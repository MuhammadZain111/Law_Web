import express from 'express';
import { chatWithBot, getChatHistory } from '../controllers/chatbotController.js';

const router = express.Router();

// Chat with the bot
router.post('/chat', chatWithBot);

// Get chat history (optional - for future use)
router.get('/history', getChatHistory);

export default router;















