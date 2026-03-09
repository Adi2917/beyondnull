import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import ContactForm from '../Components/Contact/ContactForm'
import ContactHero from '../Components/Contact/ContactHero'
import ContactMiddle from '../Components/Contact/ContactMIddle'

const Contact = () => {
  return (
    <div>
        <Navbar />
        <ContactHero />
        <ContactMiddle />
        <ContactForm />
        <Footer />
    </div>
  )
}

export default Contact