import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Heart, 
  MessageCircle, 
  Eye, 
  Calendar, 
  User,
  ArrowLeft,
  Send,
  Trash2,
  Edit
} from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("data"));
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));
  const userId = completeUser?.data?.id;

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`https://alumni-s-hub.onrender.com/api/v1/blogs/${id}`);
      if (response.data.success) {
        setBlog(response.data.data);
        setIsLiked(response.data.data.likes?.includes(userId));
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.post(`https://alumni-s-hub.onrender.com/api/v1/blogs/${id}/like`, {
        userId
      });
      
      if (response.data.success) {
        setIsLiked(response.data.isLiked);
        fetchBlog(); // Refresh to get updated like count
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await axios.post(`https://alumni-s-hub.onrender.com/api/v1/blogs/${id}/comment`, {
        userId,
        userName: userDetails?.Name,
        content: commentText
      });

      if (response.data.success) {
        setCommentText('');
        fetchBlog();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteBlog = async () => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await axios.delete(`https://alumni-s-hub.onrender.com/api/v1/blogs/${id}`);
      navigate('/blogs');
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Blog not found</h2>
            <button
              onClick={() => navigate('/blogs')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </>
    );
  }

  const isAuthor = blog.authorEmail === userDetails?.Email;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blogs')}
            className="flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blogs
          </button>

          {/* Blog Content */}
          <article className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
            {/* Cover Image */}
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
            )}

            <div className="p-8">
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold text-white mb-6">{blog.title}</h1>

              {/* Author Info and Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-5 h-5" />
                    <span className="font-semibold">{blog.authorName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>

                {isAuthor && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/edit-blog/${id}`)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteBlog}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center gap-2 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* Stats and Like Button */}
              <div className="flex items-center gap-6 mb-8">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isLiked
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="font-semibold">{blog.likes?.length || 0}</span>
                </button>
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-5 h-5" />
                  <span>{blog.comments?.length || 0} comments</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Eye className="w-5 h-5" />
                  <span>{blog.views || 0} views</span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="prose prose-invert max-w-none">
                <div className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="mt-8 bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Comments ({blog.comments?.length || 0})
            </h2>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all resize-none mb-4"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Send className="w-5 h-5" />
                Post Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {blog.comments && blog.comments.length > 0 ? (
                blog.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-[#2a2a2a] rounded-lg p-4 border border-gray-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white">{comment.userName}</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-300">{comment.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetail;
