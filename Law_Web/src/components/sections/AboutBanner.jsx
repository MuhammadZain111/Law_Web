import React from "react";

const AboutBanner = () => {
  return (
    <section
      className="bg-cover bg-center h-120 flex flex-col justify-center items-center text-white relative"
      style={{
        backgroundImage: `url('/Bann5.jpeg')`, 
      }}
    >    
      <div className="absolute inset-0 bg-black opacity-50" />

      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-semibold">About Us</h1>
        <p className="text-lg text-white">We are a modern legal platform dedicated to connecting clients with trusted lawyers.<br></br> Our mission is to make legal help accessible, transparent, and efficient for everyone.</p>  
        <p className="text-lg mt-2">
        </p>
      </div>
    </section>
  );
};

export default AboutBanner;
