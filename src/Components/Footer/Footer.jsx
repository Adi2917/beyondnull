import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp
} from "react-icons/fa";
import { FaEnvelope, FaLocationDot, FaPhone } from "react-icons/fa6";
import { Link } from "react-router-dom";
import BrandLogo from "../BrandLogo";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link className="footer-logo" to="/" aria-label="BeyondNull home">
            <BrandLogo />
          </Link>
          <p className="footer-desc">
            BeyondNull is a digital marketing and consulting company helping businesses earn attention, build trust, and turn demand into measurable growth.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <div className="links-grid">
            <Link to="/">Home</Link>
            <Link to="/about">Who We Are</Link>
            <Link to="/services">Services</Link>
            <Link to="/results">Our Work</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="footer-contact">
          <h3>Get In Touch</h3>
          <a className="contact-item" href="tel:+916205475866"><FaPhone /> +91 6205475866</a>
          <a className="contact-item" href="tel:+917485875137"><FaPhone /> +91 7485875137</a>
          <a className="contact-item" href="mailto:business@beyondnull.in"><FaEnvelope /> business@beyondnull.in</a>
          <p className="contact-item"><FaLocationDot /> Bangalore, Karnataka</p>
          <p className="agency-tags">Build - Get Found - Grow</p>
        </div>

        <div className="footer-social">
          <h3>Connect</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/beyondnulll/" target="_blank" rel="noopener noreferrer" aria-label="BeyondNull Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/profile.php?id=61570934596104" target="_blank" rel="noopener noreferrer" aria-label="BeyondNull Facebook">
              <FaFacebook />
            </a>
            <a href="https://www.linkedin.com/company/beyondnull/" target="_blank" rel="noopener noreferrer" aria-label="BeyondNull LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://wa.me/916205475866" target="_blank" rel="noopener noreferrer" aria-label="BeyondNull WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="bottom-content">
          <p>Copyright 2024 <span>BeyondNull</span>. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
