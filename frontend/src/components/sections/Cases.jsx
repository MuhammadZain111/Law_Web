"use client"

import { Shield, Users, Briefcase, Gavel } from "../../assets/icons/Icons.jsx" 

const caseTypes = [
  {
    title: "Criminal Defense",
    description: "Expert representation for individuals facing criminal charges.",
    icon: <Shield className="h-6 w-6 text-primary" />,
  },
  {
    title: "Family Law",
    description: "Support for divorce, custody, adoption, and family disputes.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: "Corporate Law",
    description: "Legal guidance for businesses, contracts, and compliance.",
    icon: <Briefcase className="h-6 w-6 text-primary" />,
  },
  {
    title: "Civil Litigation",
    description: "Resolution of disputes through lawsuits and legal action.",
    icon: <Gavel className="h-6 w-6 text-primary" />,
  },
]

const Cases = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Explore Our Case Expertise</h2>
        <p className="text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          Our network of experienced lawyers specializes in a wide range of legal areas to meet your needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {caseTypes.map((caseItem, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 text-left"
            >
              <div className="mb-4">{caseItem.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{caseItem.title}</h3>
              <p className="text-gray-600">{caseItem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Cases
