const Blog = require('../Model/Blog');
const User = require('../Model/User123');

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, tags, authorId, authorName, authorEmail, coverImage } = req.body;

    // Create excerpt if not provided
    const blogExcerpt = excerpt || content.substring(0, 150) + '...';

    const blog = await Blog.create({
      title,
      content,
      excerpt: blogExcerpt,
      author: authorId,
      authorName,
      authorEmail,
      tags: tags || [],
      coverImage
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
};

// Get all blog posts with pagination
exports.getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'Name Email Department Year')
      .lean();

    const total = await Blog.countDocuments({ isPublished: true });

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: blogs.length,
        totalBlogs: total
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog posts'
    });
  }
};

// Get single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'Name Email Department Year Github Linkedin')
      .populate('comments.user', 'Name Email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog post'
    });
  }
};

// Update blog post
exports.updateBlog = async (req, res) => {
  try {
    const { title, content, excerpt, tags, coverImage } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Update fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.excerpt = excerpt || blog.excerpt;
    blog.tags = tags || blog.tags;
    blog.coverImage = coverImage || blog.coverImage;

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post'
    });
  }
};

// Delete blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post'
    });
  }
};

// Get user's blogs
exports.getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Error fetching user blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user blogs'
    });
  }
};

// Like/Unlike blog post
exports.likeBlog = async (req, res) => {
  try {
    const { userId } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const likeIndex = blog.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: likeIndex > -1 ? 'Blog unliked' : 'Blog liked',
      likeCount: blog.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like blog post'
    });
  }
};

// Add comment to blog
exports.addComment = async (req, res) => {
  try {
    const { userId, userName, content } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    blog.comments.push({
      user: userId,
      userName,
      content,
      createdAt: new Date()
    });

    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: blog.comments[blog.comments.length - 1]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment'
    });
  }
};

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    blog.comments = blog.comments.filter(
      comment => comment._id.toString() !== req.params.commentId
    );

    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment'
    });
  }
};

// Search blogs
exports.searchBlogs = async (req, res) => {
  try {
    const { q, tags } = req.query;
    let query = { isPublished: true };

    if (q) {
      query.$text = { $search: q };
    }

    if (tags) {
      query.tags = { $in: tags.split(',') };
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('author', 'Name Email Department')
      .lean();

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('Error searching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search blogs'
    });
  }
};
