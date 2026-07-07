import React from "react";
import { motion } from "framer-motion";
import "./ServiceHero.css";

const ServiceHero = () => {
  return (
    <section className="service-hero">
      <div className="service-hero-accent"></div>

      <div className="service-hero-container">
        <motion.div 
          className="service-hero-left"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            Digital <br />
            <span className="yellow-glow-text">Services</span>
          </h1>
          <div className="title-underline"></div>
        </motion.div>

        <motion.div 
          className="service-hero-right"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-content-card">
            <p className="lead-text">
              BeyondNull builds complete digital systems for brands that need stronger visibility, better websites, and measurable growth.
            </p>
            <p>
              Our team combines creativity, strategy, and technology to deliver websites, apps, SEO, social media, ads, Google Business Profile optimization, and performance campaigns.
            </p>
            <div className="service-tags">
              <span>#WebDev</span>
              <span>#SEO</span>
              <span>#Marketing</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceHero;
