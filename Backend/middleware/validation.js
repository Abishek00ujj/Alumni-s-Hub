const validateBlog = (req, res, next) => {
  const { title, content, authorId, authorName, authorEmail } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Title must be at least 3 characters long'
    });
  }

  if (!content || content.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Content must be at least 10 characters long'
    });
  }

  if (!authorId || !authorName || !authorEmail) {
    return res.status(400).json({
      success: false,
      message: 'Author information is required'
    });
  }

  next();
};

module.exports = { validateBlog };
