import React from 'react'
import Herosection from '../components/sections/Herosection.jsx'
import OurAreas from '../components/sections/OurAreas.jsx'
import WhyChooseUs from '../components/sections/WhyChooseUs.jsx'
import About from '../components/sections/About.jsx'
import  Footer  from '../components/sections/Footer.jsx'
import FeaturedLawyers from '../components/sections/FeaturedLawyers.jsx'
import HowItWorks from '../components/sections/HowItWorks.jsx'
import Chatbot from '../components/common/Chatbot.jsx'




function Home() {
  return (
    <div className=''  >   
       <Herosection />
       <OurAreas />
       <WhyChooseUs />
       <HowItWorks />
       <FeaturedLawyers />
       <About />
       <Footer />
       <Chatbot />
    </div>
  )
}

export default Home
