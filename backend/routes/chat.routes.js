import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  getOrCreateChat,
  getConversations,
  getMessages,
  sendMessage,
  getAvailableUsers
} from '../controllers/chatController.js';

const router = Router();

// All routes require authentication
router.use(auth());

// Get or create chat
router.post('/chat', getOrCreateChat);

// Get all conversations
router.get('/conversations', getConversations);

// Get messages for a chat
router.get('/messages/:chatId', getMessages);

// Send a message
router.post('/message', sendMessage);

// Get available users for starting conversation
router.get('/users', getAvailableUsers);

export default router;

