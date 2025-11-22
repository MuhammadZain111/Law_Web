import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    details: 'support@legalconnect.com',
    description: 'Get a response within 24 hours',
    href: 'mailto:support@legalconnect.com',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    details: '+1 (555) 123-4567',
    description: 'Mon-Fri, 9 AM - 6 PM EST',
    href: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    title: 'Head Office',
    details: '123 Legal Street, Suite 400',
    description: 'New York, NY 10001',
    href: 'https://maps.google.com',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: 'Monday - Friday',
    description: '9:00 AM - 6:00 PM EST',
    href: null,
  },
]

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Contact Information
        </h2>
        <p className="text-muted-foreground text-pretty">
          Multiple ways to reach our platform support team
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {contactMethods.map((method) => (
          <Card key={method.title} className="transition-all hover:shadow-md">
            <CardContent className="p-6">
              {method.href ? (
                <a
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="group block"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center 
                    rounded-lg bg-primary/10 text-primary transition-colors
                    group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <method.icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-1 font-semibold text-foreground">
                    {method.title}
                  </h3>

                  <p className="mb-1 text-sm font-medium text-foreground">
                    {method.details}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </a>
              ) : (
                <>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <method.icon className="h-6 w-6" />
                  </div>

                  <h3 className="mb-1 font-semibold text-foreground">
                    {method.title}
                  </h3>

                  <p className="mb-1 text-sm font-medium text-foreground">
                    {method.details}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
