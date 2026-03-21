import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { FaWhatsapp, FaPhone } from "react-icons/fa"
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
        
        {/* LOGO + BRAND */}
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05, rotateY: 10 }} // 3D Tilt Effect
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img src={logo} alt="BeyondNull" />
          <h1 className="brand-text">
            <span>Beyond</span>
            <strong className="yellow-highlight">Null</strong>
          </h1>
        </motion.div>

        {/* MENU */}
        <div
          className={`menu ${menuOpen ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact</Link>

          <div className="nav-icons">
            <motion.a 
               href="https://wa.me/917485875137"
               whileHover={{ y: -5, scale: 1.2 }}
            >
              <FaWhatsapp className="icon whatsapp" />
            </motion.a>

            <motion.a 
               href="tel:7485875137"
               whileHover={{ y: -5, scale: 1.2 }}
            >
              <FaPhone className="icon phone" />
            </motion.a>
          </div>
        </div>

        {/* HAMBURGER */}
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