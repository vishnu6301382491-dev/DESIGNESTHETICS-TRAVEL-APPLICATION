import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Compass,
  Calendar,
  ChevronRight,
  Bot,
  User,
  ExternalLink
} from 'lucide-react';
import { Destination, ChatMessage } from '../../types/travel';
import { sendChatMessage } from '../../services/geminiService';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeDestination: Destination | null;
  onPlanTrip: (dest: Destination) => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  activeDestination,
  onPlanTrip,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested prompt chips based on destination context
  const defaultSuggestions = activeDestination
    ? [
        `How long should I spend in ${activeDestination.name}?`,
        `What are the must-see places in ${activeDestination.name}?`,
        `When is the quintessential season to visit?`,
        `What should I pack for current climate?`,
        `Which local culinary specialties are unmissable?`,
      ]
    : [
        'Recommend a serene coastal escape',
        'Where can I find dramatic alpine hiking?',
        'Best destination for a culinary immersion journey',
        'What should I know before visiting Kyoto?',
      ];

  // Initialize initial greeting when opened or destination changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting: ChatMessage = {
        id: 'msg-init',
        sender: 'assistant',
        content: activeDestination
          ? `Welcome. I am your **designesthetics** AI Concierge. I am attuned to the rhythms of **${activeDestination.name}, ${activeDestination.country}**.\n\nAsk me anything regarding optimal visiting windows, cultural etiquette, recommended duration, or click below to have me generate a tailored day-by-day itinerary.`
          : `Greetings from the **designesthetics** AI Concierge. How may I guide your travel aspirations today? You can inquire about our global portfolio, climate advisories, or request bespoke journey ideas.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: defaultSuggestions,
      };
      setMessages([initialGreeting]);
    }
  }, [isOpen, activeDestination]);

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

    // Build chat history for context
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

  const handleReset = () => {
    setMessages([]);
    setInputPrompt('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-[#0D1117] h-full flex flex-col border-l border-white/10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111720]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne shadow-glow-gold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-sand-50 font-normal">
                  AI Travel Concierge
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-sand-400 font-mono">
                {activeDestination
                  ? `Active focus: ${activeDestination.name}, ${activeDestination.country}`
                  : 'Google Gemini 2.0 Assistant'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              title="Reset conversation"
              className="p-2 rounded-lg text-sand-400 hover:text-sand-100 hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              aria-label="Close AI Concierge"
              className="p-2 rounded-lg text-sand-400 hover:text-sand-100 hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Destination Quick Action Banner if inside a destination */}
        {activeDestination && (
          <div className="px-5 py-3 bg-champagne/10 border-b border-champagne/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-sand-200">
              <Compass className="w-4 h-4 text-champagne" />
              <span>
                Viewing <strong>{activeDestination.name}</strong>
              </span>
            </div>
            <button
              onClick={() => {
                onClose();
                onPlanTrip(activeDestination);
              }}
              className="px-3 py-1 rounded-full bg-champagne text-black font-semibold text-[11px] uppercase tracking-wider hover:bg-champagne-light flex items-center gap-1 shadow-glow-gold"
            >
              <Calendar className="w-3 h-3" />
              <span>Plan Trip</span>
            </button>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-champagne text-black font-medium rounded-tr-none'
                    : 'glass-card border border-white/10 text-sand-200 rounded-tl-none space-y-2'
                }`}
              >
                {/* Parse simple markdown: bolding and bullets */}
                <div className="whitespace-pre-wrap">
                  {msg.content.split('\n').map((line, lIdx) => {
                    if (line.startsWith('• ') || line.startsWith('- ')) {
                      return (
                        <div key={lIdx} className="flex items-start gap-1.5 ml-1 my-0.5">
                          <span className="text-champagne font-bold">•</span>
                          <span>{line.substring(2)}</span>
                        </div>
                      );
                    }
                    return <p key={lIdx} className={line === '' ? 'h-2' : ''}>{line}</p>;
                  })}
                </div>

                <div
                  className={`text-[10px] font-mono mt-2 flex justify-end ${
                    msg.sender === 'user' ? 'text-black/60' : 'text-sand-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Suggestions chips attached to assistant messages */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 space-y-1.5 max-w-[90%]">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sand-500 block">
                    Curated prompts:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSend(sug)}
                        className="text-left text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-champagne/20 hover:border-champagne/40 border border-white/10 text-sand-300 hover:text-champagne transition-all"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 glass-card p-3.5 rounded-2xl max-w-[140px] text-xs text-sand-400 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-champagne animate-spin" />
              <span>Synthesizing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer Bar */}
        <div className="p-4 border-t border-white/10 bg-[#111720]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                activeDestination
                  ? `Ask about ${activeDestination.name} (e.g. food, seasons, hidden spots)...`
                  : 'Ask about any destination or travel advice...'
              }
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-sand-100 placeholder-sand-500 focus:outline-none focus:border-champagne/50"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isTyping}
              aria-label="Send message"
              className="p-3 rounded-xl bg-champagne text-black hover:bg-champagne-light transition-all disabled:opacity-40 shadow-glow-gold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-center text-sand-500 font-mono">
            Powered by Google Gemini · Editorial recommendations curated by designesthetics
          </div>
        </div>
      </div>
    </div>
  );
};
