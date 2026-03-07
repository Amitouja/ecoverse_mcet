'use client';

import { useState } from 'react';
import Image from 'next/image';

const PRODUCTS = [
  { name: 'Organic Linen Tee', img: '/stack.jpeg', price: '₹1,299', pts: 50, eco: 95, cat: 'organic', mat: '100% Organic Cotton' },
  { name: 'Recycled Bomber Jacket', img: '/jacket.jpeg', price: '₹3,499', pts: 70, eco: 88, cat: 'recycled', mat: 'Post-Consumer Polyester' },
  { name: 'Hemp Canvas Kicks', img: '/sneaker.jpeg', price: '₹2,799', pts: 60, eco: 91, cat: 'vegan', mat: 'Natural Hemp Fibre' },
  { name: 'Bamboo Blend Joggers', img: '/bottoms.jpeg', price: '₹1,899', pts: 45, eco: 86, cat: 'organic', mat: 'Organic Bamboo Blend' },
  { name: 'Cactus Leather Jacket', img: '/jacket.jpeg', price: '₹5,999', pts: 80, eco: 82, cat: 'vegan', mat: 'Nopal Cactus Leather' },
  { name: 'Ocean Plastic Hoodie', img: '/ocean.jpeg', price: '₹2,199', pts: 65, eco: 93, cat: 'recycled', mat: 'Ocean-Recovered Nylon' },
  { name: 'TENCEL Midi Dress', img: '/middress.jpeg', price: '₹2,899', pts: 55, eco: 90, cat: 'organic', mat: 'TENCEL™ Lyocell' },
  { name: 'Cork Sneakers', img: '/corkshoes.jpeg', price: '₹3,199', pts: 62, eco: 89, cat: 'vegan', mat: 'Natural Cork + Recycled Rubber' },
];

export default function Shop() {
  const [filter, setFilter] = useState('all');

  const filteredProducts = filter === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.cat === filter);

  const handleAddToCart = (e: React.MouseEvent, product: typeof PRODUCTS[0]) => {
    e.stopPropagation();
    
    // Burst animation
    const emojis = ['🌿', '🍃', '🌱', '✨', '💚'];
    for (let i = 0; i < 8; i++) {
      const burst = document.createElement('span');
      burst.className = 'burst';
      burst.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const angle = (Math.PI * 2 / 8) * i;
      const distance = 50 + Math.random() * 40;
      burst.style.left = (e.clientX - 8) + 'px';
      burst.style.top = (e.clientY - 8) + 'px';
      burst.style.setProperty('--bx', Math.cos(angle) * distance + 'px');
      burst.style.setProperty('--by', (Math.sin(angle) * distance - 50) + 'px');
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 900);
    }

    // Show toast
    const toast = document.getElementById('toast');
    const tPts = document.getElementById('tPts');
    const tSub = document.getElementById('tSub');
    if (toast && tPts && tSub) {
      tPts.textContent = product.pts.toString();
      tSub.textContent = `${product.name}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2600);
    }

    // Update points in nav
    const ptsEl = document.getElementById('ptsEl');
    if (ptsEl) {
      const currentPts = parseInt(ptsEl.textContent || '0');
      ptsEl.textContent = `${currentPts + product.pts} pts`;
    }
  };

  return (
    <section className="px-6 py-20 md:px-[52px] md:py-24 bg-bg2" id="shop">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 opacity-0 translate-y-[30px] transition-all duration-[650ms] ease-out [.in&]:opacity-100 [.in&]:translate-y-0">
        <div>
          <span className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-sage block mb-2">// New Arrivals</span>
          <h2 className="font-playfair text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.15] tracking-[-0.01em]">
            Shop <em className="italic text-fern">Consciously</em>
          </h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button 
            className={`px-5 py-2 font-jost font-medium text-[0.72rem] tracking-[0.08em] uppercase border border-ink/10 cursor-pointer transition-all duration-250 ${filter === 'all' ? 'bg-ink text-bg border-ink' : 'bg-white text-ink hover:border-sage'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-5 py-2 font-jost font-medium text-[0.72rem] tracking-[0.08em] uppercase border border-ink/10 cursor-pointer transition-all duration-250 ${filter === 'organic' ? 'bg-ink text-bg border-ink' : 'bg-white text-ink hover:border-sage'}`}
            onClick={() => setFilter('organic')}
          >
            Organic
          </button>
          <button 
            className={`px-5 py-2 font-jost font-medium text-[0.72rem] tracking-[0.08em] uppercase border border-ink/10 cursor-pointer transition-all duration-250 ${filter === 'recycled' ? 'bg-ink text-bg border-ink' : 'bg-white text-ink hover:border-sage'}`}
            onClick={() => setFilter('recycled')}
          >
            Recycled
          </button>
          <button 
            className={`px-5 py-2 font-jost font-medium text-[0.72rem] tracking-[0.08em] uppercase border border-ink/10 cursor-pointer transition-all duration-250 ${filter === 'vegan' ? 'bg-ink text-bg border-ink' : 'bg-white text-ink hover:border-sage'}`}
            onClick={() => setFilter('vegan')}
          >
            Vegan
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5 opacity-0 translate-y-[30px] transition-all duration-[650ms] ease-out delay-100 [.in&]:opacity-100 [.in&]:translate-y-0">
        {filteredProducts.map((product, i) => (
          <div 
            key={i} 
            className="bg-white border border-ink/10 relative overflow-hidden cursor-pointer transition-shadow duration-300 flex flex-col hover:shadow-lg hover:z-[2] group"
            style={{ transitionDelay: `${i * 0.06}s` }}
          >
            <div className="aspect-[0.85] relative overflow-hidden bg-bg2">
              <Image 
                src={product.img} 
                alt={product.name} 
                width={300} 
                height={350} 
                className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/[0.06]">
                <div 
                  className="h-full bg-gradient-to-r from-fern to-mint" 
                  style={{ width: `${product.eco}%` }}
                />
              </div>
              <div className="absolute inset-0 bg-ink/[0.04] opacity-0 transition-opacity duration-300 flex items-end p-4 group-hover:opacity-100">
                <button 
                  className="w-full px-3 py-3 bg-ink text-bg border-none font-jost font-semibold text-[0.75rem] tracking-[0.1em] uppercase cursor-pointer transition-all duration-300 translate-y-2.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-moss"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="p-[18px] flex-1 flex flex-col">
              <div className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-sage mb-1.5">
                {product.cat} · ECO {product.eco}
              </div>
              <div className="font-playfair font-semibold text-[1rem] mb-1 leading-[1.3]">
                {product.name}
              </div>
              <div className="text-[0.78rem] text-muted mb-3.5">
                {product.mat}
              </div>
              <div className="flex justify-between items-center mt-auto">
                <span className="font-playfair font-bold text-[1.1rem]">{product.price}</span>
                <span className="font-mono text-[0.6rem] text-fern">🌱 +{product.pts} pts</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
