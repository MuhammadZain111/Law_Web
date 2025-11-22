import {
  Activity,
  Briefcase,
  Globe,
  HeartHandshake,
  Home,
  Lightbulb,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

export const services = [
  {
    id: 'personal-injury',
    title: 'Personal Injury',
    description:
      "We fight for your rights and just compensation when you've been injured due to someone else's negligence.",
    icon: Activity,
    bg: 'bg-gray-50',
    detailedContent: {
      overview: "Personal injury law covers cases where individuals have been harmed due to another party's negligence or intentional actions. Our experienced legal team is dedicated to helping you receive the compensation you deserve.",
      services: [
        'Motor vehicle accidents and collisions',
        'Workplace injuries and workers compensation',
        'Slip and fall accidents',
        'Medical malpractice cases',
        'Product liability claims',
        'Wrongful death cases',
        'Dog bite and animal attack injuries',
        'Premises liability claims'
      ],
      approach: "We conduct thorough investigations, work with medical experts, and build strong cases to ensure you receive maximum compensation for medical expenses, lost wages, pain and suffering, and other damages.",
      whyChoose: "With years of experience in personal injury law, we have a proven track record of securing favorable settlements and verdicts for our clients. We work on a contingency fee basis, meaning you don't pay unless we win your case."
    }
  },
  {
    id: 'family-disputes',
    title: 'Family Disputes',
    description:
      'We offer compassionate guidance for every family member going through challenging family matters.',
    icon: Users,
    bg: 'bg-gray-50',
    detailedContent: {
      overview: "Family law matters require sensitivity, understanding, and expert legal guidance. We provide compassionate representation during some of life's most difficult moments, helping families navigate complex legal issues with dignity and respect.",
      services: [
        'Divorce and separation proceedings',
        'Child custody and visitation rights',
        'Child support and alimony',
        'Property division and asset distribution',
        'Prenuptial and postnuptial agreements',
        'Adoption and guardianship',
        'Domestic violence protection orders',
        'Paternity establishment'
      ],
      approach: "We prioritize the best interests of children and families while protecting your legal rights. Our approach combines legal expertise with emotional support, ensuring you make informed decisions during challenging times.",
      whyChoose: "Our family law attorneys understand that every family situation is unique. We work collaboratively to find solutions that minimize conflict and protect your family's future, whether through negotiation, mediation, or litigation when necessary."
    }
  },
  {
    id: 'business-legality',
    title: 'Business Legality',
    description:
      'Strategic legal counsel for your business, from contracts and transactions to dispute resolution.',
    icon: Briefcase,
    bg: 'bg-gray-50',
    detailedContent: {
      overview: "Business law encompasses all legal matters related to commercial transactions, corporate governance, and business operations. We provide comprehensive legal services to help your business thrive while staying compliant with all regulations.",
      services: [
        'Business formation and incorporation',
        'Contract drafting and review',
        'Commercial transactions and negotiations',
        'Employment law and HR compliance',
        'Intellectual property protection',
        'Business dispute resolution',
        'Mergers and acquisitions',
        'Regulatory compliance and licensing'
      ],
      approach: "We serve as your strategic legal partner, providing proactive counsel to prevent issues before they arise. Our business attorneys understand the commercial landscape and help you make informed decisions that protect your interests.",
      whyChoose: "With extensive experience in business law, we help companies of all sizes navigate complex legal challenges. We combine legal expertise with business acumen to provide practical, cost-effective solutions that support your business goals."
    }
  },
  {
    id: 'real-estate-advocacy',
    title: 'Real Estate Advocacy',
    description:
      'Expertise in navigating the complexities of real estate transactions and disputes, such as land‑owning certifications and advocacy.',
    icon: Home,
    bg: 'bg-gray-50',
    detailedContent: {
      overview: "Real estate law involves complex transactions, property rights, and regulatory compliance. Our expertise covers all aspects of real estate, from simple transactions to complex disputes and land ownership certifications.",
      services: [
        'Property purchase and sale transactions',
        'Land ownership certifications and title searches',
        'Real estate contract negotiation',
        'Property disputes and boundary issues',
        'Landlord-tenant law and evictions',
        'Zoning and land use matters',
        'Real estate development and construction law',
        'Property tax appeals and assessments'
      ],
      approach: "We conduct thorough due diligence, review all documentation, and ensure compliance with local regulations. Our goal is to protect your interests and facilitate smooth real estate transactions while avoiding costly disputes.",
      whyChoose: "Real estate transactions involve significant financial investments. Our experienced attorneys help you navigate the complexities of property law, ensuring your rights are protected and your transactions are completed successfully."
    }
  },
  {
    id: 'immigration-law',
    title: 'Immigration Law',
    description:
      'Navigating the complex landscape of immigration law, ensuring a smooth journey for individuals and businesses.',
    icon: Globe,
    bg: 'bg-gray-50',
    detailedContent: {
      overview: "Immigration law is complex and constantly evolving. We provide expert guidance to individuals, families, and businesses navigating the immigration system, helping you achieve your goals of living, working, or doing business in your desired country.",
      services: [
        'Family-based immigration petitions',
        'Employment-based visas and green cards',
        'Citizenship and naturalization',
        'Deportation defense and removal proceedings',
        'Asylum and refugee status',
        'Business immigration and investor visas',
        'Student visas and educational immigration',
        'Immigration appeals and waivers'
      ],
      approach: "We stay current with constantly changing immigration laws and policies. Our team provides personalized attention to each case, ensuring all documentation is accurate and deadlines are met. We guide you through every step of the process.",
      whyChoose: "Immigration matters are time-sensitive and require precision. Our experienced immigration attorneys have a deep understanding of the system and work diligently to help you achieve your immigration goals while avoiding costly mistakes."
    }
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    description:
      'Safeguarding your creative assets and innovations with strategic legal counsel in the realm of IP.',
    icon: Lightbulb,
    bg: 'bg-gray-50',
    detailedContent: {
      overview: "Intellectual property law protects your creative works, innovations, and brand identity. We help individuals and businesses secure, enforce, and monetize their intellectual property assets in an increasingly competitive marketplace.",
      services: [
        'Patent filing and prosecution',
        'Trademark registration and protection',
        'Copyright registration and enforcement',
        'Trade secret protection',
        'IP licensing and agreements',
        'IP litigation and dispute resolution',
        'Domain name disputes',
        'IP portfolio management'
      ],
      approach: "We work closely with inventors, creators, and businesses to identify and protect valuable intellectual property. Our comprehensive approach includes registration, enforcement, and strategic planning to maximize the value of your IP assets.",
      whyChoose: "In today's knowledge economy, intellectual property is often your most valuable asset. Our IP attorneys combine legal expertise with technical understanding to provide effective protection and enforcement strategies tailored to your needs."
    }
  },
  {
    id: 'health-safety',
    title: 'Health & Safety',
    description:
      'Ensuring compliance with workplace health and safety regulations to protect employees and employers alike.',
    icon: ShieldAlert,
    bg: 'bg-gray-50',
    detailedContent: {
      overview: "Workplace health and safety law ensures that employers provide safe working environments while protecting employees' rights. We help both employers and employees navigate complex regulations and address safety concerns effectively.",
      services: [
        'OSHA compliance and workplace safety',
        'Workers compensation claims',
        'Workplace injury investigations',
        'Safety training and compliance programs',
        'Regulatory compliance audits',
        'Workplace accident litigation',
        'Employee safety rights advocacy',
        'Employer defense in safety violations'
      ],
      approach: "We help employers develop comprehensive safety programs that protect workers while ensuring regulatory compliance. For employees, we advocate for safe working conditions and fair compensation when workplace injuries occur.",
      whyChoose: "Workplace safety is a critical concern for both employers and employees. Our attorneys understand the complex web of regulations and help you navigate them effectively, whether you're seeking compliance or pursuing a claim."
    }
  },
  {
    id: 'mediation-arbitration',
    title: 'Mediation & Arbitration',
    description:
      'Alternative dispute resolution services to settle conflicts without lengthy court battles.',
    icon: HeartHandshake,
    bg: 'bg-gray-50',
    detailedContent: {
      overview: "Mediation and arbitration offer efficient, cost-effective alternatives to traditional litigation. These alternative dispute resolution methods can save time and money while often producing more satisfactory outcomes for all parties involved.",
      services: [
        'Commercial mediation services',
        'Family law mediation',
        'Employment dispute mediation',
        'Contract dispute arbitration',
        'Construction dispute resolution',
        'Consumer dispute mediation',
        'Workplace conflict resolution',
        'Multi-party mediation and arbitration'
      ],
      approach: "We facilitate productive dialogue between parties, helping them find mutually acceptable solutions. Our mediators are trained in conflict resolution techniques and work to preserve relationships while resolving disputes efficiently.",
      whyChoose: "Alternative dispute resolution can be faster, less expensive, and less adversarial than traditional litigation. Our experienced mediators and arbitrators help parties reach fair resolutions while maintaining confidentiality and control over the process."
    }
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
          {services.map((svc, i) => (
            // Standard card
            <div
              key={i}
              className={`${svc.bg} rounded-lg p-6 flex flex-col space-y-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <svc.icon className="w-6 h-6 text-gray-500" />
              <h3 className="text-2xl font-semibold text-gray-900">{svc.title}</h3>
              <p className="text-gray-600 flex-grow">{svc.description}</p>
              <Link
                to={`/services/${svc.id}`}
                className="inline-block mt-4 px-4 py-2 border-2 border-lightbrown bg-lightbrown text-white rounded hover:bg-white hover:text-black hover:border-black hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium cursor-pointer"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
