'use client';

import { useState } from 'react';

export default function EcoRewards() {
  const [scratched, setScratched] = useState([false, false, false]);

  const handleScratch = (index: number) => {
    if (scratched[index]) return;
    
    const newScratched = [...scratched];
    newScratched[index] = true;
    setScratched(newScratched);

    // Burst animation
    const emojis = ['🎉', '✨', '🌱', '💚', '⭐'];
    emojis.forEach((em, j) => {
      setTimeout(() => {
        const burst = document.createElement('span');
        burst.className = 'burst';
        burst.textContent = em;
        const angle = (Math.PI * 2 / 5) * j;
        const distance = 60 + Math.random() * 50;
        burst.style.left = '50%';
        burst.style.top = '50%';
        burst.style.setProperty('--bx', Math.cos(angle) * distance + 'px');
        burst.style.setProperty('--by', (Math.sin(angle) * distance - 60) + 'px');
        document.body.appendChild(burst);
        setTimeout(() => burst.remove(), 900);
      }, j * 50);
    });
  };

  const cards = [
    { icon: '🎉', value: '₹50', label: 'off next order', button: 'Use Now' },
    { icon: '⚡', value: '2×', label: 'Eco Points boost', button: 'Activate' },
    { icon: '🚀', value: 'FREE', label: 'delivery', button: 'Redeem' }
  ];

  return (
    <section className="px-6 py-20 md:px-[52px] md:py-20 text-center border-t border-ink/10">
      <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-sage block mb-3">
        // Scratch & Win
      </span>
      <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold tracking-[-0.02em] mb-4">
        Your <em className="italic text-fern">Eco Rewards</em>
      </h2>
      <p className="text-[0.95rem] text-mid max-w-[440px] mx-auto leading-[1.8] mb-[52px]">
        Every purchase unlocks a mystery scratch card. Tap to reveal your reward — discounts, free shipping, double points and more.
      </p>

      <div className="flex gap-5 justify-center flex-wrap">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`w-[200px] h-[260px] relative cursor-pointer select-none transition-transform duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              i === 0 ? 'rotate-[-4deg] translate-y-[-8px] hover:rotate-[-4deg] hover:translate-y-[-22px] hover:scale-[1.04]' :
              i === 1 ? 'rotate-[1deg] translate-y-[-16px] hover:rotate-[1deg] hover:translate-y-[-30px] hover:scale-[1.05]' :
              'rotate-[-2deg] translate-y-[-4px] hover:rotate-[-2deg] hover:translate-y-[-18px] hover:scale-[1.04]'
            } ${scratched[i] ? 'bg-gradient-to-br from-sage to-[#a8d88a]' : ''}`}
            onClick={() => handleScratch(i)}
          >
            {/* Front Face */}
            <div className={`absolute inset-0 bg-white border border-ink/10 shadow-[0_12px_60px_rgba(26,26,20,0.14)] flex flex-col items-center justify-center gap-2 transition-opacity duration-400 ${scratched[i] ? 'opacity-0 pointer-events-none' : ''}`}>
              <div className="absolute inset-0 bg-[repeating-linear-gradient(60deg,rgba(0,0,0,0.025)_0px,rgba(0,0,0,0.025)_1px,transparent_1px,transparent_8px)]"></div>
              <div className="font-playfair font-bold text-[1rem] text-moss">EcoVerse</div>
              <div className="font-mono text-[0.55rem] tracking-[0.12em] uppercase text-muted">Tap to scratch</div>
              <div className="text-[1.4rem] animate-[bob_2s_ease_infinite]">👆</div>
            </div>

            {/* Back Face */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-opacity duration-400 ${scratched[i] ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              <div className="text-[2rem]">{card.icon}</div>
              <div className={`font-playfair font-bold text-ink leading-none ${card.value === 'FREE' ? 'text-[1.5rem]' : 'text-[2rem]'}`}>
                {card.value}
              </div>
              <div className="font-mono text-[0.6rem] text-ink opacity-70 uppercase tracking-[0.1em]">
                {card.label}
              </div>
              <button className="bg-ink text-white border-none px-[18px] py-[7px] font-jost font-semibold text-[0.72rem] tracking-[0.08em] uppercase cursor-pointer mt-1">
                {card.button}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
}
