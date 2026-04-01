"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product { id:number; name:string; material:string; price:string; priceNum:number; pts:string; tag:"ORGANIC"|"RECYCLED"|"VEGAN"; ecoScore:number; img:string; bgColor:string; }
interface Category { name:string; count:number; img:string; bg:string; }
interface AuthUser { name:string; email:string; pts:number; }
interface CartItem { product:Product; quantity:number; }
interface CheckoutData { fullName:string; email:string; phone:string; address:string; city:string; state:string; pincode:string; cardNumber:string; cardName:string; cardExpiry:string; cardCVV:string; }
interface Order { id?:string; user_email:string; items:CartItem[]; total:number; address:CheckoutData; status:string; created_at?:string; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories: Category[] = [
  { name:"Tops & Tees", count:24, bg:"#d4e6c3", img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80" },
  { name:"Bottoms",     count:18, bg:"#e8d9c0", img:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" },
  { name:"Outerwear",   count:12, bg:"#c8d8e8", img:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80" },
  { name:"Footwear",    count:9,  bg:"#d8cce8", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { name:"Accessories", count:15, bg:"#e8e4d4", img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
  { name:"Dresses",     count:11, bg:"#e4d4e8", img:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80" },
];

const products: Product[] = [
  { id:1,  name:"Organic Linen Tee",     material:"100% Organic Cotton",     price:"₹1,299", priceNum:1299, pts:"+50 pts", tag:"ORGANIC",  ecoScore:95, bgColor:"#eef5e8", img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=85" },
  { id:2,  name:"Recycled Bomber",       material:"Post-Consumer Polyester", price:"₹3,499", priceNum:3499, pts:"+70 pts", tag:"RECYCLED", ecoScore:88, bgColor:"#e8ede3", img:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&q=85" },
  { id:3,  name:"Hemp Canvas Kicks",     material:"Natural Hemp Fibre",      price:"₹2,799", priceNum:2799, pts:"+60 pts", tag:"VEGAN",    ecoScore:91, bgColor:"#e3eaf0", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85" },
  { id:4,  name:"Bamboo Joggers",        material:"Organic Bamboo Blend",    price:"₹1,899", priceNum:1899, pts:"+45 pts", tag:"ORGANIC",  ecoScore:86, bgColor:"#f0ebe3", img:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=85" },
  { id:5,  name:"Cactus Leather Jacket", material:"Nopal Cactus Leather",    price:"₹5,999", priceNum:5999, pts:"+80 pts", tag:"VEGAN",    ecoScore:82, bgColor:"#e8ede3", img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=85" },
  { id:6,  name:"Hemp Maxi Dress",       material:"Hemp & TENCEL™ Blend",    price:"₹2,499", priceNum:2499, pts:"+55 pts", tag:"ORGANIC",  ecoScore:93, bgColor:"#f0ebe3", img:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=85" },
  { id:7,  name:"Recycled Denim",        material:"Post-Consumer Denim",     price:"₹2,199", priceNum:2199, pts:"+65 pts", tag:"RECYCLED", ecoScore:87, bgColor:"#e3eaf0", img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=85" },
  { id:8,  name:"Cork Crossbody",        material:"Sustainable Cork Bark",   price:"₹1,699", priceNum:1699, pts:"+40 pts", tag:"VEGAN",    ecoScore:94, bgColor:"#e8d9c0", img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=85" },
  { id:9,  name:"Merino Sweater",        material:"Certified Merino Wool",   price:"₹3,999", priceNum:3999, pts:"+75 pts", tag:"ORGANIC",  ecoScore:89, bgColor:"#f0ebe3", img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&q=85" },
  { id:10, name:"Piñatex Sneakers",      material:"Pineapple Leaf Fibre",    price:"₹3,299", priceNum:3299, pts:"+68 pts", tag:"VEGAN",    ecoScore:90, bgColor:"#e8ede3", img:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=700&q=85" },
];

const ecoRanks = [
  { icon:"🌱", name:"Seed",            range:"0 – 499 pts",       perk:"+5% bonus points",          progress:100 },
  { icon:"🌿", name:"Sapling",         range:"500 – 1,499 pts",   perk:"Free eco-packaging",        progress:65  },
  { icon:"🌳", name:"Tree",            range:"1,500 – 4,999 pts", perk:"Priority scratch cards",    progress:30  },
  { icon:"🌍", name:"Forest Guardian", range:"5,000+ pts",         perk:"20% off + exclusive drops", progress:10, highlight:true },
];

const CHAT_SEED = [
  { from:"bot",  text:"Hello! 🌿 I'm EcoBot. Ask me about eco scores, sustainable outfits, or how to earn Eco Points!" },
  { from:"user", text:"How eco-friendly is the Recycled Bomber?" },
  { from:"bot",  text:"Great pick! 🧥 The Recycled Bomber uses 100% post-consumer polyester — 12 plastic bottles given new life. ECO Score: 88/100. Saves 40% water vs traditional fabric!" },
];

const SCRATCH_REWARDS = ["🎉 10% OFF","🚚 Free Shipping","🌿 2x Points","🎁 Mystery Gift","⭐ 100 Bonus Pts","💚 5% Cashback","🌱 Plant a Tree","✨ VIP Access"];

// ─── Supabase Integration ──────────────────────────────────────────────────────
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Supabase client
const createSupabaseClient = () => {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn("⚠️ Supabase credentials not configured. Using localStorage fallback.");
    return null;
  }
  
  return {
    from: (table: string) => ({
      insert: async (data: any) => {
        try {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SUPABASE_KEY}`,
              apiKey: SUPABASE_KEY,
            },
            body: JSON.stringify(data),
          });
          return { data: await response.json(), error: response.ok ? null : "Insert failed" };
        } catch (error) {
          return { data: null, error };
        }
      },
      select: async () => ({
        eq: async (column: string, value: any) => {
          try {
            const response = await fetch(
              `${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`,
              {
                headers: {
                  Authorization: `Bearer ${SUPABASE_KEY}`,
                  apiKey: SUPABASE_KEY,
                },
              }
            );
            return { data: await response.json(), error: response.ok ? null : "Select failed" };
          } catch (error) {
            return { data: null, error };
          }
        },
      }),
    }),
  };
};

// Save order to Supabase
async function saveOrderToSupabase(order: Order) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // Fallback to localStorage if Supabase not configured
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push({ ...order, id: Date.now().toString(), created_at: new Date().toISOString() });
    localStorage.setItem("orders", JSON.stringify(orders));
    return { success: true, message: "Order saved to localStorage" };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_KEY}`,
        apiKey: SUPABASE_KEY,
      },
      body: JSON.stringify({
        user_email: order.user_email,
        items: order.items,
        total: order.total,
        address: order.address,
        status: "pending",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save order");
    }

    return { success: true, message: "Order saved successfully" };
  } catch (error) {
    console.error("Error saving order:", error);
    // Fallback to localStorage
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    orders.push({ ...order, id: Date.now().toString(), created_at: new Date().toISOString() });
    localStorage.setItem("orders", JSON.stringify(orders));
    return { success: true, message: "Order saved to localStorage" };
  }
}

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── LEAF PARTICLE SIMULATOR ──────────────────────────────────────────────────
// Realistic falling leaves using AI-driven physics: wind, gravity, flutter, tumble
interface Leaf {
  x: number; y: number;
  vx: number; vy: number;
  angle: number; angVel: number;
  scale: number; opacity: number;
  type: number;      // 0-4 different leaf shapes
  color: string;
  flutter: number;   // flutter frequency
  flutterAmp: number;
  windInfluence: number;
  life: number;      // 0–1, dies and resets
  maxLife: number;
}

function LeafParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const wind = useRef({ x: 0.3, turbulence: 0 });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Draw a single realistic leaf shape ──────────────────────────────────
    const drawLeaf = (ctx: CanvasRenderingContext2D, type: number, color: string, scale: number) => {
      ctx.fillStyle = color;
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 0.4;

      if (type === 0) {
        // Elliptical leaf (like mango/ficus)
        ctx.beginPath();
        ctx.ellipse(0, 0, 14 * scale, 7 * scale, 0, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        // Midrib
        ctx.beginPath(); ctx.moveTo(-14 * scale, 0); ctx.lineTo(14 * scale, 0);
        ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 0.6 * scale; ctx.stroke();
        // Veins
        for (let v = -3; v <= 3; v++) {
          ctx.beginPath(); ctx.moveTo(v * 4 * scale, 0);
          ctx.quadraticCurveTo(v * 4 * scale + 3 * scale, -5 * scale, v * 5 * scale, -6 * scale * (1 - Math.abs(v) / 4));
          ctx.strokeStyle = "rgba(0,0,0,0.07)"; ctx.lineWidth = 0.3 * scale; ctx.stroke();
        }
      } else if (type === 1) {
        // Tear-drop / pointed leaf (like neem/tulsi)
        ctx.beginPath();
        ctx.moveTo(0, -18 * scale);
        ctx.bezierCurveTo(9 * scale, -10 * scale, 10 * scale, 4 * scale, 0, 8 * scale);
        ctx.bezierCurveTo(-10 * scale, 4 * scale, -9 * scale, -10 * scale, 0, -18 * scale);
        ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -18 * scale); ctx.lineTo(0, 8 * scale);
        ctx.strokeStyle = "rgba(0,0,0,0.14)"; ctx.lineWidth = 0.5 * scale; ctx.stroke();
      } else if (type === 2) {
        // Oak-like lobed leaf
        ctx.beginPath();
        const pts = [[-4,-16],[3,-14],[7,-10],[12,-6],[10,0],[7,4],[3,8],[0,10],[-3,8],[-7,4],[-10,0],[-12,-6],[-7,-10],[-3,-14]];
        ctx.moveTo(pts[0][0] * scale, pts[0][1] * scale);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * scale, pts[i][1] * scale);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -16 * scale); ctx.lineTo(0, 10 * scale);
        ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 0.5 * scale; ctx.stroke();
      } else if (type === 3) {
        // Small round leaf (like eucalyptus)
        ctx.beginPath();
        ctx.ellipse(0, 0, 9 * scale, 11 * scale, 0.3, 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -11 * scale); ctx.lineTo(0, 11 * scale);
        ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 0.4 * scale; ctx.stroke();
      } else {
        // Heart-shaped leaf (like paan/betel)
        ctx.beginPath();
        ctx.moveTo(0, 6 * scale);
        ctx.bezierCurveTo(-12 * scale, -2 * scale, -14 * scale, -14 * scale, 0, -10 * scale);
        ctx.bezierCurveTo(14 * scale, -14 * scale, 12 * scale, -2 * scale, 0, 6 * scale);
        ctx.fill(); ctx.stroke();
      }
    };

    // ── Leaf color palette — autumn + green + russet ─────────────────────────
    const leafColors = [
      "rgba(74,130,56,0.85)",   // fresh green
      "rgba(95,155,68,0.80)",   // mid green
      "rgba(140,185,85,0.75)",  // yellow-green
      "rgba(178,142,56,0.80)",  // golden
      "rgba(160,100,40,0.75)",  // amber
      "rgba(130,80,35,0.70)",   // russet
      "rgba(85,135,65,0.82)",   // forest green
      "rgba(165,175,70,0.75)",  // olive
    ];

    // ── Spawn leaf ────────────────────────────────────────────────────────────
    const spawnLeaf = (): Leaf => ({
      x: Math.random() * (canvas.width + 200) - 100,
      y: -30 - Math.random() * 100,
      vx: (Math.random() - 0.4) * 0.8,
      vy: 0.6 + Math.random() * 1.0,
      angle: Math.random() * Math.PI * 2,
      angVel: (Math.random() - 0.5) * 0.04,
      scale: 0.55 + Math.random() * 0.7,
      opacity: 0.7 + Math.random() * 0.3,
      type: Math.floor(Math.random() * 5),
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
      flutter: 0.04 + Math.random() * 0.06,
      flutterAmp: 0.8 + Math.random() * 1.4,
      windInfluence: 0.4 + Math.random() * 0.8,
      life: 0,
      maxLife: 400 + Math.random() * 300,
    });

    // Spawn 45 leaves (not too many — elegant density)
    const leaves: Leaf[] = Array.from({ length: 45 }, spawnLeaf).map(l => ({
      ...l,
      y: Math.random() * canvas.height, // start scattered
      life: Math.random() * l.maxLife,  // stagger existing leaves
    }));

    let time = 0;

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      // Slowly evolving wind
      wind.current.turbulence = Math.sin(time * 0.008) * 0.4 + Math.sin(time * 0.013) * 0.25;
      wind.current.x = 0.25 + Math.sin(time * 0.005) * 0.3 + wind.current.turbulence;

      leaves.forEach((leaf, i) => {
        leaf.life++;

        // Gravity
        leaf.vy += 0.018;
        // Wind with individual influence factor
        const windEffect = wind.current.x * leaf.windInfluence;
        leaf.vx += (windEffect - leaf.vx) * 0.02;
        // Terminal velocity
        leaf.vy = Math.min(leaf.vy, 2.2);
        // Flutter — side-to-side oscillation (air resistance)
        const flutterX = Math.sin(time * leaf.flutter + i * 2.1) * leaf.flutterAmp;
        const flutterScale = Math.sin(time * leaf.flutter * 0.7 + i) * 0.12; // visual depth

        leaf.x += leaf.vx + flutterX * 0.4;
        leaf.y += leaf.vy;
        leaf.angle += leaf.angVel + flutterX * 0.01;

        // Fade in/out at birth and death
        const lifeFrac = leaf.life / leaf.maxLife;
        const fadeIn  = Math.min(1, leaf.life / 40);
        const fadeOut = lifeFrac > 0.85 ? 1 - (lifeFrac - 0.85) / 0.15 : 1;
        const alpha   = leaf.opacity * fadeIn * fadeOut;

        // Respawn when off-screen or dead
        if (leaf.y > canvas.height + 60 || leaf.x < -150 || leaf.x > canvas.width + 150 || leaf.life > leaf.maxLife) {
          leaves[i] = spawnLeaf();
          return;
        }

        // Draw with perspective-like scale (flutter makes leaf appear to tilt)
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        ctx.scale(1 + flutterScale * 0.5, 1 - Math.abs(flutterScale) * 0.3);
        ctx.globalAlpha = alpha;
        // Shadow
        ctx.shadowColor = "rgba(30,60,20,0.18)";
        ctx.shadowBlur  = 4;
        ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 3;
        drawLeaf(ctx, leaf.type, leaf.color, leaf.scale);
        ctx.restore();
      });

      raf.current = requestAnimationFrame(tick);
    };

    tick();
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"fixed", top:0, left:0, width:"100%", height:"100%",
      pointerEvents:"none", zIndex:1,
    }} />
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function CustomCursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const pos  = useRef({ x:-200, y:-200 });
  const rp   = useRef({ x:-200, y:-200 });
  const hov  = useRef(false);
  const raf  = useRef(0);
  useEffect(() => {
    document.documentElement.style.cursor = "none";
    const mv = (e: MouseEvent) => {
      pos.current = { x:e.clientX, y:e.clientY };
      hov.current = !!(e.target as HTMLElement).closest("button,a,[data-hover]");
    };
    const tick = () => {
      const { x, y } = pos.current;
      if (dot.current) dot.current.style.transform = `translate(${x-4}px,${y-4}px)`;
      rp.current.x += (x - rp.current.x) * 0.11;
      rp.current.y += (y - rp.current.y) * 0.11;
      if (ring.current) {
        ring.current.style.transform = `translate(${rp.current.x-20}px,${rp.current.y-20}px) scale(${hov.current ? 2.1 : 1})`;
        ring.current.style.borderColor = hov.current ? "rgba(45,106,79,0.7)" : "rgba(0,0,0,0.5)";
      }
      raf.current = requestAnimationFrame(tick);
    };
    document.addEventListener("mousemove", mv);
    raf.current = requestAnimationFrame(tick);
    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", mv);
      cancelAnimationFrame(raf.current);
    };
  }, []);
  return (
    <>
      <div ref={dot}  style={{ position:"fixed",top:0,left:0,zIndex:99999,width:8,height:8,borderRadius:"50%",background:"#1a3a2a",boxShadow:"0 0 10px 3px rgba(26,58,42,0.5)",pointerEvents:"none",willChange:"transform" }} />
      <div ref={ring} style={{ position:"fixed",top:0,left:0,zIndex:99998,width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(0,0,0,0.5)",background:"rgba(0,0,0,0.02)",pointerEvents:"none",willChange:"transform",transition:"border-color 0.2s,transform 0.07s linear" }} />
      <style>{`*{cursor:none!important}`}</style>
    </>
  );
}

// ─── Announcement Bar ─────────────────────────────────────────────────────────
function AnnouncementBar() {
  const items = ["🌿 FREE SHIPPING ABOVE ₹999","✦ EARN 2X ECO POINTS THIS WEEK","🌱 PLANTED 48K TREES","♻️ 100% SUSTAINABLE PACKAGING","🌍 CARBON-NEUTRAL DELIVERIES","✦ NEW ARRIVALS EVERY FRIDAY","🎁 MYSTERY REWARDS ON EVERY ORDER","🌿 FREE SHIPPING ABOVE ₹999","✦ EARN 2X ECO POINTS THIS WEEK","🌱 PLANTED 48K TREES","♻️ 100% SUSTAINABLE PACKAGING","🌍 CARBON-NEUTRAL DELIVERIES","✦ NEW ARRIVALS EVERY FRIDAY","🎁 MYSTERY REWARDS ON EVERY ORDER"];
  return (
    <div style={{ background:"#0f2218",overflow:"hidden",padding:"9px 0",position:"relative",zIndex:200 }}>
      <div style={{ display:"flex",animation:"marquee 32s linear infinite",width:"max-content" }}>
        {items.map((item,i) => <span key={i} style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.18em",padding:"0 28px",whiteSpace:"nowrap",color:i%4===1?"#f0d080":i%4===3?"#80c8f0":"#a8d5a2" }}>{item}</span>)}
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ─── Floating Navigation ──────────────────────────────────────────────────────
function Navigation({ activeTab, setActiveTab, onSignInClick, user, onSignOut }:
  { activeTab:string; setActiveTab:(t:string)=>void; onSignInClick:()=>void; user:AuthUser|null; onSignOut:()=>void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", zIndex:500,
      top:   scrolled ? "10px" : "0",
      left:  scrolled ? "16px" : "0",
      right: scrolled ? "16px" : "0",
      height: scrolled ? "56px" : "64px",
      background: "rgba(245,242,235,0.96)",
      backdropFilter:"blur(24px) saturate(1.8)",
      borderRadius: scrolled ? "16px" : "0",
      border:       scrolled ? "1px solid rgba(220,215,200,0.8)" : "none",
      borderBottom: scrolled ? "none" : "1.5px solid rgba(224,219,208,0.7)",
      boxShadow:    scrolled ? "0 8px 40px rgba(0,0,0,0.1),0 2px 8px rgba(0,0,0,0.06)" : "0 1px 0 rgba(224,219,208,0.5)",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding: scrolled ? "0 24px" : "0 52px",
      transition:"all 0.45s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Left tabs */}
      <div style={{ display:"flex", gap:"24px" }}>
        {["SHOP","ECO RANKS","REWARDS","AI STYLIST","TRAVEL IMPACT","ELECTRICITY IMPACT"].map(item => (
          <button key={item} onClick={() => setActiveTab(item)} style={{
            background:"none", border:"none", cursor:"pointer",
            fontFamily:"var(--font-jost,sans-serif)", fontSize:"11px", fontWeight:700, letterSpacing:"0.1em",
            color: activeTab===item ? "#1a3a2a" : "#8a9a8a",
            borderBottom: activeTab===item ? "2px solid #2d6a4f" : "2px solid transparent",
            paddingBottom:"2px", transition:"all 0.2s", whiteSpace:"nowrap",
          }}>{item}</button>
        ))}
      </div>
      {/* Logo */}
      <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:scrolled?"20px":"23px",fontWeight:700,letterSpacing:"-0.02em",color:"#1a1a1a",userSelect:"none",transition:"font-size 0.3s" }}>
        Eco<span style={{ color:"#2d6a4f",fontStyle:"italic" }}>Verse</span>
      </div>
      {/* Right actions */}
      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
        {!user && <button style={{ display:"flex",alignItems:"center",gap:6,background:"white",border:"1.5px solid #d8d3c8",borderRadius:20,padding:"6px 14px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:600,color:"#555" }}>
          <span style={{ width:7,height:7,borderRadius:"50%",background:"#2d6a4f",display:"inline-block" }}/> 0 pts
        </button>}
        {user ? <UserMenu user={user} onSignOut={onSignOut}/> :
          <button onClick={onSignInClick} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",color:"#1a3a2a",textDecoration:"underline",textUnderlineOffset:"3px" }}>SIGN IN</button>
        }
        <button
          style={{ background:"#1a3a2a",color:"white",border:"none",borderRadius:"8px",padding:"10px 20px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 2px 12px rgba(26,58,42,0.3)" }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#2d6a4f";(e.currentTarget as HTMLElement).style.transform="translateY(-1px)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#1a3a2a";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}>
          SHOP NOW
        </button>
      </div>
    </nav>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth }: { onClose:()=>void; onAuth:(u:AuthUser)=>void }) {
  const [mode, setMode]   = useState<"signin"|"signup">("signin");
  const [form, setForm]   = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const getUsers = () => { try { return JSON.parse(localStorage.getItem("ecoverse_users")||"{}"); } catch { return {}; } };
  const submit = () => {
    setError("");
    if (!form.email||!form.password) { setError("Please fill all fields."); return; }
    if (mode==="signup"&&!form.name) { setError("Name is required."); return; }
    if (form.password.length<6) { setError("Password must be 6+ characters."); return; }
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      if (mode==="signup") {
        if (users[form.email]) { setError("Account exists. Sign in instead."); setLoading(false); return; }
        users[form.email] = { ...form, pts:0 };
        localStorage.setItem("ecoverse_users", JSON.stringify(users));
        onAuth({ name:form.name, email:form.email, pts:0 });
      } else {
        const u = users[form.email];
        if (!u) { setError("No account found. Sign up first."); setLoading(false); return; }
        if (u.password!==form.password) { setError("Incorrect password."); setLoading(false); return; }
        onAuth({ name:u.name, email:u.email, pts:u.pts });
      }
      setLoading(false);
    }, 600);
  };
  const inp: React.CSSProperties = { width:"100%",padding:"13px 16px",border:"1.5px solid #d8d3c8",background:"white",fontFamily:"var(--font-jost,sans-serif)",fontSize:"14px",color:"#1a1a1a",outline:"none",boxSizing:"border-box",borderRadius:"8px" };
  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(10,10,10,0.6)",backdropFilter:"blur(14px)",display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#f5f2eb",width:420,maxWidth:"94vw",padding:"48px 44px",position:"relative",boxShadow:"0 40px 100px rgba(0,0,0,0.25)",borderRadius:"20px",animation:"modalIn 0.35s cubic-bezier(0.16,1,0.3,1)" }} onClick={e=>e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute",top:18,right:18,background:"none",border:"none",fontSize:22,color:"#aaa",cursor:"pointer" }}>×</button>
        <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:22,fontWeight:700,marginBottom:6 }}>Eco<span style={{ color:"#2d6a4f",fontStyle:"italic" }}>Verse</span></div>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:13,color:"#8a9a8a",marginBottom:28 }}>{mode==="signin"?"Welcome back, conscious shopper.":"Join the green movement."}</p>
        <div style={{ display:"flex",borderBottom:"1.5px solid #e0dbd0",marginBottom:24 }}>
          {(["signin","signup"] as const).map(m => (
            <button key={m} onClick={()=>{setMode(m);setError("");}} style={{ flex:1,background:"none",border:"none",padding:"9px 0",fontFamily:"var(--font-jost,sans-serif)",fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:mode===m?"#1a3a2a":"#bbb",borderBottom:mode===m?"2px solid #2d6a4f":"2px solid transparent",marginBottom:"-1.5px",cursor:"pointer",transition:"all 0.2s" }}>
              {m==="signin"?"SIGN IN":"CREATE ACCOUNT"}
            </button>
          ))}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {mode==="signup"&&<input placeholder="Full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp}/>}
          <input placeholder="Email address" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submit()} style={inp}/>
          <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submit()} style={inp}/>
        </div>
        {error&&<p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:12,color:"#c0392b",margin:"10px 0 0" }}>⚠ {error}</p>}
        <button onClick={submit} disabled={loading} style={{ width:"100%",marginTop:20,background:loading?"#5a8a6a":"#1a3a2a",color:"white",border:"none",padding:15,borderRadius:10,fontFamily:"var(--font-jost,sans-serif)",fontSize:12,fontWeight:700,letterSpacing:"0.14em",cursor:loading?"default":"pointer",transition:"background 0.2s" }}>
          {loading?"...":(mode==="signin"?"SIGN IN →":"CREATE ACCOUNT →")}
        </button>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:12,color:"#8a9a8a",textAlign:"center",marginTop:16 }}>
          {mode==="signin"?"No account? ":"Already have one? "}
          <span onClick={()=>{setMode(mode==="signin"?"signup":"signin");setError("");}} style={{ color:"#2d6a4f",fontWeight:600,cursor:"pointer",textDecoration:"underline" }}>
            {mode==="signin"?"Sign up free":"Sign in"}
          </span>
        </p>
        <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      </div>
    </div>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────
function UserMenu({ user, onSignOut }: { user:AuthUser; onSignOut:()=>void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <button onClick={()=>setOpen(o=>!o)} style={{ display:"flex",alignItems:"center",gap:8,background:"#1a3a2a",border:"none",borderRadius:20,padding:"6px 14px 6px 8px",cursor:"pointer" }}>
        <div style={{ width:26,height:26,borderRadius:"50%",background:"#2d6a4f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-jost,sans-serif)",fontSize:11,fontWeight:700,color:"white" }}>{user.name[0].toUpperCase()}</div>
        <span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:11,color:"#a8d5a2",fontWeight:600 }}>{user.pts} pts</span>
      </button>
      {open&&<div style={{ position:"absolute",top:"calc(100% + 8px)",right:0,background:"white",border:"1px solid #e0dbd0",borderRadius:12,boxShadow:"0 16px 48px rgba(0,0,0,0.13)",minWidth:200,padding:"8px 0",zIndex:600 }}>
        <div style={{ padding:"12px 20px 10px",borderBottom:"1px solid #f0ece3" }}>
          <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:15,fontWeight:700 }}>{user.name}</div>
          <div style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:12,color:"#8a9a8a",marginTop:2 }}>{user.email}</div>
        </div>
        {[["🌿","Eco Points",`${user.pts}`],["📦","My Orders",""],["⚙️","Settings",""]].map(([icon,label,sub])=>(
          <div key={label} style={{ padding:"10px 20px",display:"flex",alignItems:"center",gap:10,fontFamily:"var(--font-jost,sans-serif)",fontSize:13,color:"#333",cursor:"pointer" }}
            onMouseEnter={e=>(e.currentTarget.style.background="#f5f2eb")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
            {icon} {label} {sub&&<span style={{ marginLeft:"auto",color:"#2d6a4f",fontWeight:600,fontSize:12 }}>{sub}</span>}
          </div>
        ))}
        <div style={{ borderTop:"1px solid #f0ece3",marginTop:4 }}>
          <div onClick={()=>{onSignOut();setOpen(false);}} style={{ padding:"10px 20px",fontFamily:"var(--font-jost,sans-serif)",fontSize:13,color:"#c0392b",cursor:"pointer" }}
            onMouseEnter={e=>(e.currentTarget.style.background="#fff5f5")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>↩ Sign Out</div>
        </div>
      </div>}
    </div>
  );
}

// ─── Section Header (sticky) ──────────────────────────────────────────────────
// Sticky within each section — stays visible as you scroll through it
function SectionHeader({ label, title, accent, subtitle }: { label:string; title:string; accent:string; subtitle?:string }) {
  return (
    <div style={{
      position:"sticky", top:72, zIndex:30,
      background:"rgba(245,242,235,0.96)", backdropFilter:"blur(16px)",
      borderBottom:"1px solid rgba(224,219,208,0.5)",
      padding:"18px 52px 16px",
      display:"flex", alignItems:"baseline", justifyContent:"space-between",
      flexWrap:"wrap", gap:8,
    }}>
      <div style={{ display:"flex",alignItems:"baseline",gap:16 }}>
        <span style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"9px",letterSpacing:"0.22em",color:"#2d6a4f",opacity:0.8 }}>{label}</span>
        <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"clamp(22px,3vw,34px)",fontWeight:700,color:"#1a1a1a",margin:0,lineHeight:1 }}>
          {title} <span style={{ color:"#2d6a4f",fontStyle:"italic" }}>{accent}</span>
        </h2>
      </div>
      {subtitle&&<span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:13,color:"#8a9a8a" }}>{subtitle}</span>}
    </div>
  );
}

