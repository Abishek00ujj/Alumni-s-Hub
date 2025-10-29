import React from 'react';
import { MessageCircle, Clock } from 'lucide-react';

const ChatCard = ({ chat, currentUserEmail, onClick, isActive }) => {
  const otherParticipant = chat.participants.find(p => p !== currentUserEmail);
  
  // Helper function to get unread count from array with proper error handling
  const getUnreadCount = () => {
    // Check if unreadCount exists and is an array
    if (!chat.unreadCount || !Array.isArray(chat.unreadCount)) {
      return 0;
    }
    
    const unreadItem = chat.unreadCount.find(u => u.userEmail === currentUserEmail);
    return unreadItem ? unreadItem.count : 0;
  };
  
  const unreadCount = getUnreadCount();
  
  const getInitials = (email) => {
    if (!email) return '?';
    return email.charAt(0).toUpperCase();
  };

  const getDisplayName = (email) => {
    if (!email) return 'Unknown User';
    return email.split('@')[0];
  };

  const formatTime = (date) => {
    if (!date) return '';
    
    try {
      const messageDate = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (messageDate.toDateString() === today.toDateString()) {
        return messageDate.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } else if (messageDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return messageDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-200 border-l-4 ${
        isActive
          ? 'bg-[#2a2a2a] border-orange-400'
          : 'bg-[#1a1a1a] border-transparent hover:bg-[#2a2a2a] hover:border-gray-700'
      }`}
    >
      <div className='flex items-center gap-3'>
        {/* Avatar */}
        <div className='relative flex-shrink-0'>
          <div className='w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg'>
            {getInitials(otherParticipant)}
          </div>
          {unreadCount > 0 && (
            <div className='absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#1a1a1a]'>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>

        {/* Chat Info */}
        <div className='flex-1 min-w-0'>
          <div className='flex items-center justify-between mb-1'>
            <h4 className={`font-semibold truncate ${
              unreadCount > 0 ? 'text-white' : 'text-gray-300'
            }`}>
              {getDisplayName(otherParticipant)}
            </h4>
            <span className='text-xs text-gray-500 flex items-center gap-1 flex-shrink-0 ml-2'>
              <Clock className='w-3 h-3' />
              {formatTime(chat.lastMessageTime)}
            </span>
          </div>
          <p className={`text-sm truncate ${
            unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'
          }`}>
            {chat.lastMessage || 'No messages yet'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
