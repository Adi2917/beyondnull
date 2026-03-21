import React from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaWhatsapp, FaArrowRight } from "react-icons/fa";
import "./ContactMiddle.css";

const ContactMiddle = () => {
  return (
    <section className="contact-middle-premium">
      <div className="contact-middle-container">
        
        {/* HEADING AREA */}
        <div className="contact-heading-elite">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Direct <span className="gold-text">Channels</span>
          </motion.h2>
          <p>Skip the formal queues. Reach out to the core team directly through these channels.</p>
        </div>

        {/* CONTACT CARDS - 3D GLASS STYLE */}
        <div className="contact-cards-grid">
          {[
            { icon: <FaPhoneAlt />, title: "Call Us", desc: "For urgent strategic calls.", detail: "6205475866" },
            { icon: <FaEnvelope />, title: "Email", desc: "For project briefs & docs.", detail: "beyondnull@gmail.com" },
            { icon: <FaWhatsapp />, title: "WhatsApp", desc: "For instant quick updates.", detail: "Chat Anytime" }
          ].map((item, index) => (
            <motion.div 
              className="contact-card-premium" 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="card-icon-box">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span className="contact-detail-text">{item.detail}</span>
              <div className="card-bg-blur"></div>
            </motion.div>
          ))}
        </div>

        {/* PROCESS SECTION - TIMELINE DESIGN */}
        <div className="contact-process-elite">
          <div className="process-header">
            <h2>The <span className="gold-text">Workflow</span></h2>
            <p>From initial talk to final deployment, we keep it transparent.</p>
          </div>

          <div className="process-timeline-grid">
            {[
              { num: "01", title: "Send Inquiry", desc: "Tell us about your project vision." },
              { num: "02", title: "Discussion", desc: "We map out the strategy & tech stack." },
              { num: "03", title: "Execution", desc: "Our team builds and scales your idea." }
            ].map((step, index) => (
              <motion.div 
                className="process-step-premium" 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="step-number-glow">{step.num}</div>
                <div className="step-content">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
                {index !== 2 && <FaArrowRight className="process-arrow-icon" />}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactMiddle;