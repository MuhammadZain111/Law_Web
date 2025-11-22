import { Conversation, Message } from '../models/Chat.js';

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Conversation.find({
      participants: userId
    })
    .populate('participants', 'firstname lastname email userType')
    .sort({ lastMessageTime: -1 });

    // Get unread counts for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          receiverId: userId,
          senderId: { $in: conv.participants.filter(p => p._id.toString() !== userId) },
          read: false
        });
        
        return {
          ...conv.toObject(),
          unreadCount
        };
      })
    );

    res.json({
      success: true,
      conversations: conversationsWithUnread
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user.id;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] }
    });

    if (!conversation) {
      // Create new conversation
      conversation = new Conversation({
        participants: [userId, otherUserId]
      });
      await conversation.save();
    }

    // Get messages between users
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    })
    .populate('senderId', 'firstname lastname userType')
    .sort({ timestamp: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: userId, read: false },
      { read: true }
    );

    res.json({
      success: true,
      messages,
      conversationId: conversation._id
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Get all clients for a lawyer
export const getClients = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    // Get all users who have had conversations with this lawyer
    const conversations = await Conversation.find({
      participants: lawyerId
    }).populate('participants', 'firstname lastname email userType');

    const clients = conversations
      .map(conv => conv.participants.find(p => p._id.toString() !== lawyerId))
      .filter(client => client && client.userType === 'user')
      .map(client => ({
        _id: client._id,
        name: `${client.firstname} ${client.lastname}`,
        email: client.email,
        userType: client.userType
      }));

    // Remove duplicates
    const uniqueClients = clients.filter((client, index, self) => 
      index === self.findIndex(c => c._id.toString() === client._id.toString())
    );

    res.json({
      success: true,
      clients: uniqueClients
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clients'
    });
  }
};

// Get all lawyers for a client
export const getLawyers = async (req, res) => {
  try {
    const clientId = req.user.id;

    // Get all users who have had conversations with this client
    const conversations = await Conversation.find({
      participants: clientId
    }).populate('participants', 'firstname lastname email userType');

    const lawyers = conversations
      .map(conv => conv.participants.find(p => p._id.toString() !== clientId))
      .filter(lawyer => lawyer && lawyer.userType === 'lawyer')
      .map(lawyer => ({
        _id: lawyer._id,
        name: `${lawyer.firstname} ${lawyer.lastname}`,
        email: lawyer.email,
        userType: lawyer.userType
      }));

    // Remove duplicates
    const uniqueLawyers = lawyers.filter((lawyer, index, self) => 
      index === self.findIndex(l => l._id.toString() === lawyer._id.toString())
    );

    res.json({
      success: true,
      lawyers: uniqueLawyers
    });
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lawyers'
    });
  }
};

// Save message to database
export const saveMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    await message.save();

    // Update conversation
    await Conversation.findOneAndUpdate(
      { participants: { $all: [messageData.senderId, messageData.receiverId] } },
      {
        lastMessage: messageData.message,
        lastMessageTime: messageData.timestamp || new Date(),
        $inc: { [`unreadCount.${messageData.receiverId}`]: 1 }
      },
      { upsert: true }
    );

    return message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

