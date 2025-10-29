const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  participants: [{
    type: String, // Email addresses
    required: true
  }],
  lastMessage: {
    type: String,
    default: ''
  },
  lastMessageTime: {
    type: Date,
    default: Date.now
  },
  // Changed from Map to Array of objects
  unreadCount: [{
    userEmail: {
      type: String,
      required: true
    },
    count: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastMessageTime: -1 });

// Helper method to get unread count for a user
ChatSchema.methods.getUnreadCount = function(userEmail) {
  const unread = this.unreadCount.find(u => u.userEmail === userEmail);
  return unread ? unread.count : 0;
};

// Helper method to set unread count for a user
ChatSchema.methods.setUnreadCount = function(userEmail, count) {
  const unread = this.unreadCount.find(u => u.userEmail === userEmail);
  if (unread) {
    unread.count = count;
  } else {
    this.unreadCount.push({ userEmail, count });
  }
};

// Helper method to increment unread count
ChatSchema.methods.incrementUnread = function(userEmail) {
  const unread = this.unreadCount.find(u => u.userEmail === userEmail);
  if (unread) {
    unread.count += 1;
  } else {
    this.unreadCount.push({ userEmail, count: 1 });
  }
};

module.exports = mongoose.model("Chat", ChatSchema);
