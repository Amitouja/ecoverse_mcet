export default function RealImpact() {
  return (
    <section className="px-6 py-20 md:px-[52px] md:py-20 border-t border-ink/10">
      <span className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-sage block mb-3">
        // Community Impact
      </span>
      <h2 className="font-playfair text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold tracking-[-0.02em] mb-2.5">
        Real <em className="italic text-fern">impact</em>, tracked
      </h2>
      <p className="text-mid text-[0.92rem] mt-2.5 max-w-[480px] leading-[1.8] mb-[52px]">
        Every purchase is a vote for a better planet. Here's what 12,000+ EcoVerse members have achieved together.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
        {/* Impact 1 */}
        <div className="bg-bg2 px-8 py-10 border border-ink/10">
          <span className="font-playfair text-[3.2rem] font-bold text-fern block leading-none">
            890K
          </span>
          <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-muted block my-1.5">
            Thousand Litres
          </span>
          <div className="text-[0.85rem] text-mid leading-[1.7] mb-5">
            Water saved through sustainable fabric choices across all orders.
          </div>
          <div className="h-0.5 bg-black/[0.08]">
            <div className="h-full bg-gradient-to-r from-fern to-[#a8d88a] w-[78%]"></div>
          </div>
        </div>

        {/* Impact 2 */}
        <div className="bg-bg2 px-8 py-10 border border-ink/10">
          <span className="font-playfair text-[3.2rem] font-bold text-fern block leading-none">
            340T
          </span>
          <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-muted block my-1.5">
            Tonnes CO₂
          </span>
          <div className="text-[0.85rem] text-mid leading-[1.7] mb-5">
            Carbon emissions offset by choosing recycled and organic materials.
          </div>
          <div className="h-0.5 bg-black/[0.08]">
            <div className="h-full bg-gradient-to-r from-fern to-[#a8d88a] w-[54%]"></div>
          </div>
        </div>

        {/* Impact 3 */}
        <div className="bg-bg2 px-8 py-10 border border-ink/10">
          <span className="font-playfair text-[3.2rem] font-bold text-fern block leading-none">
            48K
          </span>
          <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-muted block my-1.5">
            Thousand Bottles
          </span>
          <div className="text-[0.85rem] text-mid leading-[1.7] mb-5">
            Plastic bottles rescued from oceans, transformed into fabric.
          </div>
          <div className="h-0.5 bg-black/[0.08]">
            <div className="h-full bg-gradient-to-r from-fern to-[#a8d88a] w-[91%]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
