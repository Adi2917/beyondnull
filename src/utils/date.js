export function toDateInputValue(value) {
  const raw = String(value || "").trim()
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`

  const indian = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
  if (indian) return `${indian[3]}-${indian[2].padStart(2, "0")}-${indian[1].padStart(2, "0")}`
  return ""
}

export function formatDateValue(value, options = {}) {
  const normalized = toDateInputValue(value)
  if (!normalized) return "Not set"
  const [year, month, day] = normalized.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return "Not set"
  return date.toLocaleDateString("en-IN", options)
}

export function formatMonthValue(value) {
  return formatDateValue(value, { month: "long", year: "numeric" })
}
