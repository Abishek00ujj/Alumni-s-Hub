import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatCard from '../components/ChatCard';
import ChatMessage from '../components/ChatMessage';
import axios from 'axios';
import {
  ArrowLeft,
  Send,
  Search,
  Phone,
  Video,
  Info,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  MessageCircle,
  Loader2
} from 'lucide-react';

const ChatPage = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const storedUserDetails = JSON.parse(localStorage.getItem("data"));
  const currentUserEmail = storedUserDetails?.Email;

  useEffect(() => {
    if (currentUserEmail) {
      fetchUserChats();
    }
  }, [currentUserEmail]);

  useEffect(() => {
    if (selectedChat) {
      fetchChatMessages(selectedChat._id);
      markMessagesAsRead(selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper function to safely get unread count
const getUnreadCountSafe = (chat, userEmail) => {
  if (!chat || !chat.unreadCount || !Array.isArray(chat.unreadCount)) {
    return 0;
  }
  const unreadItem = chat.unreadCount.find(u => u.userEmail === userEmail);
  return unreadItem ? unreadItem.count : 0;
};


  const fetchUserChats = async () => {
  try {
    setLoading(true);
    const response = await axios.get(`http://localhost:5000/api/v1/chats/user/${currentUserEmail}`);
    
    if (response.data.success) {
      // Ensure all chats have proper unreadCount array
      const normalizedChats = response.data.data.map(chat => ({
        ...chat,
        unreadCount: Array.isArray(chat.unreadCount) ? chat.unreadCount : []
      }));
      setChats(normalizedChats);
    }
  } catch (error) {
    console.error('Error fetching chats:', error);
  } finally {
    setLoading(false);
  }
};


  const fetchChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/chats/messages/${chatId}`);
      
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (chatId) => {
  try {
    await axios.put('http://localhost:5000/api/v1/chats/read', {
      chatId,
      userEmail: currentUserEmail
    });
    
    // Update local chat state with proper array handling
    setChats(prevChats => prevChats.map(chat => {
      if (chat._id === chatId) {
        // Ensure unreadCount is an array
        const unreadArray = Array.isArray(chat.unreadCount) ? chat.unreadCount : [];
        
        return {
          ...chat,
          unreadCount: unreadArray.map(u => 
            u.userEmail === currentUserEmail 
              ? { ...u, count: 0 }
              : u
          )
        };
      }
      return chat;
    }));
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
};


  const sendMessage = async () => {
    if (!messageText.trim() || !selectedChat) return;

    const otherParticipant = selectedChat.participants.find(p => p !== currentUserEmail);

    try {
      setSendingMessage(true);
      const response = await axios.post('http://localhost:5000/api/v1/chats/message', {
        chatId: selectedChat._id,
        sender: currentUserEmail,
        senderName: storedUserDetails.Name,
        receiver: otherParticipant,
        content: messageText
      });

      if (response.data.success) {
        setMessages([...messages, response.data.data]);
        setMessageText('');
        
        // Update chat list
        fetchUserChats();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p !== currentUserEmail);
    return otherParticipant?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p !== currentUserEmail);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className='min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex items-center justify-center'>
          <Loader2 className='w-12 h-12 text-orange-400 animate-spin' />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className='h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] flex flex-col'>
        {/* Header */}
        <div className='bg-[#1a1a1a] border-b border-gray-800 p-4'>
          <div className='max-w-7xl mx-auto flex items-center gap-4'>
            <button
              onClick={() => navigate('/home')}
              className='text-gray-400 hover:text-white transition-colors'
            >
              <ArrowLeft className='w-6 h-6' />
            </button>
            <h1 className='text-2xl font-bold text-white'>Messages</h1>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className='flex-1 flex overflow-hidden max-w-7xl mx-auto w-full'>
          {/* Chat List Sidebar */}
          <div className='w-full sm:w-96 bg-[#1a1a1a] border-r border-gray-800 flex flex-col'>
            {/* Search Bar */}
            <div className='p-4 border-b border-gray-800'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                <input
                  type='text'
                  placeholder='Search conversations...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 bg-[#2a2a2a] text-white rounded-xl border border-gray-700 focus:border-orange-400 focus:outline-none transition-all'
                />
              </div>
            </div>

            {/* Chats List */}
            <div className='flex-1 overflow-y-auto'>
              {filteredChats.length === 0 ? (
                <div className='flex flex-col items-center justify-center h-full text-center p-8'>
                  <MessageCircle className='w-16 h-16 text-gray-600 mb-4' />
                  <p className='text-gray-400 text-lg'>No conversations yet</p>
                  <p className='text-gray-600 text-sm mt-2'>Start chatting with your network</p>
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <ChatCard
                    key={chat._id}
                    chat={chat}
                    currentUserEmail={currentUserEmail}
                    onClick={() => setSelectedChat(chat)}
                    isActive={selectedChat?._id === chat._id}
                  />
                ))
              )}
            </div>
          </div>

          {/* Chat Messages Area */}
          <div className='flex-1 flex flex-col bg-[#121212]'>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className='bg-[#1a1a1a] border-b border-gray-800 p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold'>
                        {getOtherParticipant(selectedChat)?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className='text-white font-semibold'>
                          {getOtherParticipant(selectedChat)?.split('@')[0]}
                        </h3>
                        <p className='text-gray-400 text-xs'>
                          {getOtherParticipant(selectedChat)}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button className='text-gray-400 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-all'>
                        <Phone className='w-5 h-5' />
                      </button>
                      <button className='text-gray-400 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-all'>
                        <Video className='w-5 h-5' />
                      </button>
                      <button className='text-gray-400 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-all'>
                        <Info className='w-5 h-5' />
                      </button>
                      <button className='text-gray-400 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-all'>
                        <MoreVertical className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div
                  ref={messagesContainerRef}
                  className='flex-1 overflow-y-auto p-4 space-y-2'
                >
                  {messages.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-full text-center'>
                      <MessageCircle className='w-16 h-16 text-gray-600 mb-4' />
                      <p className='text-gray-400'>No messages yet</p>
                      <p className='text-gray-600 text-sm mt-2'>Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <ChatMessage
                        key={message._id}
                        message={message}
                        isOwnMessage={message.sender === currentUserEmail}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className='bg-[#1a1a1a] border-t border-gray-800 p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <button className='text-gray-400 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-all'>
                      <Paperclip className='w-5 h-5' />
                    </button>
                    <button className='text-gray-400 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-all'>
                      <ImageIcon className='w-5 h-5' />
                    </button>
                    <button className='text-gray-400 hover:text-white p-2 hover:bg-[#2a2a2a] rounded-full transition-all'>
                      <Smile className='w-5 h-5' />
                    </button>
                  </div>
                  <div className='flex items-center gap-2'>
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder='Type a message...'
                      rows={1}
                      className='flex-1 px-4 py-3 bg-[#2a2a2a] text-white rounded-xl border border-gray-700 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 focus:outline-none transition-all resize-none'
                      style={{ maxHeight: '120px' }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!messageText.trim() || sendingMessage}
                      className='px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2'
                    >
                      {sendingMessage ? (
                        <Loader2 className='w-5 h-5 animate-spin' />
                      ) : (
                        <Send className='w-5 h-5' />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className='flex-1 flex flex-col items-center justify-center text-center p-8'>
                <MessageCircle className='w-20 h-20 text-gray-600 mb-4' />
                <h3 className='text-2xl font-bold text-white mb-2'>Select a conversation</h3>
                <p className='text-gray-400'>Choose from your existing conversations or start a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
