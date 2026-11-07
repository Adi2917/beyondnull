const SHEET_ID = "1RvuUQ-vat4j8Ml7QI0TxX2eUwqzI7eRAEswioxx7tPY"
const OFFICIAL_EMAIL = "beyoondnull@gmail.com"
const ADMIN_PHONES = ["7485875137", "6205475866"]
const SESSION_HOURS = 12
const RECEIPT_LIMIT_BYTES = 3 * 1024 * 1024
const RESOURCE_IMAGE_LIMIT_BYTES = 2 * 1024 * 1024
const RESOURCE_IMAGE_LIMIT = 5
const OWNER_PHONES = ["7485875137", "6205475866", "6201689501"]
const BRAND_ASSET_URL = "https://beyondnull.in"

const TABLES = {
  clients: ["id", "name", "phone", "email", "address", "district", "status", "source", "notes", "created_at", "updated_at"],
  services: ["id", "client_id", "service_type", "billing_type", "total_amount", "advance_amount", "pending_amount", "monthly_package", "social_platforms", "work_start_date", "work_status", "created_at", "updated_at"],
  employees: ["id", "name", "address", "phone", "job_role", "job_type", "custom_job_type", "salary", "joined_on", "status", "created_at", "updated_at", "email", "bank_name", "account_number", "ifsc_code"],
  payouts: ["id", "employee_id", "salary_month", "paid_on", "amount", "receipt_file_id", "receipt_name", "receipt_type", "created_at", "base_salary", "extra_label", "extra_amount", "generated_receipt_file_id", "email_sent_at"],
  sessions: ["id", "token_hash", "email", "role", "expires_at", "revoked_at", "created_at"],
  resets: ["id", "email", "phone", "otp_hash", "expires_at", "attempts", "used_at", "created_at"],
  resources: ["id", "slug", "category", "read_time", "title", "subtitle", "excerpt", "intro", "logo_file_id", "cover_file_id", "gallery_file_ids", "sections_json", "status", "created_at", "updated_at"]
}

const SHEET_NAMES = {
  clients: "Clients",
  services: "Client Services",
  employees: "Employees",
  payouts: "Payouts",
  sessions: "Sessions",
  resets: "PIN Resets",
  resources: "Resources"
}

function setupBeyondNullDatabase() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID)
  Object.keys(TABLES).forEach(function (key) {
    let sheet = spreadsheet.getSheetByName(SHEET_NAMES[key])
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAMES[key])
    if (sheet.getLastRow() === 0) sheet.appendRow(TABLES[key])
    else sheet.getRange(1, 1, 1, TABLES[key].length).setValues([TABLES[key]])
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
  if (!properties.getProperty("RESOURCE_FOLDER_ID")) {
    properties.setProperty("RESOURCE_FOLDER_ID", DriveApp.createFolder("BeyondNull Published Resource Images").getId())
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
    const publicActions = ["login", "requestPinReset", "confirmPinReset", "logout", "getResources"]
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
    updatePayout: function () { return updatePayout(payload) },
    getReceipt: function () { return getReceipt(payload.payout_id) },
    getPayoutProof: function () { return getPayoutProof(payload.payout_id) },
    getResources: getResources,
    addResource: function () { return addResource(payload) },
    updateResource: function () { return updateResource(payload) },
    deleteResource: function () { return deleteResource(payload.id) }
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

  readObjects("resets").filter(function (item) {
    return String(item.email) === email && String(item.phone) === phone && !item.used_at
  }).forEach(function (item) { updateRow("resets", item._row, { used_at: new Date() }) })

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
    return String(item.email) === email && String(item.phone) === phone && !item.used_at && Number(item.attempts || 0) < 5 && new Date(item.expires_at).getTime() > Date.now()
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
    employee.joined_on = normalizeStoredDate(employee.joined_on)
    employee.payout_count = payouts.filter(function (item) { return item.employee_id === employee.id }).length
    return stripMeta(employee)
  })
}

