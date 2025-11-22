import React from "react";
import OurPartner from "./OurPartner.jsx";
import Images from '../../constants/Images.js'


const lawyers = [
  {
    name: "Samantha Clarkson",
    title: "CEO & Founding Partner",
    description: "Strategic Legal Planning, Business Law",
    image: Images.partner1,
  },
  {
    name: "Samuel Andersen",
    title: "Head of Managing Partner",
    description: "Real Estate Law, Corporate Governance",
    image:  Images.partner2,
  },
  {
    name: "Jamshaid Bodla",
    title: "Legal Senior Attorney",
    description: "Family Law, Mediation, Family Disputes",
    image: Images.partner3,
  },
];

const PartnerList = () => {
  return (
    <section className="bg-[#FFFCF8] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-[#44372C]">Meet Our Team</h2>
        <p className="mt-4 text-[#87796E] max-w-2xl mx-auto text-base md:text-lg">
          Our experienced legal professionals are committed to delivering expert guidance and personalized solutions across a wide range of legal matters.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid gap-10 sm:grid-cols-2 md:grid-cols-3 justify-items-center">
        {lawyers.map((lawyer, index) => (
          <OurPartner key={index} {...lawyer} />
        ))}
      </div>
    </section>
  );
};

export default PartnerList;
