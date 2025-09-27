import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, FileText, Calendar, Clock, CreditCard, Upload, Copy } from 'lucide-react';
import { appointmentAPI } from '../services/appointmentService';

function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lawyer, selectedDate, selectedTimeSlot } = location.state || {};

  const [formData, setFormData] = useState({
    clientName: '',
    caseType: '',
    caseDescription: '',
    contactNumber: '',
    email: ''
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('easypaisa');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [errors, setErrors] = useState({});

  const caseTypes = [
    'Criminal Law',
    'Family Law',
    'Civil Litigation',
    'Corporate Law',
    'Property Law',
    'Immigration Law',
    'Tax Law',
    'Employment Law'
  ];

  const paymentMethods = [
    {
      id: 'easypaisa',
      name: 'EasyPaisa',
      icon: '📱',
      color: 'green',
      accountNumber: '03064774085'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      icon: '📱',
      color: 'red',
      accountNumber: '03001234567'
    },
    {
      id: 'bank',
      name: 'Bank Account',
      icon: '🏦',
      color: 'purple',
      accountNumber: '1234567890123456'
    }
  ];

  useEffect(() => {
    if (!lawyer || !selectedDate || !selectedTimeSlot) {
      navigate('/');
    }
  }, [lawyer, selectedDate, selectedTimeSlot, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required';
    if (!formData.caseType) newErrors.caseType = 'Case type is required';
    if (!formData.caseDescription.trim()) newErrors.caseDescription = 'Case description is required';
    if (!formData.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
    }
  };

  const copyAccountNumber = () => {
    const selectedPayment = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
    navigator.clipboard.writeText(selectedPayment.accountNumber);
    alert('Account number copied to clipboard!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!paymentScreenshot) {
      alert('Please upload payment screenshot');
      return;
    }

    try {
      // Get current user ID from token
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to book an appointment');
        navigate('/registerUser');
        return;
      }

      const appointmentData = {
        lawyerId: lawyer.id,
        clientName: formData.clientName,
        clientEmail: formData.email,
        clientPhone: formData.contactNumber,
        caseType: formData.caseType,
        caseDescription: formData.caseDescription,
        appointmentDate: selectedDate.toISOString(),
        timeSlot: selectedTimeSlot,
        consultationFee: lawyer.consultationFee,
        paymentMethod: selectedPaymentMethod,
        paymentScreenshot: paymentScreenshot.name,
        status: 'pending',
        paymentStatus: 'unpaid'
      };

      console.log('Submitting appointment:', appointmentData);

      // Make API call to create appointment
      const response = await appointmentAPI.createAppointment(appointmentData);

      if (response.success) {
        alert('Appointment booked successfully! You will receive a confirmation email shortly.');
        navigate('/');
      } else {
        alert(response.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.message || 'Failed to book appointment. Please try again.');
    }
  };

  if (!lawyer || !selectedDate || !selectedTimeSlot) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-teal-600">Appointment</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Lawyer Info Card */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-teal-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{lawyer.name}</h3>
              <p className="text-gray-600">{lawyer.profession}</p>
              <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  <span>{lawyer.experience}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{lawyer.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Date and Time */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-teal-600" />
              <div>
                <div className="font-medium text-gray-900">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{selectedTimeSlot}</span>
                </div>
              </div>
            </div>
            <button className="text-teal-600 font-medium">Change</button>
          </div>
        </div>

        {/* Case Type Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Case Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {caseTypes.map((caseType, index) => (
              <button
                key={index}
                onClick={() => setFormData(prev => ({ ...prev, caseType }))}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  formData.caseType === caseType
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <FileText className="w-5 h-5 mx-auto mb-2 text-teal-600" />
                <span className="text-sm font-medium">{caseType}</span>
              </button>
            ))}
          </div>
          {errors.caseType && (
            <p className="mt-2 text-sm text-red-600">{errors.caseType}</p>
          )}
        </div>

        {/* Client Information Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Client Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-600" />
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  placeholder="Enter your full name"
                />
              </div>
              {errors.clientName && (
                <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-600" />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  placeholder="Enter your contact number"
                />
              </div>
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-600" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Case Description */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Case Description</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your legal issue *
            </label>
            <textarea
              name="caseDescription"
              value={formData.caseDescription}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              placeholder="e.g. I need help with a property dispute, divorce case, criminal defense..."
            />
            {errors.caseDescription && (
              <p className="mt-1 text-sm text-red-600">{errors.caseDescription}</p>
            )}
          </div>
        </div>

        {/* Payment Detail */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Payment Detail</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Consultation</span>
              <span className="font-medium">Rs {lawyer.consultationFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount</span>
              <span className="font-medium">-</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-teal-600">Rs {lawyer.consultationFee}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Select Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedPaymentMethod(method.id)}
                className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-colors ${
                  selectedPaymentMethod === method.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{method.icon}</span>
                  <span className="font-medium">{method.name}</span>
                </div>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedPaymentMethod === method.id
                    ? 'border-teal-500 bg-teal-500'
                    : 'border-gray-300'
                }`}>
                  {selectedPaymentMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Account Details */}
        {selectedPaymentMethod && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-4">
              {paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.name} Number
            </h3>
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📱</span>
                <span className="font-mono text-lg">
                  {paymentMethods.find(pm => pm.id === selectedPaymentMethod)?.accountNumber}
                </span>
              </div>
              <button
                onClick={copyAccountNumber}
                className="p-2 hover:bg-teal-100 rounded-lg"
              >
                <Copy className="w-5 h-5 text-teal-600" />
              </button>
            </div>
          </div>
        )}

        {/* Payment Screenshot Upload */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Payment Screenshot</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="payment-screenshot"
            />
            <label htmlFor="payment-screenshot" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Upload Payment Screenshot</p>
              <p className="text-sm text-gray-500">Click to select image file</p>
            </label>
            {paymentScreenshot && (
              <p className="mt-2 text-sm text-teal-600">
                Selected: {paymentScreenshot.name}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
          <div>
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-xl font-bold text-teal-600">Rs {lawyer.consultationFee}</div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Submit Appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;