// ─── CLEAN 3D TOTE BAG ────────────────────────────────────────────────────────
// Redesigned: simple, solid, beautiful — clearly readable as a real bag
function ToteBag() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse  = useRef({ x:0, y:0 });
  const rotY   = useRef(0.3);
  const rotX   = useRef(0.15);
  const raf    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width = 480; const H = canvas.height = 520;

    // Simple but solid tote bag using layered 2D paths (cleaner than complex 3D)
    // We rotate a flat representation with perspective simulation
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      time += 0.012;

      // Smooth rotation
      const targetY = 0.3 + Math.sin(time * 0.4) * 0.22 + mouse.current.x * 0.0008;
      const targetX = 0.15 + mouse.current.y * 0.0004;
      rotY.current += (targetY - rotY.current) * 0.04;
      rotX.current += (targetX - rotX.current) * 0.04;

      const ry = rotY.current;
      const perspX = Math.sin(ry); // -1 to 1: how much we see the side

      const cx = W / 2;
      const cy = H / 2 + 10;

      // ── Soft ambient glow ─────────────────────────────────────────────
      const glow = ctx.createRadialGradient(cx, cy, 20, cx, cy, 200);
      glow.addColorStop(0, "rgba(180,155,100,0.12)");
      glow.addColorStop(0.5,"rgba(45,106,79,0.06)");
      glow.addColorStop(1,  "rgba(245,242,235,0)");
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

      // ── Bag dimensions ────────────────────────────────────────────────
      const bW = 140; const bH = 170; const depth = 60;
      const sideW = depth * Math.abs(perspX) * 0.8;
      const isRight = perspX > 0;

      // Light direction: upper-left
      const lightAngle = ry - 0.8;
      const frontLight = 0.55 + Math.cos(lightAngle) * 0.38;
      const sideLight  = 0.28 + Math.sin(lightAngle) * 0.2;

      // ── Drop shadow ───────────────────────────────────────────────────
      const shadowG = ctx.createRadialGradient(cx, cy + bH * 0.85 + 8, 5, cx, cy + bH * 0.85 + 8, bW * 0.9);
      shadowG.addColorStop(0, "rgba(80,55,20,0.22)"); shadowG.addColorStop(1, "rgba(80,55,20,0)");
      ctx.save(); ctx.scale(1, 0.3);
      ctx.beginPath(); ctx.ellipse(cx, (cy + bH * 0.85 + 8) / 0.3, bW * 0.82, bW * 0.6, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowG; ctx.fill(); ctx.restore();

      // ── SIDE FACE ─────────────────────────────────────────────────────
      if (sideW > 2) {
        const sideX = isRight ? cx + bW : cx - bW - sideW;
        const sideTop = cy - bH * 0.5;
        const sideBotY = cy + bH * 0.5;
        // Slight taper at top
        const taperTop = sideW * 0.85;
        const taperX   = isRight ? sideX + sideW - taperTop : sideX + sideW - sideW + taperTop - sideW;

        const sideGrad = ctx.createLinearGradient(sideX, 0, sideX + sideW, 0);
        const sc = Math.floor(160 * sideLight);
        const sc2 = Math.floor(130 * sideLight);
        sideGrad.addColorStop(0, `rgb(${sc+20},${sc},${sc2-20})`);
        sideGrad.addColorStop(1, `rgb(${sc},${sc-10},${sc2-30})`);

        ctx.beginPath();
        if (isRight) {
          ctx.moveTo(cx + bW, sideTop + 8);
          ctx.lineTo(cx + bW + taperTop, sideTop);
          ctx.lineTo(cx + bW + sideW, sideTop + 16);
          ctx.lineTo(cx + bW + sideW, sideBotY - 4);
          ctx.lineTo(cx + bW, sideBotY);
        } else {
          ctx.moveTo(cx - bW - taperTop, sideTop);
          ctx.lineTo(cx - bW, sideTop + 8);
          ctx.lineTo(cx - bW, sideBotY);
          ctx.lineTo(cx - bW - sideW, sideBotY - 4);
          ctx.lineTo(cx - bW - sideW, sideTop + 16);
        }
        ctx.closePath();
        ctx.fillStyle = sideGrad; ctx.fill();
        ctx.strokeStyle = "rgba(100,75,35,0.15)"; ctx.lineWidth = 1; ctx.stroke();
      }

      // ── FRONT FACE ────────────────────────────────────────────────────
      const fl = frontLight;
      const r0 = Math.floor(230 * fl), g0 = Math.floor(205 * fl), b0 = Math.floor(165 * fl);
      const r1 = Math.floor(210 * fl), g1 = Math.floor(185 * fl), b1 = Math.floor(145 * fl);

      const frontGrad = ctx.createLinearGradient(cx - bW, cy - bH * 0.5, cx + bW, cy + bH * 0.5);
      frontGrad.addColorStop(0,   `rgb(${r0+8},${g0+6},${b0+4})`);
      frontGrad.addColorStop(0.35,`rgb(${r0},${g0},${b0})`);
      frontGrad.addColorStop(0.7, `rgb(${r1+4},${g1+2},${b1})`);
      frontGrad.addColorStop(1,   `rgb(${r1-8},${g1-6},${b1-8})`);

      const topCurve = 18;
      // Main bag body
      ctx.beginPath();
      ctx.moveTo(cx - bW + 12, cy - bH * 0.5);                      // top-left
      ctx.lineTo(cx + bW - 12, cy - bH * 0.5);                      // top-right
      ctx.lineTo(cx + bW, cy - bH * 0.5 + topCurve);
      ctx.lineTo(cx + bW, cy + bH * 0.5 - 10);
      ctx.quadraticCurveTo(cx + bW, cy + bH * 0.5, cx + bW - 12, cy + bH * 0.5); // bottom-right rounded
      ctx.lineTo(cx - bW + 12, cy + bH * 0.5);
      ctx.quadraticCurveTo(cx - bW, cy + bH * 0.5, cx - bW, cy + bH * 0.5 - 10); // bottom-left rounded
      ctx.lineTo(cx - bW, cy - bH * 0.5 + topCurve);
      ctx.closePath();
      ctx.fillStyle = frontGrad; ctx.fill();
      ctx.strokeStyle = "rgba(150,115,65,0.2)"; ctx.lineWidth = 1.5; ctx.stroke();

      // ── TOP OPENING / RIM ─────────────────────────────────────────────
      const rimH = 22;
      const rimGrad = ctx.createLinearGradient(0, cy - bH * 0.5 - rimH, 0, cy - bH * 0.5);
      rimGrad.addColorStop(0, `rgb(${Math.floor(195*fl)},${Math.floor(168*fl)},${Math.floor(125*fl)})`);
      rimGrad.addColorStop(1, `rgb(${Math.floor(215*fl)},${Math.floor(190*fl)},${Math.floor(148*fl)})`);
      ctx.beginPath();
      ctx.moveTo(cx - bW * 0.85, cy - bH * 0.5 - rimH);
      ctx.lineTo(cx + bW * 0.85, cy - bH * 0.5 - rimH);
      ctx.lineTo(cx + bW, cy - bH * 0.5 + topCurve * 0.4);
      ctx.lineTo(cx + bW - 12, cy - bH * 0.5);
      ctx.lineTo(cx - bW + 12, cy - bH * 0.5);
      ctx.lineTo(cx - bW, cy - bH * 0.5 + topCurve * 0.4);
      ctx.closePath();
      ctx.fillStyle = rimGrad; ctx.fill();
      ctx.strokeStyle = "rgba(140,108,65,0.2)"; ctx.lineWidth = 1; ctx.stroke();

      // ── HANDLES ───────────────────────────────────────────────────────
      const handleXL = cx - bW * 0.42;
      const handleXR = cx + bW * 0.42;
      const handleBase = cy - bH * 0.5 - rimH + 6;
      const handleArc  = 88 + Math.sin(time * 0.5) * 3; // slight breathing

      [handleXL, handleXR].forEach((hx, hi) => {
        const hxOpp = hi === 0 ? handleXL + 48 : handleXR - 48;
        // Handle shadow
        ctx.beginPath();
        ctx.moveTo(hx, handleBase);
        ctx.bezierCurveTo(hx - 4, handleBase - handleArc * 0.9, hxOpp + 4, handleBase - handleArc * 0.9, hxOpp, handleBase);
        ctx.strokeStyle = "rgba(80,55,20,0.15)"; ctx.lineWidth = 11; ctx.lineCap = "round"; ctx.stroke();
        // Strap base
        ctx.beginPath();
        ctx.moveTo(hx, handleBase);
        ctx.bezierCurveTo(hx - 2, handleBase - handleArc * 0.92, hxOpp + 2, handleBase - handleArc * 0.92, hxOpp, handleBase);
        const hGrad = ctx.createLinearGradient(hx, handleBase - handleArc, hxOpp, handleBase);
        hGrad.addColorStop(0,   "rgb(200,168,110)");
        hGrad.addColorStop(0.4, "rgb(220,188,128)");
        hGrad.addColorStop(1,   "rgb(195,162,105)");
        ctx.strokeStyle = hGrad; ctx.lineWidth = 9; ctx.stroke();
        // Highlight on top edge
        ctx.beginPath();
        ctx.moveTo(hx, handleBase);
        ctx.bezierCurveTo(hx - 2, handleBase - handleArc * 0.92, hxOpp + 2, handleBase - handleArc * 0.92, hxOpp, handleBase);
        ctx.strokeStyle = "rgba(248,228,175,0.5)"; ctx.lineWidth = 2.5; ctx.stroke();
        // Metal rivets at base
        [hx, hxOpp].forEach(rx => {
          const rg = ctx.createRadialGradient(rx - 1, handleBase - 2, 1, rx, handleBase, 5);
          rg.addColorStop(0, "rgba(240,210,150,1)"); rg.addColorStop(1, "rgba(170,135,75,1)");
          ctx.beginPath(); ctx.arc(rx, handleBase, 5, 0, Math.PI * 2);
          ctx.fillStyle = rg; ctx.fill();
          ctx.strokeStyle = "rgba(120,90,40,0.4)"; ctx.lineWidth = 0.8; ctx.stroke();
        });
      });

      // ── LOGO PATCH (front center) ─────────────────────────────────────
      const pW = 56, pH = 32;
      const pX = cx - pW / 2, pY = cy - pH * 0.5 - 15;
      // Slightly embossed leather patch
      ctx.beginPath();
      ctx.roundRect(pX, pY, pW, pH, 4);
      ctx.fillStyle = `rgba(${Math.floor(200*fl)},${Math.floor(170*fl)},${Math.floor(125*fl)},0.9)`;
      ctx.fill();
      ctx.strokeStyle = `rgba(140,105,55,0.4)`; ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]); ctx.stroke(); ctx.setLineDash([]);
      // EV monogram
      ctx.font = `bold ${Math.round(14 * fl + 2)}px Georgia, serif`;
      ctx.fillStyle = `rgba(${Math.floor(120*fl)},${Math.floor(88*fl)},${Math.floor(42*fl)},0.88)`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("EV", cx, pY + pH / 2);

      // ── HORIZONTAL SEAM LINES ─────────────────────────────────────────
      [0.25, 0.6].forEach(t2 => {
        const sy = cy - bH * 0.5 + topCurve + bH * t2 * 0.82;
        ctx.beginPath();
        ctx.moveTo(cx - bW + 10, sy);
        ctx.lineTo(cx + bW - 10, sy);
        ctx.strokeStyle = `rgba(160,128,80,${0.1 + t2 * 0.08})`; ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]);
      });

      // ── SURFACE SHEEN ─────────────────────────────────────────────────
      const sheen = ctx.createRadialGradient(cx - bW * 0.25, cy - bH * 0.25, 10, cx - bW * 0.25, cy - bH * 0.25, bW * 0.7);
      sheen.addColorStop(0, "rgba(255,248,220,0.14)");
      sheen.addColorStop(0.4,"rgba(255,248,220,0.04)");
      sheen.addColorStop(1, "rgba(255,248,220,0)");
      ctx.beginPath();
      ctx.roundRect(cx - bW + 2, cy - bH * 0.5 + topCurve - 2, bW * 2 - 4, bH - topCurve + 4, 6);
      ctx.fillStyle = sheen; ctx.fill();

      raf.current = requestAnimationFrame(draw);
    };

    draw();
    const onM = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left - W/2, y: e.clientY - r.top - H/2 };
    };
    canvas.addEventListener("mousemove", onM);
    return () => { cancelAnimationFrame(raf.current); canvas.removeEventListener("mousemove", onM); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      width:480, height:520, cursor:"grab",
      filter:"drop-shadow(0 24px 48px rgba(80,55,20,0.2)) drop-shadow(0 6px 16px rgba(45,106,79,0.12))",
    }}/>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onShopClick }: { onShopClick:()=>void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 100); }, []);
  const fade = (d=0): React.CSSProperties => ({ opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(28px)", transition:`all 0.9s ${d}s cubic-bezier(0.16,1,0.3,1)` });

  return (
    <section style={{ background:"rgba(245,242,235,0.97)",minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",alignItems:"center",padding:"90px 52px 60px 72px",position:"relative",overflow:"hidden",zIndex:2 }}>
      {/* Dot grid texture */}
      <div style={{ position:"absolute",inset:0,opacity:0.035,backgroundImage:"radial-gradient(circle,#2d6a4f 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none" }}/>
      {/* Soft green wash */}
      <div style={{ position:"absolute",right:"-40px",top:"50%",transform:"translateY(-55%)",width:640,height:640,borderRadius:"58% 42% 66% 34%/50% 60% 40% 50%",background:"radial-gradient(ellipse at 40% 40%,rgba(45,106,79,0.07) 0%,rgba(168,213,162,0.04) 55%,transparent 80%)",animation:"morphBlob 14s ease-in-out infinite",pointerEvents:"none" }}/>

      {/* LEFT — copy */}
      <div style={{ position:"relative",zIndex:2 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:28,...fade(0) }}>
          <div style={{ width:28,height:1,background:"#2d6a4f" }}/>
          <span style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.25em",color:"#2d6a4f" }}>NEW COLLECTION · SS 2025</span>
        </div>
        <h1 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"clamp(46px,5vw,80px)",fontWeight:700,lineHeight:1.04,color:"#1a1a1a",margin:"0 0 24px",letterSpacing:"-0.02em",...fade(0.1) }}>
          Wear the<br/>
          <span style={{ color:"#2d6a4f",fontStyle:"italic",animation:"subtleFloat 4.5s ease-in-out infinite",display:"inline-block" }}>Change.</span>
        </h1>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"17px",color:"#5a6a5a",maxWidth:400,lineHeight:1.78,margin:"0 0 36px",...fade(0.2) }}>
          Every piece tells a story of sustainability. Shop conscious, earn Eco Points, and help the planet — one outfit at a time.
        </p>
        <div style={{ display:"flex",gap:12,marginBottom:52,...fade(0.3) }}>
          <button onClick={onShopClick}
            style={{ background:"#1a3a2a",color:"white",border:"none",padding:"15px 38px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",fontWeight:700,letterSpacing:"0.14em",cursor:"pointer",borderRadius:8,transition:"all 0.25s",boxShadow:"0 4px 18px rgba(26,58,42,0.3)" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#2d6a4f";(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="#1a3a2a";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}>
            SHOP NOW
          </button>
          <button
            style={{ background:"transparent",color:"#1a3a2a",border:"1.5px solid #1a3a2a",padding:"15px 34px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",fontWeight:600,letterSpacing:"0.14em",cursor:"pointer",borderRadius:8,transition:"all 0.25s" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#1a3a2a";(e.currentTarget as HTMLElement).style.color="white";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="#1a3a2a";}}>
            OUR IMPACT ↗
          </button>
        </div>
        <div style={{ display:"flex",gap:40,borderTop:"1px solid rgba(45,106,79,0.15)",paddingTop:32 }}>
          {[["349T","Trees Planted"],["48K","kg CO₂ Saved"],["12K","Happy Shoppers"]].map(([n,l],i)=>(
            <div key={l} style={fade(0.45+i*0.1)}>
              <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"30px",fontWeight:700,color:"#2d6a4f",lineHeight:1 }}>{n}</div>
              <div style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#8a9a8a",letterSpacing:"0.08em",marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — bag + badges */}
      <div style={{ position:"relative",zIndex:2,display:"flex",alignItems:"center",justifyContent:"center",...fade(0.15) }}>
        {/* Warm halo */}
        <div style={{ position:"absolute",width:380,height:380,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(190,160,100,0.14) 0%,transparent 68%)",filter:"blur(22px)",pointerEvents:"none" }}/>
        {/* Spinning ring */}
        <div style={{ position:"absolute",width:400,height:400,borderRadius:"50%",border:"1px dashed rgba(45,106,79,0.12)",animation:"spinRing 28s linear infinite",pointerEvents:"none" }}/>

        {/* Floating badges */}
        <div style={{ position:"absolute",top:44,left:16,zIndex:5,background:"#1a3a2a",color:"white",padding:"10px 17px",borderRadius:40,fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:600,display:"flex",alignItems:"center",gap:7,animation:"floatBadge 3.5s ease-in-out infinite",boxShadow:"0 8px 24px rgba(26,58,42,0.3)" }}>
          <span style={{ fontSize:15 }}>🌿</span>ECO SCORE 95/100
        </div>
        <div style={{ position:"absolute",bottom:88,right:8,zIndex:5,background:"white",color:"#1a3a2a",border:"1.5px solid #e0dbd0",padding:"9px 14px",borderRadius:40,fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:600,display:"flex",alignItems:"center",gap:6,animation:"floatBadge 4.2s ease-in-out infinite 0.9s",boxShadow:"0 6px 20px rgba(0,0,0,0.09)" }}>
          <span style={{ fontSize:13 }}>♻️</span>100% Recycled
        </div>
        <div style={{ position:"absolute",top:150,right:4,zIndex:5,background:"#a8d5a2",color:"#1a3a2a",padding:"7px 13px",borderRadius:20,fontFamily:"var(--font-space-mono,monospace)",fontSize:"11px",fontWeight:700,animation:"floatBadge 3.1s ease-in-out infinite 1.7s",boxShadow:"0 4px 14px rgba(45,106,79,0.25)" }}>+80 pts</div>
        <div style={{ position:"absolute",bottom:195,left:4,zIndex:5,background:"#1a3a2a",color:"#a8d5a2",padding:"8px 13px",borderRadius:20,fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:600,animation:"floatBadge 3.8s ease-in-out infinite 0.4s",boxShadow:"0 4px 14px rgba(26,58,42,0.25)" }}>🌍 Carbon Neutral</div>

        <div style={{ position:"relative",zIndex:3 }}><ToteBag/></div>

        <div style={{ position:"absolute",bottom:18,zIndex:5,fontFamily:"var(--font-playfair,serif)",fontSize:"13px",color:"#7a6a50",fontStyle:"italic",background:"rgba(245,242,235,0.88)",backdropFilter:"blur(8px)",padding:"6px 18px",borderRadius:20,border:"1px solid rgba(195,165,110,0.3)" }}>
          Natural Canvas Tote · ₹1,499
        </div>
      </div>

      <style>{`
        @keyframes subtleFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes floatBadge{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-9px) rotate(1.5deg)}}
        @keyframes morphBlob{0%,100%{border-radius:58% 42% 66% 34%/50% 60% 40% 50%}33%{border-radius:38% 62% 28% 72%/62% 38% 62% 38%}66%{border-radius:72% 28% 52% 48%/38% 52% 58% 48%}}
        @keyframes spinRing{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
      `}</style>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────
function Categories() {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"rgba(245,242,235,0.97)",position:"relative",zIndex:2 }}>
      <SectionHeader label="// BROWSE" title="What are you" accent="looking for?" subtitle="6 categories"/>
      <div style={{ padding:"40px 0 0",display:"grid",gridTemplateColumns:"repeat(6,1fr)" }}>
        {categories.map((cat,i) => (
          <div key={cat.name} style={{ background:cat.bg,cursor:"pointer",overflow:"hidden",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(28px)",transition:`all 0.7s ${0.07+i*0.08}s cubic-bezier(0.16,1,0.3,1)`,borderRight:i<5?"1px solid rgba(255,255,255,0.4)":"none" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.03)";(e.currentTarget.querySelector(".ci") as HTMLElement).style.transform="scale(1.08)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";(e.currentTarget.querySelector(".ci") as HTMLElement).style.transform="scale(1)";}}>
            <div style={{ height:200,overflow:"hidden" }}>
              <img className="ci" src={cat.img} alt={cat.name} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.5s ease" }} onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80";}}/>
            </div>
            <div style={{ padding:"16px 12px",textAlign:"center" }}>
              <h3 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"14px",fontWeight:600,color:"#1a1a1a",margin:"0 0 2px" }}>{cat.name}</h3>
              <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#6a7a6a",margin:0 }}>{cat.count} items</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Impact Strip ─────────────────────────────────────────────────────────────
function ImpactStrip() {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"#1a3a2a",padding:"72px 72px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:40,position:"relative",zIndex:2 }}>
      <div style={{ opacity:visible?1:0,transform:visible?"translateX(0)":"translateX(-28px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)" }}>
        <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"48px",fontWeight:700,color:"white",lineHeight:1.1,margin:"0 0 4px" }}>Your purchases,</h2>
        <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"48px",fontWeight:700,color:"#a8d5a2",fontStyle:"italic",lineHeight:1.1,margin:0 }}>planet's gain.</h2>
      </div>
      <div style={{ display:"flex",gap:52,flexWrap:"wrap" }}>
        {[["349T","Trees Planted"],["48K","kg CO₂ Offset"],["100%","Sustainable Pkg"],["12K","Happy Shoppers"]].map(([n,l],i)=>(
          <div key={l} style={{ textAlign:"center",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(18px)",transition:`all 0.7s ${0.2+i*0.1}s` }}>
            <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"44px",fontWeight:700,color:"#a8d5a2" }}>{n}</div>
            <div style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#6a9a6a",letterSpacing:"0.08em",marginTop:4 }}>{l}</div>
          </div>
        ))}
      </div>
      <button style={{ background:"#a8d5a2",color:"#1a3a2a",border:"none",borderRadius:8,padding:"14px 26px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.12em",cursor:"pointer",whiteSpace:"nowrap",opacity:visible?1:0,transition:"opacity 0.7s 0.5s" }}>SEE OUR IMPACT →</button>
    </section>
  );
}

