import React from "react";
import "./ContactHero.css";

const ContactHero = () => {
  return (
    <section className="contact-hero">
      <div className="contact-hero-overlay"></div>

      <div className="contact-hero-container">
        <p className="contact-tag">Get In Touch</p>

        <h1 className="contact-title">
          Let’s Start a <span>Conversation</span>
        </h1>

        <p className="contact-description">
          Have a project idea or want to collaborate? We’re always open to
          discussing new opportunities, creative ideas, and partnerships.
        </p>

        
      </div>
    </section>
  );
};

export default ContactHero;