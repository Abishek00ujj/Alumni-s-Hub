import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { 
  Loader2, 
  Linkedin, 
  Github, 
  Code, 
  Mail, 
  UsersRound,
  Share2,
  Download,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Heart,
  MessageCircle,
  Eye,
  PenSquare
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import {
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import FollowersPage from './FollowersPage';
import FollowingPage from './Followingpage';

const shareUrl = window.location.href;

const UserProfile = () => {
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  
  const [userData, setUserData] = useState(null);
  const [gitData, setGitData] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [follower, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [activeView, setActiveView] = useState('profile'); // 'profile', 'followers', 'following'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGitHubData = async (githubUsername) => {
    if (!githubUsername) return;
    try {
      const res = await axios.get(`https://api.github.com/users/${githubUsername}`);
      if (res.status === 200) {
        setGitData(res.data);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error.message);
      // Don't set error - allow component to render without GitHub data
    }
  };

  const fetchUserBlogs = async (userId) => {
    if (!userId) return;
    try {
      const response = await axios.get(`https://alumni-s-hub.onrender.com/api/v1/blogs/user/${userId}`);
      if (response.data.success) {
        setUserBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const storedUserDetails = JSON.parse(localStorage.getItem("data"));
        setUserDetails(storedUserDetails);

        const completeUser = JSON.parse(localStorage.getItem("completeUser"));
        const basicUserData = JSON.parse(localStorage.getItem("userData"));
        
        const currentUserData = completeUser?.data || basicUserData;
        
        if (currentUserData) {
          setUserData(currentUserData);
          await fetchGitHubData(currentUserData.Github);
        }

        if (completeUser?.data?.id) {
          const response = await axios.post('https://alumni-s-hub.onrender.com/api/v1/getData', { 
            id: completeUser.data.id 
          });
          
          if (response.status === 200) {
            setFollowers(response.data.data.Followers || []);
            setFollowing(response.data.data.Following || []);
          }

          // Fetch user's blog posts
          await fetchUserBlogs(completeUser.data.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError("Failed to load profile data. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const githubUrl = userData?.Github ? `https://github.com/${userData.Github}/` : "#";
  const leetcodeUrl = userData?.Leetcode ? `https://leetcode.com/u/${userData.Leetcode}/` : "#";
  const linkedinUrl = userData?.Linkedin || "#";

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Skeleton Loading Component
  const SkeletonCard = () => (
    <div className="w-full lg:w-[450px] xl:w-[500px] bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 p-6 space-y-6 animate-pulse">
      <div className="bg-gradient-to-r from-gray-700 to-gray-600 h-24 -m-6 rounded-t-2xl"></div>
      <div className="flex justify-center -mt-12">
        <div className="w-32 h-32 bg-gray-700 rounded-full border-4 border-[#1a1a1a]"></div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-700 rounded w-3/4 mx-auto"></div>
        <div className="h-8 bg-gray-700 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3 mx-auto"></div>
      </div>
      <div className="flex space-x-4 justify-center pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="w-12 h-12 bg-gray-700 rounded-full"></div>
        ))}
      </div>
    </div>
  );

  const StatsSkeleton = () => (
    <div className="w-full space-y-6 animate-pulse">
      <div className="h-8 bg-gray-700 rounded w-64 mx-auto"></div>
      <div className="h-64 bg-gray-700 rounded-lg"></div>
      <div className="h-48 bg-gray-700 rounded-lg"></div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center p-4">
      <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 max-w-md text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-all duration-300"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (error && !loading) {
    return (
      <>
        <Navbar />
        <ErrorState />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="flex justify-center lg:justify-end">
                <SkeletonCard />
              </div>
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-2xl">
                  <StatsSkeleton />
                </div>
              </div>
            </div>
          ) : (
            <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left Side - Profile Card */}
              <div className="flex justify-center lg:justify-end lg:sticky lg:top-8">
                <div className="w-full max-w-md">
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-24"></div>
                    
                    <div className="p-6 -mt-16 relative">
                      {/* Avatar */}
                      <div className="flex justify-center mb-4">
                        {gitData?.avatar_url ? (
                          <img
                            src={gitData.avatar_url}
                            className="w-32 h-32 rounded-full border-4 border-[#1a1a1a] shadow-xl object-cover"
                            alt={`${gitData.login || 'User'}'s avatar`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/128?text=No+Image';
                            }}
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full border-4 border-[#1a1a1a] shadow-xl bg-gray-700 flex items-center justify-center text-4xl text-gray-400">
                            👤
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="text-center space-y-3">
                        <h1 className="text-2xl font-bold text-white">
                          {userDetails?.Name || "User"}
                        </h1>
                        
                        {userDetails?.Year && userDetails?.Department && (
                          <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full border border-orange-500/30">
                            <span className="font-semibold">
                              {userDetails.Year} - {userDetails.Department}
                            </span>
                            <span>🎓</span>
                          </div>
                        )}

                        {gitData?.name && (
                          <p className="text-gray-300 font-medium">{gitData.name}</p>
                        )}
                        
                        {gitData?.bio && (
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {gitData.bio}
                          </p>
                        )}

                        {gitData?.blog && (
                          <a 
                            href={gitData.blog} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {gitData.blog}
                          </a>
                        )}

                        {/* Followers/Following Stats */}
                        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-700">
                          <button
                            onClick={() => setActiveView('followers')}
                            className="flex items-center gap-2 hover:text-orange-400 transition-colors group"
                          >
                            <UsersRound className="w-5 h-5" />
                            <span className="font-semibold">{follower?.length || 0}</span>
                            <span className="text-gray-400 group-hover:text-orange-400">
                              followers
                            </span>
                          </button>
                          <span className="text-gray-600">•</span>
                          <button
                            onClick={() => setActiveView('following')}
                            className="flex items-center gap-2 hover:text-orange-400 transition-colors group"
                          >
                            <span className="font-semibold">{following?.length || 0}</span>
                            <span className="text-gray-400 group-hover:text-orange-400">
                              following
                            </span>
                          </button>
                        </div>

                        {/* Social Links */}
                        <div className="flex justify-center gap-3 pt-4">
                          {linkedinUrl !== "#" && (
                            <a 
                              href={linkedinUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                            >
                              <Linkedin className="w-6 h-6" color="#0077B5" />
                            </a>
                          )}
                          {githubUrl !== "#" && (
                            <a 
                              href={githubUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                            >
                              <Github className="w-6 h-6" color="#000000" />
                            </a>
                          )}
                          {leetcodeUrl !== "#" && (
                            <a 
                              href={leetcodeUrl} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                            >
                              <Code className="w-6 h-6" color="#FFA116" />
                            </a>
                          )}
                          {userDetails?.Email && (
                            <a 
                              href={`mailto:${userDetails.Email}`}
                              className="w-12 h-12 bg-white hover:bg-gray-100 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                            >
                              <Mail className="w-6 h-6" color="#EA4335" />
                            </a>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-6">
                          <button 
                            onClick={reactToPrintFn}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-orange-500/50"
                          >
                            <Download className="w-5 h-5" />
                            Export
                          </button>
                          <WhatsappShareButton 
                            url={shareUrl} 
                            title="Hey, I'm using Alumni Hub! Check out my profile and join us!"
                            className="flex-1"
                          >
                            <button className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 font-semibold shadow-lg hover:shadow-green-500/50">
                              <Share2 className="w-5 h-5" />
                              Share
                            </button>
                          </WhatsappShareButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Stats or Followers/Following */}
              <div className="flex justify-center lg:justify-start">
                {activeView === 'profile' && userData ? (
                  <div className="w-full max-w-2xl space-y-8">
                    {/* Blog Posts Section */}
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <BookOpen className="w-8 h-8 text-orange-400" />
                        My Blog Posts
                      </h2>
                      
                      {userBlogs.length > 0 ? (
                        <>
                          <div className="grid grid-cols-1 gap-4">
                            {userBlogs.slice(0, 3).map((blog) => (
                              <div
                                key={blog._id}
                                onClick={() => navigate(`/blog/${blog._id}`)}
                                className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-800 hover:border-orange-400 transition-all cursor-pointer group"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 flex-1">
                                    {blog.title}
                                  </h3>
                                  <PenSquare className="w-5 h-5 text-gray-500 group-hover:text-orange-400 transition-colors flex-shrink-0 ml-2" />
                                </div>
                                
                                {blog.excerpt && (
                                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                    {blog.excerpt}
                                  </p>
                                )}
                                
                                {blog.tags && blog.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {blog.tags.slice(0, 3).map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-800">
                                  <span>{formatDate(blog.createdAt)}</span>
                                  <div className="flex gap-4">
                                    <span className="flex items-center gap-1">
                                      <Heart className="w-4 h-4" />
                                      {blog.likes?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageCircle className="w-4 h-4" />
                                      {blog.comments?.length || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Eye className="w-4 h-4" />
                                      {blog.views || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {userBlogs.length > 3 && (
                            <button
                              onClick={() => navigate('/blogs')}
                              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all font-semibold"
                            >
                              View All {userBlogs.length} Blog Posts
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="bg-[#1a1a1a] rounded-xl p-8 border border-gray-800">
                          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 mb-4">No blog posts yet</p>
                          <button
                            onClick={() => navigate('/create-blog')}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all font-semibold flex items-center gap-2 mx-auto"
                          >
                            <PenSquare className="w-5 h-5" />
                            Write Your First Blog
                          </button>
                        </div>
                      )}
                    </div>

                    {/* LeetCode Stats */}
                    {userData?.Leetcode && (
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                          <Code className="w-8 h-8 text-orange-400" />
                          LeetCode Progress
                        </h2>
                        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 overflow-hidden">
                          <img
                            src={`https://leetcard.jacoblin.cool/${userData.Leetcode}?theme=dark&font=Nunito&ext=heatmap`}
                            alt="LeetCode stats"
                            className="w-full h-auto rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<p class="text-gray-400 py-8">LeetCode stats unavailable</p>';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* GitHub Stats */}
                    {userData?.Github && (
                      <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                          <Github className="w-8 h-8 text-orange-400" />
                          GitHub Activity
                        </h2>
                        
                        {/* Contribution Graph */}
                        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 overflow-x-auto">
                          <iframe
                            className="w-full min-w-[300px] h-auto border-0 rounded-lg"
                            src={`https://ghchart.rshah.org/${userData.Github}`}
                            title="GitHub Heatmap"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>

                        {/* GitHub Stats Cards Grid */}
                        <div className="grid grid-cols-1 gap-4">
                          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 flex justify-center">
                            <img
                              src={`https://streak-stats.demolab.com/?user=${userData.Github}&count_private=true&theme=react&border_radius=10`}
                              alt="GitHub streak stats"
                              className="max-w-full h-auto"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<p class="text-gray-400 py-8">Stats unavailable</p>';
                              }}
                            />
                          </div>

                          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 flex justify-center">
                            <img
                              src={`https://github-readme-stats.vercel.app/api?username=${userData.Github}&show_icons=true&theme=react&rank_icon=github&border_radius=10`}
                              alt="GitHub stats"
                              className="max-w-full h-auto"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<p class="text-gray-400 py-8">Stats unavailable</p>';
                              }}
                            />
                          </div>

                          <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 flex justify-center">
                            <img
                              src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${userData.Github}&hide=HTML&langs_count=8&layout=compact&theme=react&border_radius=10`}
                              alt="Top languages"
                              className="max-w-full h-auto"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<p class="text-gray-400 py-8">Stats unavailable</p>';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Fallback if no data */}
                    {!userData?.Leetcode && !userData?.Github && userBlogs.length === 0 && (
                      <div className="text-center py-20">
                        <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No content available yet</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full max-w-4xl">
                    {/* Back Button */}
                    <div className="mb-6">
                      <button
                        onClick={() => setActiveView('profile')}
                        className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-2 transition-colors"
                      >
                        ← Back to Profile
                      </button>
                    </div>

                    {activeView === 'followers' ? (
                      <FollowersPage props={follower} />
                    ) : (
                      <FollowingPage props={following} />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
