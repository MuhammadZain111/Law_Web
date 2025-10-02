import { ArrowLeft, Calendar, CalendarIcon, Clock, DollarSign, FileText, Mail, Phone, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Label from '../components/common/Label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/common/Select.jsx';
import Textarea from '../components/common/TextArea.jsx';
import { api } from '../shared/api.js';

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

const PAYMENT_METHODS = [
  "EasyPaisa",
  "JazzCash", 
  "Bank Transfer",
  "Cash on Meeting",
  "Credit Card"
];

const CONSULTATION_TYPES = [
  "Initial Consultation",
  "Case Review",
  "Document Review",
  "Legal Advice",
  "Court Representation",
  "Contract Drafting"
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
        // Fetch from approved lawyers API
        const response = await api.get('/lawyers?status=approved');
        const lawyers = response.data || [];
        const foundLawyer = lawyers.find(l => l._id === id || l.userId === id);
        
        if (foundLawyer) {
          const apiLawyer = {
            id: foundLawyer._id || foundLawyer.userId,
            name: foundLawyer.fullName || `${foundLawyer.firstname || ''} ${foundLawyer.lastname || ''}`,
            expertise: foundLawyer.specialization || "General Law",
            specialization: foundLawyer.specialization || "General Law",
            rating: 4.5,
            reviews: 50,
            location: [foundLawyer.city, foundLawyer.state, foundLawyer.country].filter(Boolean).join(', ') || "Pakistan",
            experience: `${foundLawyer.yearsOfExperience || 0}+ years`,
            about: foundLawyer.bio || "Experienced lawyer providing quality legal services.",
            areas: [foundLawyer.specialization || "General Law"],
            languages: ["English", "Urdu"],
            email: foundLawyer.email,
          };
          setLawyer(apiLawyer);
        } else {
          // If not found in approved list, try to get user directly
          const userResponse = await api.get(`/v1/user/${id}`);
          const userPayload = userResponse?.data?.user;
          if (userPayload && userPayload.userType === 'lawyer') {
            const user = userPayload;
            const apiLawyer = {
              id: user._id,
              name: `${user.firstname} ${user.lastname}`,
              expertise: user.occupation || "General Law",
              specialization: user.occupation || "General Law",
              rating: 4.5,
              reviews: 50,
              location: "Pakistan",
              experience: "5+ years",
              about: user.bio || "Experienced lawyer providing quality legal services.",
              areas: ["General Law"],
              languages: ["English", "Urdu"],
              email: user.email,
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
    // Personal Information
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    age: '',
    gender: '',
    
    // Case Information
    caseType: '',
    consultationType: '',
    urgency: 'Normal',
    caseDescription: '',
    
    // Appointment Details
    preferredDate: '',
    preferredTime: '',
    alternativeDate: '',
    alternativeTime: '',
    
    // Payment Information
    paymentMethod: '',
    consultationFee: 5000,
    paymentScreenshot: '',
    
    // Additional Information
    previousLawyer: '',
    caseStatus: 'New',
    documents: '',
    specialRequirements: ''
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
        caseType: formData.caseType,
        caseDescription: formData.caseDescription || 'No additional details provided',
        appointmentDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
        timeSlot: selectedTime,
        consultationFee: formData.consultationFee,
        paymentMethod: formData.paymentMethod,
        paymentScreenshot: formData.paymentScreenshot,
        // Additional fields
        clientAddress: formData.address,
        clientCity: formData.city,
        clientAge: formData.age,
        clientGender: formData.gender,
        consultationType: formData.consultationType,
        urgency: formData.urgency,
        previousLawyer: formData.previousLawyer,
        caseStatus: formData.caseStatus,
        documents: formData.documents,
        specialRequirements: formData.specialRequirements
      };

      // Submit to backend
      const response = await api.post('/v1/appointments', appointmentData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        console.log('Appointment created successfully:', response.data.appointment);
      } else {
        throw new Error(response.data.message || 'Failed to create appointment');
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
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Appointment Booking Form
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h3>
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
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Enter your age"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, gender: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your complete address"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Case Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Case Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Case Type *</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, caseType: value}))} required>
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
                    <div className="space-y-2">
                      <Label>Consultation Type *</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, consultationType: value}))} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONSULTATION_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Urgency Level</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, urgency: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Case Status</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, caseStatus: value}))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select case status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New">New Case</SelectItem>
                          <SelectItem value="Ongoing">Ongoing</SelectItem>
                          <SelectItem value="Appeal">Appeal</SelectItem>
                          <SelectItem value="Review">Review</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="caseDescription">Case Description *</Label>
                    <Textarea
                      id="caseDescription"
                      name="caseDescription"
                      value={formData.caseDescription}
                      onChange={handleInputChange}
                      placeholder="Please provide detailed information about your legal case..."
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previousLawyer">Previous Lawyer (if any)</Label>
                    <Input
                      id="previousLawyer"
                      name="previousLawyer"
                      value={formData.previousLawyer}
                      onChange={handleInputChange}
                      placeholder="Name of previous lawyer (if applicable)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documents">Documents Available</Label>
                    <Textarea
                      id="documents"
                      name="documents"
                      value={formData.documents}
                      onChange={handleInputChange}
                      placeholder="List any documents you have related to your case..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Appointment Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Appointment Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <input
                              type="date"
                              min={new Date().toISOString().split('T')[0]}
                              onChange={(e) => {
                                setSelectedDate(new Date(e.target.value));
                                setIsCalendarOpen(false);
                              }}
                              className="w-full p-2 border rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialRequirements">Special Requirements</Label>
                    <Textarea
                      id="specialRequirements"
                      name="specialRequirements"
                      value={formData.specialRequirements}
                      onChange={handleInputChange}
                      placeholder="Any special requirements for the appointment (accessibility, language, etc.)"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Payment Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payment Method *</Label>
                      <Select onValueChange={(value) => setFormData(prev => ({...prev, paymentMethod: value}))} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationFee">Consultation Fee (PKR)</Label>
                      <Input
                        id="consultationFee"
                        name="consultationFee"
                        type="number"
                        value={formData.consultationFee}
                        onChange={handleInputChange}
                        placeholder="5000"
                        min="1000"
                        max="50000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentScreenshot">Payment Screenshot/Reference</Label>
                    <Input
                      id="paymentScreenshot"
                      name="paymentScreenshot"
                      value={formData.paymentScreenshot}
                      onChange={handleInputChange}
                      placeholder="Transaction ID or reference number (if paid in advance)"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading || !selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone || !formData.caseType}
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

                  <p className="text-sm text-gray-500 text-center mt-4">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                    You will receive a confirmation email once your appointment is approved.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
