import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Search, 
  PenSquare, 
  Heart, 
  MessageCircle, 
  Eye,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const userDetails = JSON.parse(localStorage.getItem("data"));

  useEffect(() => {
    fetchBlogs();
  }, [page, selectedTag]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://alumni-s-hub.onrender.com/api/v1/blogs`, {
        params: { page, limit: 9, tags: selectedTag }
      });
      
      if (response.data.success) {
        setBlogs(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBlogs();
      return;
    }

    try {
      const response = await axios.get(`https://alumni-s-hub.onrender.com/api/v1/blogs/search`, {
        params: { q: searchQuery }
      });
      
      if (response.data.success) {
        setBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error searching blogs:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const SkeletonCard = () => (
    <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-700"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="flex gap-4 pt-4">
          <div className="h-8 bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
              <TrendingUp className="w-12 h-12 text-orange-400" />
              Alumni Blogs
            </h1>
            <p className="text-gray-400 text-lg">Share your knowledge and experiences</p>
          </div>

          {/* Search and Create Section */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 mb-8 border border-gray-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search blogs by title, content, or tags..."
                  className="w-full pl-12 pr-4 py-3 bg-[#2a2a2a] text-white rounded-xl border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all font-semibold"
              >
                Search
              </button>
              <button
                onClick={() => navigate('/create-blog')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl transition-all font-semibold flex items-center gap-2"
              >
                <PenSquare className="w-5 h-5" />
                Write Blog
              </button>
            </div>
          </div>

          {/* Blog Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20">
              <PenSquare className="w-20 h-20 text-gray-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-300 mb-2">No blogs found</h3>
              <p className="text-gray-500 mb-6">Be the first to share your story!</p>
              <button
                onClick={() => navigate('/create-blog')}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all font-semibold"
              >
                Create Your First Blog
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden hover:border-orange-400 transition-all duration-300 cursor-pointer group"
                    onClick={() => navigate(`/blog/${blog._id}`)}
                  >
                    {/* Cover Image */}
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                        <PenSquare className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    <div className="p-6">
                      {/* Tags */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-orange-400 transition-colors">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {blog.excerpt || blog.content.substring(0, 150) + '...'}
                      </p>

                      {/* Author and Date */}
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b border-gray-800">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{blog.authorName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{blog.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{blog.comments?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span>{blog.views || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.total > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-[#2a2a2a] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333333] transition-all"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg">
                    Page {page} of {pagination.total}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.total}
                    className="px-4 py-2 bg-[#2a2a2a] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#333333] transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogList;
