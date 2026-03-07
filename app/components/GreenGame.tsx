export default function GreenGame() {
  return (
    <section className="px-6 py-20 md:px-[52px] md:py-20 bg-bg2 border-t border-ink/10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">
        {/* Left Content */}
        <div>
          <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-sage block mb-3">
            // Eco Ranks
          </span>
          <h2 className="font-playfair text-[2.4rem] font-bold leading-[1.1] tracking-[-0.02em] mb-4">
            Level up your <em className="italic text-fern">green game</em>
          </h2>
          <p className="text-[0.9rem] text-mid leading-[1.8] mb-7">
            Every sustainable purchase earns Eco Points. Rise through the ranks from Seed to Forest Guardian and unlock exclusive perks.
          </p>
          <button className="bg-ink text-bg border-[1.5px] border-ink px-9 py-3.5 font-jost font-semibold text-[0.78rem] tracking-[0.12em] uppercase cursor-pointer transition-all duration-250 hover:bg-moss hover:border-moss hover:-translate-y-0.5 hover:shadow-[0_12px_60px_rgba(26,26,20,0.14)]">
            Start Earning
          </button>
        </div>

        {/* Right Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 - Seed */}
          <div className="bg-white border border-ink/10 p-6 transition-all duration-300 hover:border-sage hover:shadow-[0_4px_40px_rgba(26,26,20,0.08)]">
            <span className="text-[2rem] block mb-3">🌱</span>
            <div className="font-playfair font-bold text-[1.1rem] mb-1">Seed</div>
            <span className="font-mono text-[0.6rem] text-sage block mb-3.5">0 – 499 pts</span>
            <div className="h-[3px] bg-black/[0.06] overflow-hidden mb-2.5">
              <div className="h-full bg-gradient-to-r from-fern to-[#a8d88a] w-full"></div>
            </div>
            <div className="text-[0.78rem] text-mid">+5% bonus points</div>
          </div>

          {/* Card 2 - Sapling */}
          <div className="bg-white border border-ink/10 p-6 transition-all duration-300 hover:border-sage hover:shadow-[0_4px_40px_rgba(26,26,20,0.08)]">
            <span className="text-[2rem] block mb-3">🌿</span>
            <div className="font-playfair font-bold text-[1.1rem] mb-1">Sapling</div>
            <span className="font-mono text-[0.6rem] text-sage block mb-3.5">500 – 1,499 pts</span>
            <div className="h-[3px] bg-black/[0.06] overflow-hidden mb-2.5">
              <div className="h-full bg-gradient-to-r from-fern to-[#a8d88a] w-[62%]"></div>
            </div>
            <div className="text-[0.78rem] text-mid">Free eco-packaging</div>
          </div>

          {/* Card 3 - Tree */}
          <div className="bg-white border border-ink/10 p-6 transition-all duration-300 hover:border-sage hover:shadow-[0_4px_40px_rgba(26,26,20,0.08)]">
            <span className="text-[2rem] block mb-3">🌳</span>
            <div className="font-playfair font-bold text-[1.1rem] mb-1">Tree</div>
            <span className="font-mono text-[0.6rem] text-sage block mb-3.5">1,500 – 4,999 pts</span>
            <div className="h-[3px] bg-black/[0.06] overflow-hidden mb-2.5">
              <div className="h-full bg-gradient-to-r from-fern to-[#a8d88a] w-[28%]"></div>
            </div>
            <div className="text-[0.78rem] text-mid">Priority scratch cards</div>
          </div>

          {/* Card 4 - Forest Guardian (Active) */}
          <div className="bg-fern/[0.04] border border-fern p-6 transition-all duration-300 hover:border-sage hover:shadow-[0_4px_40px_rgba(26,26,20,0.08)]">
            <span className="text-[2rem] block mb-3">🌎</span>
            <div className="font-playfair font-bold text-[1.1rem] mb-1">Forest Guardian</div>
            <span className="font-mono text-[0.6rem] text-sage block mb-3.5">5,000+ pts</span>
            <div className="h-[3px] bg-black/[0.06] overflow-hidden mb-2.5">
              <div className="h-full bg-gradient-to-r from-fern to-[#a8d88a] w-[8%]"></div>
            </div>
            <div className="text-[0.78rem] text-mid">20% off + exclusive drops</div>
          </div>
        </div>
      </div>
    </section>
  );
}
