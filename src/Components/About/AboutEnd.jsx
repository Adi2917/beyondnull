import React from "react";
import "./AboutEnd.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AboutEnd = () => {
  return (
    <section className="about-end">
      <div className="about-end-container">
        
        <motion.div 
          className="about-end-left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="cta-tag">Let's Collaborate</div>
          <h2>Ready to Grow Your <span className="yellow-text">Business With Us?</span></h2>

          <p>
            At Beyond Null, we help brands transform their digital presence 
            through creative strategies, innovative marketing, and powerful 
            branding solutions.
          </p>

          <p>
            Whether you’re a startup looking to build your identity or an 
            established brand aiming to scale, our team is here to guide you 
            with the right digital strategy and execution.
          </p>

          <div className="about-end-buttons">
            <Link to="/services" className="btn-primary-3d">
              Get Started
            </Link>

            <Link to="/contact" className="btn-secondary-outline">
              Contact Us
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="about-end-right"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0"
              alt="BeyondNull digital marketing team"
            />
            <div className="image-glow"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutEnd;