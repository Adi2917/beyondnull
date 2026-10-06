import "./HomeHero.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCode, FaLocationDot, FaRocket, FaShareNodes } from "react-icons/fa6";

const HomeHero = () => {
  const navigate = useNavigate();

  const goToServices = () => {
    navigate("/services");
  };

  return (
    <section className="hero">
      <div className="hero-visuals">
        <motion.div 
          className="blob red-blob"
          animate={{ 
            y: [0, 50, 0], 
            rotate: [0, 90, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="blob purple-blob"
          animate={{ 
            y: [0, -60, 0], 
            rotate: [0, -45, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-kicker"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FaLocationDot /> Digital growth studio
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Build a sharper digital business with <span className="highlight-text">Beyond Null</span>
        </motion.h1>

        <motion.p 
          className="hero-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          We design websites, apps, brand systems, SEO, social campaigns, ads, and local growth engines for modern businesses that want a premium digital presence.
        </motion.p>

        <div className="hero-actions">
          <motion.button 
            className="hero-btn" 
            onClick={goToServices}
            aria-label="Explore BeyondNull services"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Explore Services
          </motion.button>

          <motion.button
            className="hero-btn ghost"
            onClick={() => navigate("/contact")}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            Start a Project
          </motion.button>
        </div>
      </div>

      <motion.div
        className="hero-3d-stage"
        initial={{ opacity: 0, scale: 0.9, rotateY: -18 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
      >
        <div className="orbit-ring"></div>
        <div className="dashboard-card">
          <div className="dash-top">
            <span></span><span></span><span></span>
          </div>
          <div className="dash-line wide"></div>
          <div className="dash-grid">
            <div><FaCode /><strong>Web</strong></div>
            <div><FaShareNodes /><strong>Socials</strong></div>
            <div><FaRocket /><strong>Ads</strong></div>
          </div>
          <div className="dash-bars">
            <span></span><span></span><span></span><span></span>
          </div>
        </div>
        <div className="cube cube-red"></div>
        <div className="cube cube-green"></div>
        <div className="cube cube-brown"></div>
      </motion.div>
    </section>
  );
};

export default HomeHero;
