import React from "react";
import { Trophy, Briefcase, Award, Users } from "lucide-react"; // Added Users icon

const stats = [
  {
    title: "25+ Years",
    subtitle: "of Legal Excellence",
    icon: <Briefcase className="w-8 h-8 text-[#44372C]" />,
  },
  {
    title: "1,200+ Cases",
    subtitle: "Handled Successfully",
    icon: <Trophy className="w-8 h-8 text-[#44372C]" />,
  },
  {
    title: "98% Success",
    subtitle: "Rate in Court Trials",
    icon: <Award className="w-8 h-8 text-[#44372C]" />,
  },
  {
    title: "800+ Clients",
    subtitle: "Served with Trust",
    icon: <Users className="w-8 h-8 text-[#44372C]" />,
  },
];

const Achievements = () => {
  return (
    <section className="bg-[#FFFCF8] py-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold text-[#44372C]">Our Achievements</h2>
        <p className="mt-4 text-[#87796E] max-w-2xl mx-auto text-base md:text-lg">
          We are proud of the results we’ve achieved and the trust we've earned through our dedication, discipline, and deep legal expertise.
        </p>
      </div>

      <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 max-w-5xl mx-auto">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-8 text-center"
          >
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-[#FFFAF4] rounded-full flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-[#44372C]">{stat.title}</h3>
            <p className="text-[#87796E] mt-2 text-sm">{stat.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;
