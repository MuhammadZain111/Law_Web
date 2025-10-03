import React from "react";
import { Lightbulb, Handshake, Scale } from "lucide-react";



const missionPoints = [
  {
    icon: <Lightbulb className="w-8 h-8 text-[#44372C]" />,
    title: "Client-Focused Solutions",
    description:
      "We tailor every legal strategy to meet the unique goals of our clients, providing clarity and confidence in every decision.",
  },
  {
    icon: <Handshake className="w-8 h-8 text-[#44372C]" />,
    title: "Integrity & Trust",
    description:
      "We uphold the highest ethical standards, ensuring our clients receive transparent, honest, and principled representation.",
  },
  {
    icon: <Scale className="w-8 h-8 text-[#44372C]" />,
    title: "Accessible Legal Services",
    description:
      "Our mission is to make quality legal guidance accessible through responsive communication and practical support.",
  },
];

const Mission = () => {
  return (
    <section className="bg-[#FDF7F1] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-[#44372C]">Our Mission</h2>
        <p className="mt-4 text-[#87796E] max-w-2xl mx-auto text-base md:text-lg">
          We are committed to providing our clients with compassionate legal guidance, practical solutions, and steadfast support throughout every stage of their legal journey.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
        {missionPoints.map((point, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300 text-left group"
          >
            <div className="mb-4 flex items-center justify-center w-12 h-12 bg-[#FFFAF4] rounded-full group-hover:scale-105 transition-transform duration-300 mx-auto">
              {point.icon}
            </div>
            <h3 className="text-lg font-semibold text-[#44372C] text-center">{point.title}</h3>
            <p className="text-sm text-[#87796E] mt-3 text-center">{point.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Mission;