// ─── Shop ─────────────────────────────────────────────────────────────────────
function Shop({ onAddToCart }: { onAddToCart:(p:Product)=>void }) {
  const { ref, visible } = useScrollReveal();
  const [filter, setFilter] = useState<"ALL"|"ORGANIC"|"RECYCLED"|"VEGAN">("ALL");
  const [hovered, setHovered] = useState<number|null>(null);
  const filtered = filter==="ALL" ? products : products.filter(p=>p.tag===filter);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"rgba(245,242,235,0.97)",position:"relative",zIndex:2 }}>
      <SectionHeader
        label="// NEW ARRIVALS"
        title="Shop"
        accent="Consciously"
        subtitle={
          <div style={{ display:"flex",gap:3 }}>
            {(["ALL","ORGANIC","RECYCLED","VEGAN"] as const).map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{ padding:"7px 16px",border:"1.5px solid #c8c3b8",background:filter===f?"#1a1a1a":"transparent",color:filter===f?"white":"#555",fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",fontWeight:600,letterSpacing:"0.08em",cursor:"pointer",transition:"all 0.2s",borderRadius:4 }}>{f}</button>
            ))}
          </div> as unknown as string
        }
      />
      <div style={{ padding:"40px 0 0",display:"grid",gridTemplateColumns:"repeat(5,1fr)",borderTop:"1px solid #e8e3d8",borderLeft:"1px solid #e8e3d8" }}>
        {filtered.map((p,i) => (
          <div key={p.id} onMouseEnter={()=>setHovered(p.id)} onMouseLeave={()=>setHovered(null)}
            style={{ cursor:"pointer",overflow:"hidden",borderRight:"1px solid #e8e3d8",borderBottom:"1px solid #e8e3d8",background:hovered===p.id?"#faf8f3":"white",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(28px)",transition:`opacity 0.5s ${0.04+i*0.05}s,transform 0.5s ${0.04+i*0.05}s cubic-bezier(0.16,1,0.3,1),background 0.2s` }}>
            <div style={{ height:280,overflow:"hidden",background:p.bgColor,position:"relative" }}>
              <img src={p.img} alt={p.name}
                style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.6s ease",transform:hovered===p.id?"scale(1.07)":"scale(1)" }}
                onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80";}}/>
              <div style={{ position:"absolute",top:10,left:10,background:p.tag==="ORGANIC"?"#d4e6c3":p.tag==="RECYCLED"?"#c8d8e8":"#d4cce8",color:"#1a3a2a",padding:"3px 9px",borderRadius:20,fontFamily:"var(--font-jost,sans-serif)",fontSize:"9px",fontWeight:700,letterSpacing:"0.08em" }}>{p.tag}</div>
              <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top,rgba(26,58,42,0.88),transparent)",padding:"18px 14px 12px",display:"flex",justifyContent:"center",animation:"fadeUp 0.22s ease" }}>
                <button onClick={() => onAddToCart(p)} style={{ background:"white",color:"#1a3a2a",border:"none",borderRadius:20,padding:"7px 18px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",cursor:"pointer" }}>ADD TO CART</button>
              </div>
            </div>
            <div style={{ padding:"14px 14px 18px" }}>
              <div style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"9px",letterSpacing:"0.1em",color:"#2d6a4f",marginBottom:5 }}>ECO {p.ecoScore}/100</div>
              <h3 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"15px",fontWeight:600,color:"#1a1a1a",margin:"0 0 3px" }}>{p.name}</h3>
              <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#8a9a8a",margin:"0 0 10px" }}>{p.material}</p>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <span style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"16px",fontWeight:700,color:"#1a1a1a" }}>{p.price}</span>
                <span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",color:"#2d6a4f",fontWeight:600 }}>🌿 {p.pts}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  );
}

