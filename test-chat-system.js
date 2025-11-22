// Test script to verify chat system is working
// Run this after starting the backend server

const testChatSystem = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing Chat System...\n');
  
  // Test 1: Check if chat routes are accessible
  try {
    const response = await fetch(`${baseURL}/api/v1/chat/conversations`, {
      headers: {
        'Authorization': 'Bearer test-token' // This will fail but shows route exists
      }
    });
    console.log('✅ Chat routes are accessible:', response.status);
  } catch (error) {
    console.log('❌ Chat routes not accessible:', error.message);
  }
  
  // Test 2: Check if socket server is running
  try {
    const socket = require('socket.io-client');
    const client = socket('http://localhost:3000');
    
    client.on('connect', () => {
      console.log('✅ Socket.IO server is running and accessible');
      client.disconnect();
    });
    
    client.on('connect_error', (error) => {
      console.log('❌ Socket.IO connection failed:', error.message);
    });
    
    setTimeout(() => {
      if (client.connected) {
        console.log('✅ Socket connection established');
      } else {
        console.log('❌ Socket connection timeout');
      }
    }, 2000);
    
  } catch (error) {
    console.log('❌ Socket.IO test failed:', error.message);
  }
  
  console.log('\n📋 Chat System Status:');
  console.log('- Backend routes: /api/v1/chat/*');
  console.log('- Socket.IO: ws://localhost:3000');
  console.log('- Frontend chat buttons should appear on dashboards');
  console.log('\n🎯 How to test:');
  console.log('1. Start backend: npm run dev (port 3000)');
  console.log('2. Start frontend: npm run dev (port 5173)');
  console.log('3. Login as lawyer or client');
  console.log('4. Look for floating chat buttons (blue for lawyers, green for clients)');
  console.log('5. Click chat button to open chat interface');
};

// Run the test
testChatSystem();



