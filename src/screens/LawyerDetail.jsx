import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Briefcase, Calendar, Clock, Star, Award } from 'lucide-react';

function LawyerDetail() {
  const navigate = useNavigate();
  const { lawyerId } = useParams();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Mock lawyer data - in real app, this would come from API
  const lawyer = {
    id: lawyerId || '1',
    name: 'Ahmad Ali Khan',
    profession: 'Criminal Lawyer',
    experience: '8 Years',
    location: 'Karachi',
    consultationFee: 2000,
    rating: 4.8,
    about: 'I am a Criminal Lawyer with 8 years of experience in handling complex criminal cases.',
    bio: 'I am a Criminal Lawyer with 8 years of experience and I specialize in criminal defense, family law, and civil litigation. I have successfully handled over 500 cases.',
    profileImage: '/api/placeholder/150/150',
    specializations: ['Criminal Law', 'Family Law', 'Civil Litigation'],
    languages: ['Urdu', 'English', 'Sindhi']
  };

  // Mock available time slots
  const availableTimeSlots = [
    '09:00 - 10:00',
    '10:00 - 11:00',
    '11:00 - 12:00',
    '14:00 - 15:00',
    '15:00 - 16:00',
    '16:00 - 17:00'
  ];

  // Mock available dates (next 7 days)
  const availableDates = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    availableDates.push(date);
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select both date and time slot');
      return;
    }
    
    // Navigate to appointment booking form
    navigate(`/book-appointment/${lawyerId}`, {
      state: {
        lawyer,
        selectedDate,
        selectedTimeSlot
      }
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
          <h1 className="text-xl font-semibold text-teal-600">Lawyer Detail</h1>
          <div className="w-10"></div> {/* Spacer */}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Lawyer Profile Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-teal-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{lawyer.name}</h2>
              <p className="text-gray-600 text-lg">{lawyer.profession}</p>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-gray-500">
                  <Briefcase className="w-4 h-4 mr-1" />
                  <span className="text-sm">{lawyer.experience}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{lawyer.location}</span>
                </div>
                <div className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{lawyer.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Fee */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Consultation Fee:</span>
            <span className="text-2xl font-bold text-teal-600">Rs {lawyer.consultationFee}</span>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-3">About</h3>
          <p className="text-gray-700 leading-relaxed">{lawyer.about}</p>
        </div>

        {/* Bio Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-3">Bio</h3>
          <p className="text-gray-700 leading-relaxed">{lawyer.bio}</p>
        </div>

        {/* Specializations */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-3">Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {lawyer.specializations.map((spec, index) => (
              <span 
                key={index}
                className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Select Appointment Date */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">Select Appointment Date</h3>
          <div className="grid grid-cols-2 gap-3">
            {availableDates.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`p-3 rounded-lg border-2 text-center transition-colors ${
                  selectedDate && selectedDate.toDateString() === date.toDateString()
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-teal-300'
                }`}
              >
                <div className="text-sm font-medium">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg font-bold">
                  {date.getDate()}
                </div>
                <div className="text-xs text-gray-500">
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Available Time Slots */}
        {selectedDate && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-teal-600 mb-4">Available Time Slots</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableTimeSlots.map((timeSlot, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSlotSelect(timeSlot)}
                  className={`p-3 rounded-lg border-2 text-center transition-colors ${
                    selectedTimeSlot === timeSlot
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-1" />
                  <span className="text-sm font-medium">{timeSlot}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Book Appointment Button */}
        <button
          onClick={handleBookAppointment}
          disabled={!selectedDate || !selectedTimeSlot}
          className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold text-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
        >
          Book Appointment
        </button>
      </div>
    </div>
  );
}

export default LawyerDetail;
