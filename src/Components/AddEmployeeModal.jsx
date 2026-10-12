import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { addEmployee, updateEmployee } from "../services/authService"
import "./AddEmployeeModal.css"

const JOB_TYPES = ["Intern", "Full Time", "Remote", "Part Time", "Custom"]

function AddEmployeeModal({ onClose, refreshEmployees, employee = null }) {
  const editing = Boolean(employee)
  const [form, setForm] = useState(() => ({
    name: employee?.name || "", address: employee?.address || "", phone: String(employee?.phone || ""),
    job_role: employee?.job_role || "", job_type: employee?.job_type || "Full Time",
    custom_job_type: employee?.custom_job_type || "", salary: employee?.salary ?? "",
    joined_on: String(employee?.joined_on || new Date().toISOString().slice(0, 10)).slice(0, 10)
  }))
  const [saving, setSaving] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value
    }))
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!/^[0-9]{10}$/.test(form.phone)) return alert("Employee phone number must contain exactly 10 digits")
    if (form.job_type === "Custom" && !form.custom_job_type.trim()) return alert("Enter the custom job type")
    if (Number(form.salary) < 0) return alert("Enter a valid salary")

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
            <label className="field-span"><span>Address *</span><textarea name="address" rows="3" value={form.address} onChange={updateField} required /></label>
          </div>

          <div className="employee-form-intro"><strong>Employment details</strong><span>Role, engagement type and current monthly salary.</span></div>
          <div className="field-grid">
            <label><span>Job role *</span><input name="job_role" placeholder="e.g. Graphic Designer" value={form.job_role} onChange={updateField} required /></label>
            <label><span>Job type *</span><select name="job_type" value={form.job_type} onChange={updateField}>{JOB_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
            {form.job_type === "Custom" && <label className="field-span"><span>Custom job type *</span><input name="custom_job_type" placeholder="Enter your own employment type" value={form.custom_job_type} onChange={updateField} required /></label>}
            <label><span>Monthly salary *</span><input type="number" name="salary" min="0" value={form.salary} onChange={updateField} required /></label>
            <label><span>Joining date *</span><input type="date" name="joined_on" value={form.joined_on} onChange={updateField} required /></label>
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
