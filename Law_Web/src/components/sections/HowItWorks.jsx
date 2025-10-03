import { ArrowRight, CheckCircle, Search} from "../../assets/icons/Icons.jsx"

import { UserCheck } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How LawSphere Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Finding the right legal help has never been easier. Our simple process connects you with qualified lawyers
            in just a few steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-6 mx-auto">
              <Search className="h-8 w-8 text-primary" />
              <div className="absolute top-0 right-0 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Search for Lawyers</h3>
            <p className="text-gray-600 text-center">
              Browse our extensive directory of verified lawyers by practice area, location, or specific expertise.
            </p>
            <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <ArrowRight className="h-8 w-8 text-gray-300" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-6 mx-auto">
              <UserCheck className="h-8 w-8 text-primary" />
              <div className="absolute top-0 right-0 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Connect & Verify</h3>
            <p className="text-gray-600 text-center">
              Review lawyer profiles, credentials, and client reviews. Verify your contact information to access full
              details.
            </p>
            <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <ArrowRight className="h-8 w-8 text-gray-300" />
            </div>
          </div>

          <div className="relative">
            <div className="bg-primary/10 rounded-full h-16 w-16 flex items-center justify-center mb-6 mx-auto">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div className="absolute top-0 right-0 bg-primary text-white h-8 w-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Consult & Hire</h3>
            <p className="text-gray-600 text-center">
              Schedule consultations, discuss your case, and hire the lawyer that best fits your legal needs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
