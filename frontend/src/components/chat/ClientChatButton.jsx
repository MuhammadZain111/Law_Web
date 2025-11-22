import { useEffect, useState } from 'react';
import { chatService } from '../../services/chatService';
import ChatInterface from './ChatInterface';

const ClientChatButton = () => {
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [availableLawyers, setAvailableLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibilityStatus, setEligibilityStatus] = useState({});

  useEffect(() => {
    loadAvailableLawyers();
  }, []);

  const loadAvailableLawyers = async () => {
    try {
      setLoading(true);
      const response = await chatService.getAvailableLawyers();
      if (response.success) {
        setAvailableLawyers(response.lawyers || []);
      }
    } catch (error) {
      console.error('Error loading lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async (lawyerId) => {
    try {
      const response = await chatService.checkEligibility(lawyerId);
      setEligibilityStatus(prev => ({
        ...prev,
        [lawyerId]: response
      }));
      return response;
    } catch (error) {
      console.error('Error checking eligibility:', error);
      return { eligible: false, reason: 'Error checking eligibility' };
    }
  };

  const handleLawyerSelect = async (lawyer) => {
    const eligibility = await checkEligibility(lawyer._id);
    if (eligibility.eligible) {
      setSelectedLawyer(lawyer);
      setShowChatInterface(true);
    } else {
      alert(`Cannot chat with ${lawyer.name}: ${eligibility.reason}`);
    }
  };

  const handleCloseChat = () => {
    setShowChatInterface(false);
    setSelectedLawyer(null);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setShowChatInterface(true)}
        className="fixed bottom-6 right-6 bg-lightbrown hover:bg-white hover:text-black hover:border-black border-2 border-lightbrown text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40 cursor-pointer"
        title="Chat with Lawyer"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Interface */}
      {showChatInterface && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-5/6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Chat with Lawyer</h2>
              <button
                onClick={handleCloseChat}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Lawyer Selection or Chat Interface */}
            {!selectedLawyer ? (
              <div className="flex-1 p-6">
                <h3 className="text-lg font-medium mb-4">Select a lawyer to chat with:</h3>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2">Loading lawyers...</span>
                  </div>
                ) : availableLawyers.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Available Lawyers</h4>
                    <p className="text-gray-600 mb-4">
                      You need to have a confirmed and paid appointment or a completed appointment to chat with lawyers.
                    </p>
                    <p className="text-sm text-gray-500">
                      Book an appointment and make payment to start chatting with your lawyer.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableLawyers.map((lawyer) => {
                      const eligibility = eligibilityStatus[lawyer._id];
                      const isEligible = eligibility?.eligible;
                      
                      return (
                        <button
                          key={lawyer._id}
                          onClick={() => handleLawyerSelect(lawyer)}
                          disabled={!isEligible}
                          className={`p-4 border rounded-lg transition-colors text-left ${
                            isEligible 
                              ? 'hover:bg-gray-50 border-green-200 bg-green-50' 
                              : 'opacity-50 cursor-not-allowed border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isEligible ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                              <span className={`font-medium ${
                                isEligible ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {lawyer.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{lawyer.name}</h4>
                              <p className="text-sm text-gray-500">{lawyer.email}</p>
                              {eligibility && (
                                <p className={`text-xs mt-1 ${
                                  isEligible ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {isEligible ? '✓ Can chat' : '✗ Cannot chat'}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <ChatInterface
                selectedClient={selectedLawyer}
                onClose={handleCloseChat}
                onBack={() => setSelectedLawyer(null)}
                isClientView={true}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ClientChatButton;

