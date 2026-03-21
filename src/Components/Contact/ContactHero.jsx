import React from "react";
import { motion } from "framer-motion";
import "./ContactHero.css";

const ContactHero = () => {
  return (
    <section className="contact-hero-premium">
      {/* Dynamic Background Elements */}
      <div className="contact-hero-overlay"></div>
      <div className="contact-mesh-glow"></div>

      <div className="contact-hero-wrapper">
        <motion.div 
          className="contact-hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="contact-tag-badge">
            <span className="pulse-dot"></span> Get In Touch
          </div>

          <h1 className="contact-title-massive">
            Let’s Start a <br />
            <span className="gold-shimmer">Conversation</span>
          </h1>

          <p className="contact-description-premium">
            Have a project idea or want to collaborate? We’re always open to
            discussing new opportunities, creative ideas, and elite partnerships 
            that drive real-world impact.
          </p>

          <div className="contact-hero-cta">
            <motion.button 
              className="btn-main-gold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact-form-section').scrollIntoView({ behavior: 'smooth' })}
            >
              Drop a Message
            </motion.button>
            <div className="contact-availability">
              <p>Available for new projects</p>
              <span>Response time: &lt; 24 hours</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Bottom Wave */}
      <div className="hero-bottom-divider"></div>
    </section>
  );
};

export default ContactHero;