const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters long']
  },
  excerpt: {
    type: String,
    maxlength: [300, 'Excerpt cannot exceed 300 characters']
  },
  author: {
    type: String,  // ← CHANGED FROM ObjectId TO String
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorEmail: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: String  // ← Also String since you're using emails
  }],
  comments: [{
    user: String,
    userName: String,
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  coverImage: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
BlogSchema.index({ authorEmail: 1, createdAt: -1 });
BlogSchema.index({ author: 1, createdAt: -1 });
BlogSchema.index({ title: 'text', content: 'text', tags: 'text' });
BlogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Blog", BlogSchema);
