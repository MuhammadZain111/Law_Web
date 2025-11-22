import { useState, useEffect } from 'react';
import ChatInterface from './ChatInterface';
import { chatService } from '../../services/chatService';

const ChatButton = () => {
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [availableClients, setAvailableClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAvailableClients();
  }, []);

  const loadAvailableClients = async () => {
    try {
      setLoading(true);
      const response = await chatService.getAvailableClients();
      if (response.success) {
        setAvailableClients(response.clients || []);
      }
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    setShowChatInterface(true);
  };

  const handleCloseChat = () => {
    setShowChatInterface(false);
    setSelectedClient(null);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setShowChatInterface(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-40"
        title="Chat with Clients"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Chat Interface */}
      {showChatInterface && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Chat with Clients</h2>
              <button
                onClick={handleCloseChat}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Client Selection or Chat Interface */}
            {!selectedClient ? (
              <div className="flex-1 p-6">
                <h3 className="text-lg font-medium mb-4">Select a client to chat with:</h3>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2">Loading clients...</span>
                  </div>
                ) : availableClients.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Available Clients</h4>
                    <p className="text-gray-600 mb-4">
                      You don't have any clients with eligible appointments yet.
                    </p>
                    <p className="text-sm text-gray-500">
                      Clients need to have confirmed and paid appointments or completed appointments to chat with you.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableClients.map((client) => (
                      <button
                        key={client._id}
                        onClick={() => handleClientSelect(client)}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left border-blue-200 bg-blue-50"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {client.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{client.name}</h4>
                            <p className="text-sm text-gray-500">{client.email}</p>
                            <p className="text-xs mt-1 text-green-600">✓ Can chat</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <ChatInterface
                selectedClient={selectedClient}
                onClose={handleCloseChat}
                onBack={() => setSelectedClient(null)}
                isClientView={false}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatButton;