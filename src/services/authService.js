import { supabase } from "./supabaseClient"

const SESSION_KEY = "bn_admin_session"
const LEGACY_SESSION_KEY = "adminLogged"
const LOCAL_CLIENTS_KEY = "bn_demo_clients"
const CONTACT_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwJyjKFlkswSNUIflWz0cwb7imu_M29Ea6eywUrbGeWGOtddPUrTBUgjQvNIHItHHVf/exec"
const OFFICIAL_ADMIN_EMAIL = "beyoondnull@gmail.com"

const normalizePhone = (phone = "") => phone.replace(/\D/g, "").slice(0, 10)
const normalizePin = (pin = "") => pin.replace(/\D/g, "").slice(0, 6)
const normalizeEmail = (email = "") => email.trim().toLowerCase()

function makeError(message) {
  return { message }
}

function saveSession(admin, source = "supabase") {
  localStorage.removeItem(LEGACY_SESSION_KEY)
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      phone: admin.phone,
      email: admin.email,
      role: admin.role || "Admin",
      token: admin.session_token,
      expiresAt: admin.expires_at,
      source,
      loggedAt: new Date().toISOString()
    })
  )
}

function getAdminToken() {
  const session = getAdminSession()

  if (!session?.token) {
    return null
  }

  if (session.expiresAt && new Date(session.expiresAt).getTime() <= Date.now()) {
    logoutAdmin()
    return null
  }

  return session.token
}

function readLocalClients() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CLIENTS_KEY) || "[]")
  } catch {
    return []
  }
}

function clearLocalClients() {
  localStorage.removeItem(LOCAL_CLIENTS_KEY)
}

function sanitizeClient(client) {
  return {
    name: client.name || "",
    phone: client.phone || "",
    email: client.email || null,
    address: client.address || null,
    district: client.district || null,
    package_amount: client.package_amount || null,
    services: Array.isArray(client.services) ? client.services : [],
    status: client.status || "Active",
    source: client.source || "Admin Panel",
    notes: client.notes || null,
    created_at: client.created_at || new Date().toISOString()
  }
}

async function migrateLocalClientsToSupabase() {
  const localClients = readLocalClients()

  if (localClients.length === 0) {
    return []
  }

  const migrated = []

  for (const client of localClients) {
    const { data, error } = await addClient(sanitizeClient(client))

    if (error) {
      console.warn("Local client migration failed:", error)
      return []
    }

    if (data) {
      migrated.push(data)
    }
  }

  clearLocalClients()
  return migrated
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
    return { success: false, error: makeError("Invalid email or PIN") }
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
  const spacedOtp = String(otp).split("").join(" ")
  const subject = `[BeyondNull Security] Admin PIN Reset OTP: ${otp}`
  const plainMessage = [
    "BeyondNull Security",
    "Admin PIN Reset Verification",
    "",
    `Security code: ${otp}`,
    "",
    "This code is valid for exactly 5 minutes.",
    "Use it only to reset the BeyondNull admin PIN.",
    `Request account: ${maskedPhone}`,
    "",
    "If you did not request this reset, please ignore this email."
  ].join("\n")
  const htmlMessage = `
    <div style="margin:0;padding:32px;background:#f6f8fb;font-family:Inter,Arial,sans-serif;color:#0f172a;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #dde5f0;border-radius:24px;padding:36px 34px;text-align:center;box-shadow:0 20px 60px rgba(15,23,42,0.08);">
        <div style="width:64px;height:64px;border-radius:18px;margin:0 auto 22px;background:linear-gradient(135deg,#13b8a6,#7c3aed);display:inline-flex;align-items:center;justify-content:center;color:#ffffff;font-weight:900;font-size:24px;letter-spacing:-1px;">BN</div>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;color:#0b1220;">Admin PIN Reset Verification</h1>
        <p style="margin:0 auto 26px;max-width:460px;font-size:16px;line-height:1.65;color:#536179;">Use this secure code to reset your BeyondNull admin PIN. This verification is linked to ${maskedPhone}.</p>
        <div style="margin:0 auto 22px;padding:24px;border:2px dashed #16a3d8;border-radius:18px;background:#f8fbff;color:#0ea5e9;font-size:38px;font-weight:900;letter-spacing:13px;">${spacedOtp}</div>
        <p style="margin:0;font-size:14px;color:#8794ad;">This transmission remains active for exactly 5 minutes.</p>
        <div style="height:1px;background:#e7edf5;margin:28px 0 18px;"></div>
        <p style="margin:0;font-size:13px;line-height:1.6;color:#667085;">If you did not request this reset, ignore this email. Never share this OTP with anyone.</p>
      </div>
    </div>
  `

  data.append("subject", subject)
  data.append("title", "Admin PIN Reset Verification")
  data.append("type", "Admin Security OTP")
  data.append("fromName", "BeyondNull Security")
  data.append("name", "BeyondNull Security")
  data.append("phone", maskedPhone)
  data.append("email", email)
  data.append("message", plainMessage)
  data.append("plainMessage", plainMessage)
  data.append("htmlMessage", htmlMessage)
  data.append("html_message", htmlMessage)

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
  return Boolean(getAdminToken())
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
  const admin_session_token = getAdminToken()

  if (!admin_session_token) {
    return { data: null, error: makeError("Admin session expired. Login again."), source: "supabase" }
  }

  const client = sanitizeClient(clientData)
  const { data, error } = await supabase.rpc("admin_add_client", {
    admin_session_token,
    client_name: client.name,
    client_phone: client.phone,
    client_email: client.email || "",
    client_address: client.address || "",
    client_district: client.district || "",
    client_package_amount: client.package_amount || "",
    client_services: client.services
  })

  if (!error && !data) {
    return { data: null, error: makeError("Unauthorized admin session. Login again."), source: "supabase" }
  }

  return { data, error, source: "supabase" }
}

