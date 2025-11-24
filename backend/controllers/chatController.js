import { Chat } from '../models/Chat.js';
import { Message } from '../models/Message.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';

// Get or create chat between lawyer and client
export const getOrCreateChat = async (req, res) => {
  try {
    const { lawyerId, clientId } = req.body;
    const currentUserId = req.user?.id || req.user?.userId;

    // Validate IDs
    if (!lawyerId || !clientId) {
      return res.status(400).json({
        success: false,
        message: 'Lawyer ID and Client ID are required'
      });
    }

    // Ensure lawyerId and clientId are different
    const lawyerIdStr = lawyerId.toString();
    const clientIdStr = clientId.toString();
    
    if (lawyerIdStr === clientIdStr) {
      return res.status(400).json({
        success: false,
        message: 'Lawyer and Client cannot be the same person'
      });
    }

    // Verify lawyer exists and is actually a lawyer
    const lawyer = await User.findById(lawyerId);
    if (!lawyer || lawyer.userType !== 'lawyer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid lawyer ID'
      });
    }

    // Verify client exists and is not a lawyer
    let client = null;
    try {
      // Try to find client by ID
      if (mongoose.Types.ObjectId.isValid(clientId)) {
        client = await User.findById(clientId);
      } else {
        console.error('❌ Invalid clientId format:', clientId);
        return res.status(400).json({
          success: false,
          message: 'Invalid client ID format'
        });
      }
    } catch (error) {
      console.error('❌ Error finding client:', error);
      return res.status(400).json({
        success: false,
        message: 'Error finding client: ' + error.message
      });
    }
    
    if (!client) {
      console.error('❌ Client not found with ID:', clientId);
      console.log('⚠️ Client not found in User collection.');
      console.log('💡 Only registered users can start chats. The selected client must be registered in the system.');
      return res.status(400).json({
        success: false,
        message: 'Client not found. The selected client must be registered as a user to start a chat. Please select a registered client.'
      });
    }
    
    // Ensure client is not a lawyer
    if (client.userType === 'lawyer') {
      return res.status(400).json({
        success: false,
        message: 'Client cannot be a lawyer'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      lawyerId: new mongoose.Types.ObjectId(lawyerId),
      clientId: new mongoose.Types.ObjectId(clientId)
    }).populate('lawyerId', 'firstname lastname email photoUrl')
      .populate('clientId', 'firstname lastname email photoUrl');

    // If chat doesn't exist, create it
    if (!chat) {
      chat = await Chat.create({
        participants: [lawyerId, clientId],
        lawyerId: lawyerId,
        clientId: clientId
      });

      chat = await Chat.findById(chat._id)
        .populate('lawyerId', 'firstname lastname email photoUrl')
        .populate('clientId', 'firstname lastname email photoUrl');
    }

    res.json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Get or create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get or create chat'
    });
  }
};

// Get all conversations for current user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const userType = req.user?.userType || req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    let chats;
    if (userType === 'lawyer') {
      // Get all chats where user is the lawyer
      chats = await Chat.find({ lawyerId: userId })
        .populate('lawyerId', 'firstname lastname email photoUrl')
        .populate('clientId', 'firstname lastname email photoUrl')
        .sort({ lastMessageAt: -1 });
    } else {
      // Get all chats where user is the client
      chats = await Chat.find({ clientId: userId })
        .populate('lawyerId', 'firstname lastname email photoUrl')
        .populate('clientId', 'firstname lastname email photoUrl')
        .sort({ lastMessageAt: -1 });
    }

    res.json({
      success: true,
      conversations: chats
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations'
    });
  }
};

// Get messages for a specific chat
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Verify user is part of this chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const isParticipant = chat.participants.some(
      p => p.toString() === userId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get messages
    const messages = await Message.find({ chatId })
      .populate('senderId', 'firstname lastname email photoUrl userType')
      .sort({ createdAt: 1 })
      .limit(100);

    // Mark messages as read for current user
    await Message.updateMany(
      {
        chatId,
        receiverId: userId,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    // Update unread count
    const unreadCount = await Message.countDocuments({
      chatId,
      receiverId: userId,
      read: false
    });

    if (req.user?.userType === 'lawyer') {
      await Chat.findByIdAndUpdate(chatId, {
        'unreadCount.lawyer': 0
      });
    } else {
      await Chat.findByIdAndUpdate(chatId, {
        'unreadCount.client': 0
      });
    }

    res.json({
      success: true,
      messages,
      unreadCount
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const senderId = req.user?.id || req.user?.userId;

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (!chatId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID and message are required'
      });
    }

    // Verify chat exists and user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    const isParticipant = chat.participants.some(
      p => p.toString() === senderId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Determine receiver
    const receiverId = chat.lawyerId.toString() === senderId.toString()
      ? chat.clientId
      : chat.lawyerId;

    // Create message
    const newMessage = await Message.create({
      chatId,
      senderId,
      receiverId,
      message: message.trim()
    });

    // Update chat last message and timestamp
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message.trim(),
      lastMessageAt: new Date()
    });

    // Update unread count
    if (chat.lawyerId.toString() === senderId.toString()) {
      await Chat.findByIdAndUpdate(chatId, {
        $inc: { 'unreadCount.client': 1 }
      });
    } else {
      await Chat.findByIdAndUpdate(chatId, {
        $inc: { 'unreadCount.lawyer': 1 }
      });
    }

    // Populate sender info
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'firstname lastname email photoUrl userType')
      .populate('receiverId', 'firstname lastname email photoUrl userType');

    // Emit via socket (will be handled in socket.js)
    try {
      const { io } = await import('../socket.js');
      if (io) {
        // Emit to receiver's user room
        io.to(String(receiverId)).emit('new_message', {
          chatId,
          message: populatedMessage
        });
        // Also emit to chat room for real-time updates
        io.to(`chat_${chatId}`).emit('new_message', {
          chatId,
          message: populatedMessage
        });
      }
    } catch (socketError) {
      console.warn('Socket emit failed:', socketError?.message || socketError);
    }

    res.json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Get users for starting new conversation (for lawyers)
