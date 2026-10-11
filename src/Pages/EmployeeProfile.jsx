import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft, FaCalendarCheck, FaFileInvoice, FaTrash } from "react-icons/fa"
import { addEmployeePayout, deleteEmployee, downloadEmployeeReceipt, getEmployeeById } from "../services/authService"
import "./EmployeeProfile.css"

const initialPayout = () => ({
  salary_month: new Date().toISOString().slice(0, 7),
  paid_on: new Date().toISOString().slice(0, 10),
  amount: "",
  receipt_name: "",
  receipt_type: "",
  receipt_data: ""
})

function EmployeeProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payout, setPayout] = useState(initialPayout)
  const [saving, setSaving] = useState(false)

  const loadEmployee = async () => {
    setLoading(true)
    const { data, error } = await getEmployeeById(id)
    if (error) console.error("Employee fetch error:", error)
    setEmployee(data || null)
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    getEmployeeById(id).then(({ data, error }) => {
      if (!active) return
      if (error) console.error("Employee fetch error:", error)
      setEmployee(data || null)
      setLoading(false)
    })
    return () => { active = false }
  }, [id])

  const uploadReceipt = (event) => {
    const file = event.target.files?.[0]
    if (!file) return setPayout((current) => ({ ...current, receipt_name: "", receipt_type: "", receipt_data: "" }))
    if (file.size > 3 * 1024 * 1024) {
      event.target.value = ""
      return alert("Receipt file must be smaller than 3 MB")
    }
    const reader = new FileReader()
    reader.onload = () => setPayout((current) => ({ ...current, receipt_name: file.name, receipt_type: file.type, receipt_data: reader.result }))
    reader.readAsDataURL(file)
  }

  const submitPayout = async (event) => {
    event.preventDefault()
    if (Number(payout.amount) <= 0) return alert("Enter a valid payout amount")
    setSaving(true)
    const { error } = await addEmployeePayout(id, { ...payout, salary_month: `${payout.salary_month}-01` })
    setSaving(false)
    if (error) return alert(error.message || "Could not save payout")
    setPayout(initialPayout())
    await loadEmployee()
  }

  const remove = async () => {
    if (!window.confirm("Delete this employee profile and payout history?")) return
    const { error } = await deleteEmployee(id)
    if (error) return alert(error.message || "Could not delete employee")
    navigate("/admin-dashboard")
  }

  const openReceipt = async (payoutId) => {
    const { data, error } = await downloadEmployeeReceipt(payoutId)
    if (error) return alert(error.message || "Could not download receipt")
    const link = document.createElement("a")
    link.href = data.data
    link.download = data.name || "receipt"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  if (loading) return <div className="profile-state">Loading employee profile...</div>
  if (!employee) return <div className="profile-state">Employee profile not found.</div>

  return (
    <main className="employee-profile-page">
      <header className="employee-profile-header">
        <button onClick={() => navigate("/admin-dashboard")}><FaArrowLeft /> Dashboard</button>
        <button className="danger-action" onClick={remove}><FaTrash /> Delete profile</button>
      </header>

      <section className="employee-identity">
        <div className="employee-monogram">{employee.name?.charAt(0).toUpperCase()}</div>
        <div><span>Employee profile</span><h1>{employee.name}</h1><p>{employee.job_role} / {employee.job_type === "Custom" ? employee.custom_job_type : employee.job_type}</p></div>
        <div className="salary-summary"><small>Current salary</small><strong>Rs {Number(employee.salary || 0).toLocaleString("en-IN")}</strong></div>
      </section>

      <div className="employee-profile-grid">
        <section className="employee-panel details-panel">
          <div className="panel-heading"><FaCalendarCheck /><div><h2>Employment record</h2><p>Profile and joining details</p></div></div>
          <dl><div><dt>Phone</dt><dd><a href={`tel:${employee.phone}`}>{employee.phone}</a></dd></div><div><dt>Address</dt><dd>{employee.address}</dd></div><div><dt>Joining date</dt><dd>{new Date(`${employee.joined_on}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</dd></div><div><dt>Created</dt><dd>{new Date(employee.created_at).toLocaleDateString("en-IN")}</dd></div></dl>
        </section>

        <section className="employee-panel payout-panel">
          <div className="panel-heading"><FaFileInvoice /><div><h2>Add payout</h2><p>Record a dated salary payment</p></div></div>
          <form onSubmit={submitPayout}>
            <label><span>Salary month *</span><input type="month" value={payout.salary_month} onChange={(e) => setPayout({ ...payout, salary_month: e.target.value })} required /></label>
            <label><span>Pay date *</span><input type="date" value={payout.paid_on} onChange={(e) => setPayout({ ...payout, paid_on: e.target.value })} required /></label>
            <label><span>Amount *</span><input type="number" min="1" value={payout.amount} onChange={(e) => setPayout({ ...payout, amount: e.target.value })} required /></label>
            <label className="receipt-input"><span>Upload receipt (optional, max 3 MB)</span><input type="file" accept="image/*,.pdf" onChange={uploadReceipt} /></label>
            <button type="submit" disabled={saving}>{saving ? "Saving..." : "Submit payout"}</button>
          </form>
        </section>
      </div>

      <section className="employee-panel payout-history">
        <div className="panel-heading"><FaFileInvoice /><div><h2>Payout history</h2><p>{employee.payouts?.length || 0} payment records</p></div></div>
        {!employee.payouts?.length ? <div className="no-payouts">No payouts recorded yet.</div> : <div className="payout-table-wrap"><table><thead><tr><th>Salary month</th><th>Pay date</th><th>Amount</th><th>Receipt</th></tr></thead><tbody>{employee.payouts.map((item) => <tr key={item.id}><td>{new Date(`${String(item.salary_month).slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</td><td>{new Date(`${String(item.paid_on).slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN")}</td><td>Rs {Number(item.amount).toLocaleString("en-IN")}</td><td>{item.has_receipt ? <button className="receipt-download" onClick={() => openReceipt(item.id)}>View receipt</button> : "Not uploaded"}</td></tr>)}</tbody></table></div>}
      </section>
    </main>
  )
}

export default EmployeeProfile
