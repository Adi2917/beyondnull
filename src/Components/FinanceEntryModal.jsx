import { useState } from "react"
import { FaTimes } from "react-icons/fa"
import { addFinanceEntry } from "../services/authService"
import "./FinanceEntryModal.css"

function FinanceEntryModal({ entryType, onClose, refreshFinance }) {
  const expense = entryType === "expense"
  const [form, setForm] = useState({
    name: "", amount: "", entry_date: new Date().toISOString().slice(0, 10), notes: "",
    proof_name: "", proof_type: "", proof_data: ""
  })
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
    if (Number(form.amount) <= 0) return alert("Enter a valid amount")
    setSaving(true)
    const { error } = await addFinanceEntry({ ...form, entry_type: entryType })
    setSaving(false)
    if (error) return alert(error.message || `Could not add ${expense ? "expense" : "funds"}`)
    await refreshFinance()
    onClose()
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box finance-entry-modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div><span className="modal-kicker">Finance ledger</span><h2>{expense ? "Add expense" : "Add funds"}</h2></div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>
        <form className="finance-entry-form" onSubmit={submit}>
          <label><span>{expense ? "Expense name" : "Amount source"} *</span><input name="name" value={form.name} onChange={updateField} placeholder={expense ? "Office rent, software, travel..." : "Investment, refund, other income..."} required /></label>
          <div className="finance-field-grid">
            <label><span>Amount *</span><input type="number" name="amount" min="1" value={form.amount} onChange={updateField} required /></label>
            <label><span>Date *</span><input type="date" name="entry_date" value={form.entry_date} onChange={updateField} required /></label>
          </div>
          <label><span>Notes</span><textarea name="notes" rows="3" value={form.notes} onChange={updateField} placeholder="Optional details" /></label>
          <label><span>Proof (optional, image/PDF, max 3 MB)</span><input type="file" accept="image/*,application/pdf,.pdf" onChange={uploadProof} /></label>
          <div className="modal-actions"><button className="add-btn" type="submit" disabled={saving}>{saving ? "Saving..." : expense ? "Save expense" : "Add to balance"}</button><button className="cancel-btn" type="button" onClick={onClose}>Cancel</button></div>
        </form>
      </div>
    </div>
  )
}

export default FinanceEntryModal
