import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

import { FaWhatsapp, FaPhone } from "react-icons/fa"
import { HiOutlineMenuAlt3, HiOutlineX } from "react-icons/hi"

import logo from "../../assets/logo.png"

import "./Navbar.css"

function Navbar(){

const [menuOpen,setMenuOpen] = useState(false)

/* close menu on screen click */

useEffect(()=>{

const closeMenu = () => setMenuOpen(false)

if(menuOpen){

window.addEventListener("click",closeMenu)

}

return ()=> window.removeEventListener("click",closeMenu)

},[menuOpen])


return(

<nav className="navbar">

<div className="nav-wrapper">

{/* LOGO + BRAND */}

<div className="logo">

<img src={logo} alt="BeyondNull"/>

<h1 className="brand-text">

<span>Beyond</span>
<strong>Null</strong>

</h1>

</div>


{/* MENU */}

<div
className={`menu ${menuOpen ? "active" : ""}`}
onClick={(e)=>e.stopPropagation()}
>

<Link to="/">Home</Link>
<Link to="/about">About</Link>
<Link to="/services">Services</Link>
<Link to="/contact">Contact</Link>
<Link to="/admin">Admin</Link>

<div className="nav-icons">

<a href="https://wa.me/917485875137">
<FaWhatsapp className="icon whatsapp"/>
</a>

<a href="tel:7485875137">
<FaPhone className="icon phone"/>
</a>

</div>

</div>


{/* HAMBURGER */}

<div
className="hamburger"
onClick={(e)=>{

e.stopPropagation()
setMenuOpen(!menuOpen)

}}
>

{menuOpen ? <HiOutlineX/> : <HiOutlineMenuAlt3/>}

</div>

</div>

</nav>

)

}

export default Navbar