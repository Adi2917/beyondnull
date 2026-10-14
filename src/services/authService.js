const SESSION_KEY = "bn_admin_session"
const LEGACY_SESSION_KEY = "adminLogged"
const SHEETS_API_URL =
  "https://script.google.com/macros/s/AKfycbxVhfZH5vWv-FS9Al3gROmCiV7E_Td4aYX30xSS7_fwXf5RgJyJVAkDkhKNNiOBUVMhRA/exec"
const OFFICIAL_ADMIN_EMAIL = "beyoondnull@gmail.com"

const normalizePhone = (phone = "") => String(phone).replace(/\D/g, "").slice(0, 10)
const normalizePin = (pin = "") => String(pin).replace(/\D/g, "").slice(0, 6)
const normalizeEmail = (email = "") => String(email).trim().toLowerCase()
const makeError = (message) => ({ message })

async function apiRequest(action, payload = {}, includeSession = true) {
  const session = includeSession ? getAdminSession() : null
  const requestBody = {
    action,
    payload,
    sessionToken: session?.token || ""
  }

  try {
    const response = await fetch(SHEETS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(requestBody),
      credentials: "omit",
      redirect: "follow"
    })
    if (!response.ok) throw new Error("Google Sheets service did not respond")
    const result = await response.json()
    if (!result.ok) return { data: null, error: makeError(result.error || "Request failed") }
    return { data: result.data, error: null }
  } catch (error) {
    console.error(`Sheets API ${action} error:`, error)
    return { data: null, error: makeError("Admin service is unavailable. Check the Apps Script deployment.") }
  }
}

function saveSession(admin) {
  localStorage.removeItem(LEGACY_SESSION_KEY)
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    phone: admin.phone || "",
    email: admin.email,
    role: admin.role || "Admin",
    token: admin.session_token,
    expiresAt: admin.expires_at,
    source: "google-sheets",
    loggedAt: new Date().toISOString()
  }))
}

function getAdminToken() {
  const session = getAdminSession()
  if (!session?.token) return null
  if (session.expiresAt && new Date(session.expiresAt).getTime() <= Date.now()) {
    logoutAdmin()
    return null
  }
  return session.token
}

function sanitizeClient(client) {
  return {
    name: String(client.name || "").trim(),
    phone: normalizePhone(client.phone),
    email: normalizeEmail(client.email),
    address: String(client.address || "").trim(),
    district: String(client.district || "").trim(),
    package_amount: client.package_amount || "",
    services: Array.isArray(client.services) ? client.services : [],
    projects: Array.isArray(client.projects) ? client.projects : []
  }
}

function sanitizeEmployee(employee) {
  return {
    name: String(employee.name || "").trim(),
    address: String(employee.address || "").trim(),
    phone: normalizePhone(employee.phone),
    job_role: String(employee.job_role || "").trim(),
    job_type: String(employee.job_type || "").trim(),
    custom_job_type: String(employee.custom_job_type || "").trim(),
    salary: Number(employee.salary || 0),
    joined_on: employee.joined_on || new Date().toISOString().slice(0, 10)
  }
}

export async function loginAdmin(email, pin) {
  const cleanEmail = normalizeEmail(email)
  const cleanPin = normalizePin(pin)
  if (!/\S+@\S+\.\S+/.test(cleanEmail)) return { success: false, error: makeError("Enter valid official admin email") }
  if (!/^[0-9]{6}$/.test(cleanPin)) return { success: false, error: makeError("Enter valid 6 digit PIN") }

  const { data, error } = await apiRequest("login", { email: cleanEmail, pin: cleanPin }, false)
  if (error) return { success: false, error }
  saveSession(data)
  return { success: true, data, source: "google-sheets" }
}

