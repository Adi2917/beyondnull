import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import ServiceHero from '../Components/Service/ServiceHero'
import ServiceItem from '../Components/Service/ServiceItem'
import ServiceEnd from '../Components/Service/ServiceEnd'

const Service = () => {
  return (
    <div>
        <Navbar />
        <ServiceHero />
        <ServiceItem />
        <ServiceEnd />
        <Footer />
    </div>
  )
}

export default Service