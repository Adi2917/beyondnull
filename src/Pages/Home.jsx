import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import HomeHero from '../Components/HomeHero/HomeHero'
import HomeAbout from '../Components/About/HomeAbout'
import Who from '../Components/Who/Who'
import Why from '../Components/Why/Why'
import ContactForm from '../Components/Contact/ContactForm'

const Home = () => {
  return (
    <div>
        <Navbar />
        <HomeHero />
        <HomeAbout />
        <Who />
        <Why />
        <ContactForm />
        <Footer />
    </div>
  )
}

export default Home