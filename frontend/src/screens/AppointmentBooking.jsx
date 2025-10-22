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

// Function to get available payment methods based on lawyer's settings
const getAvailablePaymentMethods = (lawyerPaymentMethods) => {
  if (!lawyerPaymentMethods) {
    return ["Cash on Meeting"]; // Default fallback
  }
  
  const available = ["Cash on Meeting"]; // Always available
  
  if (lawyerPaymentMethods.jazzcash?.enabled) {
    available.push("JazzCash");
  }
  
  if (lawyerPaymentMethods.easypaisa?.enabled) {
    available.push("EasyPaisa");
  }
  
  if (lawyerPaymentMethods.bankTransfer?.enabled) {
    available.push("Bank Transfer");
  }
  
  return available;
};

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
  const [lawyerPaymentMethods, setLawyerPaymentMethods] = useState(null);
  const [loading, setLoading] = useState(true);
  const calendarRef = useRef(null);

  // Fetch lawyer data
  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        // Fetch from approved lawyers API
        console.log('🔍 Debug - AppointmentBooking fetching lawyer for ID:', id);
        const response = await api.get('/appointments/lawyers?status=approved');
        console.log('🔍 Debug - AppointmentBooking response:', response);
        
        const lawyersData = response.data?.lawyers || response.data || [];
        console.log('🔍 Debug - AppointmentBooking lawyersData:', lawyersData);
        console.log('🔍 Debug - AppointmentBooking lawyersData type:', typeof lawyersData);
        console.log('🔍 Debug - AppointmentBooking lawyersData isArray:', Array.isArray(lawyersData));
        
        const foundLawyer = lawyersData.find(l => l._id === id || l.userId === id);
        console.log('🔍 Debug - AppointmentBooking foundLawyer:', foundLawyer);
        
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
            phone: foundLawyer.phone || foundLawyer.phoneNumber || '',
            photoUrl: foundLawyer.photoUrl || '',
          };
          setLawyer(apiLawyer);
          
          // Set payment methods if available
          if (foundLawyer.paymentMethods) {
            console.log('🔍 Debug - Setting lawyer payment methods:', foundLawyer.paymentMethods);
            setLawyerPaymentMethods(foundLawyer.paymentMethods);
          } else {
            console.log('🔍 Debug - No payment methods found for lawyer');
          }
        } else {
          // If not found in approved list, try to get user directly
          const userResponse = await api.get(`/user/${id}`);
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
              phone: user.phone || user.phoneNumber || '',
              photoUrl: user.photoUrl || '',
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
    consultationFee: 2000,
    paymentScreenshot: '',
    
    // Additional Information
    previousLawyer: '',
    caseStatus: 'New',
    documents: '',
    documentFiles: [], // Array to store uploaded files
    specialRequirements: ''
  });

  // Keep a formatted display for consultation fee (PKR with separators)
  const [consultationFeeDisplay, setConsultationFeeDisplay] = useState('2,000');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Special handling for consultationFee: sanitize and format
    if (name === 'consultationFee') {
      const digitsOnly = String(value).replace(/[^0-9]/g, '');
      let numeric = parseInt(digitsOnly || '0', 10);
      // Clamp to sensible range
      if (Number.isNaN(numeric)) numeric = 0;
      if (numeric < 1000) numeric = 1000;
      if (numeric > 50000) numeric = 50000;
      setFormData(prev => ({ ...prev, consultationFee: numeric }));
      setConsultationFeeDisplay(numeric.toLocaleString('en-PK'));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAppointmentTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      appointmentType: value
    }));
  };

  // Handle file upload with ImageKit
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      
      // Check file type (allow common document types)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'text/plain'
      ];
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not a supported format. Please upload PDF, DOC, DOCX, JPG, PNG, or TXT files.`);
        continue;
      }

      try {
        console.log('🔍 Debug - Uploading file (local backend):', file.name);
        // Direct local upload to backend (skip ImageKit to avoid console errors)
        const fd = new FormData();
        fd.append('file', file);
        const base = (import.meta.env?.VITE_API_BASE || 'http://localhost:5000').replace(/\/$/, '') + '/api/v1/user/upload-local';
        const res = await fetch(base, { method: 'POST', body: fd, credentials: 'include' });
        const data = await res.json();
        if (!res.ok || !data?.url) throw new Error(data?.message || 'Local upload failed');
        const uploadedUrl = data.url;
        console.log('🔍 Debug - Local upload successful:', uploadedUrl);
        
        // Add file with URL to form data
        const fileWithUrl = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          url: uploadedUrl
        };
        
        setFormData(prev => ({
          ...prev,
          documentFiles: [...prev.documentFiles, fileWithUrl]
        }));
        
        alert(`File ${file.name} uploaded successfully!`);
        
      } catch (error) {
        console.error('🔍 Debug - File upload error:', error);
        alert(`Failed to upload ${file.name}: ${error.message}`);
      }
    }
  };

  // Handle payment screenshot upload
  const handlePaymentScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(`File ${file.name} is too large. Maximum size is 10MB.`);
      return;
    }
    
    // Check file type (allow images and PDF)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    if (!allowedTypes.includes(file.type)) {
      alert(`File ${file.name} is not a supported format. Please upload JPG, PNG, or PDF files.`);
      return;
    }

    try {
      console.log('🔍 Debug - Uploading payment screenshot to ImageKit:', file.name);
      
      // Get ImageKit authentication
      const { data: sig } = await api.get('/user/imagekit-auth');
      
      // Create form data for ImageKit upload
      const form = new FormData();
      form.append('file', file);
      form.append('publicKey', sig.publicKey);
      form.append('signature', sig.signature);
      form.append('expire', sig.expire);
      form.append('token', sig.token);
      form.append('fileName', file.name);
      form.append('folder', 'payment-screenshots');
      form.append('useUniqueFileName', 'true');
      
      // Upload to ImageKit
      const uploadUrl = 'https://upload.imagekit.io/api/v1/files/upload';
      const resp = await fetch(uploadUrl, { method: 'POST', body: form });
      const json = await resp.json();
      
      if (!resp.ok || !json?.url) {
        throw new Error(json?.message || 'Upload failed');
      }
      
      console.log('🔍 Debug - Payment screenshot upload successful:', json.url);
      
      // Store file with URL in form data
      const fileWithUrl = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        url: json.url
      };
      
      setFormData(prev => ({
        ...prev,
        paymentScreenshotFile: fileWithUrl
      }));
      
      alert(`Payment screenshot ${file.name} uploaded successfully!`);
      
    } catch (fallbackErr) {
      console.error('🔍 Debug - Payment screenshot upload error:', fallbackErr);
      alert(`Failed to upload ${file.name}: ${fallbackErr.message}`);
    }
  };

  // Remove uploaded file
  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documentFiles: prev.documentFiles.filter((_, i) => i !== index)
    }));
  };

  // Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const event = { target: { files } };
    handleFileUpload(event);
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
        consultationFee: Number(formData.consultationFee),
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
        documentFiles: formData.documentFiles.map(file => {
          // Ensure we're working with a File object and extract properties safely
          if (file && typeof file === 'object') {
            return {
              name: file.name || 'unknown',
              size: file.size || 0,
              type: file.type || 'application/octet-stream',
              lastModified: file.lastModified || Date.now(),
              url: file.url || null // Include URL if available
            };
          }
          // If it's already a plain object, return as is
          return file;
        }),
        specialRequirements: formData.specialRequirements
      };

      // Debug: Log the lawyerId and its format
      console.log('🔍 Debug - Lawyer ID from URL:', id);
      console.log('🔍 Debug - Lawyer ID type:', typeof id);
      console.log('🔍 Debug - Lawyer ID length:', id?.length);
      console.log('🔍 Debug - Is valid ObjectId format:', /^[0-9a-fA-F]{24}$/.test(id));
      
      // Debug: Log documentFiles data
      console.log('🔍 Debug - DocumentFiles before mapping:', formData.documentFiles);
      console.log('🔍 Debug - DocumentFiles after mapping:', appointmentData.documentFiles);
      console.log('🔍 Debug - DocumentFiles type:', typeof appointmentData.documentFiles);
      console.log('🔍 Debug - DocumentFiles isArray:', Array.isArray(appointmentData.documentFiles));
      console.log('🔍 Debug - DocumentFiles JSON:', JSON.stringify(appointmentData.documentFiles));

      // If there are files to upload, we'll need to handle them separately
      // For now, we'll include file metadata in the appointment data
      console.log('📋 Sending appointment data:', appointmentData);
      console.log('📋 Required fields check:', {
        lawyerId: !!appointmentData.lawyerId,
        clientName: !!appointmentData.clientName,
        clientEmail: !!appointmentData.clientEmail,
        clientPhone: !!appointmentData.clientPhone,
        caseType: !!appointmentData.caseType,
        caseDescription: !!appointmentData.caseDescription,
        appointmentDate: !!appointmentData.appointmentDate,
        timeSlot: !!appointmentData.timeSlot,
        consultationFee: !!appointmentData.consultationFee,
        paymentMethod: !!appointmentData.paymentMethod
      });

      // Validate required fields before sending
      const requiredFields = ['lawyerId', 'clientName', 'clientEmail', 'clientPhone', 'caseType', 'caseDescription', 'appointmentDate', 'timeSlot', 'consultationFee', 'paymentMethod'];
      const missingFields = requiredFields.filter(field => !appointmentData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate enum values
      const validCaseTypes = ['Criminal Law', 'Family Law', 'Civil Litigation', 'Corporate Law', 'Property Law', 'Immigration Law', 'Tax Law', 'Employment Law'];
      if (!validCaseTypes.includes(appointmentData.caseType)) {
        throw new Error(`Invalid case type: ${appointmentData.caseType}`);
      }

      const validPaymentMethods = ['EasyPaisa', 'JazzCash', 'Bank Transfer', 'Cash on Meeting', 'Credit Card', 'easypaisa', 'jazzcash', 'bank'];
      if (!validPaymentMethods.includes(appointmentData.paymentMethod)) {
        throw new Error(`Invalid payment method: ${appointmentData.paymentMethod}`);
      }

      // Validate timeSlot format
      const timeSlotPattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeSlotPattern.test(appointmentData.timeSlot)) {
        throw new Error(`Invalid time slot format: ${appointmentData.timeSlot}`);
      }

      // Validate consultationFee is a positive number
      if (isNaN(appointmentData.consultationFee) || appointmentData.consultationFee <= 0) {
        throw new Error(`Invalid consultation fee: ${appointmentData.consultationFee}`);
      }

      // Validate lawyerId is a valid MongoDB ObjectId format
      const objectIdPattern = /^[0-9a-fA-F]{24}$/;
      if (!objectIdPattern.test(appointmentData.lawyerId)) {
        throw new Error(`Invalid lawyer ID format: ${appointmentData.lawyerId}`);
      }

      // Submit to backend
      const response = await api.post('/appointments', appointmentData);
      
      if (response.data.success) {
        setIsSubmitted(true);
        console.log('Appointment created successfully:', response.data.appointment);
        try {
          // Notify dashboard and request refresh
          window.dispatchEvent(new CustomEvent('appt:notify', {
            detail: {
              title: 'Appointment Requested',
              description: `You requested an appointment with ${lawyer.name}.`,
              time: Date.now(),
            }
          }));
          window.dispatchEvent(new Event('appt:refetch'));
        } catch (_) {}
      } else {
        throw new Error(response.data.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        data: error.data
      });
      
      // Show more specific error message
      let errorMessage = 'Failed to book appointment. Please try again.';
      
      if (error.data?.details) {
        errorMessage = `Validation Error: ${error.data.details}`;
      } else if (error.data?.message) {
        errorMessage = `Error: ${error.data.message}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      // If there are specific validation errors, show them
      if (error.data?.errors && Array.isArray(error.data.errors)) {
        const fieldErrors = error.data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        errorMessage = `Validation errors: ${fieldErrors}`;
      }
      
      alert(errorMessage);
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
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  {lawyer.photoUrl ? (
                    <img src={lawyer.photoUrl} alt={lawyer.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{lawyer.name}</h3>
                <p className="text-gray-600">{lawyer.expertise}</p>
                <p className="text-sm text-gray-500">{lawyer.location}</p>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{lawyer?.email || 'Email not available'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{lawyer?.phone || 'Phone not available'}</span>
                </div>
              </div>
              
              {/* Payment Account Details */}
              {lawyerPaymentMethods && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">💳</span>
                    Payment Accounts
                  </h4>
                  <div className="space-y-2 text-xs">
                    {/* JazzCash */}
                    {lawyerPaymentMethods.jazzcash?.enabled && (
                      <div className="p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-sm">📱</span>
                          <span className="font-medium text-blue-900">JazzCash</span>
                        </div>
                        <p className="text-blue-800 font-mono">{lawyerPaymentMethods.jazzcash.accountNumber}</p>
                        <p className="text-blue-700">{lawyerPaymentMethods.jazzcash.accountName}</p>
                      </div>
                    )}
                    
                    {/* EasyPaisa */}
                    {lawyerPaymentMethods.easypaisa?.enabled && (
                      <div className="p-2 bg-green-50 rounded border border-green-200">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-sm">💳</span>
                          <span className="font-medium text-green-900">EasyPaisa</span>
                        </div>
                        <p className="text-green-800 font-mono">{lawyerPaymentMethods.easypaisa.accountNumber}</p>
                        <p className="text-green-700">{lawyerPaymentMethods.easypaisa.accountName}</p>
                      </div>
                    )}
                    
                    {/* Bank Transfer */}
                    {lawyerPaymentMethods.bankTransfer?.enabled && (
                      <div className="p-2 bg-purple-50 rounded border border-purple-200">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-sm">🏦</span>
                          <span className="font-medium text-purple-900">Bank Transfer</span>
                        </div>
                        <p className="text-purple-800 font-medium">{lawyerPaymentMethods.bankTransfer.bankName}</p>
                        <p className="text-purple-800 font-mono">{lawyerPaymentMethods.bankTransfer.accountNumber}</p>
                        <p className="text-purple-700">{lawyerPaymentMethods.bankTransfer.accountName}</p>
                        {lawyerPaymentMethods.bankTransfer.iban && (
                          <p className="text-purple-700 font-mono text-xs">{lawyerPaymentMethods.bankTransfer.iban}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Cash on Meeting - Always Available */}
                    <div className="p-2 bg-gray-50 rounded border border-gray-200">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-sm">💵</span>
                        <span className="font-medium text-gray-900">Cash on Meeting</span>
                      </div>
                      <p className="text-gray-700">Pay in person when you meet</p>
                    </div>
                    
                    {/* No Payment Methods Message */}
                    {!lawyerPaymentMethods.jazzcash?.enabled && !lawyerPaymentMethods.easypaisa?.enabled && !lawyerPaymentMethods.bankTransfer?.enabled && (
                      <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                        <p className="text-yellow-800 text-center">Cash payments only</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                      <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({...prev, gender: value}))}>
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
                      <Select value={formData.caseType} onValueChange={(value) => setFormData(prev => ({...prev, caseType: value}))} required>
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
                      <Select value={formData.consultationType} onValueChange={(value) => setFormData(prev => ({...prev, consultationType: value}))} required>
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
                      <Select value={formData.urgency} onValueChange={(value) => setFormData(prev => ({...prev, urgency: value}))}>
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
                      <Select value={formData.caseStatus} onValueChange={(value) => setFormData(prev => ({...prev, caseStatus: value}))}>
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
                    
                    {/* File Upload Section */}
                    <div className="mt-4">
                      <Label>Upload Documents (Optional)</Label>
                      <div className="mt-2">
                        {/* Drag and Drop Area */}
                        <div
                          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                        >
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">
                            Drag and drop files here, or click to select files
                          </p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                            onChange={handleFileUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Supported formats: PDF, DOC, DOCX, JPG, PNG, TXT (Max 10MB each)
                          </p>
                        </div>
                      </div>
                      
                      {/* Display uploaded files */}
                      {formData.documentFiles.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            Uploaded Files ({formData.documentFiles.length}):
                          </p>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {formData.documentFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-md">
                                <div className="flex items-center space-x-3">
                                  <div className="flex-shrink-0">
                                    {file.type.startsWith('image/') ? (
                                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                        <span className="text-blue-600 text-xs font-bold">IMG</span>
                                      </div>
                                    ) : file.type === 'application/pdf' ? (
                                      <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                                        <span className="text-red-600 text-xs font-bold">PDF</span>
                                      </div>
                                    ) : (
                                      <FileText className="w-4 h-4 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">
                                      {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="ml-2 text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                      <Select value={selectedTime} onValueChange={setSelectedTime} required>
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
                      <Select value={formData.paymentMethod} onValueChange={(value) => {
                        console.log('🔍 Debug - Payment method selected:', value);
                        setFormData(prev => ({...prev, paymentMethod: value}));
                      }} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {(() => {
                            const availableMethods = getAvailablePaymentMethods(lawyerPaymentMethods);
                            console.log('🔍 Debug - Available payment methods:', availableMethods);
                            console.log('🔍 Debug - Lawyer payment methods:', lawyerPaymentMethods);
                            return availableMethods.map((method) => (
                              <SelectItem key={method} value={method}>
                                {method}
                              </SelectItem>
                            ));
                          })()}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="consultationFee">Consultation Fee</Label>
                      <div className="flex items-stretch">
                        <span className="inline-flex items-center px-3 border border-r-0 rounded-l bg-gray-50 text-gray-600 text-sm">PKR</span>
                        <input
                          id="consultationFee"
                          name="consultationFee"
                          inputMode="numeric"
                          className="flex-1 border rounded-r px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                          value={consultationFeeDisplay}
                          onChange={handleInputChange}
                          placeholder="2,000"
                        />
                      </div>
                      <p className="text-xs text-gray-500">Range: PKR 1,000 – 50,000</p>
                    </div>
                  </div>
                  
                  {/* Payment Instructions */}
                  {formData.paymentMethod && formData.paymentMethod !== 'Cash on Meeting' && lawyerPaymentMethods && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                        <span className="mr-2">💳</span>
                        Payment Instructions:
                      </h4>
                      <div className="text-sm text-yellow-700 space-y-2">
                        {formData.paymentMethod === 'JazzCash' && lawyerPaymentMethods.jazzcash?.enabled && (
                          <div>
                            <p className="font-medium">Send PKR {formData.consultationFee.toLocaleString()} to:</p>
                            <p>📱 JazzCash: {lawyerPaymentMethods.jazzcash.accountNumber}</p>
                            <p>👤 Account Name: {lawyerPaymentMethods.jazzcash.accountName}</p>
                            <p className="mt-2 text-xs">Take a screenshot of the payment confirmation and upload it below.</p>
                          </div>
                        )}
                        {formData.paymentMethod === 'EasyPaisa' && lawyerPaymentMethods.easypaisa?.enabled && (
                          <div>
                            <p className="font-medium">Send PKR {formData.consultationFee.toLocaleString()} to:</p>
                            <p>💳 EasyPaisa: {lawyerPaymentMethods.easypaisa.accountNumber}</p>
                            <p>👤 Account Name: {lawyerPaymentMethods.easypaisa.accountName}</p>
                            <p className="mt-2 text-xs">Take a screenshot of the payment confirmation and upload it below.</p>
                          </div>
                        )}
                        {formData.paymentMethod === 'Bank Transfer' && lawyerPaymentMethods.bankTransfer?.enabled && (
                          <div>
                            <p className="font-medium">Transfer PKR {formData.consultationFee.toLocaleString()} to:</p>
                            <p>🏦 Bank: {lawyerPaymentMethods.bankTransfer.bankName}</p>
                            <p>📄 Account Number: {lawyerPaymentMethods.bankTransfer.accountNumber}</p>
                            <p>👤 Account Name: {lawyerPaymentMethods.bankTransfer.accountName}</p>
                            {lawyerPaymentMethods.bankTransfer.iban && (
                              <p>🔢 IBAN: {lawyerPaymentMethods.bankTransfer.iban}</p>
                            )}
                            <p className="mt-2 text-xs">Take a screenshot of the transfer confirmation and upload it below.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Payment Screenshot Upload */}
                  {(() => {
                    console.log('🔍 Debug - Checking screenshot upload conditions:');
                    console.log('🔍 Debug - formData.paymentMethod:', formData.paymentMethod);
                    console.log('🔍 Debug - Should show screenshot upload:', formData.paymentMethod && formData.paymentMethod !== 'Cash on Meeting');
                    return formData.paymentMethod && formData.paymentMethod !== 'Cash on Meeting';
                  })() && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentScreenshot">Payment Screenshot/Reference *</Label>
                        <Input
                          id="paymentScreenshot"
                          name="paymentScreenshot"
                          value={formData.paymentScreenshot}
                          onChange={handleInputChange}
                          placeholder="Transaction ID or reference number"
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Enter transaction ID or reference number from your payment.
                        </p>
                      </div>
                      
                      {/* File Upload for Screenshot */}
                      <div className="space-y-2">
                        <Label htmlFor="paymentScreenshotFile">Upload Payment Screenshot *</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <input
                            type="file"
                            id="paymentScreenshotFile"
                            name="paymentScreenshotFile"
                            accept="image/*,.pdf"
                            onChange={handlePaymentScreenshotUpload}
                            className="hidden"
                          />
                          <label htmlFor="paymentScreenshotFile" className="cursor-pointer">
                            <div className="space-y-2">
                              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  Click to upload payment screenshot
                                </p>
                                <p className="text-xs text-gray-500">
                                  PNG, JPG, PDF up to 10MB
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                        
                        {/* Display uploaded screenshot */}
                        {formData.paymentScreenshotFile && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-green-800">
                                  {formData.paymentScreenshotFile.name}
                                </p>
                                <p className="text-xs text-green-600">
                                  {(formData.paymentScreenshotFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({...prev, paymentScreenshotFile: null}))}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-500">
                          Upload screenshot of payment confirmation. Lawyer will verify payment before accepting appointment.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Cash on Meeting Note */}
                  {formData.paymentMethod === 'Cash on Meeting' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="font-semibold">Cash Payment Selected</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        You will pay PKR {formData.consultationFee.toLocaleString()} in cash when you meet the lawyer.
                      </p>
                    </div>
                  )}
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
