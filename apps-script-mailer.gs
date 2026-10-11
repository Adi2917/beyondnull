const SHEET_ID = "1RvuUQ-vat4j8Ml7QI0TxX2eUwqzI7eRAEswioxx7tPY"
const OFFICIAL_EMAIL = "beyoondnull@gmail.com"
const ADMIN_PHONES = ["7485875137", "6205475866"]
const SESSION_HOURS = 12
const RECEIPT_LIMIT_BYTES = 3 * 1024 * 1024

const TABLES = {
  clients: ["id", "name", "phone", "email", "address", "district", "status", "source", "notes", "created_at", "updated_at"],
  services: ["id", "client_id", "service_type", "billing_type", "total_amount", "advance_amount", "pending_amount", "monthly_package", "social_platforms", "work_start_date", "work_status", "created_at", "updated_at"],
  employees: ["id", "name", "address", "phone", "job_role", "job_type", "custom_job_type", "salary", "joined_on", "status", "created_at", "updated_at"],
  payouts: ["id", "employee_id", "salary_month", "paid_on", "amount", "receipt_file_id", "receipt_name", "receipt_type", "created_at"],
  sessions: ["id", "token_hash", "email", "role", "expires_at", "revoked_at", "created_at"],
  resets: ["id", "email", "phone", "otp_hash", "expires_at", "attempts", "used_at", "created_at"]
}

const SHEET_NAMES = {
  clients: "Clients",
  services: "Client Services",
  employees: "Employees",
  payouts: "Payouts",
  sessions: "Sessions",
  resets: "PIN Resets"
}

function setupBeyondNullDatabase() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
  Object.keys(TABLES).forEach(function (key) {
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES[key])
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAMES[key])
    if (sheet.getLastRow() === 0) sheet.appendRow(TABLES[key])
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, TABLES[key].length)
      .setBackground("#191717").setFontColor("#ffffff").setFontWeight("bold")
    sheet.autoResizeColumns(1, TABLES[key].length)
  })

  const properties = PropertiesService.getScriptProperties()
  if (!properties.getProperty("PIN_SALT")) properties.setProperty("PIN_SALT", Utilities.getUuid())
  if (!properties.getProperty("ADMIN_PIN_HASH")) {
    properties.setProperty("ADMIN_PIN_HASH", secureHash(properties.getProperty("PIN_SALT") + ":111111"))
  }
  properties.setProperty("ADMIN_EMAIL", OFFICIAL_EMAIL)
  properties.setProperty("ADMIN_PHONES", JSON.stringify(ADMIN_PHONES))
  if (!properties.getProperty("RECEIPT_FOLDER_ID")) {
    properties.setProperty("RECEIPT_FOLDER_ID", DriveApp.createFolder("BeyondNull Employee Payout Receipts").getId())
  }
  return "BeyondNull Google Sheets database is ready. Initial PIN: 111111"
}

function doGet() {
  return jsonResponse({ ok: true, service: "BeyondNull Admin API", status: "active" })
}

function doPost(e) {
  try {
    const request = parseRequest(e)
    if (!request.action) return handleLegacyMail(request)
    const publicActions = ["login", "requestPinReset", "confirmPinReset", "logout"]
    if (publicActions.indexOf(request.action) === -1) requireSession(request.sessionToken)
    const result = routeAction(request.action, request.payload || {}, request.sessionToken || "")
    return jsonResponse({ ok: true, data: result })
  } catch (error) {
    console.error(error && error.stack ? error.stack : error)
    return jsonResponse({ ok: false, error: safeError(error) })
  }
}

function routeAction(action, payload, sessionToken) {
  const routes = {
    login: function () { return loginAdmin(payload) },
    requestPinReset: function () { return requestPinReset(payload) },
    confirmPinReset: function () { return confirmPinReset(payload) },
    logout: function () { return logoutSession(payload.token || sessionToken) },
    getClients: getClients,
    getClient: function () { return getClient(payload.id) },
    addClient: function () { return saveClient(payload) },
    updateClient: function () { return saveClient(payload, payload.id) },
    deleteClient: function () { return deleteClient(payload.id) },
    getEmployees: getEmployees,
    getEmployee: function () { return getEmployee(payload.id) },
    addEmployee: function () { return saveEmployee(payload) },
    updateEmployee: function () { return saveEmployee(payload, payload.id) },
    deleteEmployee: function () { return deleteEmployee(payload.id) },
    addPayout: function () { return addPayout(payload) },
    getReceipt: function () { return getReceipt(payload.payout_id) }
  }
  if (!routes[action]) throw new Error("Unsupported request")
  return routes[action]()
}

