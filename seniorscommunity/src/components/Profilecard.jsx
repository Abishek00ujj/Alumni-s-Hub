import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
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
  Calendar,
  User,
  PenSquare,
  TrendingUp
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import {
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import FollowersPage from './FollowersPage';
import FollowingPage from './Followingpage';
import { Loader2Icon } from 'lucide-react';

const shareUrl = window.location.href;

const Profilecard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = location.state || {};
  
  const [follower, setFollowers] = useState([]);
  const [load, setLoad] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followerCount, setfollowerCount] = useState(0);
  const [followingCount, setfollowingCount] = useState(0);
  const [isFollow, setFollow] = useState(data?.follow || false);
  const [followChange, setfollowChange] = useState(false);
  const [followerChange, setfollowerChange] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);
  const [activeView, setActiveView] = useState('profile'); // 'profile', 'followers', 'following'
  const [loading, setLoading] = useState(true);

  const contentRef = useRef(null);
  const completeUser = JSON.parse(localStorage.getItem("completeUser"));
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handleChangeFollow = () => {
    setfollowChange(!followChange);
    setfollowerChange(false);
  };

  const handleChangeFollower = () => {
    setfollowerChange(!followerChange);
    setfollowChange(false);
  };

  const handleFollow = async () => {
    setLoad(true);
    try {
      const response = await axios.put('https://alumni-s-hub.onrender.com/api/v1/follow', {
        userId: completeUser.data.id,
        followerId: data.acadamicdata.Email,
      });
      if (response.status === 200) {
        setFollow(true);
        setfollowerCount(followerCount + 1);
      }
    } catch (error) {
      console.error('Error following user:', error.message);
    } finally {
      setLoad(false);
    }
  };

  const handleUnFollow = async () => {
    setLoad(true);
    try {
      const response = await axios.put('https://alumni-s-hub.onrender.com/api/v1/unfollow', {
        userId: completeUser.data.id,
        followerId: data.acadamicdata.Email,
      });
      if (response.status === 200) {
        setFollow(false);
        setfollowerCount(followerCount - 1);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error.message);
    } finally {
      setLoad(false);
    }
  };

  const fetchUserBlogs = async () => {
    try {
      // Using email as user identifier since that's what's available
      const response = await axios.get(`https://alumni-s-hub.onrender.com/api/v1/blogs/user/${data.acadamicdata.Email}`);
      if (response.data.success) {
        setUserBlogs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data) {
      setFollowers(data.userdata.Followers || []);
      setFollowing(data.userdata.Following || []);
      fetchUserBlogs();
    }
  }, [data]);

  useEffect(() => {
    setfollowerCount(follower.length);
    setfollowingCount(following.length);
  }, [follower, following]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const githubUrl = data ? `https://github.com/${data.userdata.Github}/` : "#";
  const leetcodeUrl = data ? `https://leetcode.com/u/${data.userdata.Leetcode}/` : "#";
  const linkedinUrl = data?.userdata.Linkedin || "#";

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">No profile data found</h2>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
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
                      {data?.githubdata?.avatar_url ? (
                        <img
                          src={data.githubdata.avatar_url}
                          className="w-32 h-32 rounded-full border-4 border-[#1a1a1a] shadow-xl object-cover"
                          alt={`${data.githubdata.login}'s avatar`}
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
                        {data.acadamicdata?.Name || "User"}
                      </h1>
                      
                      <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full border border-orange-500/30">
                        <span className="font-semibold">
                          {data.acadamicdata?.Year} - {data.acadamicdata?.Department}
                        </span>
                        <span>🎓</span>
                      </div>

                      {data.githubdata?.name && (
                        <p className="text-gray-300 font-medium">{data.githubdata.name}</p>
                      )}
                      
                      {data.githubdata?.bio && (
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {data.githubdata.bio}
                        </p>
                      )}

                      {data.githubdata?.blog && (
                        <a 
                          href={data.githubdata.blog} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {data.githubdata.blog}
                        </a>
                      )}

                      {/* Follow/Unfollow Button */}
                      {completeUser.data.id !== data?.acadamicdata?.Email && (
                        <div className="pt-4">
                          {!isFollow ? (
                            <button
                              disabled={load}
                              className={`w-full rounded-lg py-3 text-white font-semibold transition-all ${
                                load ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                              onClick={handleFollow}
                            >
                              {load ? (
                                <div className='flex justify-center items-center gap-2'>
                                  <Loader2Icon className="animate-spin w-5 h-5" />
                                  Following...
                                </div>
                              ) : (
                                'Follow'
                              )}
                            </button>
                          ) : (
                            <button
                              disabled={load}
                              className={`w-full rounded-lg py-3 text-white font-semibold transition-all ${
                                load ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-700 hover:bg-gray-600'
                              }`}
                              onClick={handleUnFollow}
                            >
                              {load ? (
                                <div className='flex justify-center items-center gap-2'>
                                  <Loader2Icon className="animate-spin w-5 h-5" />
                                  Unfollowing...
                                </div>
                              ) : (
                                'Following'
                              )}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Followers/Following Stats */}
                      <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-700">
                        <button
                          onClick={() => setActiveView('followers')}
                          className="flex items-center gap-2 hover:text-orange-400 transition-colors group"
                        >
                          <UsersRound className="w-5 h-5" />
                          <span className="font-semibold">{followerCount}</span>
                          <span className="text-gray-400 group-hover:text-orange-400">
                            followers
                          </span>
                        </button>
                        <span className="text-gray-600">•</span>
                        <button
                          onClick={() => setActiveView('following')}
                          className="flex items-center gap-2 hover:text-orange-400 transition-colors group"
                        >
                          <span className="font-semibold">{followingCount}</span>
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
                        {data.acadamicdata?.Email && (
                          <a 
                            href={`mailto:${data.acadamicdata.Email}`}
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
                          title={`Check out ${data.acadamicdata?.Name}'s profile on Alumni Hub!`}
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

            {/* Right Side - Content Feed */}
            <div className="flex justify-center lg:justify-start">
              {activeView === 'profile' ? (
                <div className="w-full max-w-2xl space-y-8">
                  {/* Instagram-Style Blog Feed */}
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                      <TrendingUp className="w-8 h-8 text-orange-400" />
                      Posts & Activities
                    </h2>
                    
                    {loading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-3"></div>
                            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                          </div>
                        ))}
                      </div>
                    ) : userBlogs.length > 0 ? (
                      <>
                        {/* Instagram-style Feed Grid */}
                        <div className="space-y-6">
                          {userBlogs.map((blog) => (
                            <div
                              key={blog._id}
                              className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden hover:border-orange-400 transition-all duration-300 cursor-pointer group"
                              onClick={() => navigate(`/blog/${blog._id}`)}
                            >
                              {/* Post Header */}
                              <div className="p-4 flex items-center gap-3 border-b border-gray-800">
                                <img
                                  src={data.githubdata?.avatar_url || 'https://via.placeholder.com/40'}
                                  alt={data.acadamicdata?.Name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="text-white font-semibold text-sm">
                                    {data.acadamicdata?.Name}
                                  </h4>
                                  <p className="text-gray-500 text-xs">
                                    {formatDate(blog.createdAt)}
                                  </p>
                                </div>
                              </div>

                              {/* Cover Image */}
                              {blog.coverImage ? (
                                <img
                                  src={blog.coverImage}
                                  alt={blog.title}
                                  className="w-full h-64 object-cover"
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              ) : (
                                <div className="w-full h-64 bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                                  <BookOpen className="w-16 h-16 text-white opacity-50" />
                                </div>
                              )}

                              {/* Post Content */}
                              <div className="p-4">
                                {/* Interaction Buttons */}
                                <div className="flex items-center gap-4 mb-3">
                                  <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart className="w-5 h-5" />
                                    <span className="text-sm font-semibold">
                                      {blog.likes?.length || 0}
                                    </span>
                                  </button>
                                  <button className="flex items-center gap-1 text-gray-400 hover:text-blue-500 transition-colors">
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="text-sm font-semibold">
                                      {blog.comments?.length || 0}
                                    </span>
                                  </button>
                                  <div className="flex items-center gap-1 text-gray-400 ml-auto">
                                    <Eye className="w-5 h-5" />
                                    <span className="text-sm">
                                      {blog.views || 0}
                                    </span>
                                  </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-orange-400 transition-colors">
                                  {blog.title}
                                </h3>

                                {/* Excerpt */}
                                {blog.excerpt && (
                                  <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                                    {blog.excerpt}
                                  </p>
                                )}

                                {/* Tags */}
                                {blog.tags && blog.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {blog.tags.slice(0, 3).map((tag, index) => (
                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* View All Blogs Button */}
                        {userBlogs.length > 0 && (
                          <button
                            onClick={() => navigate('/blogs')}
                            className="w-full px-6 py-3 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-all font-semibold border border-orange-500/30"
                          >
                            View All {userBlogs.length} Posts
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="bg-[#1a1a1a] rounded-xl p-12 border border-gray-800">
                        <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg">No posts yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                          {data.acadamicdata?.Name} hasn't shared any content
                        </p>
                      </div>
                    )}
                  </div>

                  {/* LeetCode Stats */}
                  {data.userdata?.Leetcode && (
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <Code className="w-8 h-8 text-orange-400" />
                        LeetCode Progress
                      </h2>
                      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 overflow-hidden">
                        <img
                          src={`https://leetcard.jacoblin.cool/${data.userdata.Leetcode}?theme=dark&font=Nunito&ext=heatmap`}
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
                  {data.userdata?.Github && (
                    <div className="text-center space-y-4">
                      <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
                        <Github className="w-8 h-8 text-orange-400" />
                        GitHub Activity
                      </h2>
                      
                      {/* Contribution Graph */}
                      <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 overflow-x-auto">
                        <iframe
                          className="w-full min-w-[300px] h-auto border-0 rounded-lg"
                          src={`https://ghchart.rshah.org/${data.userdata.Github}`}
                          title="GitHub Heatmap"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>

                      {/* GitHub Stats Cards */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 flex justify-center">
                          <img
                            src={`https://streak-stats.demolab.com/?user=${data.userdata.Github}&count_private=true&theme=react&border_radius=10`}
                            alt="GitHub streak stats"
                            className="max-w-full h-auto"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>

                        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 flex justify-center">
                          <img
                            src={`https://github-readme-stats.vercel.app/api?username=${data.userdata.Github}&show_icons=true&theme=react&rank_icon=github&border_radius=10`}
                            alt="GitHub stats"
                            className="max-w-full h-auto"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>

                        <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-gray-800 flex justify-center">
                          <img
                            src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${data.userdata.Github}&hide=HTML&langs_count=8&layout=compact&theme=react&border_radius=10`}
                            alt="Top languages"
                            className="max-w-full h-auto"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      </div>
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
        </div>
      </div>
    </>
  );
};

export default Profilecard;
