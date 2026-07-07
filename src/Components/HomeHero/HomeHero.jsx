import "./HomeHero.css";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaChartLine, FaCode, FaLocationDot, FaRocket } from "react-icons/fa6";

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
          <FaLocationDot /> Bangalore based digital agency
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Build a sharper digital business with <span className="highlight-text">Beyond Null</span>
        </motion.h1>

        <motion.p 
          className="hero-description"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          We design websites, apps, brand systems, SEO, social campaigns, ads, and local growth engines for modern businesses that want a premium digital presence.
        </motion.p>

        <div className="hero-actions">
          <motion.button 
            className="hero-btn" 
            onClick={goToServices}
            aria-label="Explore Web Development and Digital Marketing Services"
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
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
        <motion.div
          className="hero-photo-card"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&auto=format&fit=crop"
            alt="Digital agency team building websites and marketing campaigns"
            loading="eager"
          />
          <div className="hero-photo-overlay">
            <span>Websites</span>
            <span>SEO</span>
            <span>Campaigns</span>
          </div>
        </motion.div>
        <motion.div className="dashboard-card" animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          <div className="dash-top">
            <span></span><span></span><span></span>
          </div>
          <div className="dash-line wide"></div>
          <div className="dash-grid">
            <div><FaCode /><strong>Web</strong></div>
            <div><FaChartLine /><strong>SEO</strong></div>
            <div><FaRocket /><strong>Ads</strong></div>
          </div>
          <div className="dash-bars">
            <span></span><span></span><span></span><span></span>
          </div>
        </motion.div>
        <div className="cube cube-red"></div>
        <div className="cube cube-green"></div>
        <div className="cube cube-brown"></div>
      </motion.div>
    </section>
  );
};

export default HomeHero;
