import { useState } from 'react'
import { FileQuestion, Settings, CreditCard, Lightbulb, Shield, Users, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const categories = [
  {
    icon: Settings,
    title: 'Account & Profile',
    description: 'Profile setup, verification, settings',
    links: [
      'Reset Password',
      'Update Email Address',
      'Verification Status',
      'Profile Visibility',
      'Deactivate Account'
    ]
  },
  {
    icon: FileQuestion,
    title: 'Technical Support',
    description: 'Bug reports, login issues, errors',
    links: [
      'System Status',
      'Browser Compatibility',
      'Mobile App Issues',
      'Clear Cache & Cookies',
      'Report a Bug'
    ]
  },
  {
    icon: CreditCard,
    title: 'Billing & Payments',
    description: 'Subscription, invoices, refunds',
    links: [
      'View Invoices',
      'Update Payment Method',
      'Subscription Plans',
      'Refund Policy',
      'Billing History'
    ]
  },
  {
    icon: Users,
    title: 'Matching & Connections',
    description: 'Lawyer-client matching process',
    links: [
      'How Matching Works',
      'Client Screening',
      'Accepting Requests',
      'Messaging Guidelines',
      'Conflict of Interest'
    ]
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Data protection, account security',
    links: [
      'Two-Factor Authentication',
      'Data Export',
      'Privacy Policy',
      'Cookie Settings',
      'Security Best Practices'
    ]
  },
  {
    icon: Lightbulb,
    title: 'Feature Requests',
    description: 'Suggestions and improvements',
    links: [
      'Submit a Idea',
      'Roadmap',
      'Beta Program',
      'Feedback Forum',
      'Developer API'
    ]
  }
]

export default function SupportCategories() {
  const [openCategory, setOpenCategory] = useState(null)

  const toggleCategory = (title) => {
    setOpenCategory(openCategory === title ? null : title)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Support Categories
        </h2>
        <p className="text-muted-foreground text-pretty">
          Quick links to common platform support topics
        </p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.title}
            className={cn(
              "rounded-lg border bg-card transition-all duration-200",
              openCategory === category.title
                ? "border-primary/50 shadow-md"
                : "hover:border-primary/30"
            )}
          >
            <button
              onClick={() => toggleCategory(category.title)}
              className="flex w-full items-center justify-between p-4 text-left"
              aria-expanded={openCategory === category.title}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors",
                    openCategory === category.title
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  <category.icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground leading-none mb-1">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200",
                  openCategory === category.title && "rotate-180 text-primary"
                )}
              />
            </button>

            {/* Accordion content */}
            <div
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                openCategory === category.title
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="border-t px-4 py-4 pt-2">
                  <ul className="grid gap-2 sm:grid-cols-2 ml-[3.5rem]">
                    {category.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm text-muted-foreground hover:text-primary hover:underline flex items-center gap-2"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
