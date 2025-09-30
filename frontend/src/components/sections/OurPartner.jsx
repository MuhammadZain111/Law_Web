import React from "react";

const OurPartner = ({ image, name, title, description }) => {
  return (
    <div className="bg-[#FDF7F1] rounded-2xl text-center shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 p-6 max-w-sm">
      <img
        src={image}
        alt={name}
        className="w-full h-80 object-cover rounded-xl mb-5"
      />
      <h2 className="text-[#44372C] font-semibold text-xl">{name}</h2>
      <hr className="my-3 border-[#44372C]/30 w-1/2 mx-auto" />
      <p className="text-[#44372C] font-bold text-sm uppercase tracking-wide">{title}</p>
      <p className="text-[#87796E] text-sm mt-2">{description}</p>
    </div>
  );
};

export default OurPartner;
