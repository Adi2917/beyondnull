import {
FaInstagram,
FaFacebook,
FaLinkedin,
FaWhatsapp
} from "react-icons/fa"

import logo from "../../assets/logo.png"

import "./Footer.css"

function Footer(){

return(

<footer className="footer">

<div className="footer-container">

{/* BRAND SECTION */}

<div className="footer-brand">

<div className="footer-logo">

<img src={logo} alt="BeyondNull"/>

<h2>
<span>Beyond</span>
<strong>Null</strong>
</h2>

</div>

<p>

BeyondNull Tech & Marketing builds powerful websites,
apps and digital growth systems for modern businesses.

</p>

</div>


{/* QUICK LINKS */}

<div className="footer-links">

<h3>Quick Links</h3>

<a href="/">Home</a>
<a href="/about">About</a>
<a href="/services">Services</a>
<a href="/contact">Contact</a>

</div>


{/* CONTACT INFO */}

<div className="footer-contact">

<h3>Contact</h3>

<p>📞 6205475866</p>

<p>✉️ beyoondnull@gmail.com</p>

</div>


{/* SOCIAL MEDIA */}

<div className="footer-social">

<h3>Follow Us</h3>

<div className="social-icons">

<a href="https://www.instagram.com/beyondnulll?igsh=MWJhMzR6eGxzeW1rdA==">
<FaInstagram/>
</a>

<a href="https://www.facebook.com/share/17MKLbYVLe/">
<FaFacebook/>
</a>

<a href="https://www.linkedin.com/company/beyondnull/">
<FaLinkedin/>
</a>

<a href="https://wa.me/916205475866">
<FaWhatsapp/>
</a>

</div>

</div>

</div>


{/* COPYRIGHT */}

<div className="footer-bottom">

<p>

© 2026 BeyondNull Tech & Marketing. All rights reserved.

</p>

</div>

</footer>

)

}

export default Footer