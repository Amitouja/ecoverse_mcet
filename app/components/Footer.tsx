export default function Footer() {
  return (
    <footer className="bg-moss text-bg">
      <div className="px-6 md:px-[52px] py-[64px] md:py-[80px]">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-[52px]">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="font-playfair text-[1.8rem] font-bold mb-4">
              Eco<span className="text-mint italic">Verse</span>
            </div>
            <p className="font-jost text-[0.95rem] leading-[1.6] text-bg/80 mb-6 max-w-[280px]">
              Fashion that heals the planet. Conscious choices for a sustainable future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-bg/10 hover:bg-bg/20 rounded-lg transition-colors duration-200 text-[0.9rem]">f</a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-bg/10 hover:bg-bg/20 rounded-lg transition-colors duration-200 text-[0.9rem]">𝕏</a>
              <a href="#" className="w-9 h-9 flex items-center justify-center bg-bg/10 hover:bg-bg/20 rounded-lg transition-colors duration-200 text-[0.9rem]">📷</a>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-jost font-semibold text-[0.9rem] tracking-[0.1em] uppercase mb-6 text-bg">Shop</h3>
            <ul className="space-y-3">
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">New Arrivals</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">All Products</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Collections</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Sale</a></li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="font-jost font-semibold text-[0.9rem] tracking-[0.1em] uppercase mb-6 text-bg">Community</h3>
            <ul className="space-y-3">
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Eco Ranks</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Rewards</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">AI Stylist</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Blog</a></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-jost font-semibold text-[0.9rem] tracking-[0.1em] uppercase mb-6 text-bg">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Shipping Info</a></li>
              <li><a href="#" className="font-jost text-[0.9rem] text-bg/70 hover:text-bg transition-colors duration-200">Returns</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-bg/20 pt-[52px] mb-[52px]">
          <h3 className="font-playfair text-[1.4rem] font-bold mb-4">Stay Updated</h3>
          <p className="font-jost text-[0.95rem] text-bg/80 mb-6 max-w-[400px]">Join our community for exclusive offers and sustainability tips.</p>
          <div className="flex gap-3 max-w-[400px]">
            <input 
              type="email" 
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-bg text-ink rounded-lg font-jost text-[0.95rem] placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-leaf"
            />
            <button className="px-6 py-3 bg-leaf hover:bg-[#4d8a60] transition-colors duration-250 text-bg font-jost font-semibold text-[0.85rem] tracking-[0.08em] uppercase rounded-lg">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-bg/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-bg/60">
            © 2025 EcoVerse · Powered by Google Gemini AI · Wear the Future
          </p>
          <div className="flex gap-8">
            <a href="#" className="font-jost text-[0.75rem] tracking-[0.08em] uppercase text-bg/60 hover:text-bg transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="font-jost text-[0.75rem] tracking-[0.08em] uppercase text-bg/60 hover:text-bg transition-colors duration-200">Terms & Conditions</a>
            <a href="#" className="font-jost text-[0.75rem] tracking-[0.08em] uppercase text-bg/60 hover:text-bg transition-colors duration-200">Sustainability</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
