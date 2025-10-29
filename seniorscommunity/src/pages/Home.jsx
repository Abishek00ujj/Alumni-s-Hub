import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { 
  Loader2Icon, 
  Search, 
  X, 
  MessageCircle, 
  TrendingUp,
  Users,
  BookOpen,
  Heart,
  Eye,
  ChevronDown,
  Home as HomeIcon,
  UserCircle,
  Activity,
  MessageSquare,
  ThumbsUp,
  Share2,
  Github,
  Linkedin,
  Code,
  Mail
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState('');
  const [batch, setBatch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('feed');
  const [stats, setStats] = useState({ connections: 0, views: 0, posts: 0 });
  const [activities, setActivities] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [usersWithGitData, setUsersWithGitData] = useState({});
  
  const storedUserDetails = JSON.parse(localStorage.getItem("data"));
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAllData();
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`https://alumni-s-hub.onrender.com/api/v1/chats/unread/${storedUserDetails.Email}`);
      if (response.data.success) {
        setUnreadCount(response.data.data.totalUnread);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchBlogs(), fetchActivities(), fetchStats()]);
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
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchGitHubData = async (githubUsername) => {
    if (!githubUsername) return null;
    try {
      const response = await axios.get(`https://api.github.com/users/${githubUsername}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error);
      return null;
    }
  };

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('https://alumni-s-hub.onrender.com/api/v1/blogs', {
        params: { limit: 5 }
      });
      if (response.data.success) {
        setBlogs(response.data.data);
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
      }
    ];
    setActivities(mockActivities);
  };

  const fetchStats = async () => {
    setStats({ connections: 145, views: 523, posts: 12 });
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

  const handleStartChat = async (user) => {
    try {
      const response = await axios.post('https://alumni-s-hub.onrender.com/api/v1/chats/create', {
        user1: storedUserDetails.Email,
        user2: user.Email
      });
      
      if (response.data.success) {
        navigate('/chats');
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleViewProfile = async (user) => {
    try {
      // Fetch GitHub data if available
      let gitData = usersWithGitData[user.Email];
      
      if (!gitData && user.Github) {
        gitData = await fetchGitHubData(user.Github);
        setUsersWithGitData(prev => ({
          ...prev,
          [user.Email]: gitData
        }));
      }

      // Prepare data structure that Profilecard expects
      const profileData = {
        githubdata: gitData || {
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.Email}`,
          name: user.Name,
          bio: `${user.Department} Department - Class of 20${user.Year}`,
          blog: '',
          login: user.Github || user.Name.replace(/\s+/g, '')
        },
        userdata: {
          Github: user.Github || '',
          Leetcode: user.Leetcode || '',
          Linkedin: user.Linkedin || '',
          Followers: [],
          Following: []
        },
        acadamicdata: user,
        follow: false
      };

      navigate('/profilecard', { state: { data: profileData } });
    } catch (error) {
      console.error('Error preparing profile data:', error);
    }
  };

  // Enhanced User Card Component
  const EnhancedUserCard = ({ user }) => (
    <div className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 overflow-hidden hover:border-orange-400 transition-all duration-300 group'>
      <div className='h-24 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 relative'>
        <div className='absolute -bottom-12 left-1/2 transform -translate-x-1/2'>
          <div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-[#1a1a1a] shadow-xl'>
            {user.Name.charAt(0)}
          </div>
        </div>
      </div>

      <div className='pt-16 px-6 pb-6 text-center'>
        <h3 className='text-white font-bold text-xl mb-1 group-hover:text-orange-400 transition-colors'>
          {user.Name}
        </h3>
        
        <div className='flex items-center justify-center gap-2 text-gray-400 text-sm mb-3'>
          <span className='bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-semibold'>
            {user.Department}
          </span>
          <span className='bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-semibold'>
            20{user.Year}
          </span>
        </div>

        <div className='flex items-center justify-center gap-2 text-gray-500 text-xs mb-4'>
          <Mail className='w-3 h-3' />
          <span className='truncate'>{user.Email}</span>
        </div>

        {/* Social Links */}
        {(user.Github || user.Linkedin || user.Leetcode) && (
          <div className='flex items-center justify-center gap-2 mb-4'>
            {user.Github && (
              <a
                href={`https://github.com/${user.Github}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className='w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all'
              >
                <Github className='w-4 h-4 text-white' />
              </a>
            )}
            {user.Linkedin && (
              <a
                href={user.Linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className='w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-all'
              >
                <Linkedin className='w-4 h-4 text-white' />
              </a>
            )}
            {user.Leetcode && (
              <a
                href={`https://leetcode.com/u/${user.Leetcode}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className='w-8 h-8 bg-yellow-600 hover:bg-yellow-500 rounded-full flex items-center justify-center transition-all'
              >
                <Code className='w-4 h-4 text-white' />
              </a>
            )}
          </div>
        )}

        <div className='flex gap-2'>
          <button
            onClick={() => handleViewProfile(user)}
            className='flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2'
          >
            <UserCircle className='w-4 h-4' />
            Profile
          </button>
          <button
            onClick={() => handleStartChat(user)}
            className='px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-all'
          >
            <MessageCircle className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212]'>
          <Loader2Icon className='w-20 h-20 text-orange-400 animate-spin mb-4' />
          <p className='text-gray-400 text-lg'>Loading your network...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] pb-8'>
        {/* Top Navigation Bar */}
        <div className='sticky top-0 z-30 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-gray-800 shadow-lg'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
            <div className='flex items-center justify-between gap-4'>
              {/* Profile Icon */}
              <div className='relative' ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className='flex items-center gap-3 px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] rounded-xl transition-all border border-gray-800 hover:border-orange-400'
                >
                  <div className='w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold'>
                    {storedUserDetails?.Name?.charAt(0)}
                  </div>
                  <div className='hidden sm:block text-left'>
                    <div className='text-white font-semibold text-sm'>{storedUserDetails?.Name}</div>
                    <div className='text-gray-400 text-xs'>{storedUserDetails?.Department}</div>
                  </div>
                  <ChevronDown className='w-4 h-4 text-gray-400' />
                </button>

                {showProfileMenu && (
                  <div className='absolute left-0 top-full mt-2 w-64 bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50'>
                    <div className='p-2'>
                      <button
                        onClick={() => {
                          navigate('/userprofile');
                          setShowProfileMenu(false);
                        }}
                        className='w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2a2a2a] rounded-lg transition-all'
                      >
                        <UserCircle className='w-5 h-5 text-orange-400' />
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate('/blogs');
                          setShowProfileMenu(false);
                        }}
                        className='w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#2a2a2a] rounded-lg transition-all'
                      >
                        <BookOpen className='w-5 h-5 text-blue-400' />
                        My Blogs
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Bar */}
              <div className='flex-1 max-w-2xl'>
                <div className='relative'>
                  <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                  <input
                    type="text"
                    placeholder='Search students, posts, topics...'
                    className='w-full pl-12 pr-4 py-3 bg-[#2a2a2a] text-white rounded-xl border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all placeholder-gray-500'
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                  />
                </div>
              </div>

              {/* Message Icon */}
              <button
                onClick={() => navigate('/chats')}
                className='relative px-4 py-3 bg-[#2a2a2a] hover:bg-[#333333] rounded-xl transition-all border border-gray-800 hover:border-blue-400'
              >
                <MessageCircle className='w-6 h-6 text-blue-400' />
                {unreadCount > 0 && (
                  <span className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold'>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className='flex items-center gap-2 mt-4 overflow-x-auto pb-2'>
              <button
                onClick={() => setActiveTab('feed')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'feed'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333333]'
                }`}
              >
                <HomeIcon className='w-5 h-5' />
                Feed
              </button>
              <button
                onClick={() => setActiveTab('network')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'network'
                    ? 'bg-orange-500 text-white'
                    : 'bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333333]'
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
                className='flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap bg-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#333333]'
              >
                <BookOpen className='w-5 h-5' />
                Blogs
              </button>
            </div>

            {/* Filters for Network Tab */}
            {activeTab === 'network' && (
              <div className='flex flex-wrap gap-3 items-center mt-4'>
                <select
                  className='px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 text-sm'
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
                  className='px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-gray-700 focus:border-orange-400 text-sm'
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                >
                  <option value="">All Departments</option>
                  <option value="IT">IT</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="DS">Data Science</option>
                  <option value="ML">Machine Learning</option>
                </select>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className='flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-400 rounded-lg border border-orange-400/30 text-sm'
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

        {/* Main Content */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          {activeTab === 'network' && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filterData.length === 0 ? (
                <div className='col-span-full text-center py-20'>
                  <Users className='w-20 h-20 text-gray-600 mx-auto mb-4' />
                  <h3 className='text-2xl font-bold text-white mb-2'>No students found</h3>
                  <p className='text-gray-400'>Try adjusting your search filters</p>
                </div>
              ) : (
                filterData.map((item) => (
                  <EnhancedUserCard key={item.Email} user={item} />
                ))
              )}
            </div>
          )}

          {activeTab === 'feed' && (
            <div className='space-y-4'>
              {activities.map((activity) => (
                <div key={activity.id} className='bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6'>
                  <div className='flex items-start gap-4'>
                    <img src={activity.avatar} alt={activity.user} className='w-12 h-12 rounded-full' />
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-2'>
                        <span className='text-white font-semibold'>{activity.user}</span>
                        <span className='text-gray-400 text-sm'>{activity.action}</span>
                      </div>
                      <div className='flex items-center gap-6 mt-4 text-gray-400'>
                        <button className='flex items-center gap-2 hover:text-orange-400 text-sm'>
                          <ThumbsUp className='w-4 h-4' />
                          Like
                        </button>
                        <button className='flex items-center gap-2 hover:text-blue-400 text-sm'>
                          <MessageSquare className='w-4 h-4' />
                          Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
