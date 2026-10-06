import { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaXmark } from "react-icons/fa6";
import Swal from "sweetalert2";
import "./DiscoveryCallModal.css";

const initialForm = { name: "", phone: "", email: "", message: "" };

function DiscoveryCallModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const firstInput = useRef(null);

  useEffect(() => {
    const showModal = () => setOpen(true);
    window.addEventListener("beyondnull:open-discovery-call", showModal);
    return () => window.removeEventListener("beyondnull:open-discovery-call", showModal);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.classList.add("discovery-modal-open");
    window.addEventListener("keydown", closeOnEscape);
    window.setTimeout(() => firstInput.current?.focus(), 50);

    return () => {
      document.body.classList.remove("discovery-modal-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!/^[0-9]{10}$/.test(form.phone)) {
      Swal.fire({
        icon: "error",
        title: "Check your phone number",
        text: "Please enter a valid 10 digit phone number.",
        confirmButtonColor: "#b4142b"
      });
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("phone", form.phone);
    data.append("email", form.email);
    data.append("message", `Discovery call request: ${form.message}`);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbyoFTbbPRaFVBe41FLmQAadNFCE0JvkMNK0PmmsyqB7NguqVhJdEUHBMfKhsSPt4hzQ/exec", {
        method: "POST",
        body: data,
        mode: "no-cors"
      });

      setForm(initialForm);
      setOpen(false);
      Swal.fire({
        icon: "success",
        title: "Discovery call requested",
        text: "Our team will contact you shortly.",
        confirmButtonColor: "#b4142b"
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Request not sent",
        text: "Please try again or contact us directly.",
        confirmButtonColor: "#b4142b"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="discovery-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
      <section
        className="discovery-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discovery-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="discovery-close" type="button" onClick={() => setOpen(false)} aria-label="Close discovery call form">
          <FaXmark />
        </button>

        <div className="discovery-intro">
          <span>Free discovery call</span>
          <h2 id="discovery-modal-title">Let&apos;s find your clearest growth opportunity.</h2>
          <p>Share a few details. Our team will review your requirement and contact you with a practical next step.</p>
          <div className="discovery-contact">
            <a href="tel:+916205475866">+91 6205475866</a>
            <a href="tel:+917485875137">+91 7485875137</a>
            <a href="mailto:business@beyondnull.in">business@beyondnull.in</a>
          </div>
        </div>

        <form className="discovery-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input ref={firstInput} name="name" value={form.name} onChange={handleChange} required autoComplete="name" />
          </label>
          <label>
            Phone number
            <input name="phone" value={form.phone} onChange={handleChange} required inputMode="numeric" autoComplete="tel" maxLength="10" />
          </label>
          <label>
            Email address <small>Optional</small>
            <input name="email" type="email" value={form.email} onChange={handleChange} autoComplete="email" />
          </label>
          <label>
            What would you like to grow?
            <textarea name="message" value={form.message} onChange={handleChange} required rows="4" />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? "Sending request..." : "Request discovery call"} <FaArrowRight />
          </button>
        </form>
      </section>
    </div>
  );
}

export default DiscoveryCallModal;