function loginAdmin(payload) {
  const email = cleanEmail(payload.email)
  const pin = digits(payload.pin, 6)
  if (email !== OFFICIAL_EMAIL || !/^\d{6}$/.test(pin)) throw new Error("Invalid email or PIN")
  enforceRateLimit("login:" + email, 6, 600)
  const properties = PropertiesService.getScriptProperties()
  const actual = secureHash(properties.getProperty("PIN_SALT") + ":" + pin)
  if (!constantTimeEqual(actual, properties.getProperty("ADMIN_PIN_HASH") || "")) throw new Error("Invalid email or PIN")

  const token = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "")
  const now = new Date()
  const expires = new Date(now.getTime() + SESSION_HOURS * 60 * 60 * 1000)
  appendObject("sessions", {
    id: Utilities.getUuid(), token_hash: secureHash(token), email: email, role: "BeyondNull Admin",
    expires_at: expires, revoked_at: "", created_at: now
  })
  cleanupSecurityRows()
  return { email: email, phone: "", role: "BeyondNull Admin", session_token: token, expires_at: expires.toISOString() }
}

function requireSession(token) {
  if (!token) throw new Error("Admin session expired. Login again.")
  const tokenHash = secureHash(token)
  const session = readObjects("sessions").find(function (item) {
    return item.token_hash === tokenHash && !item.revoked_at && new Date(item.expires_at).getTime() > Date.now()
  })
  if (!session) throw new Error("Admin session expired. Login again.")
  return session
}

function logoutSession(token) {
  if (!token) return true
  const row = findRow("sessions", "token_hash", secureHash(token))
  if (row) updateRow("sessions", row.rowNumber, { revoked_at: new Date() })
  return true
}

function requestPinReset(payload) {
  const email = cleanEmail(payload.email)
  const phone = digits(payload.phone, 10)
  if (email !== OFFICIAL_EMAIL || ADMIN_PHONES.indexOf(phone) === -1) throw new Error("Admin email or phone not matched")
  enforceRateLimit("reset:" + phone, 3, 900)

  const otp = String((parseInt(Utilities.getUuid().replace(/-/g, "").slice(0, 8), 16) % 9000) + 1000)
  const expires = new Date(Date.now() + 5 * 60 * 1000)
  appendObject("resets", {
    id: Utilities.getUuid(), email: email, phone: phone, otp_hash: secureHash(phone + ":" + otp),
    expires_at: expires, attempts: 0, used_at: "", created_at: new Date()
  })
  sendResetEmail(otp, phone)
  cleanupSecurityRows()
  return { expires_at: expires.toISOString() }
}

function confirmPinReset(payload) {
  const email = cleanEmail(payload.email)
  const phone = digits(payload.phone, 10)
  const otp = digits(payload.otp, 4)
  const pin = digits(payload.pin, 6)
  if (email !== OFFICIAL_EMAIL || ADMIN_PHONES.indexOf(phone) === -1 || !/^\d{4}$/.test(otp) || !/^\d{6}$/.test(pin)) throw new Error("Invalid or expired OTP")

  const resets = readObjects("resets").filter(function (item) {
    return item.email === email && item.phone === phone && !item.used_at && Number(item.attempts || 0) < 5 && new Date(item.expires_at).getTime() > Date.now()
  }).sort(function (a, b) { return new Date(b.created_at) - new Date(a.created_at) })
  const reset = resets[0]
  if (!reset) throw new Error("Invalid or expired OTP")
  updateRow("resets", reset._row, { attempts: Number(reset.attempts || 0) + 1 })
  if (!constantTimeEqual(reset.otp_hash, secureHash(phone + ":" + otp))) throw new Error("Invalid or expired OTP")

  const properties = PropertiesService.getScriptProperties()
  properties.setProperty("ADMIN_PIN_HASH", secureHash(properties.getProperty("PIN_SALT") + ":" + pin))
  updateRow("resets", reset._row, { used_at: new Date() })
  revokeAllSessions()
  return true
}

