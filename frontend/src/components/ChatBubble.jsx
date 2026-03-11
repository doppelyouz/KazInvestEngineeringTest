import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatBubble({ message, isBot }) {
  return (
    <div className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'} mb-6`}>
      <div className={`flex max-w-[85%] md:max-w-3xl gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isBot ? 'bg-[#2a5bd7]/20 text-[#2a5bd7] border border-[#2a5bd7]/30 mt-1' : 'bg-[#102d68] text-[#8ba7d6] mt-1'
        }`}>
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>
        
        {/* Message Content */}
        <div className={`py-3 px-4 md:px-5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm text-[15px] md:text-base ${
          isBot 
            ? 'bg-[#0c2759] text-[#e6edf3] border border-[#163878] rounded-tl-sm' 
            : 'bg-[#2a5bd7] text-white rounded-tr-sm'
        }`}>
          {message}
        </div>
      </div>
    </div>
  );
}
