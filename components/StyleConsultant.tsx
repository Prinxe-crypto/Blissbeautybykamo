
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { ConsultationMessage } from '../types';

const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*|\n)/g);
  return (
    <div className="space-y-1">
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold" style={{ color: 'var(--theme-accent)' }}>{part.slice(2, -2)}</strong>;
        }
        if (part === '\n') return <br key={i} />;
        if (part.trim().startsWith('* ') || part.trim().startsWith('- ')) {
          return <div key={i} className="pl-4 flex items-start gap-2 opacity-80"><span style={{ color: 'var(--theme-primary)' }}>•</span>{part.trim().slice(2)}</div>;
        }
        return <span key={i} className="opacity-80">{part}</span>;
      })}
    </div>
  );
};

const StyleConsultant: React.FC = () => {
  const [messages, setMessages] = useState<ConsultationMessage[]>([
    { role: 'ai', text: "Welcome to the Bliss Studio. Upload your current nails or an inspiration photo, and I'll help you design your next bespoke set." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isVisualizing]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    const userMsg: ConsultationMessage = { role: 'user', text: input || "Analyze my photo.", image: selectedImage || undefined };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      if (currentImage) {
        const responseText = await geminiService.analyzeStyle(currentImage.split(',')[1]);
        setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
      } else {
        // Fix: Removed incorrect second argument 'thinking' as streamChatResponse only accepts the message string as an argument.
        const stream = geminiService.streamChatResponse(currentInput);
        let full = "";
        for await (const chunk of stream) {
          if (!chunk.done) {
            full += chunk.text;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'ai') return [...prev.slice(0, -1), { role: 'ai', text: full }];
              return [...prev, { role: 'ai', text: full }];
            });
          }
        }
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Service temporarily unavailable. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="consultant" className="py-24 border-y" style={{ backgroundColor: 'var(--theme-bg-main)', borderColor: 'var(--theme-border)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block" style={{ color: 'var(--theme-primary)' }}>AI Design Studio</span>
              <h2 className="text-4xl md:text-6xl font-bold serif italic mb-6 leading-tight">Consult <br /><span className="font-normal opacity-50">Your Style</span></h2>
            </div>
            <div className="space-y-4">
              <div onClick={() => fileInputRef.current?.click()} className="group relative overflow-hidden rounded-[2rem] border-2 border-dashed aspect-square flex flex-col items-center justify-center p-8 transition-all cursor-pointer" style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-bg-surface)' }}>
                {selectedImage ? (
                  <img src={selectedImage} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="text-center opacity-40 italic">Drop inspiration here</div>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              <button onClick={handleSend} disabled={isLoading} className="w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all" style={{ backgroundColor: 'var(--theme-primary)' }}>
                {selectedImage ? 'Analyze Masterpiece' : 'Ask Specialist'}
              </button>
            </div>
          </div>
          <div className="lg:col-span-3 rounded-[3rem] border shadow-2xl overflow-hidden flex flex-col h-[600px]" style={{ backgroundColor: 'var(--theme-bg-surface)', borderColor: 'var(--theme-border)' }}>
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-[2rem] p-6 border shadow-sm ${m.role === 'user' ? 'bg-stone-50' : 'bg-white'}`} style={{ borderColor: 'var(--theme-border)' }}>
                    {m.image && <img src={m.image} className="w-full rounded-xl mb-4" />}
                    <FormattedMessage text={m.text} />
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StyleConsultant;