// ─── Eco Ranks ────────────────────────────────────────────────────────────────
function EcoRanks() {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"rgba(240,236,227,0.97)",position:"relative",zIndex:2 }}>
      <SectionHeader label="// ECO RANKS" title="Level up your" accent="green game" subtitle="Earn points on every purchase"/>
      <div style={{ padding:"48px 72px 80px",display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:72,alignItems:"center" }}>
        <div style={{ opacity:visible?1:0,transform:visible?"translateX(0)":"translateX(-24px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)" }}>
          <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"15px",color:"#5a6a5a",lineHeight:1.8,margin:"0 0 28px" }}>Every sustainable purchase earns Eco Points. Rise from Seed to Forest Guardian and unlock exclusive perks and rewards.</p>
          <button style={{ background:"#1a1a1a",color:"white",border:"none",padding:"13px 30px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.14em",cursor:"pointer",borderRadius:8 }}>START EARNING →</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
          {ecoRanks.map((rank,i) => (
            <div key={rank.name} style={{ background:rank.highlight?"#e4ede0":"white",border:rank.highlight?"2px solid #2d6a4f":"1px solid #e0dbd0",borderRadius:10,padding:24,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(22px)",transition:`all 0.7s ${0.18+i*0.1}s cubic-bezier(0.16,1,0.3,1)` }}>
              <div style={{ fontSize:30,marginBottom:10 }}>{rank.icon}</div>
              <h3 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"18px",fontWeight:700,color:"#1a1a1a",margin:"0 0 2px" }}>{rank.name}</h3>
              <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",color:"#8a9a8a",margin:"0 0 10px",letterSpacing:"0.04em" }}>{rank.range}</p>
              <div style={{ height:3,background:"#e8e3d8",borderRadius:2,marginBottom:10,overflow:"hidden" }}>
                <div style={{ height:"100%",width:visible?`${rank.progress}%`:"0%",background:rank.highlight?"#2d6a4f":"#6a9a6a",borderRadius:2,transition:"width 1.4s 0.6s ease" }}/>
              </div>
              <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",color:"#4a6a4a",fontWeight:500,margin:0 }}>{rank.perk}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Scratch Card ─────────────────────────────────────────────────────────────
function ScratchCard({ reward, index, visible }: { reward:string; index:number; visible:boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [pct, setPct] = useState(0);
  const painting = useRef(false);
  const inited = useRef(false);
  const lastPos = useRef<{x:number,y:number}|null>(null);

  const buildFoil = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas||inited.current) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 270; canvas.height = 330; inited.current = true;
    const bg = ctx.createLinearGradient(0,0,270,330);
    bg.addColorStop(0,"#091a10"); bg.addColorStop(0.35,"#0d2b1a"); bg.addColorStop(0.65,"#142e1c"); bg.addColorStop(1,"#081508");
    ctx.fillStyle=bg; ctx.fillRect(0,0,270,330);
    for (let i=0;i<5500;i++){
      const x=Math.random()*270,y=Math.random()*330;
      const b=Math.random()>0.55;
      ctx.beginPath();ctx.arc(x,y,Math.random()*1.3,0,Math.PI*2);
      ctx.fillStyle=b?`rgba(${60+Math.random()*80},${100+Math.random()*80},${50+Math.random()*60},${Math.random()*0.5+0.1})`:`rgba(5,15,8,${Math.random()*0.45})`;
      ctx.fill();
    }
    ctx.globalAlpha=0.16;
    for (let i=0;i<80;i++){
      const x1=Math.random()*290-10,y1=Math.random()*350-10,len=15+Math.random()*70,ang=-0.4+Math.random()*0.8;
      ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1+Math.cos(ang)*len,y1+Math.sin(ang)*len);
      ctx.strokeStyle=`rgba(${120+Math.random()*80},${180+Math.random()*75},${100+Math.random()*70},${0.3+Math.random()*0.7})`;
      ctx.lineWidth=Math.random()*2;ctx.stroke();
    }
    ctx.globalAlpha=1;
    const sh=ctx.createLinearGradient(0,60,270,160);
    sh.addColorStop(0,"rgba(168,213,162,0)");sh.addColorStop(0.45,"rgba(168,213,162,0.22)");sh.addColorStop(1,"rgba(168,213,162,0)");
    ctx.fillStyle=sh;ctx.fillRect(0,0,270,330);
    [[0,0],[270,0],[0,330],[270,330]].forEach(([cx,cy])=>{
      const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,120);
      cg.addColorStop(0,"rgba(0,0,0,0.35)");cg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=cg;ctx.fillRect(0,0,270,330);
    });
    ctx.font="bold 17px Georgia,serif";ctx.fillStyle="rgba(168,213,162,0.88)";ctx.textAlign="center";ctx.fillText("EcoVerse",135,150);
    ctx.font="600 9px monospace";ctx.fillStyle="rgba(168,213,162,0.5)";ctx.fillText("SCRATCH TO REVEAL",135,176);
    ctx.font="26px sans-serif";ctx.fillText("✦",135,218);
    ctx.strokeStyle="rgba(45,106,79,0.45)";ctx.lineWidth=1.5;ctx.strokeRect(1,1,268,328);
  },[]);

  useEffect(()=>{
    if (visible&&!revealed) { const t=setTimeout(buildFoil,50+index*70); return()=>clearTimeout(t); }
  },[visible,revealed,buildFoil,index]);

  const getXY=(e:React.MouseEvent|React.TouchEvent,canvas:HTMLCanvasElement)=>{
    const r=canvas.getBoundingClientRect(),sx=canvas.width/r.width,sy=canvas.height/r.height;
    if ("touches" in e) return {x:(e.touches[0].clientX-r.left)*sx,y:(e.touches[0].clientY-r.top)*sy};
    return {x:((e as React.MouseEvent).clientX-r.left)*sx,y:((e as React.MouseEvent).clientY-r.top)*sy};
  };

  const scratchAt=(x:number,y:number)=>{
    if (revealed) return;
    const canvas=canvasRef.current; if (!canvas) return;
    const ctx=canvas.getContext("2d")!;
    ctx.globalCompositeOperation="destination-out";
    if (lastPos.current) {
      const dx=x-lastPos.current.x,dy=y-lastPos.current.y,dist=Math.sqrt(dx*dx+dy*dy),steps=Math.max(1,Math.floor(dist/4));
      for (let i=0;i<=steps;i++){
        const px=lastPos.current.x+dx*i/steps,py=lastPos.current.y+dy*i/steps;
        ctx.beginPath();
        for (let j=0;j<4;j++) ctx.arc(px+Math.random()*12-6,py+Math.random()*12-6,20+Math.random()*12,0,Math.PI*2);
        ctx.fill();
      }
    } else { ctx.beginPath(); for (let j=0;j<4;j++) ctx.arc(x+Math.random()*10-5,y+Math.random()*10-5,22,0,Math.PI*2); ctx.fill(); }
    lastPos.current={x,y};
    const data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let t=0; for(let i=3;i<data.length;i+=4) if(data[i]<100)t++;
    const p=Math.round(t/(canvas.width*canvas.height)*100);
    setPct(p);
    if (p>52) setRevealed(true);
  };

  const RMETA: Record<string,{e:string;c:string}> = {
    "🎉 10% OFF":{e:"🎉",c:"#d4e6c3"},"🚚 Free Shipping":{e:"🚚",c:"#c8dce8"},
    "🌿 2x Points":{e:"🌿",c:"#d4e6c3"},"🎁 Mystery Gift":{e:"🎁",c:"#e4d4e8"},
    "⭐ 100 Bonus Pts":{e:"⭐",c:"#f0e8c8"},"💚 5% Cashback":{e:"💚",c:"#d4e6c3"},
    "🌱 Plant a Tree":{e:"🌱",c:"#c8e0c8"},"✨ VIP Access":{e:"✨",c:"#e8dcc8"},
  };
  const m=RMETA[reward]||{e:"🎁",c:"#d4e6c3"};

  return (
    <div style={{ position:"relative",width:270,height:330,borderRadius:16,overflow:"hidden",
      boxShadow:revealed?"0 20px 56px rgba(26,58,42,0.32),0 0 0 2px rgba(45,106,79,0.35)":"0 12px 40px rgba(0,0,0,0.2),0 0 0 1px rgba(45,106,79,0.18)",
      opacity:visible?1:0,transform:visible?(revealed?"scale(1.05) translateY(-4px)":"scale(1)"):"translateY(44px)",
      transition:`opacity 0.6s ${0.08+index*0.15}s,transform 0.6s ${0.08+index*0.15}s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s` }}>
      <div style={{ position:"absolute",inset:0,background:`linear-gradient(145deg,${m.c},white)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8 }}>
        <div style={{ fontSize:56,display:"inline-block",animation:revealed?"revealPop 0.55s cubic-bezier(0.34,1.56,0.64,1)":"none" }}>{m.e}</div>
        <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"22px",fontWeight:700,color:"#1a3a2a",textAlign:"center",padding:"0 18px",lineHeight:1.2 }}>{reward}</div>
        <div style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#2d6a4f",fontWeight:600,letterSpacing:"0.05em" }}>Congratulations! 🎊</div>
        {revealed&&<button style={{ marginTop:8,background:"#1a3a2a",color:"#a8d5a2",padding:"8px 22px",borderRadius:20,border:"none",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",animation:"revealPop 0.4s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}>CLAIM →</button>}
      </div>
      {!revealed&&<canvas ref={canvasRef}
        style={{ position:"absolute",inset:0,width:"100%",height:"100%",touchAction:"none",cursor:"crosshair" }}
        onMouseDown={e=>{painting.current=true;lastPos.current=null;const c=canvasRef.current!;const {x,y}=getXY(e,c);scratchAt(x,y);}}
        onMouseUp={()=>{painting.current=false;lastPos.current=null;}}
        onMouseLeave={()=>{painting.current=false;lastPos.current=null;}}
        onMouseMove={e=>{if(painting.current){const c=canvasRef.current!;const {x,y}=getXY(e,c);scratchAt(x,y);}}}
        onTouchStart={e=>{e.preventDefault();lastPos.current=null;const c=canvasRef.current!;const {x,y}=getXY(e,c);scratchAt(x,y);}}
        onTouchMove={e=>{e.preventDefault();const c=canvasRef.current!;const {x,y}=getXY(e,c);scratchAt(x,y);}}
        onTouchEnd={()=>{lastPos.current=null;}}
      />}
      {!revealed&&pct>5&&pct<52&&<div style={{ position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.52)",backdropFilter:"blur(8px)",color:"white",padding:"4px 14px",borderRadius:20,fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",fontWeight:600,whiteSpace:"nowrap" }}>{pct}% — keep going!</div>}
      <style>{`@keyframes revealPop{0%{transform:scale(0) rotate(-15deg)}75%{transform:scale(1.15) rotate(4deg)}100%{transform:scale(1) rotate(0)}}`}</style>
    </div>
  );
}

// ─── Eco Rewards ──────────────────────────────────────────────────────────────
function EcoRewards() {
  const { ref, visible } = useScrollReveal(0.07);
  const cardRewards = useRef([0,1,2].map(i=>SCRATCH_REWARDS[i]));

  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"linear-gradient(160deg,#091a10 0%,#0d2b1a 38%,#142e1c 65%,#091810 100%)",position:"relative",zIndex:2,overflow:"hidden" }}>
      {/* Atmospheric orbs */}
      <div style={{ position:"absolute",top:"8%",left:"4%",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(45,106,79,0.18) 0%,transparent 68%)",animation:"orbFloat 9s ease-in-out infinite",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:"8%",right:"6%",width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(168,213,162,0.1) 0%,transparent 68%)",animation:"orbFloat 11s ease-in-out infinite 3s",pointerEvents:"none" }}/>

      {/* Sticky section header (dark variant) */}
      <div style={{ position:"sticky",top:72,zIndex:30,background:"rgba(9,26,16,0.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(45,106,79,0.2)",padding:"18px 52px 16px",display:"flex",alignItems:"baseline",justifyContent:"space-between",flexWrap:"wrap",gap:8 }}>
        <div style={{ display:"flex",alignItems:"baseline",gap:16 }}>
          <span style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"9px",letterSpacing:"0.22em",color:"#a8d5a2",opacity:0.7 }}>// SCRATCH & WIN</span>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"clamp(22px,3vw,34px)",fontWeight:700,color:"white",margin:0,lineHeight:1 }}>Your <span style={{ color:"#a8d5a2",fontStyle:"italic" }}>Eco Rewards</span></h2>
        </div>
        <span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:13,color:"rgba(168,213,162,0.55)" }}>Hold & drag to scratch</span>
      </div>

      <div style={{ padding:"56px 48px 80px",textAlign:"center",position:"relative",zIndex:1 }}>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"15px",color:"rgba(168,213,162,0.7)",maxWidth:460,margin:"0 auto 52px",lineHeight:1.75,opacity:visible?1:0,transition:"opacity 0.8s" }}>
          Every purchase unlocks a real dark-foil scratch card. Scratch more than 52% to reveal your hidden reward!
        </p>
        <div style={{ display:"flex",justifyContent:"center",gap:32,flexWrap:"wrap" }}>
          {[0,1,2].map(i=><ScratchCard key={i} reward={cardRewards.current[i]} index={i} visible={visible}/>)}
        </div>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"rgba(168,213,162,0.35)",marginTop:48,letterSpacing:"0.04em",opacity:visible?1:0,transition:"opacity 0.8s 0.6s" }}>
          New cards unlock with every purchase · Level up for bonus cards
        </p>
      </div>
      <style>{`@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-26px) scale(1.06)}}`}</style>
    </section>
  );
}

// ─── EcoBot ───────────────────────────────────────────────────────────────────
function EcoBot() {
  const { ref, visible } = useScrollReveal();
  const [messages, setMessages] = useState(CHAT_SEED);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const send = useCallback(async()=>{
    if (!input.trim()||loading) return;
    const text=input.trim(); setInput(""); setLoading(true);
    setMessages(m=>[...m,{from:"user",text}]);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) { setMessages(m=>[...m,{from:"bot",text:"⚠️ API key not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to .env.local"}]); setLoading(false); return; }
      
      const systemPrompt = "You are EcoBot, an AI guide for EcoVerse — sustainable fashion and lifestyle. Help with eco scores, outfit ideas, carbon savings, Eco Points, travel impact, electricity usage, and sustainable living. Be warm, brief (2-4 sentences), use emojis. Use ₹ for Indian prices. Focus on practical sustainability tips.";
      const prompt = `${systemPrompt}\n\nUser: ${text}\n\nEcoBot:`;
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 256, temperature: 0.8 }
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "API Error");
      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response. Please try again! 🌿";
      setMessages(m => [...m, { from: "bot", text: botText }]);
    } catch(err) { 
      const errorMsg = err instanceof Error ? err.message : "Connection issue";
      setMessages(m=>[...m,{from:"bot",text:`Connection issue: ${errorMsg}. Please try again! 🌿`}]); 
    }
    finally { setLoading(false); }
  },[input,loading]);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"rgba(240,236,227,0.97)",position:"relative",zIndex:2 }}>
      <SectionHeader label="// AI STYLIST" title="Meet" accent="EcoBot" subtitle="Built by Amitouja "/>
      <div style={{ padding:"48px 72px 80px",maxWidth:1100,margin:"0 auto" }}>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"15px",color:"#5a6a5a",maxWidth:460,lineHeight:1.78,marginBottom:36,opacity:visible?1:0,transition:"opacity 0.8s" }}>Your personal AI sustainability guide — eco scores, outfit ideas, carbon savings, and style tips.</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 0.54fr",gap:28,alignItems:"start" }}>
          <div style={{ borderRadius:14,overflow:"hidden",border:"1px solid #d8d3c8",boxShadow:"0 8px 32px rgba(0,0,0,0.07)",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:"all 0.9s 0.2s" }}>
            <div style={{ background:"#1a3a2a",padding:"18px 24px",display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ width:44,height:44,borderRadius:"50%",background:"#2d6a4f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🤖</div>
              <div>
                <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"18px",fontWeight:700,color:"white" }}>EcoBot</div>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:2 }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:"#a8d5a2",display:"inline-block",animation:"pulse 2s ease-in-out infinite" }}/>
                  <span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#a8d5a2" }}>Amitouja · Active</span>
                </div>
              </div>
            </div>
            <div style={{ background:"white",padding:24,minHeight:280,maxHeight:340,overflowY:"auto" }}>
              {messages.map((msg,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:msg.from==="user"?"flex-end":"flex-start",marginBottom:13 }}>
                  <div style={{ maxWidth:"80%",padding:"12px 16px",background:msg.from==="user"?"#1a3a2a":"#f5f2eb",color:msg.from==="user"?"white":"#1a1a1a",borderRadius:msg.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"13px",lineHeight:1.6 }}>{msg.text}</div>
                </div>
              ))}
              {loading&&<div style={{ display:"flex",gap:5,padding:"12px 16px",background:"#f5f2eb",borderRadius:"18px 18px 18px 4px",width:"fit-content" }}>{[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:"#2d6a4f",animation:"bounce 1s infinite",animationDelay:`${i*0.2}s` }}/>)}</div>}
              <div ref={bottomRef}/>
            </div>
            <div style={{ background:"white",padding:"0 20px 12px",display:"flex",gap:8,flexWrap:"wrap" }}>
              {["🎓 College look","🌿 Eco points","💧 Water saving","🌱 Vegan picks"].map(s=>(
                <button key={s} onClick={()=>setInput(s.split(" ").slice(1).join(" "))} style={{ padding:"5px 12px",border:"1.5px solid #d8d3c8",borderRadius:20,background:"transparent",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#555",cursor:"pointer" }}>{s}</button>
              ))}
            </div>
            <div style={{ background:"white",padding:"0 20px 20px",display:"flex",gap:10 }}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask EcoBot anything..." style={{ flex:1,padding:"12px 15px",border:"1.5px solid #d8d3c8",borderRadius:8,fontFamily:"var(--font-jost,sans-serif)",fontSize:"13px",background:"#faf9f5",outline:"none",color:"#1a1a1a" }}/>
              <button onClick={send} disabled={loading} style={{ background:"#1a3a2a",color:"white",border:"none",borderRadius:8,padding:"12px 20px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",cursor:"pointer",opacity:loading?0.7:1 }}>ASK →</button>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {[{icon:"🌍",title:"Eco Impact Explainer",desc:"Break down carbon savings, water usage, and material traceability for any product."},{icon:"✨",title:"AI Styling Assistant",desc:"Personalised eco outfit combos for any occasion — sustainability-certified."},{icon:"🏷️",title:"Smart Product Tagging",desc:"Auto-labels every item: organic, vegan leather, recycled, biodegradable, zero-waste."}].map((card,i)=>(
              <div key={card.title} style={{ background:"white",border:"1px solid #e0dbd0",borderRadius:10,padding:20,display:"flex",gap:14,alignItems:"flex-start",opacity:visible?1:0,transform:visible?"translateX(0)":"translateX(24px)",transition:`all 0.7s ${0.35+i*0.1}s cubic-bezier(0.16,1,0.3,1)` }}>
                <span style={{ fontSize:24,flexShrink:0 }}>{card.icon}</span>
                <div><h4 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"15px",fontWeight:700,color:"#1a1a1a",margin:"0 0 4px" }}>{card.title}</h4><p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",color:"#6a7a6a",lineHeight:1.6,margin:0 }}>{card.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.75)}}
      `}</style>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background:"#0f2218",padding:"60px 72px 32px",position:"relative",zIndex:2 }}>
      <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48 }}>
        <div>
          <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"24px",fontWeight:700,color:"white",marginBottom:14 }}>Eco<span style={{ color:"#a8d5a2",fontStyle:"italic" }}>Verse</span></div>
          <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"14px",lineHeight:1.75,color:"#6a9a6a",maxWidth:260 }}>Sustainable fashion for a conscious generation. Every purchase makes a real impact.</p>
        </div>
        {[["Shop",["New Arrivals","Tops & Tees","Bottoms","Outerwear","Footwear","Accessories"]],["Company",["About Us","Our Mission","Impact Report","Careers","Press"]],["Support",["FAQ","Shipping","Returns","Contact","Sustainability"]]].map(([title,links])=>(
          <div key={title as string}>
            <h4 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",letterSpacing:"0.18em",color:"white",margin:"0 0 18px",fontWeight:700 }}>{(title as string).toUpperCase()}</h4>
            {(links as string[]).map(l=>(
              <div key={l} style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"13px",color:"#6a9a6a",marginBottom:9,cursor:"pointer",transition:"color 0.2s" }} onMouseEnter={e=>(e.currentTarget.style.color="#a8d5a2")} onMouseLeave={e=>(e.currentTarget.style.color="#6a9a6a")}>{l}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop:"1px solid #1a3a2a",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",color:"#3a6a4a",margin:0 }}>© 2025 EcoVerse. All rights reserved.</p>
        <p style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",color:"#3a6a4a",margin:0 }}>Made with 🌿 for the planet</p>
      </div>
    </footer>
  );
}

// ─── Shopping Cart Component ──────────────────────────────────────────────────
function ShoppingCart({ cart, setCart, isOpen, onClose, user }: { cart:CartItem[]; setCart:(c:CartItem[])=>void; isOpen:boolean; onClose:()=>void; user:AuthUser|null }) {
  const [checkoutStep, setCheckoutStep] = useState<'cart'|'address'|'payment'|'success'>('cart');
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({ fullName:'', email:user?.email||'', phone:'', address:'', city:'', state:'', pincode:'', cardNumber:'', cardName:'', cardExpiry:'', cardCVV:'' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const updateQty = (productId:number, delta:number) => {
    setCart(cart.map(item => item.product.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeItem = (productId:number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.priceNum * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;
  const totalPts = cart.reduce((sum, item) => sum + parseInt(item.product.pts) * item.quantity, 0);

  const handleCheckout = async () => {
    if (checkoutStep === 'cart') {
      setCheckoutStep('address');
    } else if (checkoutStep === 'address') {
      if (!checkoutData.fullName || !checkoutData.email || !checkoutData.phone || !checkoutData.address || !checkoutData.city || !checkoutData.state || !checkoutData.pincode) {
        setMessage('❌ Please fill all address fields');
        return;
      }
      setCheckoutStep('payment');
    } else if (checkoutStep === 'payment') {
      if (!checkoutData.cardNumber || !checkoutData.cardName || !checkoutData.cardExpiry || !checkoutData.cardCVV) {
        setMessage('❌ Please fill all payment fields');
        return;
      }
      
      setLoading(true);
      setMessage('💳 Processing payment...');

      try {
        // Save order to Supabase
        const orderResult = await saveOrderToSupabase({
          user_email: checkoutData.email,
          items: cart,
          total: total,
          address: checkoutData,
          status: 'confirmed'
        });

        console.log('Order saved:', orderResult);
        setMessage('✅ Order placed successfully!');
        
        setTimeout(() => {
          setCheckoutStep('success');
          setTimeout(() => {
            setCart([]);
            onClose();
            setCheckoutStep('cart');
            setCheckoutData({ fullName:'', email:user?.email||'', phone:'', address:'', city:'', state:'', pincode:'', cardNumber:'', cardName:'', cardExpiry:'', cardCVV:'' });
            setMessage('');
          }, 3000);
        }, 800);
      } catch (error) {
        setMessage('❌ Error placing order. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  const inp: React.CSSProperties = { width:"100%", padding:"12px 16px", border:"1.5px solid #d8d3c8", background:"white", fontFamily:"var(--font-jost,sans-serif)", fontSize:"14px", color:"#1a1a1a", outline:"none", boxSizing:"border-box", borderRadius:"8px" };

  return (
    <>
      <div style={{ position:"fixed", inset:0, zIndex:9998, background:"rgba(10,10,10,0.6)", backdropFilter:"blur(14px)" }} onClick={onClose}/>
      <div style={{ position:"fixed", right:0, top:0, bottom:0, zIndex:9999, width:"min(540px, 92vw)", background:"#f5f2eb", boxShadow:"-8px 0 48px rgba(0,0,0,0.2)", display:"flex", flexDirection:"column", animation:"slideIn 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
        <div style={{ padding:"24px 28px", borderBottom:"1.5px solid #e0dbd0", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"24px", fontWeight:700, color:"#1a1a1a", margin:0 }}>
            {checkoutStep === 'cart' ? '🛒 Shopping Cart' : checkoutStep === 'address' ? '📍 Delivery Address' : checkoutStep === 'payment' ? '💳 Payment' : '🎉 Order Confirmed!'}
          </h2>
          <button onClick={onClose} style={{ background:"none", border:"none", fontSize:28, color:"#aaa", cursor:"pointer" }}>×</button>
        </div>

        <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>
          {checkoutStep === 'cart' && (
            cart.length === 0 ? (
              <div style={{ textAlign:"center", padding:"80px 20px" }}>
                <div style={{ fontSize:56, marginBottom:16 }}>🛒</div>
                <h3 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"20px", fontWeight:700, color:"#1a1a1a", marginBottom:8 }}>Your cart is empty</h3>
                <p style={{ color:"#8a9a8a" }}>Start shopping to add items</p>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {cart.map(item => (
                  <div key={item.product.id} style={{ display:"flex", gap:16, background:"white", border:"1px solid #e0dbd0", borderRadius:12, padding:16 }}>
                    <img src={item.product.img} alt={item.product.name} style={{ width:90, height:90, objectFit:"cover", borderRadius:8, background:item.product.bgColor }} onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80"; }} />
                    <div style={{ flex:1 }}>
                      <h4 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"16px", fontWeight:600, color:"#1a1a1a", margin:"0 0 4px" }}>{item.product.name}</h4>
                      <p style={{ fontSize:"12px", color:"#8a9a8a", margin:"0 0 8px" }}>{item.product.material}</p>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, border:"1.5px solid #d8d3c8", borderRadius:20, padding:"4px 8px" }}>
                          <button onClick={() => updateQty(item.product.id, -1)} style={{ background:"none", border:"none", fontSize:16, cursor:"pointer", color:"#1a1a1a" }}>−</button>
                          <span style={{ fontSize:"14px", fontWeight:600, minWidth:20, textAlign:"center" }}>{item.quantity}</span>
                          <button onClick={() => updateQty(item.product.id, 1)} style={{ background:"none", border:"none", fontSize:16, cursor:"pointer", color:"#1a1a1a" }}>+</button>
                        </div>
                        <span style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"16px", fontWeight:700, color:"#1a1a1a" }}>{item.product.price}</span>
                        <button onClick={() => removeItem(item.product.id)} style={{ marginLeft:"auto", background:"none", border:"none", fontSize:18, color:"#c0392b", cursor:"pointer" }}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {checkoutStep === 'address' && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <input placeholder="Full Name *" value={checkoutData.fullName} onChange={e => setCheckoutData({...checkoutData, fullName:e.target.value})} style={inp} />
              <input placeholder="Email Address *" type="email" value={checkoutData.email} onChange={e => setCheckoutData({...checkoutData, email:e.target.value})} style={inp} />
              <input placeholder="Phone Number *" type="tel" value={checkoutData.phone} onChange={e => setCheckoutData({...checkoutData, phone:e.target.value})} style={inp} />
              <textarea placeholder="Full Address *" value={checkoutData.address} onChange={e => setCheckoutData({...checkoutData, address:e.target.value})} style={{...inp, minHeight:80, resize:"vertical"}} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <input placeholder="City *" value={checkoutData.city} onChange={e => setCheckoutData({...checkoutData, city:e.target.value})} style={inp} />
                <input placeholder="State *" value={checkoutData.state} onChange={e => setCheckoutData({...checkoutData, state:e.target.value})} style={inp} />
              </div>
              <input placeholder="Pincode *" value={checkoutData.pincode} onChange={e => setCheckoutData({...checkoutData, pincode:e.target.value})} style={inp} />
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <input placeholder="Card Number *" value={checkoutData.cardNumber} onChange={e => setCheckoutData({...checkoutData, cardNumber:e.target.value})} maxLength={16} style={inp} />
              <input placeholder="Cardholder Name *" value={checkoutData.cardName} onChange={e => setCheckoutData({...checkoutData, cardName:e.target.value})} style={inp} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <input placeholder="MM/YY *" value={checkoutData.cardExpiry} onChange={e => setCheckoutData({...checkoutData, cardExpiry:e.target.value})} maxLength={5} style={inp} />
                <input placeholder="CVV *" type="password" value={checkoutData.cardCVV} onChange={e => setCheckoutData({...checkoutData, cardCVV:e.target.value})} maxLength={3} style={inp} />
              </div>
              <div style={{ background:"#e8ede3", border:"1px solid #c8d8c8", borderRadius:8, padding:16, marginTop:8 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:18 }}>🔒</span>
                  <span style={{ fontWeight:600, color:"#1a3a2a" }}>Secure Payment</span>
                </div>
                <p style={{ fontSize:"12px", color:"#4a6a4a", margin:0, lineHeight:1.5 }}>Your payment information is encrypted and secure.</p>
              </div>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div style={{ textAlign:"center", padding:"60px 20px" }}>
              <div style={{ fontSize:72, marginBottom:24, animation:"successPop 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>
              <h3 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"26px", fontWeight:700, color:"#2d6a4f", marginBottom:12 }}>Order Placed Successfully!</h3>
              <p style={{ fontSize:"15px", color:"#4a6a4a", lineHeight:1.7, marginBottom:24 }}>Thank you! You've earned <strong>{totalPts} Eco Points</strong>.</p>
              <div style={{ background:"#d4e6c3", borderRadius:12, padding:20 }}>
                <p style={{ fontSize:"13px", color:"#1a3a2a", margin:0 }}>🌱 You helped plant 2 trees!</p>
              </div>
            </div>
          )}

          {message && (
            <div style={{ padding:12, background:message.includes('❌')?'#ffebee':'#e8f5e9', borderRadius:8, fontSize:13, textAlign:'center', marginTop:12 }}>
              {message}
            </div>
          )}
        </div>

        {checkoutStep !== 'success' && cart.length > 0 && (
          <div style={{ borderTop:"1.5px solid #e0dbd0", padding:"20px 28px", background:"white" }}>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:"13px", color:"#4a4a3a" }}>Subtotal</span>
                <span style={{ fontSize:"13px", fontWeight:600, color:"#1a1a1a" }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:"13px", color:"#4a4a3a" }}>Shipping</span>
                <span style={{ fontSize:"13px", fontWeight:600, color:shipping===0?"#2d6a4f":"#1a1a1a" }}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:12, paddingTop:12, borderTop:"1px solid #e8e3d8" }}>
                <span style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"16px", fontWeight:700, color:"#1a1a1a" }}>Total</span>
                <span style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"18px", fontWeight:700, color:"#2d6a4f" }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleCheckout} disabled={loading} style={{ width:"100%", background:loading?"#aaa":"#1a3a2a", color:"white", border:"none", borderRadius:8, padding:14, fontFamily:"var(--font-jost,sans-serif)", fontSize:"12px", fontWeight:700, letterSpacing:"0.1em", cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
              {loading ? '⏳ PROCESSING...' : checkoutStep === 'cart' ? 'PROCEED TO CHECKOUT →' : checkoutStep === 'address' ? 'CONTINUE TO PAYMENT →' : 'PLACE ORDER ₹' + total.toLocaleString()}
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes slideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
        @keyframes successPop { 0% { transform:scale(0) rotate(-15deg); } 75% { transform:scale(1.15) rotate(4deg); } 100% { transform:scale(1) rotate(0); } }
      `}</style>
    </>
  );
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function HomePage() {
  const [user, setUser] = useState<AuthUser|null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const handleSignIn = useCallback(() => {
    setUser({ name: "Eco Explorer", email: "user@ecoverse.com", pts: 250 });
    setAuthModalOpen(false);
  }, []);

  const handleSignOut = useCallback(() => {
    setUser(null);
    setCart([]);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ background:"#f5f2eb", minHeight:"100vh", fontFamily:'var(--font-jost,sans-serif)', position:"relative" }}>
      <LeafParticleSystem />
      <CustomCursor />
      <AnnouncementBar />
      
      <Navigation activeTab="SHOP" setActiveTab={()=>{}} onSignInClick={() => setAuthModalOpen(true)} user={user} onSignOut={handleSignOut} />

      <main style={{ position:"relative", zIndex:2 }}>
        <Hero onShopClick={() => document.querySelector('[data-scroll-to="shop"]')?.scrollIntoView({ behavior: 'smooth' })} />
        <Categories />
        <div data-scroll-to="shop"><Shop onAddToCart={handleAddToCart} /></div>
        <ImpactStrip />
        <EcoRanks />
        <TravelData />
        <ElectricityUsage />
      </main>

      <Footer />

      <ShoppingCart cart={cart} setCart={setCart} isOpen={cartOpen} onClose={() => setCartOpen(false)} user={user} />

      {authModalOpen && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:10000 }}>
          <div style={{ background:"white", borderRadius:12, padding:40, maxWidth:400, textAlign:"center" }}>
            <h2 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:28, color:"#1a1a1a", marginBottom:16 }}>Welcome to EcoVerse</h2>
            <p style={{ color:"#555", marginBottom:24 }}>Sign in to start earning Eco Points!</p>
            <button onClick={handleSignIn} style={{ width:"100%", background:"#1a3a2a", color:"white", border:"none", borderRadius:8, padding:12, fontWeight:700, marginBottom:12, cursor:"pointer" }}>Sign In / Sign Up</button>
            <button onClick={() => setAuthModalOpen(false)} style={{ width:"100%", background:"#f0f0f0", color:"#1a1a1a", border:"none", borderRadius:8, padding:12, fontWeight:600, cursor:"pointer" }}>Continue as Guest</button>
          </div>
        </div>
      )}

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: var(--font-jost, sans-serif); }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

// ─── Travel Data Component ─────────────────────────────────────────────────────
function TravelData() {
  interface TravelEntry {
    type: 'flight' | 'car' | 'train' | 'bus';
    distance: number;
    passengers: number;
  }

  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const [newEntry, setNewEntry] = useState<TravelEntry>({ type: 'flight', distance: 0, passengers: 1 });

  const addEntry = () => {
    if (newEntry.distance > 0) {
      setEntries([...entries, newEntry]);
      setNewEntry({ type: 'flight', distance: 0, passengers: 1 });
    }
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const calculateCarbonFootprint = () => {
    return entries.reduce((total, entry) => {
      const baseEmission = {
        flight: 0.25, // kg CO2 per km
        car: 0.12,
        train: 0.04,
        bus: 0.08
      }[entry.type];

      return total + (baseEmission * entry.distance / entry.passengers);
    }, 0);
  };

  const totalFootprint = calculateCarbonFootprint();

  return (
    <section style={{ padding:"80px 52px",borderTop:"1px solid rgba(26,26,20,0.1)" }}>
      <span style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.22em",color:"#6b8c6b",display:"block",marginBottom:12,textAlign:"center" }}>// TRAVEL IMPACT CALCULATOR</span>
      <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"clamp(28px,3.5vw,44px)",fontWeight:700,textAlign:"center",marginBottom:16,lineHeight:1.1 }}>
        Track Your <span style={{ color:"#4a7c59",fontStyle:"italic" }}>Travel Footprint</span>
      </h2>
      <p style={{ fontSize:"15px",color:"#4a4a3a",maxWidth:600,margin:"0 auto 48px",textAlign:"center",lineHeight:1.8 }}>
        Calculate the carbon emissions from your travel and discover ways to reduce your environmental impact.
      </p>

      {/* Add Travel Entry */}
      <div style={{ maxWidth:400,margin:"0 auto 48px",padding:24,background:"white",borderRadius:12,boxShadow:"0 4px 24px rgba(0,0,0,0.08)",border:"1px solid rgba(26,26,20,0.05)" }}>
        <h3 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:18,fontWeight:600,marginBottom:20,color:"#1a1a14" }}>Add Travel Entry</h3>
        <div style={{ display:"flex",flexDirection:"column",gap:16 }}>
          <div>
            <label style={{ display:"block",fontSize:13,fontWeight:500,marginBottom:4,color:"#4a4a3a" }}>Travel Type</label>
            <select
              value={newEntry.type}
              onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value as TravelEntry['type'] })}
              style={{ width:"100%",padding:"12px 16px",border:"1.5px solid rgba(26,26,20,0.2)",background:"white",fontFamily:"var(--font-jost,sans-serif)",fontSize:14,color:"#1a1a14",borderRadius:8,outline:"none" }}
            >
              <option value="flight">✈️ Flight</option>
              <option value="car">🚗 Car</option>
              <option value="train">🚂 Train</option>
              <option value="bus">🚌 Bus</option>
            </select>
          </div>
          <div>
            <label style={{ display:"block",fontSize:13,fontWeight:500,marginBottom:4,color:"#4a4a3a" }}>Distance (km)</label>
            <input
              type="number"
              value={newEntry.distance}
              onChange={(e) => setNewEntry({ ...newEntry, distance: Number(e.target.value) })}
              style={{ width:"100%",padding:"12px 16px",border:"1.5px solid rgba(26,26,20,0.2)",background:"white",fontFamily:"var(--font-jost,sans-serif)",fontSize:14,color:"#1a1a14",borderRadius:8,outline:"none" }}
              placeholder="Enter distance"
            />
          </div>
          <div>
            <label style={{ display:"block",fontSize:13,fontWeight:500,marginBottom:4,color:"#4a4a3a" }}>Passengers</label>
            <input
              type="number"
              min="1"
              value={newEntry.passengers}
              onChange={(e) => setNewEntry({ ...newEntry, passengers: Number(e.target.value) })}
              style={{ width:"100%",padding:"12px 16px",border:"1.5px solid rgba(26,26,20,0.2)",background:"white",fontFamily:"var(--font-jost,sans-serif)",fontSize:14,color:"#1a1a14",borderRadius:8,outline:"none" }}
            />
          </div>
          <button
            onClick={addEntry}
            style={{ width:"100%",background:"#4a7c59",color:"white",padding:14,borderRadius:8,fontFamily:"var(--font-jost,sans-serif)",fontSize:14,fontWeight:600,border:"none",cursor:"pointer",transition:"background 0.2s" }}
            onMouseEnter={(e) => (e.target as HTMLElement).style.background = "#2d5a3d"}
            onMouseLeave={(e) => (e.target as HTMLElement).style.background = "#4a7c59"}
          >
            Add Travel Entry
          </button>
        </div>
      </div>

      {/* Travel Entries List */}
      {entries.length > 0 && (
        <div style={{ maxWidth:800,margin:"0 auto 48px" }}>
          <h3 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:20,fontWeight:600,marginBottom:24,color:"#1a1a14",textAlign:"center" }}>Your Travel Entries</h3>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {entries.map((entry, index) => (
              <div key={index} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:16,background:"white",borderRadius:8,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid rgba(26,26,20,0.05)" }}>
                <div style={{ display:"flex",alignItems:"center",gap:16 }}>
                  <span style={{ fontSize:24 }}>
                    {entry.type === 'flight' ? '✈️' : entry.type === 'car' ? '🚗' : entry.type === 'train' ? '🚂' : '🚌'}
                  </span>
                  <div>
                    <p style={{ fontWeight:500,color:"#1a1a14",textTransform:"capitalize",margin:0 }}>{entry.type}</p>
                    <p style={{ fontSize:13,color:"#4a4a3a",margin:4 }}>{entry.distance} km • {entry.passengers} passenger{entry.passengers > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <span style={{ fontSize:14,fontWeight:500,color:"#4a7c59" }}>
                    {(entry.distance / entry.passengers * {
                      flight: 0.25,
                      car: 0.12,
                      train: 0.04,
                      bus: 0.08
                    }[entry.type]).toFixed(1)} kg CO₂
                  </span>
                  <button
                    onClick={() => removeEntry(index)}
                    style={{ color:"#4a4a3a",fontSize:16,cursor:"pointer",background:"none",border:"none",padding:4 }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Carbon Footprint Summary */}
      {totalFootprint > 0 && (
        <div style={{ maxWidth:400,margin:"0 auto",textAlign:"center" }}>
          <div style={{ padding:32,background:"linear-gradient(135deg, rgba(74,130,107,0.1) 0%, rgba(45,90,61,0.1) 100%)",borderRadius:16,border:"1px solid rgba(74,130,107,0.2)" }}>
            <h3 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:24,fontWeight:700,marginBottom:8,color:"#1a1a14" }}>Total Carbon Footprint</h3>
            <p style={{ fontSize:36,fontWeight:700,marginBottom:16,color:"#4a7c59" }}>{totalFootprint.toFixed(1)} kg CO₂</p>
            <p style={{ fontSize:13,color:"#4a4a3a",marginBottom:24 }}>
              Equivalent to planting {Math.ceil(totalFootprint / 20)} trees to offset this impact.
            </p>
            <button style={{ background:"#4a7c59",color:"white",padding:"12px 24px",borderRadius:8,fontFamily:"var(--font-jost,sans-serif)",fontSize:14,fontWeight:600,border:"none",cursor:"pointer",transition:"background 0.2s" }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = "#2d5a3d"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = "#4a7c59"}>
              🌱 Offset with Eco Purchase
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Electricity Usage Component ───────────────────────────────────────────────
function ElectricityUsage() {
  const [data, setData] = useState({ monthlyUsage: 0, energySource: 'grid', householdSize: 1 });

  const calculateCarbonFootprint = () => {
    const baseEmission = {
      grid: 0.4, // kg CO2 per kWh (average grid mix)
      renewable: 0.02, // kg CO2 per kWh (solar/wind)
      mixed: 0.2 // kg CO2 per kWh (mixed sources)
    }[data.energySource] || 0.4; // default to grid if unknown

    return baseEmission * data.monthlyUsage;
  };

  const calculateAnnualFootprint = () => calculateCarbonFootprint() * 12;

  const getRecommendations = () => {
    const footprint = calculateCarbonFootprint();
    const recommendations = [];

    if (data.energySource === 'grid') {
      recommendations.push("Consider switching to renewable energy sources like solar panels");
    }

    if (footprint > 50) {
      recommendations.push("Install LED bulbs and energy-efficient appliances");
    }

    if (data.monthlyUsage > 300) {
      recommendations.push("Unplug electronics when not in use and use smart power strips");
    }

    recommendations.push("Monitor usage with smart meters and set conservation goals");

    return recommendations;
  };

  const footprint = calculateCarbonFootprint();
  const annualFootprint = calculateAnnualFootprint();

  return (
    <section style={{ padding:"80px 52px",borderTop:"1px solid rgba(26,26,20,0.1)" }}>
      <span style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.22em",color:"#6b8c6b",display:"block",marginBottom:12,textAlign:"center" }}>// ELECTRICITY IMPACT CALCULATOR</span>
      <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"clamp(28px,3.5vw,44px)",fontWeight:700,textAlign:"center",marginBottom:16,lineHeight:1.1 }}>
        Monitor Your <span style={{ color:"#4a7c59",fontStyle:"italic" }}>Electricity Usage</span>
      </h2>
      <p style={{ fontSize:"15px",color:"#4a4a3a",maxWidth:600,margin:"0 auto 48px",textAlign:"center",lineHeight:1.8 }}>
        Track your household electricity consumption and calculate your carbon footprint from energy use.
      </p>

      {/* Input Form */}
      <div style={{ maxWidth:400,margin:"0 auto 48px",padding:24,background:"white",borderRadius:12,boxShadow:"0 4px 24px rgba(0,0,0,0.08)",border:"1px solid rgba(26,26,20,0.05)" }}>
        <h3 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:18,fontWeight:600,marginBottom:24,color:"#1a1a14" }}>Electricity Details</h3>
        <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
          <div>
            <label style={{ display:"block",fontSize:13,fontWeight:500,marginBottom:6,color:"#4a4a3a" }}>Monthly Usage (kWh)</label>
            <input
              type="number"
              value={data.monthlyUsage}
              onChange={(e) => setData({ ...data, monthlyUsage: Number(e.target.value) })}
              style={{ width:"100%",padding:"12px 16px",border:"1.5px solid rgba(26,26,20,0.2)",background:"white",fontFamily:"var(--font-jost,sans-serif)",fontSize:14,color:"#1a1a14",borderRadius:8,outline:"none" }}
              placeholder="Enter kWh used per month"
            />
            <p style={{ fontSize:11,color:"#4a4a3a",marginTop:4 }}>Check your electricity bill for this information</p>
          </div>

          <div>
            <label style={{ display:"block",fontSize:13,fontWeight:500,marginBottom:6,color:"#4a4a3a" }}>Energy Source</label>
            <select
              value={data.energySource}
              onChange={(e) => setData({ ...data, energySource: e.target.value })}
              style={{ width:"100%",padding:"12px 16px",border:"1.5px solid rgba(26,26,20,0.2)",background:"white",fontFamily:"var(--font-jost,sans-serif)",fontSize:14,color:"#1a1a14",borderRadius:8,outline:"none" }}
            >
              <option value="grid">🔌 Grid Electricity (Standard)</option>
              <option value="renewable">☀️ Renewable Energy (Solar/Wind)</option>
              <option value="mixed">⚡ Mixed Sources</option>
            </select>
          </div>

          <div>
            <label style={{ display:"block",fontSize:13,fontWeight:500,marginBottom:6,color:"#4a4a3a" }}>Household Size</label>
            <input
              type="number"
              min="1"
              value={data.householdSize}
              onChange={(e) => setData({ ...data, householdSize: Number(e.target.value) })}
              style={{ width:"100%",padding:"12px 16px",border:"1.5px solid rgba(26,26,20,0.2)",background:"white",fontFamily:"var(--font-jost,sans-serif)",fontSize:14,color:"#1a1a14",borderRadius:8,outline:"none" }}
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {data.monthlyUsage > 0 && (
        <div style={{ maxWidth:900,margin:"0 auto" }}>
          {/* Carbon Footprint Cards */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))",gap:24,marginBottom:48 }}>
            <div style={{ padding:24,background:"white",borderRadius:12,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid rgba(26,26,20,0.05)",textAlign:"center" }}>
              <h4 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:18,fontWeight:600,marginBottom:8,color:"#1a1a14" }}>Monthly Footprint</h4>
              <p style={{ fontSize:32,fontWeight:700,marginBottom:4,color:"#4a7c59" }}>{footprint.toFixed(1)} kg CO₂</p>
              <p style={{ fontSize:13,color:"#4a4a3a" }}>Carbon emissions per month</p>
            </div>
            <div style={{ padding:24,background:"white",borderRadius:12,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid rgba(26,26,20,0.05)",textAlign:"center" }}>
              <h4 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:18,fontWeight:600,marginBottom:8,color:"#1a1a14" }}>Annual Footprint</h4>
              <p style={{ fontSize:32,fontWeight:700,marginBottom:4,color:"#4a7c59" }}>{annualFootprint.toFixed(1)} kg CO₂</p>
              <p style={{ fontSize:13,color:"#4a4a3a" }}>Carbon emissions per year</p>
            </div>
          </div>

          {/* Per Person Breakdown */}
          <div style={{ padding:24,background:"linear-gradient(90deg, rgba(168,200,168,0.2) 0%, rgba(61,122,80,0.1) 100%)",borderRadius:12,border:"1px solid rgba(61,122,80,0.2)",marginBottom:32 }}>
            <h4 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:18,fontWeight:600,marginBottom:16,color:"#1a1a14" }}>Per Person Impact</h4>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:24,fontWeight:700,color:"#3d7a50" }}>{(footprint / data.householdSize).toFixed(1)}</p>
                <p style={{ fontSize:13,color:"#4a4a3a" }}>kg CO₂/month per person</p>
              </div>
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:24,fontWeight:700,color:"#3d7a50" }}>{(annualFootprint / data.householdSize).toFixed(1)}</p>
                <p style={{ fontSize:13,color:"#4a4a3a" }}>kg CO₂/year per person</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ padding:24,background:"white",borderRadius:12,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"1px solid rgba(26,26,20,0.05)" }}>
            <h4 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:18,fontWeight:600,marginBottom:16,color:"#1a1a14",display:"flex",alignItems:"center",gap:8 }}>
              💡 Eco-Friendly Recommendations
            </h4>
            <ul style={{ display:"flex",flexDirection:"column",gap:12 }}>
              {getRecommendations().map((rec, index) => (
                <li key={index} style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                  <span style={{ color:"#4a7c59",marginTop:2 }}>•</span>
                  <span style={{ color:"#4a4a3a",lineHeight:1.5 }}>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Offset Action */}
          <div style={{ textAlign:"center",marginTop:32 }}>
            <button style={{ background:"#4a7c59",color:"white",padding:"14px 32px",borderRadius:8,fontFamily:"var(--font-jost,sans-serif)",fontSize:14,fontWeight:600,border:"none",cursor:"pointer",transition:"background 0.2s",display:"inline-flex",alignItems:"center",gap:8 }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.background = "#2d5a3d"}
              onMouseLeave={(e) => (e.target as HTMLElement).style.background = "#4a7c59"}>
              🌱 Offset Carbon with Eco Purchase
            </button>
            <p style={{ fontSize:13,color:"#4a4a3a",marginTop:12 }}>
              Support renewable energy projects and reduce your carbon footprint
            </p>
          </div>
        </div>
      )}
    </section>
  );
}