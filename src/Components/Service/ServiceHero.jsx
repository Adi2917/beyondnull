import React from "react";
import { motion } from "framer-motion";
import "./ServiceHero.css";

const ServiceHero = () => {
  return (
    <section className="service-hero">
      <div className="service-overlay"></div>
      
      {/* Background Decorative Element */}
      <div className="service-hero-accent"></div>

      <div className="service-hero-container">
        {/* LEFT SIDE: Big Bold Title */}
        <motion.div 
          className="service-hero-left"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            Our <br />
            <span className="yellow-glow-text">Services</span>
          </h1>
          <div className="title-underline"></div>
        </motion.div>

        {/* RIGHT SIDE: Content Box */}
        <motion.div 
          className="service-hero-right"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-content-card">
            <p className="lead-text">
              At BeyondNull, we provide powerful digital marketing and 
              tech solutions designed to scale your legacy.
            </p>
            <p>
              Our team combines creativity, strategy, and technology to deliver
              solutions that drive real business growth. From branding and
              website development to SEO and performance campaigns, we focus 
              on converting your audience into loyal customers.
            </p>
            <div className="service-tags">
              <span>#WebDev</span>
              <span>#Marketing</span>
              <span>#Growth</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHero;