import React from "react";
import "./HomeHero.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HomeHero = () => {
  const navigate = useNavigate();

  const goToServices = () => {
    navigate("/services");
  };

  return (
    <section className="hero">
      {/* 3D Animated Background Elements */}
      <div className="hero-visuals">
        <motion.div 
          className="blob yellow-blob"
          animate={{ 
            y: [0, 50, 0], 
            rotate: [0, 90, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="blob dark-blob"
          animate={{ 
            y: [0, -60, 0], 
            rotate: [0, -45, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Web Development & Digital Marketing Agency <br />
          <motion.span 
            className="highlight-text"
            animate={{ textShadow: ["0 0 10px #ffcc00", "0 0 25px #ffcc00", "0 0 10px #ffcc00"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Beyond Null
          </motion.span>
        </motion.h1>

        <motion.p 
          className="hero-description"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Beyond Null is a professional web development and digital marketing agency 
          offering website development, app development, social media marketing, 
          Google My Business optimization, and complete digital marketing solutions 
          to help businesses grow faster in the modern digital world.
        </motion.p>

        <motion.button 
          className="hero-btn" 
          onClick={goToServices}
          aria-label="Explore Web Development and Digital Marketing Services"
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px #ffcc00" }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Explore Services
        </motion.button>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div 
        className="scroll-indicator"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="mouse"></div>
      </motion.div>
    </section>
  );
};

export default HomeHero;