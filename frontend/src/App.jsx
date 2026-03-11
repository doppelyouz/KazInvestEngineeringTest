import { useState, useRef, useEffect } from 'react';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import { BotMessageSquare, MessageSquare } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text) => {
    setMessages(prev => [...prev, { text, isBot: false }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://kazinvestengineeringtest.onrender.com/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, isBot: true }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        text: "Sorry, I'm having trouble connecting to the server. Please check if the backend is running.", 
        isBot: true,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#071d49] text-gray-100 font-sans tracking-wide">
      {/* Messages or Welcome Screen */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 w-full max-w-4xl mx-auto pb-32 mt-12 md:mt-24">
          <div className="bg-[#2a5bd7] w-12 h-12 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-[#2a5bd7]/20">
            <MessageSquare size={24} className="text-white" fill="currentColor" />
          </div>
          <h1 className="text-[28px] md:text-3xl text-white font-medium mb-3">Hi there!</h1>
          <h2 className="text-[36px] md:text-[44px] leading-tight text-white font-bold mb-4">What would you like to know?</h2>
          <p className="text-[#8ba7d6] text-[17px] font-normal leading-relaxed mt-1">
            Use one of the most common prompts below<br className="hidden md:block"/>
            <span className="md:inline hidden"> </span>or ask your own question
          </p>
        </div>
      ) : (
        <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 pb-32 mt-4">
          <div className="flex flex-col">
            {messages.map((msg, index) => (
              <ChatBubble key={index} message={msg.text} isBot={msg.isBot} />
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start mb-6 animate-pulse">
                 <div className="flex max-w-[80%] gap-3 flex-row">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-[#2a5bd7]/20 text-[#2a5bd7] border border-[#2a5bd7]/30 mt-1">
                      <div className="w-4 h-4 rounded-full border-2 border-t-[#2a5bd7] border-r-transparent border-b-transparent border-l-transparent animate-spin"/>
                    </div>
                    <div className="py-3 px-4 rounded-2xl bg-[#0c2759] border border-[#163878] rounded-tl-sm w-16 flex items-center justify-center space-x-1 shadow-sm">
                       <span className="w-2 h-2 bg-[#4b7ce6] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                       <span className="w-2 h-2 bg-[#4b7ce6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                       <span className="w-2 h-2 bg-[#4b7ce6] rounded-full animate-bounce"></span>
                    </div>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </main>
      )}

      {/* Input Area */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;
