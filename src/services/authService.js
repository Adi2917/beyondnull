import { supabase } from "./supabaseClient"

const SESSION_KEY = "bn_admin_session"
const LEGACY_SESSION_KEY = "adminLogged"
const LOCAL_CLIENTS_KEY = "bn_demo_clients"
const CONTACT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyoFTbbPRaFVBe41FLmQAadNFCE0JvkMNK0PmmsyqB7NguqVhJdEUHBMfKhsSPt4hzQ/exec"
const OFFICIAL_ADMIN_EMAIL = "beyoondnull@gmail.com"

const normalizePhone = (phone = "") => phone.replace(/\D/g, "").slice(0, 10)
const normalizePin = (pin = "") => pin.replace(/\D/g, "").slice(0, 6)
const normalizeEmail = (email = "") => email.trim().toLowerCase()

function makeError(message) {
  return { message }
}

function saveSession(admin, source = "supabase") {
  localStorage.setItem(LEGACY_SESSION_KEY, "true")
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      phone: admin.phone,
      email: admin.email,
      role: admin.role || "Admin",
      source,
      loggedAt: new Date().toISOString()
    })
  )
}

function readLocalClients() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || "[]")
  } catch {
    return []
  }
}

function writeLocalClients(clients) {
  localStorage.setItem(LOCAL_CLIENTS_KEY, JSON.stringify(clients))
}