function getClients() {
  const services = readObjects("services")
  return readObjects("clients").sort(newestFirst).map(function (client) {
    client.projects = services.filter(function (item) { return item.client_id === client.id }).map(normalizeService)
    client.services = client.projects.map(function (item) { return item.service_type })
    return stripMeta(client)
  })
}

function getClient(id) {
  const client = readObjects("clients").find(function (item) { return item.id === String(id) })
  if (!client) throw new Error("Client not found")
  client.projects = readObjects("services").filter(function (item) { return item.client_id === client.id }).map(normalizeService)
  client.services = client.projects.map(function (item) { return item.service_type })
  return stripMeta(client)
}

function saveClient(payload, id) {
  validatePhone(payload.phone)
  if (!String(payload.name || "").trim()) throw new Error("Client name is required")
  const projects = validateProjects(payload.projects)
  const lock = LockService.getScriptLock()
  lock.waitLock(10000)
  try {
    const now = new Date()
    const clientId = id || Utilities.getUuid()
    const clientData = {
      id: clientId, name: String(payload.name).trim(), phone: digits(payload.phone, 10),
      email: cleanEmail(payload.email), address: String(payload.address || "").trim(),
      district: String(payload.district || "").trim(), status: "Active", source: "Admin Panel", notes: "", updated_at: now
    }
    if (id) {
      const existing = findRow("clients", "id", id)
      if (!existing) throw new Error("Client not found")
      updateRow("clients", existing.rowNumber, clientData)
      deleteRowsWhere("services", "client_id", id)
    } else {
      clientData.created_at = now
      appendObject("clients", clientData)
    }
    projects.forEach(function (project) {
      appendObject("services", Object.assign({}, project, { id: Utilities.getUuid(), client_id: clientId, created_at: now, updated_at: now }))
    })
    return getClient(clientId)
  } finally { lock.releaseLock() }
}

function deleteClient(id) {
  const lock = LockService.getScriptLock(); lock.waitLock(10000)
  try {
    deleteRowsWhere("services", "client_id", id)
    return deleteRowsWhere("clients", "id", id) > 0
  } finally { lock.releaseLock() }
}

function validateProjects(projects) {
  const allowedServices = ["Website Development", "App Development", "Social Media Marketing", "Social Media Management"]
  const allowedPlatforms = ["Facebook", "Instagram", "LinkedIn", "Twitter / X"]
  const allowedStatus = ["Running", "Paused", "Delivered", "Stopped"]
  if (!Array.isArray(projects) || !projects.length) throw new Error("Select at least one service")
  return projects.map(function (item) {
    const service = String(item.service_type || "")
    if (allowedServices.indexOf(service) === -1) throw new Error("Invalid service selected")
    const monthly = service.indexOf("Social Media") === 0
    const platforms = Array.isArray(item.social_platforms) ? item.social_platforms.filter(function (name) { return allowedPlatforms.indexOf(name) !== -1 }) : []
    if (monthly && !platforms.length) throw new Error("Select at least one social platform")
    const total = amount(item.total_amount), advance = amount(item.advance_amount), monthlyPackage = amount(item.monthly_package)
    if (!monthly && total <= 0) throw new Error("Total project amount is required")
    if (!monthly && advance > total) throw new Error("Advance cannot exceed total amount")
    if (monthly && monthlyPackage <= 0) throw new Error("Monthly package is required")
    const status = allowedStatus.indexOf(item.work_status) !== -1 ? item.work_status : "Running"
    if ((!monthly && status === "Stopped") || (monthly && status === "Delivered")) throw new Error("Invalid work status")
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(item.work_start_date || ""))) throw new Error("Work start date is required")
    return {
      service_type: service, billing_type: monthly ? "monthly" : "project", total_amount: monthly ? "" : total,
      advance_amount: monthly ? "" : advance, pending_amount: monthly ? "" : Math.max(total - advance, 0),
      monthly_package: monthly ? monthlyPackage : "", social_platforms: JSON.stringify(platforms),
      work_start_date: item.work_start_date, work_status: status
    }
  })
}

