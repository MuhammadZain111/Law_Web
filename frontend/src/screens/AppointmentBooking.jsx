import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lawyers } from '@/data/Lawyers';
import { appointmentAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Input from '@/components/common/Input';
import Label from '@/components/common/Label';
import Textarea from '@/components/common/TextArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/common/Select';
import Calendar from '@/components/common/Calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/common/Popover';
import { CalendarIcon, Clock, User, Mail, Phone, ArrowLeft } from 'lucide-react';
// import { format } from 'date-fns';

const APPOINTMENT_TYPES = [
  "Criminal Law",
  "Family Law", 
  "Civil Litigation",
  "Corporate Law",
  "Property Law",
  "Immigration Law",
  "Tax Law",
  "Employment Law"
];

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
];

export default function AppointmentBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState();
  const [selectedTime, setSelectedTime] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);

  // Fetch lawyer data
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        // First try static data
        const staticLawyer = lawyers.find((l) => l.id.toString() === id);
        if (staticLawyer) {
          setLawyer(staticLawyer);
        } else {
          // If not found, fetch from API
          const response = await lawyerAPI.getLawyerById(id);
          if (response.success && response.lawyer) {
            const apiLawyer = {
              id: response.lawyer._id,
              name: `${response.lawyer.firstname} ${response.lawyer.lastname}`,
              expertise: response.lawyer.occupation || "General Law",
              specialization: response.lawyer.occupation || "General Law",
              rating: 4.5,
              reviews: 50,
              location: "Pakistan",
              experience: "5+ years",
              about: response.lawyer.bio || "Experienced lawyer providing quality legal services.",
              areas: ["General Law"],
              languages: ["English", "Urdu"],
            };
            setLawyer(apiLawyer);
          }
        }
      } catch (error) {
        console.error("Error fetching lawyer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentType: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAppointmentTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      appointmentType: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare appointment data
      const appointmentData = {
        lawyerId: id,
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        caseType: formData.appointmentType,
        caseDescription: formData.message || 'No additional details provided',
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedTime,
        consultationFee: 5000, // Default fee
        paymentMethod: 'easypaisa', // Default payment method
        paymentScreenshot: '', // Optional
      };

      // Submit to backend
      const response = await appointmentAPI.createAppointment(appointmentData);
      
      if (response.success) {
        setIsSubmitted(true);
        console.log('Appointment created successfully:', response.appointment);
      } else {
        throw new Error(response.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading lawyer information...
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="p-6 text-center text-gray-600">
        Lawyer not found.
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Requested!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment request has been sent to {lawyer.name}. 
              You will receive a confirmation email shortly.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate(`/lawyers/${id}`)}
                className="w-full"
              >
                Back to Lawyer Profile
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/lawyers/${id}`)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lawyer Profile
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Book an Appointment</h1>
          <p className="text-gray-600 mt-2">
            Schedule a consultation with {lawyer.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lawyer Info Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Lawyer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
                <h3 className="font-semibold text-lg">{lawyer.name}</h3>
                <p className="text-gray-600">{lawyer.expertise}</p>
                <p className="text-sm text-gray-500">{lawyer.location}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>Contact to view</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Contact to view</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                {/* Case Type */}
                <div className="space-y-2">
                  <Label>Case Type *</Label>
                  <Select onValueChange={handleAppointmentTypeChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select case type" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPOINTMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Preferred Date *</Label>
                  <div className="relative" ref={calendarRef}>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      type="button"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
                    </Button>
                    {isCalendarOpen && (
                      <div className="absolute top-full left-0 mt-1 z-50 bg-white border rounded-md shadow-lg p-3">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setIsCalendarOpen(false);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label>Preferred Time *</Label>
                  <Select onValueChange={setSelectedTime} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_SLOTS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">Additional Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please provide any additional details about your legal needs..."
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isLoading || !selectedDate || !selectedTime}
                >
                  {isLoading ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Booking Appointment...
                    </>
                  ) : (
                    'Request Appointment'
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
