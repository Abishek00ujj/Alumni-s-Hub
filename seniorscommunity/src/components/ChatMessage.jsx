import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';

const ChatMessage = ({ message, isOwnMessage }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 ${
          isOwnMessage
            ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
            : 'bg-[#2a2a2a] text-white border border-gray-800'
        }`}
      >
        {!isOwnMessage && (
          <p className='text-xs text-gray-400 mb-1 font-semibold'>
            {message.senderName}
          </p>
        )}
        
        <p className='break-words whitespace-pre-wrap'>{message.content}</p>
        
        <div className={`flex items-center gap-1 justify-end mt-1 text-xs ${
          isOwnMessage ? 'text-white/70' : 'text-gray-500'
        }`}>
          <Clock className='w-3 h-3' />
          <span>{formatTime(message.createdAt)}</span>
          {isOwnMessage && (
            message.read ? (
              <CheckCheck className='w-4 h-4 text-blue-400' />
            ) : (
              <Check className='w-4 h-4' />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
