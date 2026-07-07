import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp
} from "react-icons/fa";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BrandLogo from "../BrandLogo";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <motion.div className="footer-logo" whileHover={{ scale: 1.05, rotateY: 8 }}>
            <BrandLogo />
          </motion.div>
          <p className="footer-desc">
            BeyondNull is a web development and digital marketing studio building websites, apps, SEO systems, campaigns, and digital growth assets.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <div className="links-grid">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="footer-contact">
          <h3>Get In Touch</h3>
          <p className="contact-item"><FaPhone /> +91 6205475866</p>
          <p className="contact-item"><FaEnvelope /> beyondnull@gmail.com</p>
          <p className="contact-item"><FaLocationDot /> India</p>
          <p className="agency-tags">Web Dev - App Dev - SEO - Marketing</p>
        </div>

        <div className="footer-social">
          <h3>Connect</h3>
          <div className="social-icons">
            <motion.a whileHover={{ y: -5 }} href="https://www.instagram.com/beyondnulll?igsh=MWJhMzR6eGxzeW1rdA==" target="_blank" rel="noopener noreferrer" aria-label="BeyondNull Instagram">
              <FaInstagram />
            </motion.a>
            <motion.a whileHover={{ y: -5 }} href="https://www.facebook.com/share/17MKLbYVLe/" target="_blank" rel="noopener noreferrer" aria-label="BeyondNull Facebook">
              <FaFacebook />
            </motion.a>
            <motion.a whileHover={{ y: -5 }} href="https://www.linkedin.com/company/beyondnull/" target="_blank" rel="noopener noreferrer" aria-label="BeyondNull LinkedIn">
              <FaLinkedin />
            </motion.a>
            <motion.a whileHover={{ y: -5 }} href="https://wa.me/916205475866" target="_blank" rel="noopener noreferrer" aria-label="BeyondNull WhatsApp">
              <FaWhatsapp />
            </motion.a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-content">
          <p>Copyright 2026 <span>BeyondNull</span> Tech & Marketing. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
