import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const cards = [
    {
      title: 'Client-Centered Experience',
      desc: 'Foster meaningful client relationships with real-time updates, secure messaging, and task reminders.',
      image: 'https://source.unsplash.com/featured/?law,client',
    },
    {
      title: 'Smart Legal Automation',
      desc: 'Automate reminders, court tracking, and case progress. Let us handle the tech while you handle justice.',
      image: 'https://source.unsplash.com/featured/?law,technology',
    },
    {
      title: 'Mission-Focused Innovation',
      desc: 'We aim to make law accessible and efficient with design-first solutions tailored for legal professionals.',
      image: 'https://source.unsplash.com/featured/?law,innovation',
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-200 py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col justify-center h-full">
        {/* Title and Intro */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl font-extrabold text-gray-800 mb-6">About Our Platform</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a modern legal tech platform built to revolutionize how law professionals manage their practice.
            From streamlining appointments to intelligent case tracking and client engagement, we enable law firms
            and solo lawyers to focus more on justice and less on admin.
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="relative rounded-2xl overflow-hidden shadow-lg group h-[300px] bg-cover bg-center"
              style={{ backgroundImage: `url(${card.image})` }}
            >
              {/* Always-present light overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-0 transition-all duration-500 group-hover:from-black/70"></div>

              {/* Content on top */}
              <div className="absolute bottom-0 p-6 text-white z-10">
                <h3 className="text-2xl font-semibold mb-2 drop-shadow-md">{card.title}</h3>
                <p className="text-sm drop-shadow-md">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <h4 className="text-2xl text-gray-800 font-bold mb-4">Join a New Era of Legal Practice</h4>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Whether you're a solo lawyer or a large firm, our platform adapts to your needs — providing reliability, speed,
            and a seamless legal management experience. Let’s build the future of law together.
          </p>
          <button className="bg-lightbrown text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-darkbrown transition">
            Get Started Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
