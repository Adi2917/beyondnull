import { useMemo, useState } from "react"
import { FaCheck, FaTimes } from "react-icons/fa"
import { addClient } from "../services/authService"
import "./AddClientModal.css"

const SERVICES = [
  { name: "Website Development", billing: "project", finalStatus: "Delivered" },
  { name: "App Development", billing: "project", finalStatus: "Delivered" },
  { name: "Social Media Marketing", billing: "monthly", finalStatus: "Stopped" },
  { name: "Social Media Management", billing: "monthly", finalStatus: "Stopped" }
]
const PLATFORMS = ["Facebook", "Instagram", "LinkedIn", "Twitter / X"]

const emptyProject = (service) => ({
  service_type: service.name,
  billing_type: service.billing,
  total_amount: "",
  advance_amount: "",
  monthly_package: "",
  social_platforms: [],
  work_start_date: new Date().toISOString().slice(0, 10),
  work_status: "Running"
})

function AddClientModal({ onClose, refreshClients }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", district: "" })
  const [projects, setProjects] = useState([])
  const [saving, setSaving] = useState(false)
  const selectedNames = useMemo(() => projects.map((item) => item.service_type), [projects])

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value
    }))
  }

  const toggleService = (service) => {
    setProjects((current) => current.some((item) => item.service_type === service.name)
      ? current.filter((item) => item.service_type !== service.name)
      : [...current, emptyProject(service)])
  }

  const updateProject = (serviceName, field, value) => {
    setProjects((current) => current.map((item) => item.service_type === serviceName ? { ...item, [field]: value } : item))
  }

  const togglePlatform = (serviceName, platform) => {
    setProjects((current) => current.map((item) => {
      if (item.service_type !== serviceName) return item
      const social_platforms = item.social_platforms.includes(platform)
        ? item.social_platforms.filter((name) => name !== platform)
        : [...item.social_platforms, platform]
      return { ...item, social_platforms }
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!/^[0-9]{10}$/.test(form.phone)) return alert("Enter a valid 10 digit phone number")
    if (!projects.length) return alert("Select at least one service")

    for (const project of projects) {
      if (!project.work_start_date) return alert(`Select work start date for ${project.service_type}`)
      if (project.billing_type === "project") {
        if (Number(project.total_amount) <= 0) return alert(`Enter total amount for ${project.service_type}`)
        if (Number(project.advance_amount) > Number(project.total_amount)) return alert("Advance amount cannot exceed total amount")
      } else {
        if (!project.social_platforms.length) return alert(`Select at least one platform for ${project.service_type}`)
        if (Number(project.monthly_package) <= 0) return alert(`Enter monthly package for ${project.service_type}`)
      }
    }

    setSaving(true)
    const { error } = await addClient({ ...form, package_amount: "", services: selectedNames, projects })
    setSaving(false)
    if (error) return alert(error.message || "Could not add client")
    await refreshClients()
    onClose()
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box client-entry-modal" role="dialog" aria-modal="true" aria-labelledby="add-client-title">
        <div className="modal-header">
          <div><span className="modal-kicker">New business record</span><h2 id="add-client-title">Add client</h2></div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <section className="form-section">
            <SectionHeading number="01" title="Client details" text="Primary contact and location information." />
            <div className="field-grid">
              <label><span>Client name *</span><input name="name" value={form.name} onChange={updateForm} required /></label>
              <label><span>Phone number *</span><input name="phone" inputMode="numeric" placeholder="10 digit number" value={form.phone} onChange={updateForm} required /></label>
              <label><span>Email address</span><input type="email" name="email" value={form.email} onChange={updateForm} /></label>
              <label><span>District / City</span><input name="district" value={form.district} onChange={updateForm} /></label>
              <label className="field-span"><span>Address</span><textarea name="address" rows="2" value={form.address} onChange={updateForm} /></label>
            </div>
          </section>

          <section className="form-section">
            <SectionHeading number="02" title="Services" text="Select every service included in this engagement." />
            <div className="service-grid">
              {SERVICES.map((service) => (
                <button type="button" key={service.name} className={`service-card ${selectedNames.includes(service.name) ? "active" : ""}`} onClick={() => toggleService(service)}>
                  <FaCheck /> {service.name}
                </button>
              ))}
            </div>
          </section>

          {projects.map((project, index) => {
            const definition = SERVICES.find((item) => item.name === project.service_type)
            const pending = Math.max(0, Number(project.total_amount || 0) - Number(project.advance_amount || 0))
            return (
              <section className="form-section service-detail" key={project.service_type}>
                <SectionHeading number={String(index + 3).padStart(2, "0")} title={project.service_type} text={project.billing_type === "project" ? "Project billing and delivery tracking." : "Monthly package and platform tracking."} />
                {project.billing_type === "project" ? (
                  <div className="field-grid three-columns">
                    <label><span>Total amount *</span><input type="number" min="0" value={project.total_amount} onChange={(e) => updateProject(project.service_type, "total_amount", e.target.value)} required /></label>
                    <label><span>Advance paid</span><input type="number" min="0" value={project.advance_amount} onChange={(e) => updateProject(project.service_type, "advance_amount", e.target.value)} /></label>
                    <label><span>Pending amount</span><input value={`Rs ${pending.toLocaleString("en-IN")}`} readOnly /></label>
                  </div>
                ) : (
                  <>
                    <div className="platform-picker">
                      <span className="field-label">Platforms * (select at least one)</span>
                      <div>{PLATFORMS.map((platform) => <button type="button" key={platform} className={project.social_platforms.includes(platform) ? "active" : ""} onClick={() => togglePlatform(project.service_type, platform)}>{platform}</button>)}</div>
                    </div>
                    <div className="field-grid"><label><span>Monthly package *</span><input type="number" min="0" value={project.monthly_package} onChange={(e) => updateProject(project.service_type, "monthly_package", e.target.value)} required /></label></div>
                  </>
                )}
                <div className="field-grid service-meta-fields">
                  <label><span>Work start date *</span><input type="date" value={project.work_start_date} onChange={(e) => updateProject(project.service_type, "work_start_date", e.target.value)} required /></label>
                  <label><span>Work status *</span><select value={project.work_status} onChange={(e) => updateProject(project.service_type, "work_status", e.target.value)}><option>Running</option><option>Paused</option><option>{definition.finalStatus}</option></select></label>
                </div>
              </section>
            )
          })}

          <div className="modal-actions sticky-actions">
            <button className="add-btn" type="submit" disabled={saving}>{saving ? "Creating..." : "Create client record"}</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function SectionHeading({ number, title, text }) {
  return <div className="form-section-heading"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>
}

export default AddClientModal
