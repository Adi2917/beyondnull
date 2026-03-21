import React, { useState } from "react";
import "./ContactForm.css";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // Optional: For smooth reveal

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
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#ffcc00"
      });
      return;
    }

    if (form.email !== "" && !/\S+@\S+\.\S+/.test(form.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
        background: "#111",
        color: "#fff",
        confirmButtonColor: "#ffcc00"
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
        confirmButtonColor: "#ffcc00",
        background: "#111",
        color: "#fff"
      });

    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again",
        background: "#111",
        color: "#fff"
      });
    }
  };

  return (
    <section className="contact">
      <div className="contact-wrapper-main">
        
        <div className="contact-heading">
          <motion.h2 initial={{opacity:0}} whileInView={{opacity:1}}>
            Let's Build Something <span className="yellow-gradient">Amazing Together</span>
          </motion.h2>
          <p>
            Have a project idea or business requirement? 
            Send us a message and our team will connect with you shortly.
          </p>
        </div>

        <div className="contact-container">
          {/* LEFT INFO SIDE */}
          <div className="contact-info">
            <div className="info-badge">BeyondNull Ecosystem</div>
            <h3>Grow Your Digital Empire</h3>
            <p>
              We don't just build websites; we create digital assets that 
              generate revenue. Join hands with the fastest-growing agency.
            </p>

            <ul className="premium-list">
              <li><span className="dot"></span> Custom Software Development</li>
              <li><span className="dot"></span> Digital Marketing Strategy</li>
              <li><span className="dot"></span> High-Performance Web Apps</li>
              <li><span className="dot"></span> Business Scaling Solutions</li>
            </ul>
          </div>

          {/* RIGHT FORM SIDE */}
          <div className="contact-form-card">
            <div className="form-glass-layer">
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