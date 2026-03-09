import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import AboutHero from '../Components/About/AboutHero'
import AboutMiddle from '../Components/About/AboutMiddle'
import MsnVsn from '../Components/About/MsnVsn'
import Values from '../Components/About/Values'
import AboutEnd from '../Components/About/AboutEnd'

const About = () => {
  return (
    <div>
        <Navbar />
        <AboutHero />
        <AboutMiddle />
        <MsnVsn />
        <Values />
        <AboutEnd />
        <Footer />
    </div>
  )
}

export default About