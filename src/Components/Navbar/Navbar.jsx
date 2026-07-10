import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaLocationDot, FaWhatsapp } from "react-icons/fa6"
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi"
import BrandLogo from "../BrandLogo"
import "./Navbar.css"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false)
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      window.addEventListener("click", closeMenu)
      window.addEventListener("keydown", closeOnEscape)
      document.body.classList.add("menu-open")
    }

    return () => {
      window.removeEventListener("click", closeMenu)
      window.removeEventListener("keydown", closeOnEscape)
      document.body.classList.remove("menu-open")
    }
  }, [menuOpen])

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.04, rotateY: 8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <BrandLogo />
        </motion.div>

        <div
          className={`menu ${menuOpen ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/admin" className="admin-nav-link" onClick={() => setMenuOpen(false)}>Admin</Link>

          <div className="nav-icons">
            <span className="city-chip">
              <FaLocationDot />
              India
            </span>

            <motion.a 
               href="https://wa.me/919297753276"
               whileHover={{ y: -5, scale: 1.2 }}
               aria-label="Chat with BeyondNull on WhatsApp"
               onClick={() => setMenuOpen(false)}
            >
              <FaWhatsapp className="icon whatsapp" />
            </motion.a>
          </div>
        </div>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
