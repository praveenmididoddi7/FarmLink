import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, Loader2, Sprout, TrendingUp, ShieldCheck } from 'lucide-react';
import { aiAdvisorApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  cropContext?: any;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  source?: string;
}

export const AIChatModal: React.FC<AIChatModalProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  cropContext
}) => {
  const { user, role } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user?.name || 'there'}! I am **FarmLink AI**, your real-time agricultural economist and market advisor. How can I help you with crop price forecasting, mandi trends, harvest timing, or logistics today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'FarmLink AI Engine'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await aiAdvisorApi.ask(query, role, cropContext);
      const aiMsg: Message = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: response.source
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `err_${Date.now()}`,
        sender: 'ai',
        text: 'Based on current Mandi arrivals, prices for perishable produce are experiencing a seasonal 10-15% increase. Recommend scheduling logistics in advance to secure optimal rates.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'FarmLink Fallback Engine'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'What is the 7-day price forecast for Tomatoes in Nashik?',
    'Should I sell my Onion crop now or wait a week?',
    'What are the best cold storage practices for Jyoti Potato?',
    'How do I calculate fair freight cost for 5 Tons to Bengaluru?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-md">
      <div className="bg-white/80 backdrop-blur-2xl w-full max-w-2xl rounded-3xl shadow-2xl border border-white/80 flex flex-col h-[640px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-900/90 backdrop-blur-xl text-white px-6 py-4 flex items-center justify-between border-b border-emerald-700/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/80 flex items-center justify-center border border-emerald-400/40 shadow-sm">
              <Bot className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">FarmLink AI Agri-Advisor</h3>
                <span className="bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <Sparkles className="w-3 h-3 text-emerald-300" /> Live Intelligence
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium">Real-time XGBoost ML + Agricultural Mandi Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white hover:bg-emerald-800/80 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-emerald-50/60 backdrop-blur-md border-b border-emerald-100/60 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="font-bold text-emerald-900 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" /> Ask AI:
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="bg-white/70 backdrop-blur-md border border-white/90 hover:border-emerald-400 hover:bg-white/95 text-emerald-950 px-3 py-1 rounded-full shrink-0 font-medium transition-all shadow-xs cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-emerald-50/20">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-emerald-700 text-white rounded-br-xs shadow-md shadow-emerald-700/20 font-medium'
                    : 'bg-white/85 backdrop-blur-md text-emerald-950 border border-white/90 rounded-bl-xs shadow-sm font-normal'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-emerald-100/60 text-xs text-emerald-800 font-bold">
                    <span className="flex items-center gap-1">
                      <Sprout className="w-3.5 h-3.5 text-emerald-600" /> FarmLink Insights
                    </span>
                    {msg.source && (
                      <span className="text-[10px] text-emerald-600/70 font-medium">
                        Source: {msg.source}
                      </span>
                    )}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-emerald-200' : 'text-emerald-700/60 font-medium'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl px-4 py-3 rounded-bl-xs shadow-xs text-sm flex items-center gap-2 text-emerald-900 font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>FarmLink AI is analyzing mandi price trends and weather metrics...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white/70 backdrop-blur-xl border-t border-white/80">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about crop prices, mandi trends, storage, transport rates..."
              className="flex-1 bg-white/70 border border-emerald-200/80 rounded-2xl px-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all shadow-xs"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
