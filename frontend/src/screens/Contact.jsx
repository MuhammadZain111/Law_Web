import ContactForm from '@/components/sections/ContactForm'
import ContactHero from '@/components/sections/ContactHero'
import ContactInfo from '@/components/sections/ContactInfo'
import SocialLinks from '@/components/sections/SocialLinks'
import SupportCategories from '@/components/sections/SupportCategories'
import CustomNavbar from '@/components/sections/CustomNavbar'
import Footer from '@/components/sections/Footer'


export const metadata = {
  title: 'Contact Us - LegalConnect',
  description:
    "Get in touch with our platform support team. We're here to help lawyers and clients connect effectively.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
     <CustomNavbar />
      <ContactHero />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-12">
        
            <ContactInfo />
            <SupportCategories />
            <SocialLinks />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
