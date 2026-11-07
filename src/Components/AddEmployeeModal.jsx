import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { addEmployee, updateEmployee } from "../services/authService"
import "./AddEmployeeModal.css"
import { toDateInputValue } from "../utils/date"

const JOB_TYPES = ["Intern", "Full Time", "Remote", "Part Time", "Custom"]
const OWNER_PHONES = ["7485875137", "6205475866", "6201689501"]

function AddEmployeeModal({ onClose, refreshEmployees, employee = null }) {
  const editing = Boolean(employee)
  const [form, setForm] = useState(() => ({
    name: employee?.name || "", address: employee?.address || "", phone: String(employee?.phone || ""),
    job_role: employee?.job_role || "", job_type: employee?.job_type || "Full Time",
    custom_job_type: employee?.custom_job_type || "", salary: employee?.salary ?? "",
    joined_on: toDateInputValue(employee?.joined_on) || new Date().toISOString().slice(0, 10),
    email: employee?.email || "", bank_name: employee?.bank_name || "",
    account_number: String(employee?.account_number || ""), ifsc_code: employee?.ifsc_code || ""
  }))
  const [saving, setSaving] = useState(false)
  const isOwner = OWNER_PHONES.includes(form.phone)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10)
        : name === "account_number" ? value.replace(/\D/g, "").slice(0, 24)
          : name === "ifsc_code" ? value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11)
            : value
    }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!/^[0-9]{10}$/.test(form.phone)) return alert("Employee phone number must contain exactly 10 digits")
    if (form.job_type === "Custom" && !form.custom_job_type.trim()) return alert("Enter the custom job type")
    if (!isOwner && Number(form.salary) <= 0) return alert("Monthly salary is required for this employee")
    if (Number(form.salary || 0) < 0) return alert("Enter a valid salary")
    if (!/\S+@\S+\.\S+/.test(form.email)) return alert("Enter a valid employee email")
    if (form.ifsc_code && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc_code)) return alert("Enter a valid IFSC code")

    setSaving(true)
    const { error } = editing ? await updateEmployee(employee.id, form) : await addEmployee(form)
    setSaving(false)
    if (error) return alert(error.message || `Could not ${editing ? "update" : "create"} employee profile`)
    await refreshEmployees()
    onClose()
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box employee-entry-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div><span className="modal-kicker">Team directory</span><h2>{editing ? "Edit employee profile" : "Create employee profile"}</h2></div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>
        <form className="employee-form" onSubmit={submit}>
          <div className="employee-form-intro"><strong>Personal details</strong><span>Keep employee information accurate for payroll records.</span></div>
          <div className="field-grid">
            <label><span>Employee name *</span><input name="name" value={form.name} onChange={updateField} required /></label>
            <label><span>Phone number *</span><input name="phone" inputMode="numeric" placeholder="Exactly 10 digits" value={form.phone} onChange={updateField} required /></label>
            <label className="field-span"><span>Employee email *</span><input type="email" name="email" placeholder="Receipt will be sent here" value={form.email} onChange={updateField} required /></label>
            <label className="field-span"><span>Address *</span><textarea name="address" rows="3" value={form.address} onChange={updateField} required /></label>
          </div>

          <div className="employee-form-intro"><strong>Employment details</strong><span>Role, engagement type and current monthly salary.</span></div>
          <div className="field-grid">
            <label><span>Job role *</span><input name="job_role" placeholder="e.g. Graphic Designer" value={form.job_role} onChange={updateField} required /></label>
            <label><span>Job type *</span><select name="job_type" value={form.job_type} onChange={updateField}>{JOB_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
            {form.job_type === "Custom" && <label className="field-span"><span>Custom job type *</span><input name="custom_job_type" placeholder="Enter your own employment type" value={form.custom_job_type} onChange={updateField} required /></label>}
            <label><span>Monthly salary{isOwner ? "" : " *"}</span><input type="number" name="salary" min="0" placeholder={isOwner ? "0 (optional for owner)" : "Fixed monthly salary"} value={form.salary} onChange={updateField} required={!isOwner} /></label>
            <label><span>Joining date *</span><input type="date" name="joined_on" value={form.joined_on} onChange={updateField} required /></label>
            {isOwner && <p className="owner-salary-note field-span">Owner profile detected. Monthly salary is optional and defaults to Rs 0.</p>}
          </div>

          <div className="employee-form-intro"><strong>Bank account details</strong><span>Used on payroll records and salary receipts.</span></div>
          <div className="field-grid">
            <label><span>Bank name</span><input name="bank_name" placeholder="e.g. State Bank of India" value={form.bank_name} onChange={updateField} /></label>
            <label><span>Account number</span><input name="account_number" inputMode="numeric" placeholder="Bank account number" value={form.account_number} onChange={updateField} /></label>
            <label className="field-span"><span>IFSC code</span><input name="ifsc_code" placeholder="e.g. SBIN0001234" value={form.ifsc_code} onChange={updateField} /></label>
          </div>

          <div className="modal-actions">
            <button className="add-btn" type="submit" disabled={saving}>{saving ? "Saving..." : editing ? "Save employee changes" : "Create profile"}</button>
            <button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEmployeeModal
