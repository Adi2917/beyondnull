import React, { useState } from "react";
import "./ContactForm.css";
import Swal from "sweetalert2";

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Logic remains 100% same as your code
    if (!/^[0-9]{10}$/.test(form.phone)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone Number",
        text: "Please enter a valid 10 digit phone number",
        background: "#fffaf4",
        color: "#211b18",
        confirmButtonColor: "#7957d5"
      });
      return;
    }

    if (form.email !== "" && !/\S+@\S+\.\S+/.test(form.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
        background: "#fffaf4",
        color: "#211b18",
        confirmButtonColor: "#7957d5"
      });
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("name", form.name);
    data.append("phone", form.phone);
    data.append("email", form.email);
    data.append("message", form.message);

    try {
      await fetch("https://script.google.com/macros/s/AKfycbyoFTbbPRaFVBe41FLmQAadNFCE0JvkMNK0PmmsyqB7NguqVhJdEUHBMfKhsSPt4hzQ/exec", {
        method: "POST",
        body: data,
        mode: "no-cors"
      });

      setForm({ name: "", phone: "", email: "", message: "" });
      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Message Sent Successfully",
        text: "Our team will contact you soon",
        confirmButtonColor: "#7957d5",
        background: "#fffaf4",
        color: "#211b18"
      });

    } catch {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again",
        background: "#fffaf4",
        color: "#211b18"
      });
    }
  };

  return (
    <section className="contact" id="contact-form-section">
      <div className="contact-wrapper-main">
        
        <div className="contact-heading">
          <span className="section-kicker">Free discovery call</span>
          <h2>
            Have an idea? Let's turn it into <span className="yellow-gradient">business growth.</span>
          </h2>
          <p>
            Tell us what you are building, improving, or trying to grow. We will use the call to identify a practical next step.
          </p>
        </div>

        <div className="contact-container">
          {/* LEFT INFO SIDE */}
          <div className="contact-info">
            <div className="info-badge">BeyondNull / Bangalore</div>
            <h3>One team for your complete digital journey.</h3>
            <p>
              From the first website screen to the campaign that brings the next customer, we connect every part around one clear business goal.
            </p>

            <ul className="premium-list">
              <li><span>01</span><strong>Build</strong> Websites, apps, and digital assets</li>
              <li><span>02</span><strong>Get Found</strong> SEO, local search, and authority</li>
              <li><span>03</span><strong>Grow</strong> Social, ads, campaigns, and strategy</li>
            </ul>

            <div className="contact-direct">
              <a href="mailto:business@beyondnull.in">business@beyondnull.in</a>
              <a href="tel:+916205475866">+91 6205475866</a>
              <a href="tel:+917485875137">+91 7485875137</a>
            </div>
          </div>

          {/* RIGHT FORM SIDE */}
          <div className="contact-form-card">
            <div className="form-glass-layer">
              <div className="form-heading">
                <span>Start a conversation</span>
                <h3>Book a free discovery call.</h3>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    name="name"
                    placeholder=" "
                    required
                    value={form.name}
                    onChange={handleChange}
                  />
                  <label>Your Full Name</label>
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    name="phone"
                    placeholder=" "
                    required
                    value={form.phone}
                    onChange={handleChange}
                  />
                  <label>Phone Number</label>
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={form.email}
                    onChange={handleChange}
                  />
                  <label>Email Address (Optional)</label>
                </div>

                <div className="input-group">
                  <textarea
                    name="message"
                    placeholder=" "
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                  <label>Tell us about your project...</label>
                </div>

                <button type="submit" className="submit-btn-3d" disabled={loading}>
                  <span className="btn-text">
                    {loading ? "Initializing..." : "Send Message"}
                  </span>
                  <div className="btn-glow"></div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