function getEmployee(id) {
  const employee = readObjects("employees").find(function (item) { return item.id === String(id) })
  if (!employee) throw new Error("Employee not found")
  employee.salary = Number(employee.salary || 0)
  employee.joined_on = normalizeStoredDate(employee.joined_on)
  employee.payouts = readObjects("payouts").filter(function (item) { return item.employee_id === employee.id }).sort(function (a, b) { return new Date(b.paid_on) - new Date(a.paid_on) }).map(function (item) {
    item.amount = Number(item.amount || 0)
    item.base_salary = Number(item.base_salary === "" ? item.amount : item.base_salary || 0)
    item.extra_amount = Number(item.extra_amount || 0)
    item.has_receipt = Boolean(item.generated_receipt_file_id || item.receipt_file_id)
    item.has_payment_proof = Boolean(item.receipt_file_id)
    item.email_sent = Boolean(item.email_sent_at)
    delete item.receipt_file_id
    delete item.generated_receipt_file_id
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
  const employeePhone = digits(payload.phone, 10)
  const employeeSalary = amount(payload.salary)
  if (OWNER_PHONES.indexOf(employeePhone) === -1 && employeeSalary <= 0) throw new Error("Monthly salary is required")
  const now = new Date()
  const data = {
    id: id || Utilities.getUuid(), name: String(payload.name).trim(), address: String(payload.address).trim(),
    phone: employeePhone, job_role: String(payload.job_role).trim(), job_type: payload.job_type,
    custom_job_type: payload.job_type === "Custom" ? String(payload.custom_job_type).trim() : "",
    salary: employeeSalary, joined_on: normalizeDateValue(payload.joined_on, "Joining date"), status: "Active", updated_at: now,
    email: cleanEmail(payload.email), bank_name: String(payload.bank_name || "").trim().slice(0, 120),
    account_number: digits(payload.account_number, 24), ifsc_code: String(payload.ifsc_code || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11)
  }
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) throw new Error("Invalid employee email")
  if (data.ifsc_code && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(data.ifsc_code)) throw new Error("Invalid IFSC code")
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
  payoutRows.forEach(function (item) {
    ;[item.receipt_file_id, item.generated_receipt_file_id].filter(Boolean).forEach(function (fileId) {
      try { DriveApp.getFileById(fileId).setTrashed(true) } catch (error) { console.warn(error) }
    })
  })
  deleteRowsWhere("payouts", "employee_id", id)
  return deleteRowsWhere("employees", "id", id) > 0
}

function addPayout(payload) {
  const employee = getEmployee(payload.employee_id)
  if (!employee) throw new Error("Employee not found")
  if (!employee.email) throw new Error("Employee email is required before creating a payout")
  const payout = normalizePayout(payload, Number(employee.salary || 0))
  const payoutId = Utilities.getUuid()
  let proofId = ""
  let generatedId = ""
  try {
    if (payload.receipt_data) proofId = saveReceipt(payload.receipt_data, payload.receipt_name, payload.receipt_type)
    const generated = createSalaryReceipt(employee, payout, payoutId)
    generatedId = generated.fileId
    sendSalaryReceiptEmail(employee, payout, generated.blob, generated.receiptNumber, false)
    const now = new Date()
    const data = {
      id: payoutId, employee_id: payload.employee_id, salary_month: payout.salary_month,
      paid_on: payout.paid_on, amount: payout.total_amount, receipt_file_id: proofId,
      receipt_name: proofId ? String(payload.receipt_name || "payment-proof") : "",
      receipt_type: proofId ? String(payload.receipt_type || "application/octet-stream") : "", created_at: now,
      base_salary: payout.base_salary, extra_label: payout.extra_label, extra_amount: payout.extra_amount,
      generated_receipt_file_id: generatedId, email_sent_at: now
    }
    appendObject("payouts", data)
    return payoutResponse(data)
  } catch (error) {
    ;[proofId, generatedId].filter(Boolean).forEach(function (fileId) { try { DriveApp.getFileById(fileId).setTrashed(true) } catch (cleanupError) { console.warn(cleanupError) } })
    throw error
  }
}

function updatePayout(payload) {
  const existing = readObjects("payouts").find(function (item) { return item.id === String(payload.id) })
  if (!existing) throw new Error("Payout not found")
  const employee = getEmployee(existing.employee_id)
  if (!employee.email) throw new Error("Employee email is required before updating a payout")
  const previousBase = existing.base_salary === "" ? Number(existing.amount || employee.salary || 0) : Number(existing.base_salary || 0)
  const payout = normalizePayout(payload, previousBase)

  let replacementReceiptId = ""
  let generatedReceiptId = ""
  try {
    if (payload.receipt_data) replacementReceiptId = saveReceipt(payload.receipt_data, payload.receipt_name, payload.receipt_type)
    const generated = createSalaryReceipt(employee, payout, existing.id)
    generatedReceiptId = generated.fileId
    sendSalaryReceiptEmail(employee, payout, generated.blob, generated.receiptNumber, true)
    const updates = {
      salary_month: payout.salary_month,
      paid_on: payout.paid_on,
      amount: payout.total_amount,
      receipt_file_id: replacementReceiptId || existing.receipt_file_id,
      receipt_name: replacementReceiptId ? String(payload.receipt_name || "receipt") : existing.receipt_name,
      receipt_type: replacementReceiptId ? String(payload.receipt_type || "application/octet-stream") : existing.receipt_type,
      base_salary: payout.base_salary,
      extra_label: payout.extra_label,
      extra_amount: payout.extra_amount,
      generated_receipt_file_id: generatedReceiptId,
      email_sent_at: new Date()
    }
    updateRow("payouts", existing._row, updates)
    if (replacementReceiptId && existing.receipt_file_id) {
      try { DriveApp.getFileById(existing.receipt_file_id).setTrashed(true) } catch (error) { console.warn(error) }
    }
    if (existing.generated_receipt_file_id) try { DriveApp.getFileById(existing.generated_receipt_file_id).setTrashed(true) } catch (error) { console.warn(error) }
    return payoutResponse(Object.assign({}, existing, updates))
  } catch (error) {
    if (replacementReceiptId) try { DriveApp.getFileById(replacementReceiptId).setTrashed(true) } catch (cleanupError) { console.warn(cleanupError) }
    if (generatedReceiptId) try { DriveApp.getFileById(generatedReceiptId).setTrashed(true) } catch (cleanupError) { console.warn(cleanupError) }
    throw error
  }
}

function normalizePayout(payload, defaultBaseSalary) {
  const baseSalary = payload.base_salary === undefined || payload.base_salary === "" ? amount(defaultBaseSalary) : amount(payload.base_salary)
  const extraAmount = amount(payload.extra_amount)
  const extraLabel = String(payload.extra_label || "").trim().slice(0, 100)
  if (extraAmount > 0 && !extraLabel) throw new Error("Enter a label for the extra payment")
  const totalAmount = Math.round((baseSalary + extraAmount) * 100) / 100
  if (totalAmount <= 0) throw new Error("Enter a valid payout amount")
  return {
    salary_month: normalizeDateValue(payload.salary_month, "Salary month"),
    paid_on: normalizeDateValue(payload.paid_on, "Pay date"),
    base_salary: baseSalary,
    extra_label: extraAmount > 0 ? extraLabel : "",
    extra_amount: extraAmount,
    total_amount: totalAmount
  }
}

function payoutResponse(item) {
  return {
    id: item.id, employee_id: item.employee_id, salary_month: item.salary_month, paid_on: item.paid_on,
    amount: Number(item.amount || 0), base_salary: Number(item.base_salary || 0), extra_label: item.extra_label || "",
    extra_amount: Number(item.extra_amount || 0), receipt_name: item.receipt_name || "", receipt_type: item.receipt_type || "",
    created_at: serializeValue(item.created_at), has_receipt: Boolean(item.generated_receipt_file_id || item.receipt_file_id),
    has_payment_proof: Boolean(item.receipt_file_id), email_sent: Boolean(item.email_sent_at)
  }
}

function saveReceipt(dataUrl, name, type) {
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/)
  if (!match) throw new Error("Invalid receipt file")
  const contentType = String(type || match[1]).toLowerCase()
  if (contentType !== "application/pdf" && contentType.indexOf("image/") !== 0) throw new Error("Receipt must be an image or PDF")
  const bytes = Utilities.base64Decode(match[2])
  if (bytes.length > RECEIPT_LIMIT_BYTES) throw new Error("Receipt must be smaller than 3 MB")
  const folderId = PropertiesService.getScriptProperties().getProperty("RECEIPT_FOLDER_ID")
  if (!folderId) throw new Error("Receipt folder is not configured")
  return DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(bytes, contentType, safeFileName(name))).getId()
}

