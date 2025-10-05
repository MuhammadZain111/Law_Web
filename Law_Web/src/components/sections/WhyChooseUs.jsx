import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-5xl font-extrabold text-gray-800 mb-6">Who We Are</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a forward-thinking legal tech platform designed to empower lawyers and law firms
            with innovative tools that simplify their day-to-day operations. From scheduling to case
            management and secure client communications, we provide a unified solution for the modern legal professional.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              title: "Seamless Case Management",
              description:
                "Organize, track, and manage your cases in one place. Our intuitive interface helps you stay ahead of deadlines and court schedules.",
            },
            {
              title: "Smart Scheduling",
              description:
                "Book appointments, sync calendars, and automate reminders. We make sure you never miss a client or a court date.",
            },
            {
              title: "Secure Communication",
              description:
                "Built-in messaging and file sharing keeps you connected with your clients — securely and professionally.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition"
            >
              <h3 className="text-2xl font-semibold text-lightbrown mb-4">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-xl text-gray-700 mb-6">
            Our mission is to modernize the legal profession by bringing efficiency, transparency, and innovation to every lawyer's fingertips.
          </p>
          <button className="bg-lightbrown text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-darkbrown hover:cursor-pointer transition">
            Join the Future of Legal Work
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
