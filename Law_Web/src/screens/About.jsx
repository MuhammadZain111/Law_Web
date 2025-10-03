import React from 'react'


import Footer from "../components/sections/Footer.jsx"
import AboutBanner from '../Components/sections/AboutBanner.jsx';
import PartnerList from '../Components/sections/PartnerList.jsx';
import Vision from  '../Components/sections/Vision.jsx'
import Mission from '../Components/sections/Mission.jsx'
import Achievements from '../Components/sections/Achievements.jsx'
import LegalServices from '../Components/sections/LegalServices.jsx'
import CustomNavbar from '../components/sections/CustomNavbar.jsx';



function About() {
  return (
  
  <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
       <AboutBanner />
       <Vision />
       <Achievements />
       <PartnerList />
       <Mission />
       <LegalServices />
        <Footer />

    </div>

  )
}

export default About
