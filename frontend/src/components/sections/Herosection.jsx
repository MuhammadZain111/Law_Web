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
   
   <div className="Herosection  min-h-auto  bg-[#fefaf6] ">
    
     <Navbar /> 

     <section className="bg-[#fefaf6] py-40">
      <div className="container mx-auto px-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="inline-flex items-center bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-6">
              <Scale className="h-4 w-4 mr-2" />
              Trusted Legal Solutions
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Find the Right <span className="text-primary  text-lightbrown">Legal Expert</span> for Your Case
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with experienced lawyers specializing in various legal fields. Get professional legal advice and
              representation when you need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/lawyers">
                <Button size="lg" className="w-full bg-lightbrown sm:w-auto group">
                  Find a Lawyer
                  <ArrowRight className="ml-2 h-4 w-4 " />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10">
            <div className="relative rounded-lg overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500">
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply">
              <h1>helllo</h1>
              </div>
             





              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/80 to-transparent p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Trusted by</p>
                    <p className="text-white text-xl font-bold">10,000+ Clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    </div>

)
}

export default Herosection
