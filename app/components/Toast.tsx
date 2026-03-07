export default function Toast() {
  return (
    <div 
      id="toast" 
      className="fixed bottom-7 right-7 bg-white border border-ink/10 shadow-lg px-6 py-[18px] z-[850] flex items-center gap-3.5 min-w-[280px] translate-y-20 opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none [&.show]:translate-y-0 [&.show]:opacity-100"
    >
      <span className="text-[1.3rem]">🌿</span>
      <div>
        <div className="font-playfair font-semibold text-[0.95rem]">
          +<span id="tPts" className="text-fern">50</span> Eco Points!
        </div>
        <div id="tSub" className="font-mono text-[0.58rem] text-muted mt-0.5">
          Added to wallet
        </div>
      </div>
    </div>
  );
}
