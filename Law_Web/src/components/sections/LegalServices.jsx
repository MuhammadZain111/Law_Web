import React from 'react'
import {
  Activity,
  Users,
  Briefcase,
  Home,
  Globe,
  Lightbulb,
  HeartHandshake,
  ShieldAlert,
} from 'lucide-react'

const services = [
  {
    title: 'Personal Injury',
    description:
      "We fight for your rights and just compensation when you've been injured due to someone else's negligence.",
    icon: Activity,
    bg: 'bg-gray-50',
  },
  {
    title: 'Family Disputes',
    description:
      'We offer compassionate guidance for every family member going through challenging family matters.',
    icon: Users,
    bg: 'bg-gray-50',
  },
  {
    title: 'Business Legality',
    description:
      'Strategic legal counsel for your business, from contracts and transactions to dispute resolution.',
    icon: Briefcase,
    bg: 'bg-gray-50',
  },
  {
    title: 'Real Estate Advocacy',
    description:
      'Expertise in navigating the complexities of real estate transactions and disputes, such as land‑owning certifications and advocacy.',
    icon: Home,
    bg: null, // will use image
    imageUrl:
      'https://images.unsplash.com/photo-1572120360610-d971b9f27500?auto=format&fit=crop&w=800&q=80',
    linkText: 'Read More',
    linkHref: '#',
  },
  {
    title: 'Immigration Law',
    description:
      'Navigating the complex landscape of immigration law, ensuring a smooth journey for individuals and businesses.',
    icon: Globe,
    bg: 'bg-gray-50',
  },
  {
    title: 'Intellectual Property',
    description:
      'Safeguarding your creative assets and innovations with strategic legal counsel in the realm of IP.',
    icon: Lightbulb,
    bg: 'bg-gray-50',
  },
  {
    title: 'Health & Safety',
    description:
      'Ensuring compliance with workplace health and safety regulations to protect employees and employers alike.',
    icon: ShieldAlert,
    bg: 'bg-gray-50',
  },
  {
    title: 'Mediation & Arbitration',
    description:
      'Alternative dispute resolution services to settle conflicts without lengthy court battles.',
    icon: HeartHandshake,
    bg: 'bg-gray-50',
  },
]

export default function LegalServices() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Our Comprehensive <span className="italic">Legal Services</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover tailored legal solutions crafted for your unique needs, ensuring confidence
            and success in every aspect of your legal journey.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((svc, i) =>
            svc.bg ? (
              // Standard card
              <div
                key={i}
                className={`${svc.bg} rounded-lg p-6 flex flex-col space-y-4 shadow-sm hover:shadow-md transition-shadow`}
              >
                <svc.icon className="w-6 h-6 text-gray-500" />
                <h3 className="text-2xl font-semibold text-gray-900">{svc.title}</h3>
                <p className="text-gray-600 flex-grow">{svc.description}</p>
              </div>
            ) : (
              // Image‐background card
              <div key={i} className="relative rounded-lg overflow-hidden shadow-sm">
                <img
                  src={svc.imageUrl}
                  alt={svc.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <svc.icon className="w-6 h-6 text-white" />
                    <h3 className="text-2xl font-semibold">{svc.title}</h3>
                  </div>
                  <div>
                    <p className="mb-4">{svc.description}</p>
                    {svc.linkText && (
                      <a
                        href={svc.linkHref}
                        className="inline-block px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
                      >
                        {svc.linkText}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
