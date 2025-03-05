import React from 'react';
import { MessageSquare, Bot } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : 'bg-purple-500'}`}>
        {isUser ? <MessageSquare size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>
      <div className={`flex-1 max-w-[80%] p-4 rounded-2xl ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
        <p className="text-sm">{message.content}</p>
        <span className="text-xs mt-2 block opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};