import React from 'react'

function OurAreas() {
  
  const services = [
    {
      title: "Personal Injury",
      description: "We fight for your rights and just compensation when you’ve been injured due to someone else’s negligence.",
      icon: "🩺",
      image: null,
    },
    {
      title: "Family Disputes",
      description: "We offer compassionate guidance for every family member going through challenging family matters including divorce, custody, and support issues.",
      icon: null,
      // image: "/family.jpg",
    },
    {
      title: "Business Legality",
      description: "Strategic legal counsel for your business, from contracts and transactions to business dispute resolution.",
      icon: "💼",
      // image: null,
    },
    {
      title: "Real Estate Advocacy",
      description: "Expertise in navigating the complexities of legal real estate transactions and legal disputes.",
      icon: "🏠",
      // image: null,
    },
  ];


  return (
 
    <div>
      <section className="py-16 bg-[#fefaf7]">

        <div className="max-w-7xl mx-auto px-4">

          <div className="flex items-center justify-between mb-10">

            <h2 className="text-4xl font-serif font-semibold text-[#2c1f1a]">Our Legal Practice Areas</h2>

            <button className="text-sm px-5 py-2 bg-[#ebe2dd] text-[#2c1f1a] rounded-md hover:bg-[#dfd1c8] transition"> See More Legal Services</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`p-6 bg-[#f4e7df] rounded-md shadow-md relative ${
                  service.image ? 'bg-cover bg-center text-white' : ''
                }`}
                style={service.image ? { backgroundImage: `url(${service.image})` } : {}}
              >
                {!service.image && (
                  <div className="text-2xl mb-4">{service.icon}</div>
                )}
                <h3 className="text-2xl font-serif font-semibold mb-2">{service.title}</h3>
                <p className="text-sm">{service.description}</p>
                {service.image && (
                  <button className="mt-4 inline-block text-sm underline">Read More</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>

  );
}

export default OurAreas;
