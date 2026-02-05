
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  
  return (
    <div className="space-y-1">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold" style={{ color: 'var(--theme-primary)' }}>{part.slice(2, -2)}</strong>;
        }
        if (part === '\n') return <br key={i} />;
        if (part.trim().startsWith('* ') || part.trim().startsWith('- ')) {
          return <div key={i} className="pl-4 flex items-start gap-2"><span style={{ color: 'var(--theme-accent)' }}>•</span>{part.trim().slice(2)}</div>;
        }
        return <span key={i}>{part}</span>;
      })}
    </div>
  );
};

const ChatBot: React.FC<{ isOpen: boolean; onClose: () => void; initialMessage?: string }> = ({ isOpen, onClose, initialMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: "Hi! I'm Bliss. I provide instant details on prices, location, and booking. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSend(initialMessage);
    }
  }, [initialMessage, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(async (textOverride?: string) => {
    const msgText = textOverride || input;
    if (!msgText.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', text: msgText }]);
    setInput('');
    setIsLoading(true);

    let fullText = "";
    
    try {
      const stream = geminiService.streamChatResponse(msgText);
      let isFirstChunk = true;

      for await (const chunk of stream) {
        if (!chunk.done) {
          fullText += chunk.text;
          
          setMessages(prev => {
            if (isFirstChunk) {
              isFirstChunk = false;
              return [...prev, { role: 'ai', text: fullText }];
            }
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { role: 'ai', text: fullText };
            return newMsgs;
          });
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Error connecting. Check WhatsApp." }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 md:bottom-24 right-4 md:right-8 z-[100] w-[92vw] md:w-[420px] h-[80vh] md:h-[650px] max-h-[85vh] bg-white rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-[var(--theme-border)] animate-in slide-in-from-bottom-10 duration-500">
      {/* Header */}
      <div className="p-6 md:p-8 text-white flex justify-between items-center shadow-lg relative z-10" style={{ backgroundColor: 'var(--theme-primary)' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
          </div>
          <div>
            <h3 className="font-bold serif text-xl md:text-2xl italic tracking-tight">Bliss AI</h3>
            <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] opacity-80 font-black">Instant Support</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 md:p-3 hover:bg-black/10 rounded-full transition-colors active:scale-90" aria-label="Close Chat">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-6 space-y-6 bg-stone-50/50 scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[88%] p-4 md:p-5 rounded-[1.8rem] shadow-sm text-sm md:text-base leading-relaxed ${
              m.role === 'user' 
                ? 'text-white rounded-tr-none' 
                : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
            }`} style={{ 
              backgroundColor: m.role === 'user' ? 'var(--theme-primary)' : 'white'
            }}>
              <FormattedMessage text={m.text} />
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1].role !== 'ai' && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl rounded-tl-none flex gap-2 items-center shadow-sm border border-stone-100">
              <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
              <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.2s]" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
              <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:0.4s]" style={{ backgroundColor: 'var(--theme-accent)' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-5 md:p-6 bg-white border-t border-stone-100 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
        <div className="relative mb-4">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about prices or location..."
            className="w-full pl-5 pr-14 py-4 bg-stone-100 border-none rounded-2xl text-sm md:text-base focus:ring-2 focus:ring-[var(--theme-accent)] outline-none transition-all placeholder:text-stone-400"
          />
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-white rounded-xl disabled:opacity-50 transition-all active:scale-90 shadow-lg"
            style={{ backgroundColor: 'var(--theme-primary)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="w-full py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-600 transition-colors border border-stone-100 rounded-xl hover:bg-stone-50"
        >
          Close AI Assistant
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
