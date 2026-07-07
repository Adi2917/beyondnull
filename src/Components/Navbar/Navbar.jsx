import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FaLocationDot, FaWhatsapp } from "react-icons/fa6"
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi"
import logo from "../../assets/logo2.png"
import "./Navbar.css"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  /* close menu on screen click - Wahi logic jo tune diya tha */
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false)
    if (menuOpen) {
      window.addEventListener("click", closeMenu)
    }
    return () => window.removeEventListener("click", closeMenu)
  }, [menuOpen])

  return (
    <nav className="navbar">
      <div className="nav-wrapper">
        
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.04, rotateY: 8 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img src={logo} alt="BeyondNull" />
          <h1 className="brand-text">
            <span>Beyond</span>
            <strong>Null</strong>
          </h1>
        </motion.div>

        <div
          className={`menu ${menuOpen ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>

          <div className="nav-icons">
            <span className="city-chip">
              <FaLocationDot />
              Bangalore
            </span>

            <motion.a 
               href="https://wa.me/917485875137"
               whileHover={{ y: -5, scale: 1.2 }}
               aria-label="Chat with BeyondNull on WhatsApp"
            >
              <FaWhatsapp className="icon whatsapp" />
            </motion.a>
          </div>
        </div>

        <div
          className="hamburger"
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
