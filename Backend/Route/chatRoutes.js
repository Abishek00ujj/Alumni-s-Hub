const express = require('express');
const router = express.Router();
const {
  getOrCreateChat,
  getUserChats,
  sendMessage,
  getChatMessages,
  markAsRead,
  deleteMessage,
  getUnreadCount
} = require('./chatController');

// Chat routes
router.post('/create', getOrCreateChat);
router.get('/user/:userEmail', getUserChats);
router.get('/unread/:userEmail', getUnreadCount);

// Message routes
router.post('/message', sendMessage);
router.get('/messages/:chatId', getChatMessages);
router.put('/read', markAsRead);
router.delete('/message/:messageId', deleteMessage);

module.exports = router;
