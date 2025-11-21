import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lawyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    lawyer: { type: Number, default: 0 },
    client: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Index for faster queries
chatSchema.index({ participants: 1 });
chatSchema.index({ lawyerId: 1, clientId: 1 });

export const Chat = mongoose.model('Chat', chatSchema);

