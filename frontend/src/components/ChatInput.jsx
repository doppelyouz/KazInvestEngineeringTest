import { Mic, MicOff, ChevronRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import useSpeechToText from '../hooks/useSpeechToText';

export default function ChatInput({ onSendMessage, isLoading }) {
  const [message, setMessage] = useState('');
  const { isListening, transcript, startListening, stopListening, setTranscript } = useSpeechToText();

  useEffect(() => {
    if (transcript) {
      setMessage(transcript);
    }
  }, [transcript]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      setTranscript('');
      if (isListening) stopListening();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setMessage('');
      startListening();
    }
  };

  return (
    <div className="fixed bottom-0 w-full bg-gradient-to-t from-[#071d49] via-[#071d49]/95 to-transparent pt-12 pb-6 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-center bg-[#102d68] border border-[#1c418c] rounded-2xl shadow-2xl p-1 md:p-1.5 focus-within:border-[#2a5bd7] transition-all duration-300"
        >
          <button
            type="button"
            onClick={handleMicClick}
            className={`p-3 mx-1 transition-colors duration-200 ${
              isListening ? 'text-red-400 animate-pulse' : 'text-[#8ba7d6] hover:text-white'
            }`}
            title={isListening ? "Stop recording" : "Start recording"}
          >
            {isListening ? <MicOff size={22} /> : <Mic size={22} />}
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isListening ? "Listening..." : "Ask whatever you want"}
            disabled={isLoading || isListening}
            className="flex-1 bg-transparent border-none focus:outline-none text-white placeholder-[#5176af] py-3 text-base md:text-lg disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="bg-[#2a5bd7] hover:bg-[#1d46b0] disabled:bg-[#1c3875] disabled:text-[#8ba7d6] rounded-xl p-2 md:p-3 text-white transition-colors duration-200 mx-1 flex items-center justify-center shadow-md disabled:shadow-none"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <ChevronRight size={24} strokeWidth={2.5} />}
          </button>
        </form>
      </div>
    </div>
  );
}
