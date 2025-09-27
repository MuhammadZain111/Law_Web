import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Briefcase, Star, ArrowLeft } from 'lucide-react';
import { lawyerAPI } from '../services/appointmentService';

function LawyersList() {
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock lawyers data as fallback
  const mockLawyers = [
    {
      id: '1',
      name: 'Ahmad Ali Khan',
      profession: 'Criminal Lawyer',
      experience: '8 Years',
      location: 'Karachi',
      consultationFee: 2000,
      rating: 4.8,
      specializations: ['Criminal Law', 'Family Law'],
      profileImage: '/api/placeholder/150/150'
    },
    {
      id: '2',
      name: 'Fatima Sheikh',
      profession: 'Corporate Lawyer',
      experience: '5 Years',
      location: 'Lahore',
      consultationFee: 3000,
      rating: 4.9,
      specializations: ['Corporate Law', 'Tax Law'],
      profileImage: '/api/placeholder/150/150'
    },
    {
      id: '3',
      name: 'Muhammad Hassan',
      profession: 'Property Lawyer',
      experience: '12 Years',
      location: 'Islamabad',
      consultationFee: 2500,
      rating: 4.7,
      specializations: ['Property Law', 'Civil Litigation'],
      profileImage: '/api/placeholder/150/150'
    },
    {
      id: '4',
      name: 'Ayesha Malik',
      profession: 'Family Lawyer',
      experience: '6 Years',
      location: 'Karachi',
      consultationFee: 1800,
      rating: 4.6,
      specializations: ['Family Law', 'Divorce Law'],
      profileImage: '/api/placeholder/150/150'
    }
  ];

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const response = await lawyerAPI.getAllLawyers();
      if (response.success && response.lawyers) {
        setLawyers(response.lawyers);
      } else {
        // Fallback to mock data
        setLawyers(mockLawyers);
      }
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      setError(error.message);
      // Use mock data as fallback
      setLawyers(mockLawyers);
    } finally {
      setLoading(false);
    }
  };

  const handleLawyerClick = (lawyerId) => {
    navigate(`/lawyer/${lawyerId}`);
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
          <h1 className="text-xl font-semibold text-teal-600">Available Lawyers</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-600">Loading lawyers...</div>
          </div>
        )}
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-yellow-800">
              <strong>Note:</strong> {error}. Showing sample data.
            </div>
          </div>
        )}
        
        {!loading && lawyers.map((lawyer) => (
          <div 
            key={lawyer.id}
            onClick={() => handleLawyerClick(lawyer.id)}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{lawyer.name}</h3>
                <p className="text-gray-600 text-lg">{lawyer.profession}</p>
                
                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span>{lawyer.experience}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{lawyer.location}</span>
                  </div>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="font-medium">{lawyer.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {lawyer.specializations.map((spec, index) => (
                    <span 
                      key={index}
                      className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">Rs {lawyer.consultationFee}</div>
                <div className="text-sm text-gray-500">per consultation</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LawyersList;