function normalizeService(item) {
  item.social_platforms = parseJsonArray(item.social_platforms)
  ;["total_amount", "advance_amount", "pending_amount", "monthly_package"].forEach(function (key) {
    item[key] = item[key] === "" ? null : Number(item[key])
  })
  return stripMeta(item)
}

function getEmployees() {
  const payouts = readObjects("payouts")
  return readObjects("employees").sort(newestFirst).map(function (employee) {
    employee.salary = Number(employee.salary || 0)
    employee.payout_count = payouts.filter(function (item) { return item.employee_id === employee.id }).length
    return stripMeta(employee)
  })
}

function getEmployee(id) {
  const employee = readObjects("employees").find(function (item) { return item.id === String(id) })
  if (!employee) throw new Error("Employee not found")
  employee.salary = Number(employee.salary || 0)
  employee.payouts = readObjects("payouts").filter(function (item) { return item.employee_id === employee.id }).sort(function (a, b) { return new Date(b.paid_on) - new Date(a.paid_on) }).map(function (item) {
    item.amount = Number(item.amount || 0)
    item.has_receipt = Boolean(item.receipt_file_id)
    delete item.receipt_file_id
    return stripMeta(item)
  })
  return stripMeta(employee)
}

function saveEmployee(payload, id) {
  validatePhone(payload.phone)
  const jobTypes = ["Intern", "Full Time", "Remote", "Part Time", "Custom"]
  if (!String(payload.name || "").trim() || !String(payload.address || "").trim() || !String(payload.job_role || "").trim()) throw new Error("Complete all required employee fields")
  if (jobTypes.indexOf(payload.job_type) === -1) throw new Error("Invalid job type")
  if (payload.job_type === "Custom" && !String(payload.custom_job_type || "").trim()) throw new Error("Enter custom job type")
  const now = new Date()
  const data = {
    id: id || Utilities.getUuid(), name: String(payload.name).trim(), address: String(payload.address).trim(),
    phone: digits(payload.phone, 10), job_role: String(payload.job_role).trim(), job_type: payload.job_type,
    custom_job_type: payload.job_type === "Custom" ? String(payload.custom_job_type).trim() : "",
    salary: amount(payload.salary), joined_on: payload.joined_on, status: "Active", updated_at: now
  }
  const duplicate = readObjects("employees").find(function (item) { return item.phone === data.phone && item.id !== id })
  if (duplicate) throw new Error("An employee with this phone number already exists")
  if (id) {
    const existing = findRow("employees", "id", id)
    if (!existing) throw new Error("Employee not found")
    updateRow("employees", existing.rowNumber, data)
  } else { data.created_at = now; appendObject("employees", data) }
  return getEmployee(data.id)
}

function deleteEmployee(id) {
  const payoutRows = readObjects("payouts").filter(function (item) { return item.employee_id === id })
  payoutRows.forEach(function (item) { if (item.receipt_file_id) try { DriveApp.getFileById(item.receipt_file_id).setTrashed(true) } catch (error) { console.warn(error) } })
  deleteRowsWhere("payouts", "employee_id", id)
  return deleteRowsWhere("employees", "id", id) > 0
}

function addPayout(payload) {
  if (!getEmployee(payload.employee_id)) throw new Error("Employee not found")
  const payoutAmount = amount(payload.amount)
  if (payoutAmount <= 0) throw new Error("Enter a valid payout amount")
  let receiptId = ""
  if (payload.receipt_data) receiptId = saveReceipt(payload.receipt_data, payload.receipt_name, payload.receipt_type)
  const data = {
    id: Utilities.getUuid(), employee_id: payload.employee_id, salary_month: payload.salary_month,
    paid_on: payload.paid_on, amount: payoutAmount, receipt_file_id: receiptId,
    receipt_name: receiptId ? String(payload.receipt_name || "receipt") : "",
    receipt_type: receiptId ? String(payload.receipt_type || "application/octet-stream") : "", created_at: new Date()
  }
  appendObject("payouts", data)
  delete data.receipt_file_id
  data.has_receipt = Boolean(receiptId)
  return data
}

function saveReceipt(dataUrl, name, type) {
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/)
  if (!match) throw new Error("Invalid receipt file")
  const bytes = Utilities.base64Decode(match[2])
  if (bytes.length > RECEIPT_LIMIT_BYTES) throw new Error("Receipt must be smaller than 3 MB")
  const folderId = PropertiesService.getScriptProperties().getProperty("RECEIPT_FOLDER_ID")
  if (!folderId) throw new Error("Receipt folder is not configured")
  return DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(bytes, type || match[1], safeFileName(name))).getId()
}

function getReceipt(payoutId) {
  const payout = readObjects("payouts").find(function (item) { return item.id === String(payoutId) })
  if (!payout || !payout.receipt_file_id) throw new Error("Receipt not found")
  const blob = DriveApp.getFileById(payout.receipt_file_id).getBlob()
  return { name: payout.receipt_name || blob.getName(), type: payout.receipt_type || blob.getContentType(), data: "data:" + (payout.receipt_type || blob.getContentType()) + ";base64," + Utilities.base64Encode(blob.getBytes()) }
}

function sendResetEmail(otp, phone) {
  const spacedOtp = otp.split("").join(" ")
  const maskedPhone = "Admin ending " + phone.slice(-4)
  const subject = "[BeyondNull Security] Admin PIN Reset Verification"
  const plainBody = "BeyondNull Security\n\nYour verification code is " + otp + ".\nThis code expires in 5 minutes.\nAccount: " + maskedPhone + "\n\nNever share this code with anyone."
  const htmlBody = '<div style="margin:0;padding:36px 18px;background:#f5f1ee;font-family:Arial,sans-serif;color:#191717"><div style="max-width:600px;margin:0 auto;border:1px solid #eadcdf;background:#fff"><div style="padding:22px 30px;background:#191717;color:#fff"><div style="font-size:20px;font-weight:800">BEYOND<span style="color:#d71935">NULL</span></div><div style="margin-top:5px;color:#cdbfc1;font-size:11px;letter-spacing:1.6px;text-transform:uppercase">Secure admin verification</div></div><div style="padding:36px 30px"><p style="margin:0 0 9px;color:#a51d34;font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase">PIN reset request</p><h1 style="margin:0 0 14px;font-size:28px">Your verification code</h1><p style="margin:0 0 26px;font-size:15px;line-height:1.7;color:#6c6263">Use this one-time code to reset the BeyondNull admin PIN for ' + maskedPhone + '.</p><div style="padding:22px;border-left:5px solid #d71935;background:#faf7f5;font-size:36px;font-weight:900;letter-spacing:12px;text-align:center">' + spacedOtp + '</div><p style="margin:18px 0 0;font-size:13px;color:#765d61">This code expires in 5 minutes and can be used only once.</p></div><div style="padding:18px 30px;border-top:1px solid #eadcdf;background:#faf7f5;color:#765d61;font-size:12px">If you did not request this change, ignore this email. Never share this code with anyone.</div></div></div>'
  MailApp.sendEmail({ to: OFFICIAL_EMAIL, subject: subject, name: "BeyondNull Security", replyTo: OFFICIAL_EMAIL, body: plainBody, htmlBody: htmlBody })
}

function handleLegacyMail(params) {
  const subject = params.subject || "BeyondNull Website Enquiry"
  const body = params.plainMessage || params.message || "New website enquiry received."
  const html = params.htmlMessage || params.html_message || String(body).replace(/\n/g, "<br>")
  MailApp.sendEmail({ to: OFFICIAL_EMAIL, subject: subject, name: params.fromName || "BeyondNull Website", replyTo: params.email || OFFICIAL_EMAIL, body: body, htmlBody: html })
  return jsonResponse({ ok: true })
}

function parseRequest(e) {
  const raw = e && e.postData ? e.postData.contents : ""
  if (raw) try { return JSON.parse(raw) } catch (error) { console.warn("Non-JSON request") }
  return e && e.parameter ? e.parameter : {}
}

function spreadsheet() { return SpreadsheetApp.openById(SHEET_ID) }
function sheetFor(key) {
  const sheet = spreadsheet().getSheetByName(SHEET_NAMES[key])
  if (!sheet) throw new Error("Database is not initialized. Run setupBeyondNullDatabase first.")
  return sheet
}

