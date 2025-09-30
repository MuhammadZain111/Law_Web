import React from "react";

const Vision = () => {
  return (
    <section className="bg-[#FFFCF8] py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
        
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#44372C] mb-6">
            Our Vision
          </h2>
          <p className="text-[#87796E] text-lg md:text-xl leading-relaxed">
            At our law firm, we envision a legal landscape where every individual and business has access to trusted, transparent, and transformative legal services. <br /><br />
            We strive to be pioneers in legal innovation, combining deep legal expertise with compassion, integrity, and a forward-thinking mindset.
          </p>
        </div>


        <div className="flex justify-center">
          <img
            src="/vision.jpg" // Replace with your actual image path
            alt="Vision illustration"
            className="w-full max-w-md rounded-2xl shadow-md"
          />
        </div>
      </div>
    </section>
  );
};

export default Vision;
