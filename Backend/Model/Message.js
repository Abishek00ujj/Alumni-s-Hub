const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: String, // Email
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  receiver: {
    type: String, // Email
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for faster queries
MessageSchema.index({ chatId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1, receiver: 1 });

module.exports = mongoose.model("Message", MessageSchema);
