export default function ImpactStrip() {
  return (
    <section className="px-6 py-[60px] md:px-[52px] md:py-[60px] bg-moss text-[#e8f0e8] flex flex-col md:flex-row items-center justify-between gap-10 flex-wrap">
      <div className="max-w-[400px]">
        <h2 className="font-playfair text-[clamp(1.6rem,3vw,2.4rem)] font-bold tracking-[-0.02em] mb-2">
          Your purchases,<br />
          <em className="italic text-mint">planet's gain</em>
        </h2>
        <p className="text-[0.9rem] opacity-70 leading-[1.7]">
          Every eco-certified product you buy plants a seed. Our community has offset 340 tonnes of CO₂ this year alone.
        </p>
      </div>
      
      <div className="flex gap-10">
        <div>
          <span className="font-playfair text-[2.2rem] font-bold text-[#c8ffb0] block">340T</span>
          <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase opacity-60">CO₂ Offset</span>
        </div>
        <div>
          <span className="font-playfair text-[2.2rem] font-bold text-[#c8ffb0] block">48K</span>
          <span className="font-mono text-[0.58rem] tracking-[0.1em] uppercase opacity-60">Bottles Saved</span>
        </div>
      </div>
      
      <button className="bg-[#c8ffb0] text-moss border-none px-8 py-3.5 font-jost font-bold text-[0.8rem] tracking-[0.1em] uppercase cursor-pointer transition-all duration-250 flex-shrink-0 hover:bg-white hover:-translate-y-0.5">
        See Our Impact →
      </button>
    </section>
  );
}
