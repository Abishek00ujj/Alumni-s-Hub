import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Save, 
  X, 
  Image as ImageIcon,
  Tag,
  AlertCircle
} from 'lucide-react';

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    coverImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const userDetails = JSON.parse(localStorage.getItem("data"));
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      setLoading(false);
      return;
    }

    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        authorId: completeUser?.data?.id || userDetails?.id,
        authorName: userDetails?.Name,
        authorEmail: userDetails?.Email
      };

      const response = await axios.post('https://alumni-s-hub.onrender.com/api/v1/blogs', blogData);

      if (response.data.success) {
        navigate(`/blog/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      setError(error.response?.data?.message || 'Failed to create blog post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Create New Blog Post</h1>
            <p className="text-gray-400">Share your knowledge with the alumni community</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Image URL */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <ImageIcon className="w-5 h-5 text-orange-400" />
                Cover Image URL (Optional)
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all"
              />
              {formData.coverImage && (
                <div className="mt-4">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <label className="block text-white font-semibold mb-3">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your blog title..."
                required
                maxLength={200}
                className="w-full px-4 py-3 bg-[#2a2a2a] text-white text-xl rounded-lg border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all"
              />
              <p className="text-gray-500 text-sm mt-2">{formData.title.length}/200 characters</p>
            </div>

            {/* Content */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <label className="block text-white font-semibold mb-3">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your blog content here... (Markdown supported)"
                required
                rows={15}
                className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all resize-none"
              />
              <p className="text-gray-500 text-sm mt-2">{formData.content.length} characters</p>
            </div>

            {/* Excerpt */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <label className="block text-white font-semibold mb-3">
                Excerpt (Optional)
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Short description of your blog post..."
                rows={3}
                maxLength={300}
                className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all resize-none"
              />
              <p className="text-gray-500 text-sm mt-2">{formData.excerpt.length}/300 characters</p>
            </div>

            {/* Tags */}
            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
              <label className="flex items-center gap-2 text-white font-semibold mb-3">
                <Tag className="w-5 h-5 text-orange-400" />
                Tags (Optional)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="programming, web development, react (comma separated)"
                className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all"
              />
              <p className="text-gray-500 text-sm mt-2">Separate tags with commas</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Publish Blog
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold flex items-center gap-2 transition-all"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateBlog;
