'use client';

import { useState } from 'react';

export default function Navigation() {
  const [points, setPoints] = useState(0);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuth = () => {
    setIsLoggedIn(true);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPoints(0);
  };

  return (
    <>
      <nav className="sticky top-0 z-[500] bg-[rgba(247,244,239,0.98)] backdrop-blur-[16px] border-b border-[rgba(26,26,20,0.08)] px-[52px] grid grid-cols-[1fr_auto_1fr] items-center h-[72px] md:px-5 md:grid-cols-[auto_1fr] shadow-[0_2px_12px_rgba(26,26,20,0.04)]">
        <div className="flex gap-8 items-center md:hidden">
          <a href="/" className="font-jost font-medium text-[0.75rem] tracking-[0.12em] uppercase text-ink/70 no-underline transition-all duration-250 relative group hover:text-moss">
            Home 
            <span className="absolute bottom-[-3px] left-0 right-0 h-[2px] bg-moss scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a href="#shop" className="font-jost font-medium text-[0.75rem] tracking-[0.12em] uppercase text-ink/70 no-underline transition-all duration-250 relative group hover:text-moss">
            Shop 
            <span className="absolute bottom-[-3px] left-0 right-0 h-[2px] bg-moss scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a href="/travel" className="font-jost font-medium text-[0.75rem] tracking-[0.12em] uppercase text-ink/70 no-underline transition-all duration-250 relative group hover:text-moss">
            Travel ✈️
            <span className="absolute bottom-[-3px] left-0 right-0 h-[2px] bg-moss scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a href="/electricity" className="font-jost font-medium text-[0.75rem] tracking-[0.12em] uppercase text-ink/70 no-underline transition-all duration-250 relative group hover:text-moss">
            Energy ⚡
            <span className="absolute bottom-[-3px] left-0 right-0 h-[2px] bg-moss scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </a>
          <a href="/ml-results" className="font-jost font-medium text-[0.75rem] tracking-[0.12em] uppercase text-ink/70 no-underline transition-all duration-250 relative group hover:text-fern">
            ML 🤖
            <span className="absolute bottom-[-3px] left-0 right-0 h-[2px] bg-fern scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </a>
        </div>
        
        <a href="#" className="text-center font-playfair text-[1.65rem] font-bold tracking-[-0.01em] text-ink no-underline leading-none">
          Eco<span className="text-fern italic">Verse</span>
        </a>
        
        <div className="flex gap-3 items-center justify-end md:gap-2">
          <div className="flex items-center gap-[6px] bg-fern/8 border border-fern/20 rounded-full px-[14px] py-[7px] font-mono text-[0.65rem] text-fern/80 cursor-pointer hover:bg-fern/12 transition-colors duration-200">
            <span className="w-[6px] h-[6px] bg-fern rounded-full animate-pulse" />
            <span id="ptsEl" className="font-semibold">{points} pts</span>
          </div>

          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-moss/10 border border-moss/20 text-moss hover:bg-moss/15 transition-all duration-250 hover:-translate-y-0.5 font-jost text-[0.75rem] font-medium tracking-[0.05em]">
                <span className="w-2 h-2 bg-moss rounded-full"></span>
                Account
              </button>
              <div className="absolute right-0 mt-2 w-[160px] bg-bg border border-ink/15 rounded-lg shadow-[0_12px_40px_rgba(26,26,20,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2 z-[600]">
                <button className="w-full text-left px-4 py-2 text-ink/70 hover:text-moss hover:bg-moss/5 transition-all duration-200 font-jost text-[0.75rem]">Profile</button>
                <button className="w-full text-left px-4 py-2 text-ink/70 hover:text-moss hover:bg-moss/5 transition-all duration-200 font-jost text-[0.75rem]">Orders</button>
                <button className="w-full text-left px-4 py-2 text-ink/70 hover:text-moss hover:bg-moss/5 transition-all duration-200 font-jost text-[0.75rem] border-t border-ink/10">Rewards</button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600/70 hover:text-red-600 hover:bg-red-50/50 transition-all duration-200 font-jost text-[0.75rem] border-t border-ink/10"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => { setIsAuthOpen(true); setAuthMode('login'); }}
                className="px-5 py-2 font-jost font-medium text-[0.75rem] tracking-[0.08em] uppercase text-moss border border-moss/30 rounded-full bg-transparent hover:bg-moss/8 transition-all duration-250 hover:-translate-y-0.5"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setIsAuthOpen(true); setAuthMode('signup'); }}
                className="px-5 py-2 font-jost font-semibold text-[0.75rem] tracking-[0.08em] uppercase text-bg bg-moss border border-moss rounded-full hover:bg-leaf transition-all duration-250 hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(45,90,61,0.2)] hover:shadow-[0_8px_24px_rgba(45,90,61,0.3)]"
              >
                Sign Up
              </button>
            </>
          )}
          
          <button 
            onClick={scrollToShop}
            className="hidden md:block bg-moss text-bg border-none rounded-full px-5 py-2 font-jost font-semibold text-[0.75rem] tracking-[0.08em] uppercase cursor-pointer transition-all duration-250 hover:bg-leaf hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(45,90,61,0.15)]"
          >
            Shop
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      {isAuthOpen && (
        <div 
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-[700] transition-opacity duration-300"
          onClick={() => setIsAuthOpen(false)}
        >
          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[400px] bg-bg border border-ink/15 rounded-2xl shadow-[0_20px_80px_rgba(26,26,20,0.25)] p-8 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsAuthOpen(false)}
              className="absolute top-6 right-6 text-ink/40 hover:text-ink/70 transition-colors duration-200 text-[1.5rem]"
            >
              ✕
            </button>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-ink/10">
              {['login', 'signup'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAuthMode(mode as 'login' | 'signup')}
                  className={`pb-3 font-jost font-medium text-[0.85rem] tracking-[0.05em] uppercase transition-all duration-250 relative ${
                    authMode === mode 
                      ? 'text-moss' 
                      : 'text-ink/50 hover:text-ink/70'
                  }`}
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  {authMode === mode && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-moss" />
                  )}
                </button>
              ))}
            </div>

            {/* Form Content */}
            {authMode === 'login' ? (
              <div className="space-y-5">
                <h2 className="font-playfair text-[1.8rem] font-bold text-ink mb-6">Welcome Back</h2>
                
                <div>
                  <label className="block font-jost text-[0.75rem] tracking-[0.08em] uppercase text-ink/60 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-bg2 border border-ink/15 rounded-lg font-jost text-[0.95rem] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss transition-all duration-250"
                  />
                </div>

                <div>
                  <label className="block font-jost text-[0.75rem] tracking-[0.08em] uppercase text-ink/60 mb-2">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-bg2 border border-ink/15 rounded-lg font-jost text-[0.95rem] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss transition-all duration-250"
                  />
                </div>

                <button 
                  onClick={handleAuth}
                  className="w-full mt-6 px-6 py-3 bg-moss text-bg font-jost font-semibold text-[0.85rem] tracking-[0.08em] uppercase rounded-lg hover:bg-leaf transition-all duration-250 hover:shadow-[0_8px_24px_rgba(45,90,61,0.3)]"
                >
                  Sign In
                </button>

                <button className="w-full text-center text-ink/50 hover:text-moss font-jost text-[0.75rem] tracking-[0.05em] transition-colors duration-200 mt-4">
                  Forgot Password?
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <h2 className="font-playfair text-[1.8rem] font-bold text-ink mb-6">Join EcoVerse</h2>
                
                <div>
                  <label className="block font-jost text-[0.75rem] tracking-[0.08em] uppercase text-ink/60 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full px-4 py-3 bg-bg2 border border-ink/15 rounded-lg font-jost text-[0.95rem] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss transition-all duration-250"
                  />
                </div>

                <div>
                  <label className="block font-jost text-[0.75rem] tracking-[0.08em] uppercase text-ink/60 mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-bg2 border border-ink/15 rounded-lg font-jost text-[0.95rem] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss transition-all duration-250"
                  />
                </div>

                <div>
                  <label className="block font-jost text-[0.75rem] tracking-[0.08em] uppercase text-ink/60 mb-2">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-bg2 border border-ink/15 rounded-lg font-jost text-[0.95rem] text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-moss focus:border-moss transition-all duration-250"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox" 
                    id="terms"
                    className="mt-1 w-4 h-4 accent-moss cursor-pointer"
                  />
                  <label htmlFor="terms" className="font-jost text-[0.75rem] text-ink/60 cursor-pointer leading-[1.5]">
                    I agree to the Terms & Conditions and Privacy Policy
                  </label>
                </div>

                <button 
                  onClick={handleAuth}
                  className="w-full mt-6 px-6 py-3 bg-moss text-bg font-jost font-semibold text-[0.85rem] tracking-[0.08em] uppercase rounded-lg hover:bg-leaf transition-all duration-250 hover:shadow-[0_8px_24px_rgba(45,90,61,0.3)]"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Social Login */}
            <div className="mt-8 pt-6 border-t border-ink/10">
              <p className="text-center text-ink/50 font-jost text-[0.75rem] mb-4 tracking-[0.05em]">OR CONTINUE WITH</p>
              <div className="grid grid-cols-3 gap-3">
                <button className="px-4 py-2.5 bg-bg2 border border-ink/15 rounded-lg hover:bg-bg2/80 transition-all duration-200 font-jost text-[0.7rem] text-ink/70">Google</button>
                <button className="px-4 py-2.5 bg-bg2 border border-ink/15 rounded-lg hover:bg-bg2/80 transition-all duration-200 font-jost text-[0.7rem] text-ink/70">Apple</button>
                <button className="px-4 py-2.5 bg-bg2 border border-ink/15 rounded-lg hover:bg-bg2/80 transition-all duration-200 font-jost text-[0.7rem] text-ink/70">Meta</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