function getReceipt(payoutId) {
  const payout = readObjects("payouts").find(function (item) { return item.id === String(payoutId) })
  const fileId = payout && (payout.generated_receipt_file_id || payout.receipt_file_id)
  if (!fileId) throw new Error("Receipt not found")
  const blob = DriveApp.getFileById(fileId).getBlob()
  return fileDownloadResponse(blob, blob.getName())
}

function getPayoutProof(payoutId) {
  const payout = readObjects("payouts").find(function (item) { return item.id === String(payoutId) })
  if (!payout || !payout.receipt_file_id) throw new Error("Receipt proof not found")
  const blob = DriveApp.getFileById(payout.receipt_file_id).getBlob()
  return fileDownloadResponse(blob, payout.receipt_name || blob.getName(), payout.receipt_type)
}

function fileDownloadResponse(blob, name, type) {
  const contentType = type || blob.getContentType()
  return { name: name || blob.getName(), type: contentType, data: "data:" + contentType + ";base64," + Utilities.base64Encode(blob.getBytes()) }
}

function createSalaryReceipt(employee, payout, payoutId) {
  const receiptNumber = "BN-PAY-" + payout.salary_month.slice(0, 7).replace("-", "") + "-" + String(payoutId).replace(/-/g, "").slice(0, 6).toUpperCase()
  const fileName = safeFileName("BeyondNull-Salary-Receipt-" + employee.name + "-" + payout.salary_month.slice(0, 7)) + ".pdf"
  const html = buildSalaryReceiptHtml(employee, payout, receiptNumber)
  const pdfBlob = Utilities.newBlob(html, MimeType.HTML, fileName.replace(/\.pdf$/, ".html")).getAs(MimeType.PDF).setName(fileName)
  const folderId = PropertiesService.getScriptProperties().getProperty("RECEIPT_FOLDER_ID")
  if (!folderId) throw new Error("Receipt folder is not configured")
  const file = DriveApp.getFolderById(folderId).createFile(pdfBlob)
  return { fileId: file.getId(), blob: file.getBlob().setName(fileName), receiptNumber: receiptNumber }
}

