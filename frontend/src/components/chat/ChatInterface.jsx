import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const ChatInterface = ({ selectedClient, onClose, onBack, isClientView = false }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Get current user from localStorage or context
  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
          id: payload.userId || payload.id,
          name: payload.name || payload.firstname + ' ' + payload.lastname,
          userType: payload.userType || payload.role
        };
      }
    } catch (error) {
      console.error('Error parsing token:', error);
    }
    
    // Fallback to mock data for demo
    return isClientView ? {
      id: 'client-a',
      name: 'Client A',
      userType: 'user'
    } : {
      id: 'lawyer-x',
      name: 'Lawyer X',
      userType: 'lawyer'
    };
  };

  const currentUser = getCurrentUser();

  useEffect(() => {
    if (selectedClient) {
      initializeSocket();
      // Load some mock messages
      loadMockMessages();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMockMessages = () => {
    // Mock messages for demonstration
    const mockMessages = [
      {
        id: 1,
        senderId: 'client-a',
        receiverId: 'lawyer-x',
        message: 'Hello, I need help with my legal case.',
        timestamp: new Date(Date.now() - 3600000),
        sender: 'client'
      },
      {
        id: 2,
        senderId: 'lawyer-x',
        receiverId: 'client-a',
        message: 'Hello! I\'m here to help. Can you tell me more about your case?',
        timestamp: new Date(Date.now() - 3500000),
        sender: 'lawyer'
      },
      {
        id: 3,
        senderId: 'client-a',
        receiverId: 'lawyer-x',
        message: 'I have a contract dispute with my business partner.',
        timestamp: new Date(Date.now() - 3400000),
        sender: 'client'
      }
    ];
    setMessages(mockMessages);
  };

  const initializeSocket = () => {
    const newSocket = io('http://localhost:3000', {
      auth: { 
        userId: currentUser.id,
        userType: currentUser.userType,
        token: localStorage.getItem('token')
      },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('message_sent', (message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user_typing', (data) => {
      if (data.senderId === selectedClient.id) {
        setOtherUserTyping(data.isTyping);
      }
    });

    newSocket.on('message_error', (data) => {
      console.error('Chat error:', data);
      alert(`Chat Error: ${data.error}${data.reason ? ' - ' + data.reason : ''}`);
    });

    setSocket(newSocket);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      id: Date.now(),
      senderId: currentUser.id,
      receiverId: selectedClient.id,
      message: newMessage.trim(),
      timestamp: new Date(),
      sender: currentUser.userType
    };

    // Add message to local state immediately
    setMessages(prev => [...prev, messageData]);
    
    // Emit to socket
    socket.emit('send_message', messageData);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit('typing_start', {
      senderId: currentUser.id,
      receiverId: selectedClient.id
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing_stop', {
        senderId: currentUser.id,
        receiverId: selectedClient.id
      });
    }, 1000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className={`w-8 h-8 ${isClientView ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center`}>
            <span className={`${isClientView ? 'text-blue-600' : 'text-green-600'} font-medium text-sm`}>
              {selectedClient.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{selectedClient.name}</h3>
            <p className="text-sm text-gray-500">
              {isClientView ? 'Lawyer' : 'Client'} • Online
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'lawyer' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'lawyer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'lawyer' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <p className="text-sm italic">
                {isClientView ? 'Lawyer' : 'Client'} is typing...
              </p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;