function appendObject(key, object) {
  const headers = TABLES[key]
  sheetFor(key).appendRow(headers.map(function (header) { return object[header] === undefined ? "" : object[header] }))
}

function readObjects(key) {
  const sheet = sheetFor(key)
  if (sheet.getLastRow() < 2) return []
  const headers = TABLES[key]
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, headers.length).getValues().map(function (row, index) {
    const object = { _row: index + 2 }
    headers.forEach(function (header, column) { object[header] = serializeValue(row[column]) })
    return object
  })
}

function findRow(key, field, value) {
  const item = readObjects(key).find(function (record) { return String(record[field]) === String(value) })
  return item ? { rowNumber: item._row, data: item } : null
}

function updateRow(key, rowNumber, updates) {
  const sheet = sheetFor(key), headers = TABLES[key]
  Object.keys(updates).forEach(function (field) {
    const column = headers.indexOf(field)
    if (column >= 0) sheet.getRange(rowNumber, column + 1).setValue(updates[field] === undefined ? "" : updates[field])
  })
}

function deleteRowsWhere(key, field, value) {
  const sheet = sheetFor(key)
  const rows = readObjects(key).filter(function (record) { return String(record[field]) === String(value) }).map(function (record) { return record._row }).sort(function (a, b) { return b - a })
  rows.forEach(function (row) { sheet.deleteRow(row) })
  return rows.length
}

function cleanupSecurityRows() {
  const now = Date.now()
  readObjects("sessions").filter(function (item) { return new Date(item.expires_at).getTime() < now - 86400000 }).sort(function (a, b) { return b._row - a._row }).forEach(function (item) { sheetFor("sessions").deleteRow(item._row) })
  readObjects("resets").filter(function (item) { return new Date(item.expires_at).getTime() < now - 86400000 }).sort(function (a, b) { return b._row - a._row }).forEach(function (item) { sheetFor("resets").deleteRow(item._row) })
}

function revokeAllSessions() {
  readObjects("sessions").filter(function (item) { return !item.revoked_at }).forEach(function (item) { updateRow("sessions", item._row, { revoked_at: new Date() }) })
}

function enforceRateLimit(key, limit, seconds) {
  const cache = CacheService.getScriptCache()
  const current = Number(cache.get(key) || 0) + 1
  cache.put(key, String(current), seconds)
  if (current > limit) throw new Error("Too many attempts. Please try again later.")
}

function secureHash(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(value), Utilities.Charset.UTF_8).map(function (byte) { const normalized = byte < 0 ? byte + 256 : byte; return ("0" + normalized.toString(16)).slice(-2) }).join("")
}

function constantTimeEqual(left, right) {
  left = String(left); right = String(right)
  if (left.length !== right.length) return false
  let mismatch = 0
  for (let i = 0; i < left.length; i += 1) mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i)
  return mismatch === 0
}

function validatePhone(phone) { if (!/^\d{10}$/.test(digits(phone, 10))) throw new Error("Phone number must contain exactly 10 digits") }
function digits(value, length) { return String(value || "").replace(/\D/g, "").slice(0, length) }
function cleanEmail(value) { return String(value || "").trim().toLowerCase() }
function amount(value) { const number = Number(value || 0); return isFinite(number) && number >= 0 ? Math.round(number * 100) / 100 : 0 }
function parseJsonArray(value) { try { const parsed = JSON.parse(value || "[]"); return Array.isArray(parsed) ? parsed : [] } catch (error) { return [] } }
function safeFileName(value) { return String(value || "receipt").replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120) }
function serializeValue(value) { return value instanceof Date ? value.toISOString() : value }
function newestFirst(a, b) { return new Date(b.created_at) - new Date(a.created_at) }
function stripMeta(object) { const clean = Object.assign({}, object); delete clean._row; return clean }
function safeError(error) {
  const message = String(error && error.message ? error.message : "Request failed")
  const allowed = ["Invalid", "Admin", "Client", "Employee", "Receipt", "Select", "Enter", "Complete", "Unsupported", "Too many", "Database", "Phone", "Total", "Advance", "Monthly", "Work", "An employee"]
  return allowed.some(function (prefix) { return message.indexOf(prefix) === 0 }) ? message : "Request could not be completed"
}
function jsonResponse(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON) }
