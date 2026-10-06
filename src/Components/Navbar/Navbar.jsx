import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi"
import BrandLogo from "../BrandLogo"
import { openDiscoveryCall } from "../../utils/openDiscoveryCall"
import "./Navbar.css"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

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
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
        
        <Link className={`logo ${pathname === "/" ? "active" : ""}`} to="/" aria-label="BeyondNull home" aria-current={pathname === "/" ? "page" : undefined} onClick={() => setMenuOpen(false)}>
          <BrandLogo />
        </Link>

        <div
          className={`menu ${menuOpen ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Link className={pathname === "/about" ? "active" : ""} aria-current={pathname === "/about" ? "page" : undefined} to="/about" onClick={() => setMenuOpen(false)}>Who We Are</Link>
          <Link className={pathname === "/services" ? "active" : ""} aria-current={pathname === "/services" ? "page" : undefined} to="/services" onClick={() => setMenuOpen(false)}>Services</Link>
          <Link className={pathname === "/results" ? "active" : ""} aria-current={pathname === "/results" ? "page" : undefined} to="/results" onClick={() => setMenuOpen(false)}>Our Work</Link>
          <Link className={pathname === "/resources" ? "active" : ""} aria-current={pathname === "/resources" ? "page" : undefined} to="/resources" onClick={() => setMenuOpen(false)}>Resources</Link>
          <Link className={pathname === "/contact" ? "active" : ""} aria-current={pathname === "/contact" ? "page" : undefined} to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <button
            className="nav-discovery-btn"
            type="button"
            onClick={() => {
              setMenuOpen(false)
              openDiscoveryCall()
            }}
          >
            Book a Free Discovery Call
          </button>
        </div>

        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          role="button"
          tabIndex="0"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={(e) => {
            e.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setMenuOpen(!menuOpen)
            }
          }}
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </div>
        </div>
      </nav>
      <div className="navbar-spacer" aria-hidden="true" />
    </>
  )
}

export default Navbar
