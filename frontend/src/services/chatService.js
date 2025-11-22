import { api } from '../shared/api.js';

export const chatService = {
  // Check if client is eligible to chat with a specific lawyer
  async checkEligibility(lawyerId) {
    try {
      const response = await api.get(`/chat/eligibility/${lawyerId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking chat eligibility:', error);
      return {
        success: false,
        eligible: false,
        reason: 'Error checking eligibility'
      };
    }
  },

  // Get all lawyers that the client can chat with
  async getAvailableLawyers() {
    try {
      const response = await api.get('/chat/lawyers');
      return response.data;
    } catch (error) {
      console.error('Error fetching available lawyers:', error);
      return {
        success: false,
        lawyers: []
      };
    }
  },

  // Get all clients that a lawyer can chat with
  async getAvailableClients() {
    try {
      const response = await api.get('/chat/clients');
      return response.data;
    } catch (error) {
      console.error('Error fetching available clients:', error);
      return {
        success: false,
        clients: []
      };
    }
  },

  // Get conversations for the current user
  async getConversations() {
    try {
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return {
        success: false,
        conversations: []
      };
    }
  },

  // Get messages between current user and another user
  async getMessages(otherUserId) {
    try {
      const response = await api.get(`/chat/messages/${otherUserId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return {
        success: false,
        messages: []
      };
    }
  }
};

