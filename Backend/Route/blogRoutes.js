const express = require('express');
const router = express.Router();

// Import all controller functions
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  likeBlog,
  addComment,
  deleteComment,
  searchBlogs
} = require('./blogController');

// Public routes
router.get('/', getAllBlogs);
router.get('/search', searchBlogs);
router.get('/user/:userId', getUserBlogs);
router.get('/:id', getBlogById);

// Blog creation/modification routes
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

// Interaction routes
router.post('/:id/like', likeBlog);
router.post('/:id/comment', addComment);
router.delete('/:id/comment/:commentId', deleteComment);

// IMPORTANT: Export the router, not an object
module.exports = router;