function buildSalaryReceiptHtml(employee, payout, receiptNumber) {
  const logo = inlinePublicAsset("/beyondnull-official-logo.jpg")
  const signature = inlinePublicAsset("/aditya-signature.png")
  const month = formatPayrollMonth(payout.salary_month)
  const paidOn = formatPayrollDate(payout.paid_on)
  const bankLine = [employee.bank_name, employee.account_number ? "A/C ending " + String(employee.account_number).slice(-4) : "", employee.ifsc_code].filter(Boolean).join(" | ") || "Not provided"
  const extraRow = payout.extra_amount > 0
    ? '<tr><td style="padding:11px 0;border-bottom:1px solid #eadcdf;color:#6c6263">' + escapeHtml(payout.extra_label) + '</td><td style="padding:11px 0;border-bottom:1px solid #eadcdf;text-align:right;font-weight:700">Rs ' + formatMoney(payout.extra_amount) + '</td></tr>'
    : ""
  const logoMarkup = logo
    ? '<img src="' + logo + '" style="width:66px;height:66px;object-fit:contain;border-radius:50%">'
    : '<div style="font-size:24px;font-weight:900">BEYOND<span style="color:#e31837">NULL</span></div>'
  const signatureMarkup = signature
    ? '<img src="' + signature + '" style="display:block;width:190px;height:62px;object-fit:contain;object-position:left center;margin:0 0 2px auto">'
    : '<div style="height:55px"></div>'

  return '<!doctype html><html><head><meta charset="UTF-8"></head><body style="margin:0;background:#f4efec;font-family:Arial,sans-serif;color:#191717">' +
    '<div style="width:720px;margin:24px auto;background:#fff;border:1px solid #dfd4d5">' +
      '<div style="height:9px;background:#e31837"></div>' +
      '<div style="padding:30px 38px 24px;background:#191717;color:#fff">' +
        '<table style="width:100%;border-collapse:collapse"><tr><td style="vertical-align:middle">' + logoMarkup + '</td><td style="text-align:right;vertical-align:middle"><div style="font-size:11px;letter-spacing:2px;color:#ef9bab;font-weight:700">PAYMENT ACKNOWLEDGEMENT</div><div style="font-size:29px;font-weight:800;margin-top:5px">Salary Receipt</div><div style="font-size:12px;color:#cdbfc1;margin-top:7px">' + escapeHtml(receiptNumber) + '</div></td></tr></table>' +
      '</div>' +
      '<div style="padding:32px 38px">' +
        '<table style="width:100%;border-collapse:collapse;margin-bottom:27px"><tr><td><div style="font-size:11px;color:#a51d34;font-weight:800;letter-spacing:1px">PAID TO</div><div style="font-size:23px;font-weight:800;margin-top:6px">' + escapeHtml(employee.name) + '</div><div style="font-size:13px;color:#6c6263;margin-top:5px">' + escapeHtml(employee.job_role) + '</div></td><td style="text-align:right"><div style="font-size:11px;color:#765d61;font-weight:700">SALARY MONTH</div><div style="font-size:18px;font-weight:800;margin-top:6px">' + escapeHtml(month) + '</div><div style="font-size:12px;color:#6c6263;margin-top:5px">Paid on ' + escapeHtml(paidOn) + '</div></td></tr></table>' +
        '<div style="background:#faf7f5;border-left:4px solid #e31837;padding:17px 20px;margin-bottom:24px"><div style="font-size:11px;color:#765d61;font-weight:700">PAYMENT ACCOUNT</div><div style="font-size:13px;font-weight:700;margin-top:6px">' + escapeHtml(bankLine) + '</div></div>' +
        '<table style="width:100%;border-collapse:collapse;font-size:14px"><tr><td style="padding:11px 0;border-bottom:1px solid #eadcdf;color:#6c6263">Monthly salary</td><td style="padding:11px 0;border-bottom:1px solid #eadcdf;text-align:right;font-weight:700">Rs ' + formatMoney(payout.base_salary) + '</td></tr>' + extraRow + '<tr><td style="padding:18px 0 10px;font-size:17px;font-weight:900">Total paid</td><td style="padding:18px 0 10px;text-align:right;font-size:23px;font-weight:900;color:#b4142c">Rs ' + formatMoney(payout.total_amount) + '</td></tr></table>' +
        '<div style="margin-top:29px;padding-top:23px;border-top:1px solid #eadcdf"><table style="width:100%;border-collapse:collapse"><tr><td style="vertical-align:bottom"><div style="font-size:12px;color:#6c6263;line-height:1.7">This system-generated receipt confirms the salary payment recorded by BeyondNull.<br>For payroll queries, contact ' + escapeHtml(OFFICIAL_EMAIL) + '.</div></td><td style="width:220px;text-align:right;vertical-align:bottom">' + signatureMarkup + '<div style="font-size:13px;font-weight:800">Aditya Kumar</div><div style="font-size:11px;color:#765d61;margin-top:3px">Authorized Signatory</div><div style="font-size:11px;color:#a51d34;font-weight:800;margin-top:3px">Finance Department</div></td></tr></table></div>' +
      '</div>' +
      '<div style="padding:15px 38px;background:#faf7f5;border-top:1px solid #eadcdf;font-size:11px;color:#765d61;text-align:center">BeyondNull | Bangalore, Karnataka | beyoondnull@gmail.com</div>' +
    '</div></body></html>'
}

