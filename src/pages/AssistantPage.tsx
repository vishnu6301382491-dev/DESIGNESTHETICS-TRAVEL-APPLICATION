import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  RotateCcw,
  Compass,
  Calendar,
  Bot,
  User,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Destination, ChatMessage } from '../types/travel';
import { sendChatMessage } from '../services/geminiService';

export const AssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destQuery = searchParams.get('dest');

  const activeDestination =
    DESTINATIONS_DATA.find((d) => d.id.toLowerCase() === destQuery?.toLowerCase()) || null;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultSuggestions = activeDestination
    ? [
        `How long should I spend in ${activeDestination.name}?`,
        `What are the must-see sights in ${activeDestination.name}?`,
        `When is the quintessential season to visit?`,
        `What should I pack for current climate?`,
        `Which local culinary specialties are unmissable?`,
      ]
    : [
        'Recommend a serene coastal escape',
        'Where can I find dramatic alpine hiking?',
        'Best destination for a cultural & culinary journey',
        'What should a first-time visitor know before Tokyo?',
      ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const initialGreeting: ChatMessage = {
      id: 'msg-init',
      sender: 'assistant',
      content: activeDestination
        ? `Welcome to the **designesthetics** AI Concierge salon. I am attuned to the rhythms of **${activeDestination.name}, ${activeDestination.country}**.\n\nInquire about optimal seasons, secret viewpoints, cultural customs, or click **"Plan Itinerary"** above to construct a bespoke day-by-day journey.`
        : `Greetings from the **designesthetics** AI Concierge. I am your editorial travel curator powered by Google Gemini. How may I elevate your travel aspirations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: defaultSuggestions,
    };
    setMessages([initialGreeting]);
  }, [destQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    const history = messages.map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      text: m.content,
    }));

    try {
      const reply = await sendChatMessage(text.trim(), activeDestination || undefined, history);

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: defaultSuggestions.filter((s) => s !== text),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fadeIn">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne shadow-glow-gold">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-3xl text-sand-50 font-normal">
                AI Travel Concierge
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-sand-400 font-mono">
              {activeDestination
                ? `Active Focus: ${activeDestination.name}, ${activeDestination.country}`
                : 'Google Gemini 2.0 Assistant · Editorial Travel Salon'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeDestination && (
            <button
              onClick={() => navigate(`/planner?dest=${activeDestination.id}`)}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-champagne text-black text-xs font-semibold uppercase tracking-wider shadow-glow-gold"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Plan {activeDestination.name}</span>
            </button>
          )}

          <button
            onClick={() => setMessages([])}
            title="Reset conversation"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sand-400 hover:text-sand-100 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Destination Switcher Banner */}
      <div className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-champagne shrink-0" />
          <span className="text-sand-300">
            {activeDestination ? (
              <>
                Focused on <strong className="text-sand-100">{activeDestination.name}</strong>. Inquires will be tailored to its climate, places, and culture.
              </>
            ) : (
              'Exploring globally. You can also pick a specific destination to focus the concierge:'
            )}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {DESTINATIONS_DATA.slice(0, 5).map((d) => (
            <button
              key={d.id}
              onClick={() => navigate(`/assistant?dest=${d.id}`)}
              className={`px-3 py-1 rounded-lg text-xs transition-all shrink-0 ${
                activeDestination?.id === d.id
                  ? 'bg-champagne text-black font-semibold shadow-glow-gold'
                  : 'bg-white/5 hover:bg-white/10 text-sand-300'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      {/* Message Chat Container */}
      <div className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 min-h-[500px] flex flex-col justify-between shadow-luxury space-y-6">
        <div className="space-y-6 flex-1 overflow-y-auto max-h-[60vh] pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-3xl p-5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-champagne text-black font-medium rounded-tr-none shadow-glow-gold'
                    : 'glass-card border border-white/10 text-sand-200 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.content.split('\n').map((line, lIdx) => {
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-2 ml-1 my-1">
                          <span className="text-champagne font-bold">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx} className={line === '' ? 'h-2' : ''}>{line}</p>;
                  })}
                </div>

                <div
                  className={`text-[10px] font-mono mt-3 flex justify-end ${
                    msg.sender === 'user' ? 'text-black/60' : 'text-sand-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Suggestions Chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-4 space-y-2 max-w-[90%]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sand-500 block">
                    Suggested Inquiries:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        className="text-left text-xs px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-champagne/20 hover:border-champagne/40 border border-white/10 text-sand-300 hover:text-champagne transition-all"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2.5 glass-card p-4 rounded-2xl max-w-[160px] text-xs text-sand-300 border border-white/10">
              <Sparkles className="w-4 h-4 text-champagne animate-spin" />
              <span>Synthesizing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                activeDestination
                  ? `Ask about ${activeDestination.name} (e.g. 3-day itinerary, food, best season)...`
                  : 'Ask about any destination, climate, packing, or travel ideas...'
              }
              className="flex-1 bg-white/5 border border-white/15 rounded-2xl px-5 py-4 text-xs sm:text-sm text-sand-100 placeholder-sand-500 focus:outline-none focus:border-champagne/50 tracking-wide"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              aria-label="Send query"
              className="p-4 rounded-2xl bg-champagne text-black hover:bg-champagne-light transition-all disabled:opacity-40 shadow-glow-gold shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-center text-sand-500 font-mono">
            Enter to send · Shift+Enter for multiline · Powered by Google Gemini
          </div>
        </div>
      </div>
    </div>
  );
};