/* =========================
GET ALL CLIENTS
========================= */

export async function getClients() {
  await migrateLocalClientsToSupabase()

  const admin_session_token = getAdminToken()

  if (!admin_session_token) {
    return { data: [], error: makeError("Admin session expired. Login again."), source: "supabase" }
  }

  const { data, error } = await supabase.rpc("admin_get_clients", {
    admin_session_token
  })

  return { data: data || [], error, source: "supabase" }
}

/* =========================
GET SINGLE CLIENT
========================= */

export async function getClientById(id) {
  const admin_session_token = getAdminToken()

  if (!admin_session_token) {
    return { data: null, error: makeError("Admin session expired. Login again."), source: "supabase" }
  }

  const { data, error } = await supabase.rpc("admin_get_client", {
    admin_session_token,
    client_id: id
  })

  if (!error && !data) {
    return { data: null, error: makeError("Unauthorized admin session. Login again."), source: "supabase" }
  }

  return { data, error, source: "supabase" }
}

/* =========================
UPDATE CLIENT
========================= */

export async function updateClient(id, updatedData) {
  const admin_session_token = getAdminToken()

  if (!admin_session_token) {
    return { data: null, error: makeError("Admin session expired. Login again."), source: "supabase" }
  }

  const client = sanitizeClient(updatedData)
  const { data, error } = await supabase.rpc("admin_update_client", {
    admin_session_token,
    client_id: id,
    client_name: client.name,
    client_phone: client.phone,
    client_email: client.email || "",
    client_address: client.address || "",
    client_district: client.district || "",
    client_package_amount: client.package_amount || "",
    client_services: client.services
  })

  if (!error && !data) {
    return { data: null, error: makeError("Unauthorized admin session. Login again."), source: "supabase" }
  }

  return { data, error, source: "supabase" }
}

/* =========================
DELETE CLIENT
========================= */

export async function deleteClient(id) {
  const admin_session_token = getAdminToken()

  if (!admin_session_token) {
    return { data: false, error: makeError("Admin session expired. Login again."), source: "supabase" }
  }

  const { data, error } = await supabase.rpc("admin_delete_client", {
    admin_session_token,
    client_id: id
  })

  if (!error && !data) {
    return { data: false, error: makeError("Unauthorized admin session. Login again."), source: "supabase" }
  }

  return { data, error, source: "supabase" }
}
