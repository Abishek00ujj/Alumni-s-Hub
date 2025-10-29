import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Loader2Icon, 
  Search, 
  X, 
  MessageCircle, 
  UserPlus, 
  TrendingUp,
  Users,
  BookOpen,
  Send,
  Filter,
  Star,
  Heart,
  Eye,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Code,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  Bell,
  Settings,
  LogOut,
  Home as HomeIcon,
  UserCircle,
  Zap,
  Target,
  Activity
} from 'lucide-react';
import StudCard from '../components/StudCard';

const Home = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [suggestedConnections, setSuggestedConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const [batch, setBatch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feed'); // 'feed', 'network', 'messages', 'blogs'
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [stats, setStats] = useState({
    connections: 0,
    views: 0,
    posts: 0
  });
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState([]);
  
  const storedUserDetails = JSON.parse(localStorage.getItem("data"));
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));
  const messagesEndRef = useRef(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchBlogs(),
        fetchActivities(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://alumni-s-hub.onrender.com/api/v1/GetUser');
      if (response.data) {
        const allUsers = response.data.data;
        setUsers(allUsers);
        
        // Filter suggested connections (users not followed and not self)
        const suggestions = allUsers
          .filter(user => user.Email !== storedUserDetails.Email)
          .slice(0, 5);
        setSuggestedConnections(suggestions);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://alumni-s-hub.onrender.com/api/v1/blogs', {
        params: { limit: 5 }
      });
      if (response.data.success) {
        setBlogs(response.data.data);
        
        // Extract trending topics from blog tags
        const tags = response.data.data
          .flatMap(blog => blog.tags || [])
          .reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
          }, {});
        
        const trending = Object.entries(tags)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([tag, count]) => ({ tag, count }));
        
        setTrendingTopics(trending);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  const fetchActivities = async () => {
    // Mock activities - in production, fetch from backend
    const mockActivities = [
      {
        id: 1,
        type: 'blog',
        user: 'Rajesh Kumar',
        action: 'published a new blog',
        title: 'Understanding React Hooks',
        time: '2 hours ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
      },
      {
        id: 2,
        type: 'connection',
        user: 'Priya Sharma',
        action: 'started following',
        title: 'John Doe',
        time: '5 hours ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
      },
      {
        id: 3,
        type: 'achievement',
        user: 'Amit Patel',
        action: 'earned a badge',
        title: '100 Day Streak',
        time: '1 day ago',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
      }
    ];
    setActivities(mockActivities);
  };

  const fetchStats = async () => {
    // Mock stats - in production, fetch from backend
    setStats({
      connections: 145,
      views: 523,
      posts: 12
    });
  };

  const filterData = users.filter((item) => (
    item.Name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (item.Email !== storedUserDetails.Email) &&
    (batch === '' || item.Department === batch) &&
    (year === '' || item.Year === year)
  ));

  const clearFilters = () => {
    setSearchQuery('');
    setYear('');
    setBatch('');
  };

  const hasActiveFilters = searchQuery || year || batch;

  const handleSendMessage = (user) => {
    setSelectedUser(user);
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    if (messageText.trim()) {
      // In production, send message to backend
      console.log('Sending message to:', selectedUser.Name, messageText);
      
      // Add to conversations
      const newMessage = {
        id: Date.now(),
        from: storedUserDetails.Email,
        to: selectedUser.Email,
        text: messageText,
        timestamp: new Date(),
        read: false
      };
      
      setConversations([...conversations, newMessage]);
      setMessageText('');
      setShowMessageModal(false);
      
      // Show success notification
      alert(`Message sent to ${selectedUser.Name}`);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading Screen
  if (loading) {
    return (
      <>
        <Navbar />
        <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212]'>
          <div className='relative mb-4'>
            <div className='w-20 h-20 border-4 border-orange-400 border-t-transparent rounded-full animate-spin'></div>
            <Loader2Icon className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-400 w-10 h-10' />
          </div>
          <p className='text-gray-400 text-lg'>Loading your feed...</p>
        </div>
      </>
    );
  }

  // Message Modal Component
  const MessageModal = () => (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <div className='bg-[#1a1a1a] rounded-2xl border border-gray-800 max-w-lg w-full p-6'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg'>
              {selectedUser?.Name?.charAt(0)}
            </div>
            <div>
              <h3 className='text-white font-semibold text-lg'>{selectedUser?.Name}</h3>
              <p className='text-gray-400 text-sm'>{selectedUser?.Department} - {selectedUser?.Year}</p>
            </div>
          </div>
          <button
            onClick={() => setShowMessageModal(false)}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder='Type your message...'
          className='w-full h-32 px-4 py-3 bg-[#2a2a2a] text-white rounded-xl border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all resize-none mb-4'
        />

        <div className='flex gap-3'>
          <button
            onClick={() => setShowMessageModal(false)}
            className='flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-all font-semibold'
          >
            Cancel
          </button>
          <button
            onClick={sendMessage}
            disabled={!messageText.trim()}
            className='flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <Send className='w-5 h-5' />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );

  // Stats Card Component
  const StatsCard = () => (
    <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6 mb-6'>
      <div className='flex items-center gap-4 mb-6'>
        <div className='w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl'>
          {storedUserDetails?.Name?.charAt(0)}
        </div>
        <div>
          <h3 className='text-white font-bold text-xl'>{storedUserDetails?.Name}</h3>
          <p className='text-gray-400 text-sm'>{storedUserDetails?.Department} - {storedUserDetails?.Year}</p>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <div className='text-center'>
          <div className='text-2xl font-bold text-orange-400'>{stats.connections}</div>
          <div className='text-gray-400 text-xs'>Connections</div>
        </div>
        <div className='text-center border-x border-gray-800'>
          <div className='text-2xl font-bold text-blue-400'>{stats.views}</div>
          <div className='text-gray-400 text-xs'>Profile Views</div>
        </div>
        <div className='text-center'>
          <div className='text-2xl font-bold text-green-400'>{stats.posts}</div>
          <div className='text-gray-400 text-xs'>Posts</div>
        </div>
      </div>

      <button
        onClick={() => navigate('/userprofile')}
        className='w-full mt-6 px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl transition-all font-semibold border border-orange-500/30'
      >
        View My Profile
      </button>
    </div>
  );

  // Suggested Connections Component
  const SuggestedConnections = () => (
    <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6 mb-6'>
      <h3 className='text-white font-bold text-lg mb-4 flex items-center gap-2'>
        <UserPlus className='w-5 h-5 text-orange-400' />
        People You May Know
      </h3>

      <div className='space-y-4'>
        {suggestedConnections.map((user, index) => (
          <div key={user.Email} className='flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-xl hover:bg-[#333333] transition-all'>
            <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold'>
              {user.Name.charAt(0)}
            </div>
            <div className='flex-1 min-w-0'>
              <h4 className='text-white font-semibold text-sm truncate'>{user.Name}</h4>
              <p className='text-gray-400 text-xs'>{user.Department}</p>
            </div>
            <button
              onClick={() => navigate('/profilecard', { state: { data: user } })}
              className='px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-all'
            >
              View
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setActiveTab('network')}
        className='w-full mt-4 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors'
      >
        Show more →
      </button>
    </div>
  );

  // Trending Topics Component
  const TrendingTopics = () => (
    <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6 mb-6'>
      <h3 className='text-white font-bold text-lg mb-4 flex items-center gap-2'>
        <TrendingUp className='w-5 h-5 text-orange-400' />
        Trending Topics
      </h3>

      <div className='space-y-3'>
        {trendingTopics.map((topic, index) => (
          <div key={index} className='flex items-center justify-between p-3 bg-[#2a2a2a] rounded-xl hover:bg-[#333333] transition-all cursor-pointer'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-sm'>
                {index + 1}
              </div>
              <span className='text-white text-sm font-medium'>#{topic.tag}</span>
            </div>
            <span className='text-gray-400 text-xs'>{topic.count} posts</span>
          </div>
        ))}
      </div>
    </div>
  );

  // Latest Blogs Component
  const LatestBlogs = () => (
    <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6'>
      <h3 className='text-white font-bold text-lg mb-4 flex items-center gap-2'>
        <BookOpen className='w-5 h-5 text-orange-400' />
        Latest From Network
      </h3>

      <div className='space-y-4'>
        {blogs.slice(0, 3).map((blog) => (
          <div
            key={blog._id}
            onClick={() => navigate(`/blog/${blog._id}`)}
            className='p-4 bg-[#2a2a2a] rounded-xl hover:bg-[#333333] transition-all cursor-pointer border border-gray-800 hover:border-orange-400'
          >
            <h4 className='text-white font-semibold text-sm mb-2 line-clamp-2'>{blog.title}</h4>
            <p className='text-gray-400 text-xs mb-3 line-clamp-2'>{blog.excerpt}</p>
            <div className='flex items-center justify-between text-xs text-gray-500'>
              <span className='flex items-center gap-1'>
                <Heart className='w-3 h-3' />
                {blog.likes?.length || 0}
              </span>
              <span className='flex items-center gap-1'>
                <MessageCircle className='w-3 h-3' />
                {blog.comments?.length || 0}
              </span>
              <span className='flex items-center gap-1'>
                <Eye className='w-3 h-3' />
                {blog.views || 0}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/blogs')}
        className='w-full mt-4 text-orange-400 hover:text-orange-300 text-sm font-semibold transition-colors'
      >
        View all blogs →
      </button>
    </div>
  );

  // Activity Feed Component
  const ActivityFeed = () => (
    <div className='space-y-4'>
      {activities.map((activity) => (
        <div key={activity.id} className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6'>
          <div className='flex items-start gap-4'>
            <img
              src={activity.avatar}
              alt={activity.user}
              className='w-12 h-12 rounded-full'
            />
            <div className='flex-1'>
              <div className='flex items-center gap-2 mb-2'>
                <span className='text-white font-semibold'>{activity.user}</span>
                <span className='text-gray-400 text-sm'>{activity.action}</span>
                <span className='text-orange-400 font-medium'>{activity.title}</span>
              </div>
              <p className='text-gray-500 text-xs mb-4'>{activity.time}</p>
              
              {activity.type === 'blog' && (
                <div className='bg-[#2a2a2a] rounded-xl p-4 border border-gray-800'>
                  <p className='text-gray-400 text-sm'>Check out this amazing post about modern web development...</p>
                </div>
              )}

              <div className='flex items-center gap-6 mt-4 text-gray-400'>
                <button className='flex items-center gap-2 hover:text-orange-400 transition-colors text-sm'>
                  <ThumbsUp className='w-4 h-4' />
                  Like
                </button>
                <button className='flex items-center gap-2 hover:text-blue-400 transition-colors text-sm'>
                  <MessageCircle className='w-4 h-4' />
                  Comment
                </button>
                <button className='flex items-center gap-2 hover:text-green-400 transition-colors text-sm'>
                  <Share2 className='w-4 h-4' />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Network Tab Component
  const NetworkTab = () => (
    <div className='space-y-6'>
      <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6'>
        <h2 className='text-2xl font-bold text-white mb-6 flex items-center gap-3'>
          <Users className='w-7 h-7 text-orange-400' />
          Your Network
        </h2>

        {filterData.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20'>
            <Users className='w-20 h-20 text-gray-600 mb-4' />
            <h3 className='text-2xl font-bold text-gray-300 mb-2'>No connections found</h3>
            <p className='text-gray-500'>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filterData.map((item) => (
              <StudCard key={item.Email} props={item} onMessage={handleSendMessage} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      
      <div className='min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] pb-8'>
        {/* Enhanced Header with Search and Navigation */}
        <div className='sticky top-0 z-20 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-gray-800 shadow-lg'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            {/* Search Bar */}
            <div className='mb-4'>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type="text"
                  placeholder='Search students, posts, topics...'
                  className='w-full pl-12 pr-4 py-3 bg-[#2a2a2a] text-white rounded-xl border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all duration-300 placeholder-gray-500'
                  onChange={(e) => setSearchQuery(e.target.value)}
                  value={searchQuery}
                />
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className='flex items-center gap-2 overflow-x-auto pb-2'>
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'feed'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                }`}
              >
                <HomeIcon className='w-5 h-5' />
                Feed
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'network'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                }`}
              >
                <Users className='w-5 h-5' />
                Network
                <span className='bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full'>
                  {filterData.length}
                </span>
              </button>
              <button
                onClick={() => navigate('/blogs')}
                className='flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all bg-[#2a2a2a] text-gray-400 hover:text-white'
              >
                <BookOpen className='w-5 h-5' />
                Blogs
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'messages'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                }`}
              >
                <MessageCircle className='w-5 h-5' />
                Messages
                {conversations.length > 0 && (
                  <span className='bg-red-500 text-white text-xs px-2 py-0.5 rounded-full'>
                    {conversations.length}
                  </span>
                )}
              </button>
            </div>

            {/* Filter Controls */}
            {activeTab === 'network' && (
              <div className='flex flex-wrap gap-3 items-center mt-4'>
                <select
                  className='px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all cursor-pointer hover:bg-[#333333] text-sm'
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="">All Years</option>
                  <option value="20">2020</option>
                  <option value="21">2021</option>
                  <option value="22">2022</option>
                  <option value="23">2023</option>
                  <option value="24">2024</option>
                </select>

                <select
                  className='px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all cursor-pointer hover:bg-[#333333] text-sm'
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="DS">Data Science</option>
                  <option value="ECE">ECE</option>
                  <option value="CYS">Cyber Security</option>
                  <option value="ML">ML</option>
                  <option value="CSE">CSE</option>
                  <option value="AGRI">Agriculture</option>
                  <option value="BME">BME</option>
                  <option value="BT">Biotech</option>
                  <option value="CIVIL">Civil</option>
                  <option value="EEE">EEE</option>
                  <option value="FT">Food Tech</option>
                  <option value="MECH">Mechanical</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className='flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-400/30 hover:bg-orange-500/20 transition-all text-sm'
                  >
                    <X className='w-4 h-4' />
                    Clear
                  </button>
                )}

                <div className='ml-auto text-gray-400 text-sm'>
                  {filterData.length} found
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
            {/* Left Sidebar */}
            <div className='lg:col-span-3 space-y-6'>
              <StatsCard />
              <SuggestedConnections />
              <TrendingTopics />
            </div>

            {/* Main Content */}
            <div className='lg:col-span-6'>
              {/* Create Post Card */}
              {activeTab === 'feed' && (
                <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6 mb-6'>
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl'>
                      {storedUserDetails?.Name?.charAt(0)}
                    </div>
                    <button
                      onClick={() => navigate('/create-blog')}
                      className='flex-1 px-4 py-3 bg-[#2a2a2a] hover:bg-[#333333] text-gray-400 text-left rounded-xl transition-all border border-gray-700'
                    >
                      Share your thoughts...
                    </button>
                  </div>
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => navigate('/create-blog')}
                      className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-xl transition-all font-semibold'
                    >
                      <BookOpen className='w-5 h-5' />
                      Write Blog
                    </button>
                    <button className='flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-xl transition-all font-semibold'>
                      <Activity className='w-5 h-5' />
                      Share Update
                    </button>
                  </div>
                </div>
              )}

              {/* Content based on active tab */}
              {activeTab === 'feed' && <ActivityFeed />}
              {activeTab === 'network' && <NetworkTab />}
              {activeTab === 'messages' && (
                <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6'>
                  <h2 className='text-2xl font-bold text-white mb-6'>Messages</h2>
                  {conversations.length === 0 ? (
                    <div className='text-center py-20'>
                      <MessageCircle className='w-20 h-20 text-gray-600 mx-auto mb-4' />
                      <p className='text-gray-400'>No messages yet</p>
                      <p className='text-gray-500 text-sm mt-2'>Start connecting with your network</p>
                    </div>
                  ) : (
                    <div className='space-y-4'>
                      {conversations.map((conv) => (
                        <div key={conv.id} className='p-4 bg-[#2a2a2a] rounded-xl'>
                          <p className='text-white'>{conv.text}</p>
                          <p className='text-gray-500 text-xs mt-2'>
                            {new Date(conv.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className='lg:col-span-3'>
              <LatestBlogs />
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && <MessageModal />}
    </>
  );
};

export default Home;
