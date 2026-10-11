import { useState } from "react"
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa"
import { addResource } from "../services/authService"
import "./AddResourceModal.css"

const MAX_IMAGE_BYTES = 2 * 1024 * 1024
const MAX_GALLERY_IMAGES = 5

const readImage = (file) => new Promise((resolve, reject) => {
  if (!file.type.startsWith("image/")) return reject(new Error("Only image files are allowed"))
  if (file.size > MAX_IMAGE_BYTES) return reject(new Error(`${file.name} must be smaller than 2 MB`))
  const reader = new FileReader()
  reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result })
  reader.onerror = () => reject(new Error(`Could not read ${file.name}`))
  reader.readAsDataURL(file)
})

function AddResourceModal({ onClose, refreshResources }) {
  const [form, setForm] = useState({
    title: "", subtitle: "", category: "Business Growth", read_time: "5 min read",
    excerpt: "", intro: "", logo: null, cover: null, gallery: [], sections: []
  })
  const [saving, setSaving] = useState(false)

  const updateField = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }))

  const chooseSingleImage = async (field, file) => {
    if (!file) return
    try {
      const image = await readImage(file)
      setForm((current) => ({ ...current, [field]: image }))
    } catch (error) { alert(error.message) }
  }

  const chooseGallery = async (files) => {
    const selected = Array.from(files)
    if (form.gallery.length + selected.length > MAX_GALLERY_IMAGES) return alert("You can add up to 5 gallery images")
    try {
      const images = await Promise.all(selected.map(readImage))
      setForm((current) => ({ ...current, gallery: [...current.gallery, ...images] }))
    } catch (error) { alert(error.message) }
  }

  const addSection = () => setForm((current) => ({
    ...current,
    sections: [...current.sections, { heading: "", body: "" }]
  }))

  const updateSection = (index, field, value) => setForm((current) => ({
    ...current,
    sections: current.sections.map((section, sectionIndex) => sectionIndex === index ? { ...section, [field]: value } : section)
  }))

  const removeSection = (index) => setForm((current) => ({
    ...current,
    sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index)
  }))

  const submit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) return alert("Resource heading is required")
    setSaving(true)
    const { error } = await addResource(form)
    setSaving(false)
    if (error) return alert(error.message || "Could not publish resource")
    await refreshResources()
    onClose()
  }

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal-box resource-entry-modal" role="dialog" aria-modal="true" aria-labelledby="resource-modal-title">
        <div className="modal-header">
          <div><span className="modal-kicker">Resource library</span><h2 id="resource-modal-title">Publish a resource</h2></div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </div>

        <form className="resource-form" onSubmit={submit}>
          <section className="resource-form-section">
            <div className="resource-form-heading"><span>01</span><div><strong>Article details</strong><p>Only the main heading is required. Complete the fields you want to show.</p></div></div>
            <div className="field-grid">
              <label className="field-span"><span>Main heading *</span><input name="title" value={form.title} onChange={updateField} required placeholder="Resource title" /></label>
              <label className="field-span"><span>Subtitle (optional)</span><input name="subtitle" value={form.subtitle} onChange={updateField} placeholder="Supporting line below the heading" /></label>
              <label><span>Category</span><input name="category" value={form.category} onChange={updateField} /></label>
              <label><span>Reading time</span><input name="read_time" value={form.read_time} onChange={updateField} placeholder="5 min read" /></label>
              <label className="field-span"><span>Card description (optional)</span><textarea name="excerpt" rows="3" value={form.excerpt} onChange={updateField} placeholder="Short summary shown in the resource library" /></label>
              <label className="field-span"><span>Article introduction (optional)</span><textarea name="intro" rows="4" value={form.intro} onChange={updateField} placeholder="Opening paragraph on the article page" /></label>
            </div>
          </section>

          <section className="resource-form-section">
            <div className="resource-form-heading"><span>02</span><div><strong>Visuals</strong><p>Logo, cover and gallery are optional. JPG, PNG or WebP; maximum 2 MB each.</p></div></div>
            <div className="resource-upload-grid">
              <label><span>Logo image</span><input type="file" accept="image/*" onChange={(event) => chooseSingleImage("logo", event.target.files[0])} /><small>{form.logo?.name || "No logo selected"}</small></label>
              <label><span>Cover image</span><input type="file" accept="image/*" onChange={(event) => chooseSingleImage("cover", event.target.files[0])} /><small>{form.cover?.name || "No cover selected"}</small></label>
              <label className="resource-gallery-input"><span>More images (up to 5)</span><input type="file" accept="image/*" multiple onChange={(event) => chooseGallery(event.target.files)} /><small>{form.gallery.length ? `${form.gallery.length} image(s) selected` : "No gallery images selected"}</small></label>
            </div>
            {form.gallery.length > 0 && <div className="selected-image-list">{form.gallery.map((image, index) => <button type="button" key={`${image.name}-${index}`} onClick={() => setForm((current) => ({ ...current, gallery: current.gallery.filter((_, imageIndex) => imageIndex !== index) }))}>{image.name}<FaTimes /></button>)}</div>}
          </section>

          <section className="resource-form-section">
            <div className="resource-form-heading"><span>03</span><div><strong>Content sections</strong><p>Add as many subheadings as needed. Leave this empty for a short announcement-style resource.</p></div></div>
            <div className="resource-sections">
              {form.sections.map((section, index) => (
                <div className="resource-section-editor" key={index}>
                  <div><strong>Subheading {index + 1}</strong><button type="button" onClick={() => removeSection(index)} aria-label={`Remove subheading ${index + 1}`}><FaTrash /></button></div>
                  <input value={section.heading} onChange={(event) => updateSection(index, "heading", event.target.value)} placeholder="Section heading" />
                  <textarea rows="5" value={section.body} onChange={(event) => updateSection(index, "body", event.target.value)} placeholder="Section content. Leave a blank line between paragraphs." />
                </div>
              ))}
              <button className="add-resource-section" type="button" onClick={addSection}><FaPlus /> Add another subheading</button>
            </div>
          </section>

          <div className="modal-actions">
            <button className="add-btn" type="submit" disabled={saving}>{saving ? "Publishing..." : "Add to resources"}</button>
            <button className="cancel-btn" type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddResourceModal
