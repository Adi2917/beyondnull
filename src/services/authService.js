import { supabase } from "./supabaseClient"

const SESSION_KEY = "bn_admin_session"
const LEGACY_SESSION_KEY = "adminLogged"
const LOCAL_CLIENTS_KEY = "bn_demo_clients"

const normalizePhone = (phone = "") => phone.replace(/\D/g, "").slice(0, 10)
const normalizePin = (pin = "") => pin.replace(/\D/g, "").slice(0, 6)

function makeError(message) {
  return { message }
}

function saveSession(admin, source = "supabase") {
  localStorage.setItem(LEGACY_SESSION_KEY, "true")
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      phone: admin.phone,
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
  const cleanPhone = normalizePhone(phone)
  const cleanPin = normalizePin(pin)

  if (!/^[0-9]{10}$/.test(cleanPhone)) {
    return { success: false, error: makeError("Enter valid 10 digit admin phone") }
  }

  if (!/^[0-9]{6}$/.test(cleanPin)) {
    return { success: false, error: makeError("Enter valid 6 digit PIN") }
  }

  const { data, error } = await supabase
    .rpc("verify_admin_login", {
      admin_phone: cleanPhone,
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
