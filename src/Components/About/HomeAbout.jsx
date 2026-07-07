import React from "react";
import "./HomeAbout.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const HomeAbout = () => {
  const navigate = useNavigate();

  const goToAbout = () => {
    navigate("/about");
  };

  return (
    <section className="homeAbout">
      {/* Background Subtle Text for Premium Look */}
      <div className="bg-watermark">BEYOND NULL</div>

      <div className="about-wrapper">
        
        {/* Left Side: Content with Slide-In */}
        <motion.div 
          className="about-left"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="about-heading">
            Your creative tech partner for <span className="yellow-text">digital growth</span>
          </h2>

          <p className="about-text">
            Beyond Null is a web development and digital marketing agency built for brands that need more than a basic online presence. We blend websites, apps, SEO, ads, social media, design, and local discovery into one growth-focused digital system.
          </p>

          <motion.button 
            className="about-button" 
            onClick={goToAbout}
            aria-label="Learn more about Beyond Null"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Read More
          </motion.button>
        </motion.div>

        {/* Right Side: Image with 3D Hover & Glow */}
        <motion.div 
          className="about-right"
          initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
          whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
        >
          <div className="image-container">
            <div className="glow-border"></div>
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978"
              alt="Team working on strategy"
              loading="lazy"
            />
            {/* 3D Floating Badge */}
            <motion.div 
              className="experience-badge"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span>Digital</span> Studio
            </motion.div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HomeAbout;
