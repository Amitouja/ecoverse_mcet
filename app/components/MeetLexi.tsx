'use client';

import { useState } from 'react';

export default function MeetLexi() {
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Hello! 🌿 I\'m EcoBot, powered by Gemini AI. Ask me about eco scores, sustainable outfits, or how to earn more Eco Points!' },
    { type: 'user', text: 'How eco-friendly is the Recycled Bomber?' },
    { type: 'ai', text: 'Great pick! 🧥 The Recycled Bomber uses 100% post-consumer polyester — that\'s 12 plastic bottles given new life. ECO Score: 88/100. Saves 40% water vs traditional fabric!' }
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    { emoji: '🎓', text: 'Suggest a college outfit' },
    { emoji: '🌱', text: 'How do eco points work?' },
    { emoji: '💧', text: 'Most water-saving fabric?' },
    { emoji: '🌿', text: 'Show vegan options' }
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { type: 'user', text: input }]);
    setInput('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', text: '🤖 Great question! Ask me about eco scores, outfit combos, carbon savings, or vegan options!' }]);
    }, 1000);
  };

  return (
    <section className="px-6 py-20 md:px-[52px] md:py-20 bg-bg2 border-t border-ink/10">
      <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-sage block mb-3">
        // Powered by Gemini AI
      </span>
      <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold tracking-[-0.02em] mb-2.5">
        Meet <em className="italic text-fern">EcoBot</em>
      </h2>
      <p className="text-mid text-[0.92rem] mt-2.5 max-w-[480px] leading-[1.8] mb-[52px]">
        Your personal AI sustainability guide — eco scores, outfit ideas, carbon savings, and sustainable style tips.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Chatbox */}
        <div className="bg-white border border-ink/10 shadow-[0_4px_40px_rgba(26,26,20,0.08)]">
          {/* Chat Header */}
          <div className="px-5 py-4 border-b border-ink/10 flex items-center gap-3 bg-moss">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-[0.95rem]">
              🤖
            </div>
            <div>
              <div className="font-playfair font-semibold text-[0.9rem] text-white">EcoBot</div>
              <div className="font-mono text-[0.58rem] text-white/60 mt-0.5 before:content-['●_'] before:text-[#a8f0a8]">
                Gemini AI · Active
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="px-5 py-5 h-[320px] overflow-y-auto flex flex-col gap-2.5">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3.5 py-2.5 text-[0.85rem] leading-[1.65] animate-[msgIn_0.3s_ease_both] ${
                  msg.type === 'ai'
                    ? 'bg-bg2 border border-ink/10 self-start'
                    : 'bg-moss text-white self-end font-mono text-[0.72rem]'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Pills */}
          <div className="flex gap-1.5 flex-wrap px-5 pb-3">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                className="px-3 py-1.5 border border-ink/10 font-jost text-[0.72rem] text-mid bg-transparent cursor-pointer transition-all duration-200 hover:border-sage hover:text-fern hover:bg-sage/[0.06]"
                onClick={() => setInput(q.text)}
              >
                {q.emoji} {q.text.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t border-ink/10">
            <input
              className="flex-1 bg-transparent border-none outline-none px-[18px] py-3.5 font-jost text-[0.85rem] text-ink placeholder:text-muted"
              placeholder="Ask EcoBot anything…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              className="bg-moss text-white border-none px-[22px] py-3.5 font-jost font-semibold text-[0.75rem] tracking-[0.08em] uppercase cursor-pointer flex-shrink-0 hover:bg-leaf"
              onClick={handleSend}
            >
              Ask →
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-px">
          <div className="bg-white border border-ink/10 p-6 flex gap-[18px] transition-all duration-300 hover:border-sage hover:bg-sage/[0.04]">
            <span className="text-[1.6rem] flex-shrink-0">🌍</span>
            <div>
              <div className="font-playfair font-semibold text-[0.95rem] mb-1.5">Eco Impact Explainer</div>
              <div className="text-[0.8rem] text-mid leading-[1.65]">
                Ask Gemini to break down carbon savings, water usage, and material traceability for any product.
              </div>
            </div>
          </div>

          <div className="bg-white border border-ink/10 p-6 flex gap-[18px] transition-all duration-300 hover:border-sage hover:bg-sage/[0.04]">
            <span className="text-[1.6rem] flex-shrink-0">✨</span>
            <div>
              <div className="font-playfair font-semibold text-[0.95rem] mb-1.5">AI Styling Assistant</div>
              <div className="text-[0.8rem] text-mid leading-[1.65]">
                Get personalised eco outfit combinations for any occasion — all sustainability-certified.
              </div>
            </div>
          </div>

          <div className="bg-white border border-ink/10 p-6 flex gap-[18px] transition-all duration-300 hover:border-sage hover:bg-sage/[0.04]">
            <span className="text-[1.6rem] flex-shrink-0">🏷️</span>
            <div>
              <div className="font-playfair font-semibold text-[0.95rem] mb-1.5">Smart Product Tagging</div>
              <div className="text-[0.8rem] text-mid leading-[1.65]">
                Gemini auto-labels every item: organic, vegan leather, recycled, biodegradable. Zero greenwashing.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes msgIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
