import  { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "../components/common/Card.jsx"
import Badge from "../components/common/Badge.jsx"
import { Scale, FileText, Users, MessageSquare, Calendar, ArrowRight } from "../../src/assets/icons/Icons.jsx"

import { Link } from "react-router-dom"
import ServiceBookingForm from "../../src/components/sections/ServiceBookingForm.jsx"
import Button from  "../components/common/Button.jsx"
import Footer from "../components/sections/Footer.jsx"
import CustomNavbar from "../components/sections/CustomNavbar.jsx"




const SERVICES = [
  {
    id: 1,
    title: "Family Law Consultation",
    description: "Get expert advice on divorce, child custody, and family-related legal matters.",
    icon: Users,
    price: "$150",
    duration: "60 min",
    popular: true,
  },
  {
    id: 2,
    title: "Business Contract Review",
    description: "Professional review and advice on business contracts and agreements.",
    icon: FileText,
    price: "$200",
    duration: "90 min",
    popular: false,
  },
  {
    id: 3,
    title: "Real Estate Legal Advice",
    description: "Consultation on property transactions, landlord-tenant issues, and real estate law.",
    icon: Scale,
    price: "$175",
    duration: "75 min",
    popular: false,
  },
  {
    id: 4,
    title: "Criminal Defense Strategy",
    description: "Strategic consultation for criminal charges and defense planning.",
    icon: Scale,
    price: "$250",
    duration: "120 min",
    popular: true,
  },
  {
    id: 5,
    title: "Immigration Consultation",
    description: "Expert advice on visa applications, citizenship, and immigration issues.",
    icon: Users,
    price: "$180",
    duration: "90 min",
    popular: false,
  },
  {
    id: 6,
    title: "Intellectual Property Review",
    description: "Consultation on patents, trademarks, copyrights, and IP protection strategies.",
    icon: FileText,
    price: "$225",
    duration: "90 min",
    popular: false,
  },
]

const Services = () => {
  return (
    <main className="min-h-screen bg-gray-50">
     
     <CustomNavbar />
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Services & Consultations</h1>
            <p className="text-xl opacity-90 mb-8">
              Book professional legal consultations and services with our verified lawyers
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <a href="#services">Browse Services</a>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 hover:bg-white/20" asChild>
                <a href="#booking">Request Custom Service</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Legal Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our range of professional legal services and consultations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    {service.popular && <Badge className="bg-primary">Popular</Badge>}
                  </div>
                  <CardTitle className="mt-4">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-500">{service.duration}</span>
                    </div>
                    <div className="text-xl font-bold text-primary">{service.price}</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/services/book/${service.id}`} className="w-full">
                    <Button className="w-full">
                      Book Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Request a Custom Service</h2>
              <p className="text-gray-600">
                Need a specific legal service not listed above? Fill out the form below to request a custom
                consultation.
              </p>
            </div>

            <ServiceBookingForm />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform connects you with qualified legal professionals for various legal needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Scale className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600">
                All lawyers on our platform are verified and have their credentials thoroughly checked.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">
                Book consultations at your convenience with our easy-to-use scheduling system.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Communication</h3>
              <p className="text-gray-600">
                Communicate with your lawyer through our secure messaging platform for privacy and convenience.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

export default Services
