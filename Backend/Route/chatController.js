const Chat = require('../Model/Chat');
const Message = require('../Model/Message');

// Get or create chat between two users
exports.getOrCreateChat = async (req, res) => {
  try {
    const { user1, user2 } = req.body;

    if (!user1 || !user2) {
      return res.status(400).json({
        success: false,
        message: 'Both user emails are required'
      });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [user1, user2] }
    });

    // Create new chat if doesn't exist
    if (!chat) {
      chat = await Chat.create({
        participants: [user1, user2],
        unreadCount: [
          { userEmail: user1, count: 0 },
          { userEmail: user2, count: 0 }
        ]
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    console.error('Error getting/creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get or create chat',
      error: error.message
    });
  }
};

// Get all chats for a user
exports.getUserChats = async (req, res) => {
  try {
    const { userEmail } = req.params;

    const chats = await Chat.find({
      participants: userEmail
    }).sort({ lastMessageTime: -1 });

    res.status(200).json({
      success: true,
      data: chats
    });
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chats'
    });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, sender, senderName, receiver, content, messageType } = req.body;

    if (!chatId || !sender || !receiver || !content) {
      return res.status(400).json({
        success: false,
        message: 'Chat ID, sender, receiver, and content are required'
      });
    }

    // Create message
    const message = await Message.create({
      chatId,
      sender,
      senderName,
      receiver,
      content,
      messageType: messageType || 'text'
    });

    // Update chat with last message and increment unread count
    const chat = await Chat.findById(chatId);
    if (chat) {
      chat.lastMessage = content;
      chat.lastMessageTime = new Date();
      chat.incrementUnread(receiver); // Use helper method
      await chat.save();
    }

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
};

// Get messages for a chat
exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chatId });

    res.status(200).json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        count: messages.length,
        totalMessages: total
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { chatId, userEmail } = req.body;

    await Message.updateMany(
      {
        chatId,
        receiver: userEmail,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    // Reset unread count using helper method
    const chat = await Chat.findById(chatId);
    if (chat) {
      chat.setUnreadCount(userEmail, 0);
      await chat.save();
    }

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark messages as read'
    });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndDelete(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const { userEmail } = req.params;

    const chats = await Chat.find({
      participants: userEmail
    });

    let totalUnread = 0;
    const chatUnreadCounts = [];

    chats.forEach(chat => {
      const count = chat.getUnreadCount(userEmail); // Use helper method
      totalUnread += count;
      chatUnreadCounts.push({
        chatId: chat._id,
        unread: count
      });
    });

    res.status(200).json({
      success: true,
      data: {
        totalUnread,
        chats: chatUnreadCounts
      }
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};