function sendSalaryReceiptEmail(employee, payout, pdfBlob, receiptNumber, corrected) {
  const month = formatPayrollMonth(payout.salary_month)
  const subject = (corrected ? "[Updated] " : "") + "BeyondNull salary receipt - " + month
  const plainBody = "Hello " + employee.name + ",\n\nGreetings from BeyondNull. Your salary payment for " + month + " has been recorded. Total paid: Rs " + formatMoney(payout.total_amount) + ".\n\nYour official salary receipt is attached.\n\nRegards,\nFinance Department\nBeyondNull"
  const htmlBody = '<div style="margin:0;padding:30px 16px;background:#f5f1ee;font-family:Arial,sans-serif;color:#191717"><div style="max-width:620px;margin:auto;background:#fff;border:1px solid #eadcdf"><div style="padding:22px 28px;background:#191717;color:#fff;font-size:21px;font-weight:900">BEYOND<span style="color:#e31837">NULL</span></div><div style="padding:30px 28px"><p style="margin:0 0 16px;font-size:17px;font-weight:700">Hello ' + escapeHtml(employee.name) + ',</p><p style="margin:0 0 16px;line-height:1.7;color:#6c6263">Greetings from BeyondNull. Your salary payment for <strong>' + escapeHtml(month) + '</strong> has been recorded successfully.</p><div style="padding:18px 20px;background:#faf7f5;border-left:4px solid #e31837"><span style="display:block;font-size:11px;color:#765d61;font-weight:700">TOTAL PAID</span><strong style="display:block;margin-top:5px;font-size:26px;color:#b4142c">Rs ' + formatMoney(payout.total_amount) + '</strong><span style="display:block;margin-top:6px;font-size:12px;color:#765d61">Receipt ' + escapeHtml(receiptNumber) + '</span></div><p style="margin:20px 0 0;line-height:1.7;color:#6c6263">Your official salary receipt is attached as a PDF for your records.</p></div><div style="padding:20px 28px;border-top:1px solid #eadcdf;background:#faf7f5"><strong>Finance Department</strong><br><span style="font-size:12px;color:#765d61">BeyondNull</span></div></div></div>'
  MailApp.sendEmail({ to: employee.email, subject: subject, name: "BeyondNull Finance", replyTo: OFFICIAL_EMAIL, body: plainBody, htmlBody: htmlBody, attachments: [pdfBlob] })
}

