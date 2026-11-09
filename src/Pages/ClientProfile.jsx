import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FaDownload, FaEdit, FaPlus, FaTrash } from "react-icons/fa"
import ClientPaymentModal from "../Components/ClientPaymentModal"
import { deleteClient as removeClient, deleteClientPayment, downloadClientPaymentProof, getClientById, updateClient as saveClient } from "../services/authService"
import "./ClientProfile.css"

const money = (value) => `Rs ${Number(value || 0).toLocaleString("en-IN")}`
const displayDate = (value) => value ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN") : "Not set"

function ClientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({})
  const [paymentModal, setPaymentModal] = useState(null)

  const fetchClient = useCallback(async () => {
    const { data, error } = await getClientById(id)
    if (error) {
      console.error(error)
      setLoading(false)
      return
    }
    setClient(data)
    setForm(data)
    setLoading(false)
  }, [id])

  useEffect(() => {
    const timer = window.setTimeout(fetchClient, 0)
    return () => window.clearTimeout(timer)
  }, [fetchClient])

  const handleChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const updateProjectStatus = (serviceType, status) => setForm((current) => ({
    ...current,
    projects: (current.projects || []).map((project) => project.service_type === serviceType ? { ...project, work_status: status } : project)
  }))

  const updateClient = async () => {
    if (!/^[0-9]{10}$/.test(form.phone || "")) return alert("Enter valid 10 digit phone number")
    if (!Array.isArray(form.services) || form.services.length === 0) return alert("Select at least one service")
    const { error } = await saveClient(id, {
      name: form.name, phone: form.phone, email: form.email, address: form.address,
      district: form.district, services: form.services, projects: form.projects || []
    })
    if (error) return alert(error.message || "Update failed")
    setEditMode(false)
    await fetchClient()
  }

  const deleteClient = async () => {
    if (!window.confirm("Delete this client and its payment history?")) return
    const { error } = await removeClient(id)
    if (error) return alert(error.message || "Delete failed")
    navigate(-1)
  }

  const removePayment = async (payment) => {
    if (!window.confirm(`Delete ${money(payment.amount)} payment?`)) return
    const { error } = await deleteClientPayment(payment.id)
    if (error) return alert(error.message || "Could not delete payment")
    await fetchClient()
  }

  const downloadProof = async (payment) => {
    const { data, error } = await downloadClientPaymentProof(payment.id)
    if (error) return alert(error.message || "Could not download payment proof")
    const link = document.createElement("a")
    link.href = data.data
    link.download = data.name || "client-payment-proof"
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  if (loading) return <div className="profile-loading">Loading client...</div>
  if (!client) return <div className="profile-loading">Client not found</div>

  const projects = editMode ? form.projects : client.projects

  return (
    <main className="client-profile">
      <section className="profile-card">
        <div className="profile-header">
          <div className="avatar">{client.name?.charAt(0).toUpperCase()}</div>
          <div className="profile-identity">
            {editMode ? <input name="name" value={form.name || ""} onChange={handleChange} /> : <h2>{client.name}</h2>}
            <p className="district">{client.district}</p>
          </div>
          <div className="profile-icons"><button type="button" onClick={() => setEditMode(true)} aria-label="Edit client"><FaEdit /></button><button type="button" onClick={deleteClient} aria-label="Delete client"><FaTrash /></button></div>
        </div>

        <div className="info-grid">
          {[{ label: "Phone", name: "phone" }, { label: "Email", name: "email", empty: "Not provided" }, { label: "Address", name: "address", empty: "Not provided" }, { label: "District", name: "district", empty: "Not provided" }].map((field) => (
            <div className="info-item" key={field.name}><span>{field.label}</span>{editMode ? <input name={field.name} value={form[field.name] || ""} onChange={handleChange} /> : <p>{client[field.name] || field.empty}</p>}</div>
          ))}
          <div className="info-item"><span>Added on</span><p>{new Date(client.created_at).toLocaleDateString("en-IN")}</p></div>
          <div className="info-item"><span>Service total</span><p>{money(client.contract_total)}</p></div>
          <div className="info-item payment-total"><span>Paid (recorded payments)</span><p>{money(client.payment_total)}</p></div>
          <div className="info-item payment-pending"><span>Pending</span><p>{money(client.pending_amount)}</p></div>
        </div>

        <section className="services">
          <div className="profile-section-head"><div><span>Work records</span><h3>Services</h3></div></div>
          <div className="profile-projects">
            {projects?.length ? projects.map((project) => (
              <article className="profile-project" key={project.id || `${project.service_type}-${project.work_start_date}`}>
                <div><strong>{project.service_type}</strong><span>{project.work_start_date ? `Started ${displayDate(project.work_start_date)}` : "Start date not set"}</span></div>
                {project.billing_type === "project" ? <p>Project total: {money(project.total_amount)}. Payments are recorded separately below.</p> : <p>Monthly package: {money(project.monthly_package)} / {(project.social_platforms || []).join(", ")}</p>}
                {editMode ? <select value={project.work_status} onChange={(event) => updateProjectStatus(project.service_type, event.target.value)}><option>Running</option><option>Paused</option><option>{project.billing_type === "project" ? "Delivered" : "Stopped"}</option></select> : <b className={`project-status ${project.work_status?.toLowerCase()}`}>{project.work_status}</b>}
              </article>
            )) : <p className="no-services">No structured services recorded</p>}
          </div>
        </section>

        <section className="client-payment-section">
          <div className="profile-section-head"><div><span>Finance history</span><h3>Client payments</h3></div><button type="button" onClick={() => setPaymentModal({ mode: "add" })}><FaPlus /> Add payment</button></div>
          {!client.payments?.length ? <div className="client-payment-empty">No payment recorded yet.</div> : <div className="client-payment-table"><table><thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Details</th><th>Proof</th><th>Actions</th></tr></thead><tbody>{client.payments.map((payment) => (
            <tr key={payment.id}><td>{displayDate(payment.paid_on)}</td><td>{payment.payment_type}</td><td className="client-payment-amount">{money(payment.amount)}</td><td>{payment.notes || "-"}</td><td>{payment.has_proof ? <button type="button" className="payment-proof" onClick={() => downloadProof(payment)}><FaDownload /> View</button> : "-"}</td><td><div className="payment-actions"><button type="button" onClick={() => setPaymentModal({ mode: "edit", payment })}><FaEdit /></button><button type="button" onClick={() => removePayment(payment)}><FaTrash /></button></div></td></tr>
          ))}</tbody></table></div>}
        </section>

        <div className="profile-actions">
          <a href={`tel:${client.phone}`} className="call-btn">Call</a>
          <a href={`https://wa.me/91${client.phone}`} target="_blank" rel="noreferrer" className="whatsapp-btn">WhatsApp</a>
          {editMode && <button className="save-btn" onClick={updateClient}>Save</button>}
          <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </section>
      {paymentModal && <ClientPaymentModal clientId={id} payment={paymentModal.mode === "edit" ? paymentModal.payment : null} onClose={() => setPaymentModal(null)} onSaved={fetchClient} />}
    </main>
  )
}

export default ClientProfile
