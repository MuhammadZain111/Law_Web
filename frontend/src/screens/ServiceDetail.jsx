import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CustomNavbar from '../components/sections/CustomNavbar'
import Footer from '../components/sections/Footer'
import { services } from '../components/sections/LegalServices'

export default function ServiceDetail() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const service = services.find(svc => svc.id === serviceId)

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <CustomNavbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
          <Link
            to="/about"
            className="inline-block px-6 py-3 bg-gray-800 text-white rounded hover:bg-gray-900 transition"
          >
            Back to Services
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const Icon = service.icon
  const detailedContent = service.detailedContent

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Services
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Icon className="w-8 h-8 text-gray-700" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">{service.title}</h1>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed">{service.description}</p>
        </div>

        {/* Detailed Content */}
        {detailedContent && (
          <div className="space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{detailedContent.overview}</p>
            </div>

            {/* Services */}
            {detailedContent.services && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Services</h2>
                <ul className="space-y-3">
                  {detailedContent.services.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-gray-800 mr-3">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Approach */}
            {detailedContent.approach && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Approach</h2>
                <p className="text-gray-700 leading-relaxed">{detailedContent.approach}</p>
              </div>
            )}

            {/* Why Choose */}
            {detailedContent.whyChoose && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us</h2>
                <p className="text-gray-700 leading-relaxed">{detailedContent.whyChoose}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Contact us today to discuss how we can help you with your legal needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-white text-gray-900 rounded hover:bg-gray-100 transition font-medium"
            >
              Contact Us
            </Link>
            <Link
              to="/lawyers"
              className="inline-block px-6 py-3 border-2 border-white text-white rounded hover:bg-white hover:text-gray-900 transition font-medium"
            >
              Find a Lawyer
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}


