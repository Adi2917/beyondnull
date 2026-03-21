import React from "react";
import { motion } from "framer-motion";
import "./AboutHero.css";

const AboutHero = () => {
  return (
    <section className="about-hero">
      {/* Dynamic Background Overlay */}
      <div className="about-overlay"></div>
      
      {/* Animated Background Elements */}
      <div className="hero-shapes">
        <div className="shape s1"></div>
        <div className="shape s2"></div>
      </div>

      <motion.div 
        className="about-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Web Development & Digital Solutions
          <span className="gold-glow"> That Empower Modern Businesses</span>
        </motion.h1>

        <motion.div 
          className="about-content-box"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p>
            Beyond Null is a modern web development and digital marketing
            agency focused on building high-performance websites,
            scalable software, and powerful digital platforms.
          </p>

          <p>
            Our team combines strategy, design, and engineering to build
            reliable products that help startups and businesses grow
            faster in the digital world.
          </p>
        </motion.div>

        {/* Floating Line Decorative */}
        <motion.div 
          className="hero-line"
          animate={{ width: ["0%", "100%", "0%"] }}
          transition={{ duration: 4, repeat: Infinity }}
        ></motion.div>
      </motion.div>
    </section>
  );
};

export default AboutHero;