function inlinePublicAsset(path) {
  try {
    const response = UrlFetchApp.fetch(BRAND_ASSET_URL + path, { muteHttpExceptions: true, followRedirects: true })
    if (response.getResponseCode() !== 200) return ""
    const blob = response.getBlob()
    return "data:" + blob.getContentType() + ";base64," + Utilities.base64Encode(blob.getBytes())
  } catch (error) { console.warn(error); return "" }
}

function formatPayrollMonth(value) {
  const date = new Date(normalizeDateValue(value, "Salary month") + "T00:00:00")
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "MMMM yyyy")
}

function formatPayrollDate(value) {
  const date = new Date(normalizeDateValue(value, "Pay date") + "T00:00:00")
  return Utilities.formatDate(date, Session.getScriptTimeZone(), "dd MMMM yyyy")
}

function formatMoney(value) { return Number(value || 0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") }
function escapeHtml(value) { return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") }

function getResources() {
  ensureResourceStorage()
  return readObjects("resources")
    .filter(function (item) { return item.status === "Published" })
    .sort(newestFirst)
    .map(normalizeResource)
}

function addResource(payload) {
  ensureResourceStorage()
  const title = String(payload.title || "").trim()
  if (!title) throw new Error("Resource heading is required")

  const sections = normalizeResourceSections(payload.sections)

  const gallery = Array.isArray(payload.gallery) ? payload.gallery.slice(0, RESOURCE_IMAGE_LIMIT) : []
  if (Array.isArray(payload.gallery) && payload.gallery.length > RESOURCE_IMAGE_LIMIT) throw new Error("Resource gallery supports up to 5 images")

  const uploadedIds = []
  try {
    const logoId = payload.logo && payload.logo.data ? saveResourceImage(payload.logo) : ""
    if (logoId) uploadedIds.push(logoId)
    const coverId = payload.cover && payload.cover.data ? saveResourceImage(payload.cover) : ""
    if (coverId) uploadedIds.push(coverId)
    const galleryIds = gallery.map(function (image) {
      const id = saveResourceImage(image)
      uploadedIds.push(id)
      return id
    })

    const now = new Date()
    const resource = {
      id: Utilities.getUuid(),
      slug: uniqueResourceSlug(title),
      category: String(payload.category || "Business Growth").trim().slice(0, 80),
      read_time: String(payload.read_time || "5 min read").trim().slice(0, 30),
      title: title.slice(0, 180),
      subtitle: String(payload.subtitle || "").trim().slice(0, 260),
      excerpt: String(payload.excerpt || payload.subtitle || "").trim().slice(0, 500),
      intro: String(payload.intro || payload.excerpt || payload.subtitle || "").trim().slice(0, 1500),
      logo_file_id: logoId,
      cover_file_id: coverId,
      gallery_file_ids: JSON.stringify(galleryIds),
      sections_json: JSON.stringify(sections),
      status: "Published",
      created_at: now,
      updated_at: now
    }
    appendObject("resources", resource)
    return normalizeResource(resource)
  } catch (error) {
    uploadedIds.forEach(function (id) { try { DriveApp.getFileById(id).setTrashed(true) } catch (cleanupError) { console.warn(cleanupError) } })
    throw error
  }
}

function updateResource(payload) {
  ensureResourceStorage()
  const existing = readObjects("resources").find(function (item) { return item.id === String(payload.id) })
  if (!existing) throw new Error("Resource not found")
  const title = String(payload.title || "").trim()
  if (!title) throw new Error("Resource heading is required")

  const sections = normalizeResourceSections(payload.sections)
  const gallery = Array.isArray(payload.gallery) ? payload.gallery.slice(0, RESOURCE_IMAGE_LIMIT) : []
  if (Array.isArray(payload.gallery) && payload.gallery.length > RESOURCE_IMAGE_LIMIT) throw new Error("Resource gallery supports up to 5 images")

  const uploadedIds = []
  try {
    const logoId = payload.logo && payload.logo.data ? saveResourceImage(payload.logo) : existing.logo_file_id
    if (logoId !== existing.logo_file_id) uploadedIds.push(logoId)
    const coverId = payload.cover && payload.cover.data ? saveResourceImage(payload.cover) : existing.cover_file_id
    if (coverId !== existing.cover_file_id) uploadedIds.push(coverId)
    const previousGallery = parseJsonArray(existing.gallery_file_ids)
    const galleryIds = gallery.length ? gallery.map(function (image) {
      const id = saveResourceImage(image)
      uploadedIds.push(id)
      return id
    }) : previousGallery

    const updates = {
      category: String(payload.category || "Business Growth").trim().slice(0, 80),
      read_time: String(payload.read_time || "5 min read").trim().slice(0, 30),
      title: title.slice(0, 180),
      subtitle: String(payload.subtitle || "").trim().slice(0, 260),
      excerpt: String(payload.excerpt || payload.subtitle || "").trim().slice(0, 500),
      intro: String(payload.intro || payload.excerpt || payload.subtitle || "").trim().slice(0, 1500),
      logo_file_id: logoId,
      cover_file_id: coverId,
      gallery_file_ids: JSON.stringify(galleryIds),
      sections_json: JSON.stringify(sections),
      updated_at: new Date()
    }
    updateRow("resources", existing._row, updates)

    const replacedIds = []
    if (logoId !== existing.logo_file_id && existing.logo_file_id) replacedIds.push(existing.logo_file_id)
    if (coverId !== existing.cover_file_id && existing.cover_file_id) replacedIds.push(existing.cover_file_id)
    if (gallery.length) replacedIds.push.apply(replacedIds, previousGallery)
    replacedIds.forEach(function (id) { try { DriveApp.getFileById(id).setTrashed(true) } catch (error) { console.warn(error) } })
    return normalizeResource(Object.assign({}, existing, updates))
  } catch (error) {
    uploadedIds.forEach(function (id) { try { DriveApp.getFileById(id).setTrashed(true) } catch (cleanupError) { console.warn(cleanupError) } })
    throw error
  }
}

function deleteResource(id) {
  const resource = readObjects("resources").find(function (item) { return item.id === String(id) })
  if (!resource) throw new Error("Resource not found")
  const fileIds = [resource.logo_file_id, resource.cover_file_id].concat(parseJsonArray(resource.gallery_file_ids)).filter(Boolean)
  fileIds.forEach(function (fileId) { try { DriveApp.getFileById(fileId).setTrashed(true) } catch (error) { console.warn(error) } })
  return deleteRowsWhere("resources", "id", id) > 0
}

function saveResourceImage(image) {
  const match = String(image.data || "").match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  if (!match) throw new Error("Invalid resource image")
  const bytes = Utilities.base64Decode(match[2])
  if (bytes.length > RESOURCE_IMAGE_LIMIT_BYTES) throw new Error("Resource images must be smaller than 2 MB each")
  const folderId = PropertiesService.getScriptProperties().getProperty("RESOURCE_FOLDER_ID")
  if (!folderId) throw new Error("Resource image folder is not configured")
  const file = DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(bytes, match[1], safeFileName(image.name || "resource-image")))
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
  return file.getId()
}

function normalizeResource(item) {
  const galleryIds = parseJsonArray(item.gallery_file_ids)
  return {
    id: item.id,
    slug: item.slug,
    category: item.category,
    readTime: item.read_time,
    title: item.title,
    subtitle: item.subtitle,
    excerpt: item.excerpt,
    intro: item.intro,
    logo: publicDriveImage(item.logo_file_id, 600),
    image: publicDriveImage(item.cover_file_id || item.logo_file_id, 1600),
    gallery: galleryIds.map(function (id) { return publicDriveImage(id, 1600) }),
    sections: parseJsonArray(item.sections_json),
    createdAt: serializeValue(item.created_at),
    managed: true
  }
}

function publicDriveImage(fileId, width) {
  return fileId ? "https://drive.google.com/thumbnail?id=" + encodeURIComponent(fileId) + "&sz=w" + width : ""
}

function uniqueResourceSlug(title) {
  const base = String(title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "resource"
  const existing = readObjects("resources").map(function (item) { return item.slug })
  let slug = base
  let suffix = 2
  while (existing.indexOf(slug) !== -1) { slug = base + "-" + suffix; suffix += 1 }
  return slug
}

function normalizeResourceSections(sections) {
  return Array.isArray(sections) ? sections.map(function (section) {
    return {
      heading: String(section.heading || "").trim(),
      paragraphs: Array.isArray(section.paragraphs)
        ? section.paragraphs.map(function (paragraph) { return String(paragraph || "").trim() }).filter(Boolean)
        : String(section.body || "").split(/\n\s*\n/).map(function (paragraph) { return paragraph.trim() }).filter(Boolean)
    }
  }).filter(function (section) { return section.heading || section.paragraphs.length }) : []
}

function ensureResourceStorage() {
  const target = spreadsheet()
  let sheet = target.getSheetByName(SHEET_NAMES.resources)
  if (!sheet) {
    sheet = target.insertSheet(SHEET_NAMES.resources)
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(TABLES.resources)
    sheet.setFrozenRows(1)
    sheet.getRange(1, 1, 1, TABLES.resources.length).setBackground("#191717").setFontColor("#ffffff").setFontWeight("bold")
    sheet.autoResizeColumns(1, TABLES.resources.length)
  }
  const properties = PropertiesService.getScriptProperties()
  if (!properties.getProperty("RESOURCE_FOLDER_ID")) properties.setProperty("RESOURCE_FOLDER_ID", DriveApp.createFolder("BeyondNull Published Resource Images").getId())
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
    headers.forEach(function (header, column) { object[header] = serializeValue(row[column], header) })
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
function normalizeDateValue(value, label) {
  if (value instanceof Date && !isNaN(value.getTime())) return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd")
  const raw = String(value || "").trim()
  let match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) return match[1] + "-" + match[2] + "-" + match[3]
  match = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/)
  if (match) return match[3] + "-" + ("0" + match[2]).slice(-2) + "-" + ("0" + match[1]).slice(-2)
  throw new Error((label || "Date") + " is required")
}
function normalizeStoredDate(value) {
  if (!value) return ""
  try { return normalizeDateValue(value, "Date") } catch (error) { return String(value) }
}
function serializeValue(value, field) {
  if (!(value instanceof Date)) return value
  const dateOnlyFields = ["joined_on", "work_start_date", "salary_month", "paid_on"]
  return dateOnlyFields.indexOf(field) !== -1
    ? Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd")
    : value.toISOString()
}
function newestFirst(a, b) { return new Date(b.created_at) - new Date(a.created_at) }
function stripMeta(object) { const clean = Object.assign({}, object); delete clean._row; return clean }
function safeError(error) {
  const message = String(error && error.message ? error.message : "Request failed")
  const allowed = ["Invalid", "Admin", "Client", "Employee", "Payout", "Receipt", "Resource", "Select", "Enter", "Complete", "Unsupported", "Too many", "Database", "Phone", "Total", "Advance", "Monthly", "Salary", "Pay", "Joining", "Work", "An employee"]
  return allowed.some(function (prefix) { return message.indexOf(prefix) === 0 }) ? message : "Request could not be completed"
}
function jsonResponse(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON) }
