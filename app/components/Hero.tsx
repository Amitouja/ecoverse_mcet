'use client';

import Image from 'next/image';

export default function Hero() {
  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-100px)] border-b border-ink/10">
      {/* Hero Left */}
      <div className="bg-bg2 flex flex-col justify-center px-8 py-20 lg:px-16 lg:py-20 relative overflow-hidden border-r border-ink/10 before:content-[''] before:absolute before:-top-[100px] before:-left-[100px] before:w-[400px] before:h-[400px] before:rounded-full before:bg-[radial-gradient(circle,rgba(107,140,107,0.15)_0%,transparent_70%)]">
        <div className="relative z-10">
          <div className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-sage mb-6 flex items-center gap-2.5 before:content-[''] before:w-7 before:h-[1px] before:bg-sage">
            New Collection · SS 2025
          </div>
          
          <h1 className="font-playfair text-[clamp(2.8rem,5vw,4.8rem)] font-bold leading-[1.05] tracking-[-0.02em] mb-6">
            Fashion that<br />
            <em className="italic text-fern block">Heals the Planet</em>
          </h1>
          
          <p className="text-[0.95rem] leading-[1.85] text-mid max-w-[380px] mb-10">
            Shop eco-conscious clothing, earn Eco Points on every sustainable purchase, and unlock 
            GPay-style scratch rewards. Every piece tells a story of regeneration.
          </p>
          
          <div className="flex gap-3.5 items-center flex-wrap">
            <button 
              onClick={scrollToShop}
              className="bg-ink text-bg border-[1.5px] border-ink px-9 py-3.5 font-jost font-semibold text-[0.78rem] tracking-[0.12em] uppercase cursor-pointer transition-all duration-250 hover:bg-moss hover:border-moss hover:-translate-y-0.5 hover:shadow-[0_12px_60px_rgba(26,26,20,0.14)]"
            >
              Shop Collection
            </button>
            <button className="bg-transparent text-ink border-[1.5px] border-ink/10 px-9 py-3.5 font-jost font-medium text-[0.78rem] tracking-[0.12em] uppercase cursor-pointer transition-all duration-250 hover:border-sage hover:text-fern">
              Claim Rewards
            </button>
          </div>
          
          <div className="flex gap-8 mt-[52px] pt-8 border-t border-ink/10">
            <div>
              <span className="font-playfair text-[1.8rem] font-bold text-ink block">12K+</span>
              <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-muted block mt-1">Eco Warriors</span>
            </div>
            <div>
              <span className="font-playfair text-[1.8rem] font-bold text-ink block">890K</span>
              <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-muted block mt-1">Litres Saved</span>
            </div>
            <div>
              <span className="font-playfair text-[1.8rem] font-bold text-ink block">4.2M</span>
              <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-muted block mt-1">Points Awarded</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Right */}
      <div className="hidden lg:flex bg-bg items-center justify-center relative overflow-hidden px-10 py-[60px] before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[420px] before:h-[420px] before:rounded-full before:border before:border-sage/15">
        <div className="relative w-[320px] h-[480px]">
          {/* Card 1 */}
          <div className="absolute w-[190px] top-0 left-2.5 bg-white border border-ink/10 shadow-[0_12px_60px_rgba(26,26,20,0.14)] p-4 cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-[0_20px_60px_rgba(26,26,20,0.18)] hover:z-10 animate-[hc1_5s_ease-in-out_infinite_alternate]">
            <div className="w-full aspect-square overflow-hidden mb-2.5 bg-bg2">
              <Image src="/stack.jpeg" alt="Organic Linen Tee" width={200} height={200} className="w-full h-full object-cover" />
            </div>
            <div className="font-playfair text-[0.85rem] font-semibold mb-1">Organic Linen Tee</div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[0.72rem] text-ink">₹1,299</span>
              <span className="bg-fern/12 border border-fern/25 px-2 py-0.5 font-mono text-[0.55rem] text-fern">ECO 95</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="absolute w-[210px] top-[120px] left-20 bg-white border border-ink/10 shadow-[0_12px_60px_rgba(26,26,20,0.14)] p-4 cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-[0_20px_60px_rgba(26,26,20,0.18)] hover:z-10 z-[2] animate-[hc2_6s_ease-in-out_infinite_alternate]">
            <div className="w-full aspect-square overflow-hidden mb-2.5 bg-bg2">
              <Image src="/jacket.jpeg" alt="Recycled Bomber" width={200} height={200} className="w-full h-full object-cover" />
            </div>
            <div className="font-playfair text-[0.85rem] font-semibold mb-1">Recycled Bomber</div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[0.72rem] text-ink">₹3,499</span>
              <span className="bg-fern/12 border border-fern/25 px-2 py-0.5 font-mono text-[0.55rem] text-fern">ECO 88</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="absolute w-[175px] top-[280px] left-5 bg-white border border-ink/10 shadow-[0_12px_60px_rgba(26,26,20,0.14)] p-4 cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-[0_20px_60px_rgba(26,26,20,0.18)] hover:z-10 animate-[hc3_4.5s_ease-in-out_infinite_alternate]">
            <div className="w-full aspect-square overflow-hidden mb-2.5 bg-bg2">
              <Image src="/sneaker.jpeg" alt="Hemp Canvas Kicks" width={200} height={200} className="w-full h-full object-cover" />
            </div>
            <div className="font-playfair text-[0.85rem] font-semibold mb-1">Hemp Canvas Kicks</div>
            <div className="flex justify-between items-center">
              <span className="font-mono text-[0.72rem] text-ink">₹2,799</span>
              <span className="bg-fern/12 border border-fern/25 px-2 py-0.5 font-mono text-[0.55rem] text-fern">ECO 91</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes hc1 {
          from { transform: rotate(-3deg) translateY(0); }
          to { transform: rotate(-1deg) translateY(-14px); }
        }
        @keyframes hc2 {
          from { transform: rotate(2deg) translateY(0); }
          to { transform: rotate(4deg) translateY(-18px); }
        }
        @keyframes hc3 {
          from { transform: rotate(-1deg) translateY(0); }
          to { transform: rotate(1deg) translateY(-10px); }
        }
      `}</style>
    </section>
  );
}
