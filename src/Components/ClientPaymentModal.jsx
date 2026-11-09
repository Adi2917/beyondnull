import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { addClientPayment, updateClientPayment } from "../services/authService"
import "./ClientPaymentModal.css"

const emptyPayment = () => ({
  payment_type: "Advance", amount: "", paid_on: new Date().toISOString().slice(0, 10),
  notes: "", proof_name: "", proof_type: "", proof_data: ""
})

function ClientPaymentModal({ clientId, payment, onClose, onSaved }) {
  const [form, setForm] = useState(payment ? {
    payment_type: payment.payment_type || "Payment", amount: payment.amount || "", paid_on: payment.paid_on || "",
    notes: payment.notes || "", proof_name: "", proof_type: "", proof_data: ""
  } : emptyPayment())
  const [saving, setSaving] = useState(false)
  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const uploadProof = (event) => {
    const file = event.target.files?.[0]
    if (!file) return setForm((current) => ({ ...current, proof_name: "", proof_type: "", proof_data: "" }))
    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      event.target.value = ""
      return alert("Proof must be an image or PDF")
    }
    if (file.size > 3 * 1024 * 1024) {
      event.target.value = ""
      return alert("Proof must be smaller than 3 MB")
    }
    const reader = new FileReader()
    reader.onload = () => setForm((current) => ({ ...current, proof_name: file.name, proof_type: file.type, proof_data: reader.result }))
    reader.readAsDataURL(file)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (Number(form.amount) <= 0) return alert("Enter a valid payment amount")
    setSaving(true)
    const result = payment
      ? await updateClientPayment(payment.id, clientId, form)
      : await addClientPayment(clientId, form)
    setSaving(false)
    if (result.error) return alert(result.error.message || "Could not save client payment")
    await onSaved()
    onClose()
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box client-payment-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div><span className="modal-kicker">Client ledger</span><h2>{payment ? "Edit payment" : "Add payment"}</h2></div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>
        <form className="client-payment-form" onSubmit={submit}>
          <div className="client-payment-fields">
            <label><span>Payment type *</span><select name="payment_type" value={form.payment_type} onChange={updateField}><option>Advance</option><option>Installment</option><option>Monthly payment</option><option>Full payment</option><option>Other</option></select></label>
            <label><span>Amount *</span><input type="number" name="amount" min="1" step="0.01" value={form.amount} onChange={updateField} required /></label>
            <label><span>Payment date *</span><input type="date" name="paid_on" value={form.paid_on} onChange={updateField} required /></label>
          </div>
          <label><span>Notes</span><textarea name="notes" rows="3" value={form.notes} onChange={updateField} placeholder="Installment, month or transaction details" /></label>
          <label><span>Payment proof {payment?.has_proof ? "(choose only to replace existing proof)" : "(optional)"}</span><input type="file" accept="image/*,application/pdf,.pdf" onChange={uploadProof} /></label>
          <div className="modal-actions"><button className="add-btn" type="submit" disabled={saving}>{saving ? "Saving..." : "Save payment"}</button><button className="cancel-btn" type="button" onClick={onClose}>Cancel</button></div>
        </form>
      </div>
    </div>
  )
}

export default ClientPaymentModal