export async function requestAdminPinReset(email, phone) {
  const cleanEmail = normalizeEmail(email)
  const cleanPhone = normalizePhone(phone)
  if (cleanEmail !== OFFICIAL_ADMIN_EMAIL) return { success: false, error: makeError("Use the official admin email") }
  if (!/^[0-9]{10}$/.test(cleanPhone)) return { success: false, error: makeError("Enter valid 10 digit admin phone") }

  const { data, error } = await apiRequest("requestPinReset", { email: cleanEmail, phone: cleanPhone }, false)
  if (error) return { success: false, error }
  return { success: true, expiresAt: data.expires_at, message: "OTP sent to the official admin email. It is valid for 5 minutes." }
}

export async function confirmAdminPinReset({ email, phone, otp, pin, confirm }) {
  const cleanPin = normalizePin(pin)
  if (cleanPin !== normalizePin(confirm)) return { success: false, error: makeError("New PIN and confirm PIN do not match") }
  if (!/^[0-9]{4}$/.test(String(otp || ""))) return { success: false, error: makeError("Enter valid 4 digit OTP") }
  if (!/^[0-9]{6}$/.test(cleanPin)) return { success: false, error: makeError("PIN must be 6 digits") }

  const { data, error } = await apiRequest("confirmPinReset", {
    email: normalizeEmail(email), phone: normalizePhone(phone), otp: String(otp), pin: cleanPin
  }, false)
  if (error) return { success: false, error }
  return { success: Boolean(data) }
}

export function logoutAdmin() {
  const token = getAdminSession()?.token
  localStorage.removeItem(LEGACY_SESSION_KEY)
  localStorage.removeItem(SESSION_KEY)
  if (token) apiRequest("logout", { token }, false)
}

export function checkAdminSession() { return Boolean(getAdminToken()) }

export function getAdminSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null") } catch { return null }
}

export async function addClient(clientData) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  const result = await apiRequest("addClient", sanitizeClient(clientData))
  return { ...result, source: "google-sheets" }
}

export async function getClients() {
  if (!getAdminToken()) return { data: [], error: makeError("Admin session expired. Login again.") }
  const result = await apiRequest("getClients")
  return { data: result.data || [], error: result.error, source: "google-sheets" }
}

export async function getClientById(id) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("getClient", { id })
}

export async function updateClient(id, updatedData) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("updateClient", { id, ...sanitizeClient(updatedData) })
}

export async function deleteClient(id) {
  if (!getAdminToken()) return { data: false, error: makeError("Admin session expired. Login again.") }
  return apiRequest("deleteClient", { id })
}

export async function getEmployees() {
  if (!getAdminToken()) return { data: [], error: makeError("Admin session expired. Login again.") }
  const result = await apiRequest("getEmployees")
  return { data: result.data || [], error: result.error }
}

export async function getEmployeeById(id) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("getEmployee", { id })
}

export async function addEmployee(employeeData) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("addEmployee", sanitizeEmployee(employeeData))
}

export async function updateEmployee(id, employeeData) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("updateEmployee", { id, ...sanitizeEmployee(employeeData) })
}

export async function deleteEmployee(id) {
  if (!getAdminToken()) return { data: false, error: makeError("Admin session expired. Login again.") }
  return apiRequest("deleteEmployee", { id })
}

export async function addEmployeePayout(employeeId, payout) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("addPayout", { employee_id: employeeId, ...payout, amount: Number(payout.amount || 0) })
}

export async function updateEmployeePayout(payoutId, payout) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("updatePayout", { id: payoutId, ...payout, amount: Number(payout.amount || 0) })
}

export async function downloadEmployeeReceipt(payoutId) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("getReceipt", { payout_id: payoutId })
}

export async function getPublishedResources() {
  const result = await apiRequest("getResources", {}, false)
  return { data: result.data || [], error: result.error }
}

export async function addResource(resource) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("addResource", resource)
}

export async function updateResource(resource) {
  if (!getAdminToken()) return { data: null, error: makeError("Admin session expired. Login again.") }
  return apiRequest("updateResource", resource)
}

export async function deleteResource(id) {
  if (!getAdminToken()) return { data: false, error: makeError("Admin session expired. Login again.") }
  return apiRequest("deleteResource", { id })
}