export const getAvailableUsers = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;
    const userType = req.user?.userType || req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (userType === 'lawyer') {
      // Get all unique clients who have appointments with this lawyer
      const Appointment = (await import('../models/appointment.model.js')).default;
      
      // Find all CONFIRMED appointments for this lawyer
      // Try to convert userId to ObjectId first
      let lawyerObjectId;
      try {
        lawyerObjectId = mongoose.Types.ObjectId.isValid(userId) 
          ? new mongoose.Types.ObjectId(userId) 
          : null;
      } catch (error) {
        console.error('❌ Invalid userId format:', userId);
        lawyerObjectId = null;
      }
      
      // Build query conditions
      const lawyerQuery = lawyerObjectId 
        ? [
            { lawyerId: lawyerObjectId },
            { lawyerId: userId }
          ]
        : [{ lawyerId: userId }];
      
      const appointments = await Appointment.find({ 
        $and: [
          { $or: lawyerQuery },
          { status: { $in: ['confirmed', 'completed'] } } // Only confirmed or completed appointments
        ]
      }).select('clientId clientEmail clientName lawyerId status').lean();

      console.log(`📋 Found ${appointments.length} CONFIRMED appointments for lawyer ${userId}`);
      if (appointments.length > 0) {
        console.log(`📋 Sample confirmed appointments:`, appointments.slice(0, 3).map(a => ({
          clientId: a.clientId,
          clientEmail: a.clientEmail,
          clientName: a.clientName,
          status: a.status,
          lawyerId: a.lawyerId
        })));
      } else {
        console.warn(`⚠️ No confirmed appointments found for lawyer ${userId}.`);
        // Check total appointments (including pending)
        const totalAppointments = await Appointment.find({ 
          $or: [
            { lawyerId: new mongoose.Types.ObjectId(userId) },
            { lawyerId: userId }
          ]
        }).select('status').lean();
        const statusCounts = totalAppointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1;
          return acc;
        }, {});
        console.log(`📋 Total appointments by status:`, statusCounts);
      }

      // Extract unique client IDs (from linked appointments)
      const clientIds = [...new Set(
        appointments
          .map(a => {
            // Handle both string and ObjectId formats
            if (a.clientId) {
              const id = a.clientId.toString();
              console.log(`📋 Found clientId in appointment:`, id, `for client:`, a.clientName);
              return id;
            }
            return null;
          })
          .filter(Boolean)
      )];

      // Extract unique client emails (ALL appointments have clientEmail)
      const clientEmails = [...new Set(
        appointments
          .map(a => {
            const email = a.clientEmail?.toLowerCase().trim();
            if (email) {
              console.log(`📧 Found clientEmail in appointment:`, email, `for client:`, a.clientName);
            }
            return email;
          })
          .filter(Boolean)
      )];

      console.log(`👥 SUMMARY: Found ${clientIds.length} client IDs and ${clientEmails.length} unique emails`);
      console.log(`📧 ALL client emails (${clientEmails.length}):`, clientEmails);
      console.log(`🆔 ALL client IDs (${clientIds.length}):`, clientIds);
      
      // Log appointment details for debugging
      if (appointments.length > 0) {
        console.log(`📋 All appointment details (${appointments.length}):`, appointments.map(a => ({
          clientId: a.clientId?.toString() || 'null',
          clientEmail: a.clientEmail,
          clientName: a.clientName,
          status: a.status
        })));
      }

      // Build query to find ALL clients by ID or email
      const orConditions = [];

      // Add clientId matches (if any)
      if (clientIds.length > 0) {
        try {
          const validObjectIds = clientIds
            .filter(id => mongoose.Types.ObjectId.isValid(id))
            .map(id => new mongoose.Types.ObjectId(id));
          
          if (validObjectIds.length > 0) {
            orConditions.push({ 
              _id: { $in: validObjectIds } 
            });
            console.log(`✅ Added ${validObjectIds.length} valid client IDs to query`);
          }
        } catch (error) {
          console.error('❌ Error processing client IDs:', error);
        }
      }

      // Add email matches - User model has email with lowercase: true
      if (clientEmails.length > 0) {
        console.log(`📧 Searching for ${clientEmails.length} unique emails`);
        console.log(`📧 ALL emails from appointments:`, clientEmails);
        
        // Since User model has email with lowercase: true, convert all emails to lowercase
        const emailLowercase = clientEmails.map(e => e.toLowerCase().trim());
        const uniqueLowercaseEmails = [...new Set(emailLowercase)];
        
        console.log(`📧 Unique lowercase emails to search (${uniqueLowercaseEmails.length}):`, uniqueLowercaseEmails);
        
        // Use direct $in match since emails are stored in lowercase in User model
        // Add each email as a separate condition to ensure all are matched
        for (const email of uniqueLowercaseEmails) {
          orConditions.push({ email: email });
        }
        
        console.log(`✅ Added ${uniqueLowercaseEmails.length} email conditions to query`);
      }

      // If no OR conditions, return empty
      if (orConditions.length === 0) {
        console.warn('⚠️ No client IDs or emails found in appointments');
        return res.json({
          success: true,
          users: []
        });
      }

      // Build final query - use all conditions in $or
      const query = {
        userType: { $ne: 'lawyer' },
        $or: orConditions
      };

      console.log(`🔍 Final query structure:`, {
        userType: query.userType,
        totalOrConditions: orConditions.length,
        clientIdConditions: clientIds.length,
        emailConditions: clientEmails.length
      });
      console.log(`🔍 All Client IDs (${clientIds.length}):`, clientIds);
      console.log(`🔍 All Client emails (${clientEmails.length}):`, clientEmails);
      console.log(`🔍 Sample query conditions:`, orConditions.slice(0, 3));

      // Get client user details - use lean() for better performance
      const clients = await User.find(query)
        .select('firstname lastname email photoUrl _id')
        .sort({ firstname: 1, lastname: 1 })
        .lean();
        
      console.log(`🔍 Raw query result: ${clients.length} clients found`);

      console.log(`✅ Found ${clients.length} matching users from database`);
      
      // Log which clients were found
      if (clients.length > 0) {
        console.log(`📋 Found clients:`, clients.map(c => ({
          _id: c._id?.toString(),
          name: `${c.firstname} ${c.lastname}`,
          email: c.email
        })));
      } else {
        console.warn(`⚠️ No clients found! Check if emails/IDs match.`);
        console.warn(`📧 Searched emails:`, clientEmails);
        console.warn(`🆔 Searched IDs:`, clientIds);
      }

      // Remove duplicates based on email (case-insensitive)
      const uniqueClients = [];
      const seenEmails = new Set();
      const seenIds = new Set();
      
      for (const client of clients) {
        const emailKey = client.email?.toLowerCase().trim();
        const idKey = client._id?.toString();
        
        // Check both email and ID to avoid duplicates
        if (emailKey && !seenEmails.has(emailKey)) {
          seenEmails.add(emailKey);
          if (idKey) seenIds.add(idKey);
          uniqueClients.push(client);
        } else if (idKey && !seenIds.has(idKey) && !emailKey) {
          // Handle case where email might be missing but ID exists
          seenIds.add(idKey);
          uniqueClients.push(client);
        }
      }

      console.log(`✅ Returning ${uniqueClients.length} unique clients`);
      console.log(`📋 Client details:`, uniqueClients.map(c => ({
        _id: c._id,
        name: `${c.firstname} ${c.lastname}`,
        email: c.email
      })));

      // Log missing clients
      if (uniqueClients.length < clientEmails.length) {
        const foundEmails = new Set(uniqueClients.map(c => c.email?.toLowerCase().trim()).filter(Boolean));
        const missingEmails = clientEmails.filter(email => !foundEmails.has(email.toLowerCase().trim()));
        
        console.log(`⚠️ Found ${uniqueClients.length} registered clients but ${clientEmails.length} unique emails`);
        console.log(`📋 Missing clients (not registered):`, missingEmails);
        console.log(`💡 Only registered users can be selected for chat`);
        console.log(`📋 Registered clients:`, uniqueClients.map(c => c.email));
      }

      console.log(`✅ Final result: Returning ${uniqueClients.length} clients`);
      console.log(`📋 Clients being returned:`, uniqueClients.map(c => ({
        _id: c._id?.toString(),
        name: `${c.firstname} ${c.lastname}`,
        email: c.email
      })));

      res.json({
        success: true,
        users: uniqueClients
      });
    } else {
      // For clients, get all approved lawyers
      const lawyers = await User.find({
        userType: 'lawyer',
        status: 'approved'
      }).select('firstname lastname email photoUrl specialization');

      res.json({
        success: true,
        users: lawyers
      });
    }
  } catch (error) {
    console.error('Get available users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available users'
    });
  }
};

