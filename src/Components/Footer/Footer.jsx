import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaWhatsapp
} from "react-icons/fa"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import logo from "../../assets/logo2.png"
import "./Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* BRAND SECTION */}
        <div className="footer-brand">
          <motion.div 
            className="footer-logo"
            whileHover={{ scale: 1.05 }}
          >
            <img src={logo} alt="BeyondNull Tech and Digital Solutions" />
            <h2>
              <span>Beyond</span>
              <strong className="yellow-glow">Null</strong>
            </h2>
          </motion.div>
          <p className="footer-desc">
            BeyondNull is a elite web development and digital marketing 
            agency engineering high-performance software and 
            result-driven strategies to scale your business.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <div className="links-grid">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        {/* CONTACT INFO */}
        <div className="footer-contact">
          <h3>Get In Touch</h3>
          <p className="contact-item"><span>📞</span> +91 6205475866</p>
          <p className="contact-item"><span>✉️</span> beyoondnull@gmail.com</p>
          <p className="agency-tags">Web Dev • App Dev • SEO • Marketing</p>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="footer-social">
          <h3>Connect</h3>
          <div className="social-icons">
            <motion.a whileHover={{ y: -5, color: "#E1306C" }} href="https://www.instagram.com/beyondnulll?igsh=MWJhMzR6eGxzeW1rdA==" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </motion.a>
            <motion.a whileHover={{ y: -5, color: "#1877F2" }} href="https://www.facebook.com/share/17MKLbYVLe/" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </motion.a>
            <motion.a whileHover={{ y: -5, color: "#0A66C2" }} href="https://www.linkedin.com/company/beyondnull/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </motion.a>
            <motion.a whileHover={{ y: -5, color: "#25D366" }} href="https://wa.me/916205475866" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
            </motion.a>
          </div>
        </div>
      </div>

      {/* COPYRIGHT AREA */}
      <div className="footer-bottom">
        <div className="bottom-content">
          <p>© 2026 <span>BeyondNull</span> Tech & Marketing. All Rights Reserved.</p>
          <div className="footer-line"></div>
        </div>
      </div>
    </footer>
  )
}

export default Footer