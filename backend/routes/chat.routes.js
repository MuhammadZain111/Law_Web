import express from 'express';
import {
    getClients,
    getConversations,
    getLawyers,
    getMessages
} from '../controllers/chatController.js';
import { requireAuth } from '../middleware/auth.js';
import { getChatEligibilityStatus, verifyChatEligibility } from '../middleware/chatEligibility.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Get all conversations for the current user
router.get('/conversations', getConversations);

// Get messages between current user and another user (with eligibility check)
router.get('/messages/:otherUserId', verifyChatEligibility, getMessages);

// Get all clients for a lawyer
router.get('/clients', getClients);

// Get all lawyers for a client
router.get('/lawyers', getLawyers);

// Check chat eligibility for a specific lawyer (for clients)
router.get('/eligibility/:lawyerId', getChatEligibilityStatus);

export default router;