function createLocalClient(clientData) {
  const client = {
    ...clientData,
    id:
      globalThis.crypto?.randomUUID?.() ||
      `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    created_at: new Date().toISOString()
  }

  const clients = [client, ...readLocalClients()]
  writeLocalClients(clients)
  return client
}

/* =========================
ADMIN LOGIN
========================= */

export async function loginAdmin(phone, pin) {
  const cleanEmail = normalizeEmail(phone)
  const cleanPin = normalizePin(pin)

  if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
    return { success: false, error: makeError("Enter valid official admin email") }
  }

  if (!/^[0-9]{6}$/.test(cleanPin)) {
    return { success: false, error: makeError("Enter valid 6 digit PIN") }
  }

  const { data, error } = await supabase
    .rpc("verify_admin_login", {
      admin_email: cleanEmail,
      admin_pin: cleanPin
    })
    .maybeSingle()

  if (error) {
    console.error("Admin login backend error:", error)
    return {
      success: false,
      error: makeError("Admin backend setup pending. Run supabase-setup.sql again.")
    }
  }

  if (!data) {
    return { success: false, error: makeError("Invalid phone or PIN") }
  }

  const admin = { ...data, role: data.role || "Admin" }
  saveSession(admin, "supabase")
  return { success: true, data: admin, source: "supabase" }
}

/* =========================
ADMIN PIN RESET
========================= */

async function sendOtpMail({ email, phone, otp }) {
  const data = new FormData()
  const maskedPhone = `Admin ending ${phone.slice(-4)}`
  const message = [
    "BeyondNull Admin PIN Reset Verification",
    "",
    `Your 4 digit OTP is: ${otp}`,
    "",
    "This OTP is valid for 5 minutes.",
    "Use this code only to reset the BeyondNull admin PIN.",
    "",
    "If you did not request this reset, please ignore this email."
  ].join("\n")

  data.append("subject", "BeyondNull Admin PIN Reset OTP")
  data.append("title", "BeyondNull Admin PIN Reset OTP")
  data.append("type", "Admin Security OTP")
  data.append("name", "BeyondNull Security Team")
  data.append("phone", maskedPhone)
  data.append("email", email)
  data.append("message", message)

  await fetch(CONTACT_SCRIPT_URL, {
    method: "POST",
    body: data,
    mode: "no-cors"
  })
}

export async function requestAdminPinReset(email, phone) {
  const cleanEmail = normalizeEmail(email)
  const cleanPhone = normalizePhone(phone)

  if (cleanEmail !== OFFICIAL_ADMIN_EMAIL) {
    return { success: false, error: makeError("Use the official admin email") }
  }

  if (!/^[0-9]{10}$/.test(cleanPhone)) {
    return { success: false, error: makeError("Enter valid 10 digit admin phone") }
  }

  const { data, error } = await supabase
    .rpc("request_admin_pin_reset", {
      admin_email: cleanEmail,
      admin_phone: cleanPhone
    })
    .maybeSingle()

  if (error) {
    console.error("PIN reset request error:", error)
    return {
      success: false,
      error: makeError("PIN reset backend setup pending. Run supabase-setup.sql again.")
    }
  }

  if (!data?.otp) {
    return { success: false, error: makeError("Admin email or phone not matched") }
  }

  try {
    await sendOtpMail({ email: cleanEmail, phone: cleanPhone, otp: data.otp })
  } catch (mailError) {
    console.warn("OTP mail bridge failed:", mailError)
  }

  return {
    success: true,
    expiresAt: data.expires_at,
    message: "OTP sent to official admin email. It is valid for 5 minutes."
  }
}

export async function confirmAdminPinReset({ email, phone, otp, pin, confirm }) {
  const cleanEmail = normalizeEmail(email)
  const cleanPhone = normalizePhone(phone)
  const cleanOtp = String(otp || "").replace(/\D/g, "").slice(0, 4)
  const cleanPin = normalizePin(pin)
  const cleanConfirm = normalizePin(confirm)

  if (cleanPin !== cleanConfirm) {
    return { success: false, error: makeError("New PIN and confirm PIN do not match") }
  }

  if (!/^[0-9]{4}$/.test(cleanOtp)) {
    return { success: false, error: makeError("Enter valid 4 digit OTP") }
  }

  if (!/^[0-9]{6}$/.test(cleanPin)) {
    return { success: false, error: makeError("PIN must be 6 digits") }
  }

  const { data, error } = await supabase.rpc("confirm_admin_pin_reset", {
    admin_email: cleanEmail,
    admin_phone: cleanPhone,
    reset_otp: cleanOtp,
    new_pin: cleanPin
  })

  if (error) {
    console.error("PIN reset confirm error:", error)
    return {
      success: false,
      error: makeError("Could not verify OTP. Run supabase-setup.sql again.")
    }
  }

  if (!data) {
    return { success: false, error: makeError("Invalid or expired OTP") }
  }

  return { success: true }
}

/* =========================
LOGOUT
========================= */

export function logoutAdmin() {
  localStorage.removeItem(LEGACY_SESSION_KEY)
  localStorage.removeItem(SESSION_KEY)
}

/* =========================
CHECK LOGIN SESSION
========================= */

export function checkAdminSession() {
  return Boolean(localStorage.getItem(SESSION_KEY) || localStorage.getItem(LEGACY_SESSION_KEY))
}

export function getAdminSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null")
  } catch {
    return null
  }
}

/* =========================
ADD CLIENT
========================= */

export async function addClient(clientData) {
  try {
    const { data, error } = await supabase
      .from("clients")
      .insert([clientData])
      .select()
      .single()

    if (!error && data) {
      return { data, error: null, source: "supabase" }
    }

    console.warn("Supabase add client failed, saving locally:", error)
  } catch (error) {
    console.warn("Supabase add client unavailable, saving locally:", error)
  }

  const data = createLocalClient(clientData)
  return { data, error: null, source: "demo" }
}

/* =========================
GET ALL CLIENTS
========================= */

export async function getClients() {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      const localClients = readLocalClients()
      return {
        data: [...(data || []), ...localClients].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        ),
        error: null,
        source: "supabase"
      }
    }

    console.warn("Supabase fetch clients failed, reading local clients:", error)
  } catch (error) {
    console.warn("Supabase fetch clients unavailable, reading local clients:", error)
  }

  return { data: readLocalClients(), error: null, source: "demo" }
}

/* =========================
GET SINGLE CLIENT
========================= */

export async function getClientById(id) {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (!error && data) {
      return { data, error: null, source: "supabase" }
    }
  } catch (error) {
    console.warn("Supabase fetch client unavailable, reading local client:", error)
  }

  const data = readLocalClients().find((client) => client.id === id)
  return {
    data: data || null,
    error: data ? null : makeError("Client not found"),
    source: "demo"
  }
}

/* =========================
UPDATE CLIENT
========================= */

export async function updateClient(id, updatedData) {
  try {
    const { data, error } = await supabase
      .from("clients")
      .update(updatedData)
      .eq("id", id)
      .select()
      .maybeSingle()

    if (!error && data) {
      return { data, error: null, source: "supabase" }
    }
  } catch (error) {
    console.warn("Supabase update client unavailable, updating local client:", error)
  }

  const clients = readLocalClients()
  const index = clients.findIndex((client) => client.id === id)

  if (index === -1) {
    return { data: null, error: makeError("Client not found"), source: "demo" }
  }

  clients[index] = { ...clients[index], ...updatedData }
  writeLocalClients(clients)

  return { data: clients[index], error: null, source: "demo" }
}

/* =========================
DELETE CLIENT
========================= */

export async function deleteClient(id) {
  try {
    const { error } = await supabase.from("clients").delete().eq("id", id)

    if (!error) {
      return { data: true, error: null, source: "supabase" }
    }
  } catch (error) {
    console.warn("Supabase delete client unavailable, deleting local client:", error)
  }

  writeLocalClients(readLocalClients().filter((client) => client.id !== id))
  return { data: true, error: null, source: "demo" }
}
