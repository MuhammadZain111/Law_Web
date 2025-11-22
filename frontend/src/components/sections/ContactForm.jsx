'use client'

import Input from '@/components/common/Input'
import Label from '@/components/common/Label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/common/Select'
import Textarea from '@/components/common/TextArea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: 'Message sent successfully!',
      description: 'Our support team will get back to you within 24 hours.',
    })

    setIsSubmitting(false)
    e.target.reset()
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Platform Support Form</CardTitle>
        <CardDescription>
          Need help with the platform? Fill out this form and our support team will assist you.
          <span className="mt-2 block font-medium text-foreground">
            Note: This form is for platform support only, not for legal case inquiries.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" name="firstName" placeholder="John" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" name="lastName" placeholder="Doe" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" name="email" type="email" placeholder="john.doe@example.com" required />
          </div>

          <div className="space-y-2">
            <Label>I am a *</Label>
            <Select name="userType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lawyer">Lawyer</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="visitor">Visitor / Potential User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Support Category *</Label>
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account & Profile Issues</SelectItem>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="billing">Billing & Payments</SelectItem>
                <SelectItem value="features">Feature Requests</SelectItem>
                <SelectItem value="other">General Inquiry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input id="subject" name="subject" placeholder="Brief description of your issue" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Please provide detailed information about your platform support request..."
              rows={6}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full !bg-lightbrown hover:!bg-white hover:!text-black hover:!border-black border-2 border-lightbrown text-white transition-all duration-200 cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            By submitting this form, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
