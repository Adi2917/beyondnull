import React from "react";
import "./ContactMiddle.css";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaInstagram, FaLinkedin } from "react-icons/fa";

const ContactMiddle = () => {
  return (
    <section className="contact-middle">

      <div className="contact-middle-container">

        <div className="contact-heading">
          <h2>Connect With Us</h2>
          <p>
            We believe great projects start with great conversations. 
            Reach out and let's build something amazing together.
          </p>
        </div>

        {/* CONTACT CARDS */}

        <div className="contact-cards">

          <div className="contact-card">
            <FaPhoneAlt className="card-icon" />
            <h3>Call Us</h3>
            <p>Speak directly with us for quick discussions.</p>
            <span>6205475866</span>
          </div>

          <div className="contact-card">
            <FaEnvelope className="card-icon" />
            <h3>Email</h3>
            <p>Send us your ideas and project details.</p>
            <span>beyondnull@gmail.com</span>
          </div>

          <div className="contact-card">
            <FaWhatsapp className="card-icon" />
            <h3>WhatsApp</h3>
            <p>Quick chat for instant responses.</p>
            <span>Chat Anytime</span>
          </div>

        </div>

        {/* PROCESS SECTION */}

        <div className="contact-process">

          <h2>Our Simple Process</h2>

          <div className="process-grid">

            <div className="process-step">
              <div className="step-number">01</div>
              <h4>Send Inquiry</h4>
              <p>Tell us about your idea or project requirement.</p>
            </div>

            <div className="process-step">
              <div className="step-number">02</div>
              <h4>Discussion</h4>
              <p>We discuss the best approach and solutions.</p>
            </div>

            <div className="process-step">
              <div className="step-number">03</div>
              <h4>Execution</h4>
              <p>Our team starts building your vision.</p>
            </div>

          </div>

        </div>

        {/* SOCIAL CONNECT */}

        

      </div>

    </section>
  );
};

export default ContactMiddle;