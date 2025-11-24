import React from 'react'
import Navbar from './CustomNavbar.jsx'
import Images from '../../constants/Images.js'

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Button from "../common/Button.jsx"
import { ArrowRight, Scale } from "../../assets/icons/Icons.jsx"




  const Herosection = () => {
    const heroRef = useRef(null)
    const textRef = useRef(null)
    const imageRef = useRef(null)
  
    useEffect(() => {
      // Animate hero section on load
      if (heroRef.current) {
        heroRef.current.classList.add("animate-fade-in")
      }
  
      // Animate text and image with a slight delay
      setTimeout(() => {
        if (textRef.current) {
          textRef.current.classList.add("animate-slide-in-left")
        }
        if (imageRef.current) {
          imageRef.current.classList.add("animate-slide-in-right")
        }
      }, 300)
    }, [])
  

  return (   
   
   <div className="Herosection min-h-auto bg-[#fdf4eb]">
    
     <Navbar /> 

     <section className="relative bg-[#fdf4eb] py-20 md:py-28">
     <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -left-24 -top-24 h-64 w-64 bg-[#f4d5b5] rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -right-24 top-1/2 h-72 w-72 bg-[#fce3c8] rounded-full blur-3xl opacity-60"></div>
     </div>
     <div className="relative container mx-auto px-6 md:px-10">
       <div className="flex flex-col md:flex-row items-center gap-10">
         <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="inline-flex items-center bg-[#f8e0c7] px-3 py-1 rounded-full text-[#8a4c2a] text-sm font-medium mb-6 border border-[#f1cda9]">
              <Scale className="h-4 w-4 mr-2" />
              Trusted Legal Solutions
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#2e1b12] mb-6 leading-tight tracking-tight">
              Find the Right <span className="bg-gradient-to-r from-[#8b4c1f] to-[#5a2a14] bg-clip-text text-transparent">Legal Expert</span> for Your Case
            </h1>
            <p className="text-lg md:text-xl text-[#5c4a3e] mb-10 leading-relaxed max-w-2xl">
              Connect with experienced lawyers specializing in various legal fields. Get professional legal advice and
              representation when you need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/lawyers">
                <Button size="lg" className="w-full sm:w-auto group !bg-[#7a3a1f] hover:!bg-[#5f2d17] shadow-lg shadow-amber-200/70">
                  Find a Lawyer
                  <ArrowRight className="ml-2 h-4 w-4 " />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto !border-[#d7b192] !text-[#7a4b28] hover:!bg-[#f9ebdf] hover:!text-[#5a2d18]">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-[#f0c9a5]/70 hover:scale-[1.01] transition-transform duration-500 bg-[#1a1a1a]">
              <img src="/banner.png" alt="Legal hero" className="w-full h-[360px] md:h-[440px] object-cover" />
             





              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a120e]/90 to-transparent p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                    <Scale className="h-6 w-6 text-[#7a3a1f]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Trusted by</p>
                    <p className="text-white text-xl font-bold">10,000+ Clients</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium text-[#7a3a1f] shadow">Verified Network</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </div>

)
}

export default Herosection
