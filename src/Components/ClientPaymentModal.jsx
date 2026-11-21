import { useMemo, useState } from "react"
import { FaTimes } from "react-icons/fa"
import { addClientPayment, updateClientPayment } from "../services/authService"
import "./ClientPaymentModal.css"

const currentMonth = () => new Date().toISOString().slice(0, 7)
const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`
const defaultType = (project) => project?.billing_type === "monthly" ? "Monthly payment" : "Advance"

function ClientPaymentModal({ client, payment, onClose, onSaved }) {
  const projects = client.projects || []
  const initialProject = projects.find((project) => project.id === payment?.service_id) || projects[0]
  const [form, setForm] = useState({
    service_id: initialProject?.id || "", payment_type: payment?.payment_type || defaultType(initialProject),
    billing_period: payment?.billing_period || currentMonth(), amount: payment?.amount || "",
    paid_on: payment?.paid_on || new Date().toISOString().slice(0, 10), notes: payment?.notes || "",
    proof_name: "", proof_type: "", proof_data: ""
  })
  const [saving, setSaving] = useState(false)
  const project = projects.find((item) => item.id === form.service_id)
  const monthly = project?.billing_type === "monthly"
  const serviceTotal = Number(monthly ? project?.monthly_package : project?.total_amount || 0)
  const alreadyPaid = useMemo(() => (client.payments || []).filter((item) => {
    if (item.id === payment?.id || item.service_id !== form.service_id) return false
    return !monthly || (item.billing_period || String(item.paid_on || "").slice(0, 7)) === form.billing_period
  }).reduce((sum, item) => sum + Number(item.amount || 0), 0), [client.payments, form.billing_period, form.service_id, monthly, payment?.id])
  const remainingBefore = Math.max(serviceTotal - alreadyPaid, 0)
  const remainingAfter = Math.max(remainingBefore - Number(form.amount || 0), 0)

  const updateField = (event) => {
    const { name, value } = event.target
    if (name === "service_id") {
      const nextProject = projects.find((item) => item.id === value)
      setForm((current) => ({ ...current, service_id: value, payment_type: defaultType(nextProject), amount: "" }))
      return
    }
    if (name === "payment_type" && (value === "Full payment" || value === "Monthly payment")) {
      setForm((current) => ({ ...current, payment_type: value, amount: remainingBefore || "" }))
      return
    }
    setForm((current) => ({ ...current, [name]: value }))
  }

  const uploadProof = (event) => {
    const file = event.target.files?.[0]
    if (!file) return setForm((current) => ({ ...current, proof_name: "", proof_type: "", proof_data: "" }))
    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) { event.target.value = ""; return alert("Proof must be an image or PDF") }
    if (file.size > 3 * 1024 * 1024) { event.target.value = ""; return alert("Proof must be smaller than 3 MB") }
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, proof_name: file.name, proof_type: file.type, proof_data: reader.result }))
    reader.readAsDataURL(file)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (!project) return alert("Select a service")
    if (Number(form.amount) <= 0) return alert("Enter a valid payment amount")
    if (Number(form.amount) > remainingBefore) return alert(`Amount cannot exceed remaining balance ${money(remainingBefore)}`)
    setSaving(true)
    const result = payment ? await updateClientPayment(payment.id, client.id, form) : await addClientPayment(client.id, form)
    setSaving(false)
    if (result.error) return alert(result.error.message || "Could not save client payment")
    alert(payment ? "Payment updated. Review the refreshed PDF before sending." : "Payment saved. Review the PDF, then send the receipt when ready.")
    await onSaved()
    onClose()
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box client-payment-modal" role="dialog" aria-modal="true">
        <div className="modal-header"><div><span className="modal-kicker">Client ledger</span><h2>{payment ? "Edit payment" : "Add payment"}</h2></div><button type="button" className="close-btn" onClick={onClose} aria-label="Close"><FaTimes /></button></div>
        <form className="client-payment-form" onSubmit={submit}>
          <div className="client-payment-fields service-payment-fields">
            <label><span>Service *</span><select name="service_id" value={form.service_id} onChange={updateField} required><option value="">Select service</option>{projects.map((item) => <option key={item.id} value={item.id}>{item.service_type}</option>)}</select></label>
            <label><span>Payment mode *</span><select name="payment_type" value={form.payment_type} onChange={updateField}>{monthly ? <><option>Monthly payment</option><option>Partial monthly payment</option></> : <><option>Advance</option><option>Installment</option><option>Full payment</option></>}</select></label>
            {monthly && <label><span>Billing month *</span><input type="month" name="billing_period" value={form.billing_period} onChange={updateField} required /></label>}
          </div>
          {project && <div className="payment-balance-summary"><div><span>{monthly ? "Monthly package" : "Project total"}</span><strong>{money(serviceTotal)}</strong></div><div><span>Already received</span><strong>{money(alreadyPaid)}</strong></div><div><span>Available balance</span><strong>{money(remainingBefore)}</strong></div><div className="balance-after"><span>Balance after payment</span><strong>{money(remainingAfter)}</strong></div></div>}
          <div className="client-payment-fields payment-detail-fields"><label><span>Amount received *</span><input type="number" name="amount" min="1" max={remainingBefore || undefined} step="0.01" value={form.amount} onChange={updateField} required /></label><label><span>Payment date *</span><input type="date" name="paid_on" value={form.paid_on} onChange={updateField} required /></label></div>
          <label><span>Notes</span><textarea name="notes" rows="3" value={form.notes} onChange={updateField} placeholder="Transaction reference or payment details" /></label>
          <label><span>Payment proof {payment?.has_proof ? "(choose only to replace existing proof)" : "(optional)"}</span><input type="file" accept="image/*,application/pdf,.pdf" onChange={uploadProof} /></label>
          <div className="modal-actions"><button className="add-btn" type="submit" disabled={saving || !project || remainingBefore <= 0}>{saving ? "Saving..." : "Save payment"}</button><button className="cancel-btn" type="button" onClick={onClose}>Cancel</button></div>
        </form>
      </div>
    </div>
  )
}

export default ClientPaymentModal
