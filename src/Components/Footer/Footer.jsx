import {
FaInstagram,
FaFacebook,
FaLinkedin,
FaWhatsapp
} from "react-icons/fa"

import { Link } from "react-router-dom"

import logo from "../../assets/logo.png"

import "./Footer.css"

function Footer(){

return(

<footer className="footer">

<div className="footer-container">

{/* BRAND SECTION */}

<div className="footer-brand">

<div className="footer-logo">

<img src={logo} alt="BeyondNull Tech and Digital Solutions Company"/>

<h2>
<span>Beyond</span>
<strong>Null</strong>
</h2>

</div>

<p>

BeyondNull is a modern web development, app development,
digital marketing and software solutions company helping
businesses grow faster with powerful technology and
result-driven digital strategies.

</p>

</div>


{/* QUICK LINKS */}

<div className="footer-links">

<h3>Quick Links</h3>

<Link to="/">Home</Link>
<Link to="/about">About</Link>
<Link to="/services">Services</Link>
<Link to="/contact">Contact</Link>

</div>


{/* CONTACT INFO */}

<div className="footer-contact">

<h3>Contact</h3>

<p>📞 6205475866</p>

<p>✉️ beyoondnull@gmail.com</p>

<p>Digital Agency • Web Development • App Development • SEO Services</p>

</div>


{/* SOCIAL MEDIA */}

<div className="footer-social">

<h3>Follow Us</h3>

<div className="social-icons">

<a href="https://www.instagram.com/beyondnulll?igsh=MWJhMzR6eGxzeW1rdA==" target="_blank" rel="noopener noreferrer">
<FaInstagram/>
</a>

<a href="https://www.facebook.com/share/17MKLbYVLe/" target="_blank" rel="noopener noreferrer">
<FaFacebook/>
</a>

<a href="https://www.linkedin.com/company/beyondnull/" target="_blank" rel="noopener noreferrer">
<FaLinkedin/>
</a>

<a href="https://wa.me/916205475866" target="_blank" rel="noopener noreferrer">
<FaWhatsapp/>
</a>

</div>

</div>

</div>


{/* COPYRIGHT */}

<div className="footer-bottom">

<p>

© 2026 BeyondNull Tech & Marketing | Web Development | App Development | Digital Marketing Agency

</p>

</div>

</footer>

)

}

export default Footer