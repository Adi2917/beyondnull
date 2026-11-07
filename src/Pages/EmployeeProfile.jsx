import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaArrowLeft, FaCalendarCheck, FaDownload, FaEdit, FaEye, FaFileInvoice, FaTrash } from "react-icons/fa"
import { addEmployeePayout, deleteEmployee, downloadEmployeeReceipt, downloadPayoutProof, getEmployeeById, updateEmployeePayout } from "../services/authService"
import "./EmployeeProfile.css"
import { WORKSPACE_PATH } from "../portalRoutes"
import { formatDateValue, formatMonthValue, toDateInputValue } from "../utils/date"

const initialPayout = (baseSalary = 0) => ({
  salary_month: new Date().toISOString().slice(0, 7),
  paid_on: new Date().toISOString().slice(0, 10),
  base_salary: Number(baseSalary || 0),
  extra_label: "",
  extra_amount: "",
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
  const [editingPayoutId, setEditingPayoutId] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadEmployee = async () => {
    setLoading(true)
    const { data, error } = await getEmployeeById(id)
    if (error) console.error("Employee fetch error:", error)
    setEmployee(data || null)
    if (data && !editingPayoutId) setPayout(initialPayout(data.salary))
    setLoading(false)
  }

  useEffect(() => {
    let active = true
    getEmployeeById(id).then(({ data, error }) => {
      if (!active) return
      if (error) console.error("Employee fetch error:", error)
      setEmployee(data || null)
      if (data) setPayout(initialPayout(data.salary))
      setLoading(false)
    })
    return () => { active = false }
  }, [id])

  const uploadReceipt = (event) => {
    const file = event.target.files?.[0]
    if (!file) return setPayout((current) => ({ ...current, receipt_name: "", receipt_type: "", receipt_data: "" }))
    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      event.target.value = ""
      return alert("Payment proof must be an image or PDF")
    }
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
    const total = Number(payout.base_salary || 0) + Number(payout.extra_amount || 0)
    if (total <= 0) return alert("Salary or extra payment amount must be greater than zero")
    if (Number(payout.extra_amount || 0) > 0 && !payout.extra_label.trim()) return alert("Enter a name for the extra payment")
    if (!employee.email) return alert("Add the employee email before creating a payout")
    setSaving(true)
    const payload = { ...payout, salary_month: `${payout.salary_month}-01` }
    const { error } = editingPayoutId
      ? await updateEmployeePayout(editingPayoutId, payload)
      : await addEmployeePayout(id, payload)
    setSaving(false)
    if (error) return alert(error.message || "Could not save payout")
    setEditingPayoutId(null)
    setPayout(initialPayout(employee.salary))
    await loadEmployee()
  }

  const editPayout = (item) => {
    setEditingPayoutId(item.id)
    setPayout({
      salary_month: toDateInputValue(item.salary_month).slice(0, 7),
      paid_on: toDateInputValue(item.paid_on),
      base_salary: Number(item.base_salary ?? item.amount ?? employee.salary ?? 0),
      extra_label: item.extra_label || "",
      extra_amount: item.extra_amount ? String(item.extra_amount) : "",
      receipt_name: "",
      receipt_type: "",
      receipt_data: ""
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const cancelPayoutEdit = () => {
    setEditingPayoutId(null)
    setPayout(initialPayout(employee?.salary))
  }

  const remove = async () => {
    if (!window.confirm("Delete this employee profile and payout history?")) return
    const { error } = await deleteEmployee(id)
    if (error) return alert(error.message || "Could not delete employee")
    navigate(WORKSPACE_PATH)
  }

  const viewReceipt = async (payoutId) => {
    const preview = window.open("", "_blank")
    if (!preview) return alert("Please allow pop-ups to view the receipt")
    preview.document.write("<p style='font-family:Arial;padding:24px'>Loading salary receipt...</p>")
    const { data, error } = await downloadEmployeeReceipt(payoutId)
    if (error) {
      preview.close()
      return alert(error.message || "Could not open receipt")
    }
    const response = await fetch(data.data)
    const blobUrl = URL.createObjectURL(await response.blob())
    preview.location.href = blobUrl
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
  }

  const downloadReceipt = async (payoutId) => {
    const { data, error } = await downloadEmployeeReceipt(payoutId)
    if (error) return alert(error.message || "Could not download receipt")
    const link = document.createElement("a")
    link.href = data.data
    link.download = data.name || "BeyondNull-salary-receipt.pdf"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const openProof = async (payoutId) => {
    const { data, error } = await downloadPayoutProof(payoutId)
    if (error) return alert(error.message || "Could not download payment proof")
    const link = document.createElement("a")
    link.href = data.data
    link.download = data.name || "payment-proof"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  if (loading) return <div className="profile-state">Loading employee profile...</div>
  if (!employee) return <div className="profile-state">Employee profile not found.</div>

  return (
    <main className="employee-profile-page">
      <header className="employee-profile-header">
        <button onClick={() => navigate(WORKSPACE_PATH)}><FaArrowLeft /> Dashboard</button>
        <button className="danger-action" onClick={remove}><FaTrash /> Delete profile</button>
      </header>

      <section className="employee-identity">
        <div className="employee-monogram">{employee.name?.charAt(0).toUpperCase()}</div>
        <div><span>Employee profile</span><h1>{employee.name}</h1><p>{employee.job_role} / {employee.job_type === "Custom" ? employee.custom_job_type : employee.job_type}</p></div>
        <div className="salary-summary"><small>Current salary</small><strong>{Number(employee.salary || 0) > 0 ? `Rs ${Number(employee.salary).toLocaleString("en-IN")}` : "Not fixed"}</strong></div>
      </section>

      <div className="employee-profile-grid">
        <section className="employee-panel details-panel">
          <div className="panel-heading"><FaCalendarCheck /><div><h2>Employment record</h2><p>Profile and joining details</p></div></div>
          <dl><div><dt>Phone</dt><dd><a href={`tel:${employee.phone}`}>{employee.phone}</a></dd></div><div><dt>Email</dt><dd>{employee.email ? <a href={`mailto:${employee.email}`}>{employee.email}</a> : "Not added"}</dd></div><div><dt>Address</dt><dd>{employee.address}</dd></div><div><dt>Joining date</dt><dd>{formatDateValue(employee.joined_on, { day: "numeric", month: "long", year: "numeric" })}</dd></div><div><dt>Created</dt><dd>{new Date(employee.created_at).toLocaleDateString("en-IN")}</dd></div></dl>
          <div className="bank-detail-block"><span>Bank account</span><strong>{employee.bank_name || "Not added"}</strong><p>{employee.account_number ? `A/C ending ${String(employee.account_number).slice(-4)}` : "Account number not added"}</p><p>{employee.ifsc_code || "IFSC not added"}</p></div>
        </section>

        <section className="employee-panel payout-panel">
          <div className="panel-heading"><FaFileInvoice /><div><h2>{editingPayoutId ? "Edit payout" : "Add payout"}</h2><p>{editingPayoutId ? "Update the selected payment record" : "Record a dated salary payment"}</p></div></div>
          <form onSubmit={submitPayout}>
            <label><span>Salary month *</span><input type="month" value={payout.salary_month} onChange={(e) => setPayout({ ...payout, salary_month: e.target.value })} required /></label>
            <label><span>Pay date *</span><input type="date" value={payout.paid_on} onChange={(e) => setPayout({ ...payout, paid_on: e.target.value })} required /></label>
            <label><span>Monthly salary</span><input type="number" value={payout.base_salary} readOnly /></label>
            <div className="extra-payment-fields"><label><span>Extra payment name (optional)</span><input value={payout.extra_label} placeholder="Bonus, incentive, reimbursement..." onChange={(e) => setPayout({ ...payout, extra_label: e.target.value })} /></label><label><span>Extra amount (optional)</span><input type="number" min="0" value={payout.extra_amount} placeholder="0" onChange={(e) => setPayout({ ...payout, extra_amount: e.target.value })} /></label></div>
            <div className="payout-total"><span>Total payment</span><strong>Rs {(Number(payout.base_salary || 0) + Number(payout.extra_amount || 0)).toLocaleString("en-IN")}</strong></div>
            <label className="receipt-input"><span>{editingPayoutId ? "Replace payment proof (optional, image/PDF, max 3 MB)" : "Upload payment proof (optional, image/PDF, max 3 MB)"}</span><input key={editingPayoutId || "new"} type="file" accept="image/*,application/pdf,.pdf" onChange={uploadReceipt} /></label>
            <div className="payout-form-actions"><button type="submit" disabled={saving}>{saving ? "Saving..." : editingPayoutId ? "Save payout changes" : "Submit payout"}</button>{editingPayoutId && <button type="button" className="cancel-payout-edit" onClick={cancelPayoutEdit}>Cancel edit</button>}</div>
          </form>
        </section>
      </div>

      <section className="employee-panel payout-history">
        <div className="panel-heading"><FaFileInvoice /><div><h2>Payout history</h2><p>{employee.payouts?.length || 0} payment records</p></div></div>
        {!employee.payouts?.length ? <div className="no-payouts">No payouts recorded yet.</div> : <div className="payout-table-wrap"><table><thead><tr><th>Salary month</th><th>Pay date</th><th>Salary</th><th>Extra</th><th>Total</th><th>Documents</th><th>Action</th></tr></thead><tbody>{employee.payouts.map((item) => <tr key={item.id}><td>{formatMonthValue(item.salary_month)}</td><td>{formatDateValue(item.paid_on)}</td><td>Rs {Number(item.base_salary || 0).toLocaleString("en-IN")}</td><td>{Number(item.extra_amount || 0) > 0 ? `${item.extra_label}: Rs ${Number(item.extra_amount).toLocaleString("en-IN")}` : "-"}</td><td><strong>Rs {Number(item.amount).toLocaleString("en-IN")}</strong></td><td><div className="payout-doc-actions">{item.has_receipt && <><button className="receipt-view" onClick={() => viewReceipt(item.id)}><FaEye /> View receipt</button><button className="receipt-download" onClick={() => downloadReceipt(item.id)}><FaDownload /> Download PDF</button></>}{item.has_payment_proof && <button className="proof-download" onClick={() => openProof(item.id)}>Payment proof</button>}</div></td><td><button className="payout-edit-button" onClick={() => editPayout(item)}><FaEdit /> Edit</button></td></tr>)}</tbody></table></div>}
      </section>
    </main>
  )
}

export default EmployeeProfile
