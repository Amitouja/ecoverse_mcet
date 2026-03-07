"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product { id: number; name: string; material: string; price: string; pts: string; tag: "ORGANIC"|"RECYCLED"|"VEGAN"; ecoScore: number; img: string; bgColor: string; }
interface Category { name: string; count: number; img: string; bg: string; }
interface AuthUser { name: string; email: string; pts: number; }

// ─── Data — FIXED IMAGES ─────────────────────────────────────────────────────
const categories: Category[] = [
  { name: "Tops & Tees", count: 24, bg: "#d4e6c3", img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80" },
  { name: "Bottoms",     count: 18, bg: "#e8d9c0", img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80" },
  { name: "Outerwear",   count: 12, bg: "#c8d8e8", img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80" },
  { name: "Footwear",    count: 9,  bg: "#d8cce8", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80" },
  { name: "Accessories", count: 15, bg: "#e8e4d4", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80" },
  { name: "Dresses",     count: 11, bg: "#e4d4e8", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80" },
];

const products: Product[] = [
  { id:1,  name:"Organic Linen Tee",     material:"100% Organic Cotton",     price:"₹1,299", pts:"+50 pts", tag:"ORGANIC",  ecoScore:95, bgColor:"#eef5e8", img:"https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=700&q=85" },
  { id:2,  name:"Recycled Bomber",       material:"Post-Consumer Polyester", price:"₹3,499", pts:"+70 pts", tag:"RECYCLED", ecoScore:88, bgColor:"#e8ede3", img:"https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=700&q=85" },
  { id:3,  name:"Hemp Canvas Kicks",     material:"Natural Hemp Fibre",      price:"₹2,799", pts:"+60 pts", tag:"VEGAN",    ecoScore:91, bgColor:"#e3eaf0", img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&q=85" },
  { id:4,  name:"Bamboo Joggers",        material:"Organic Bamboo Blend",    price:"₹1,899", pts:"+45 pts", tag:"ORGANIC",  ecoScore:86, bgColor:"#f0ebe3", img:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=700&q=85" },
  { id:5,  name:"Cactus Leather Jacket", material:"Nopal Cactus Leather",    price:"₹5,999", pts:"+80 pts", tag:"VEGAN",    ecoScore:82, bgColor:"#e8ede3", img:"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700&q=85" },
  { id:6,  name:"Hemp Maxi Dress",       material:"Hemp & TENCEL™ Blend",    price:"₹2,499", pts:"+55 pts", tag:"ORGANIC",  ecoScore:93, bgColor:"#f0ebe3", img:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=700&q=85" },
  { id:7,  name:"Recycled Denim",        material:"Post-Consumer Denim",     price:"₹2,199", pts:"+65 pts", tag:"RECYCLED", ecoScore:87, bgColor:"#e3eaf0", img:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=700&q=85" },
  { id:8,  name:"Cork Crossbody",        material:"Sustainable Cork Bark",   price:"₹1,699", pts:"+40 pts", tag:"VEGAN",    ecoScore:94, bgColor:"#e8d9c0", img:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=85" },
  { id:9,  name:"Merino Sweater",        material:"Certified Merino Wool",   price:"₹3,999", pts:"+75 pts", tag:"ORGANIC",  ecoScore:89, bgColor:"#f0ebe3", img:"https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=700&q=85" },
  { id:10, name:"Piñatex Sneakers",      material:"Pineapple Leaf Fibre",    price:"₹3,299", pts:"+68 pts", tag:"VEGAN",    ecoScore:90, bgColor:"#e8ede3", img:"https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=700&q=85" },
];

const ecoRanks = [
  { icon:"🌱", name:"Seed",           range:"0 – 499 pts",       perk:"+5% bonus points",          progress:100 },
  { icon:"🌿", name:"Sapling",        range:"500 – 1,499 pts",   perk:"Free eco-packaging",        progress:65  },
  { icon:"🌳", name:"Tree",           range:"1,500 – 4,999 pts", perk:"Priority scratch cards",    progress:30  },
  { icon:"🌍", name:"Forest Guardian",range:"5,000+ pts",         perk:"20% off + exclusive drops", progress:10, highlight:true },
];

const CHAT_SEED = [
  { from:"bot",  text:"Hello! 🌿 I'm EcoBot. Ask me about eco scores, sustainable outfits, or how to earn Eco Points!" },
  { from:"user", text:"How eco-friendly is the Recycled Bomber?" },
  { from:"bot",  text:"Great pick! 🧥 The Recycled Bomber uses 100% post-consumer polyester — 12 plastic bottles given new life. ECO Score: 88/100. Saves 40% water vs traditional fabric!" },
];

const SCRATCH_REWARDS = ["🎉 10% OFF","🚚 Free Shipping","🌿 2x Points","🎁 Mystery Gift","⭐ 100 Bonus Pts","💚 5% Cashback","🌱 Plant a Tree","✨ VIP Access"];

// ─── Scroll Reveal Hook ───────────────────────────────────────────────────────
function useScrollReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
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
        ring.current.style.borderColor = hov.current ? "rgba(45,106,79,0.7)" : "rgba(0,0,0,0.52)";
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
      <div ref={dot}  style={{ position:"fixed",top:0,left:0,zIndex:99999,width:8,height:8,borderRadius:"50%",background:"#0a0a0a",boxShadow:"0 0 10px 3px rgba(0,0,0,0.6),0 0 24px 6px rgba(0,0,0,0.2)",pointerEvents:"none",willChange:"transform" }} />
      <div ref={ring} style={{ position:"fixed",top:0,left:0,zIndex:99998,width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(0,0,0,0.52)",background:"rgba(0,0,0,0.03)",boxShadow:"0 0 14px 4px rgba(0,0,0,0.12)",pointerEvents:"none",willChange:"transform",transition:"border-color 0.2s,transform 0.07s linear" }} />
      <style>{`*{cursor:none!important}`}</style>
    </>
  );
}

// ─── Announcement Marquee ─────────────────────────────────────────────────────
function AnnouncementBar() {
  const items = [
    "🌿 FREE SHIPPING ABOVE ₹999","✦ EARN 2X ECO POINTS THIS WEEK","🌱 PLANTED 48K TREES","♻️ 100% SUSTAINABLE PACKAGING",
    "🌍 CARBON-NEUTRAL DELIVERIES","✦ NEW ARRIVALS EVERY FRIDAY","🎁 MYSTERY REWARDS ON EVERY ORDER",
    "🌿 FREE SHIPPING ABOVE ₹999","✦ EARN 2X ECO POINTS THIS WEEK","🌱 PLANTED 48K TREES","♻️ 100% SUSTAINABLE PACKAGING",
    "🌍 CARBON-NEUTRAL DELIVERIES","✦ NEW ARRIVALS EVERY FRIDAY","🎁 MYSTERY REWARDS ON EVERY ORDER",
  ];
  return (
    <div style={{ background:"#0f2218",overflow:"hidden",padding:"9px 0",position:"relative",zIndex:200 }}>
      <div style={{ display:"flex",animation:"marquee 32s linear infinite",width:"max-content" }}>
        {items.map((item, i) => (
          <span key={i} style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.18em",padding:"0 28px",whiteSpace:"nowrap",
            color: i%4===1?"#f0d080" : i%4===3?"#80c8f0" : "#a8d5a2" }}>{item}</span>
        ))}
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
    const fn = () => setScrolled(window.scrollY > 55);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", zIndex:150,
      top:   scrolled ? "12px" : "0",
      left:  scrolled ? "20px" : "0",
      right: scrolled ? "20px" : "0",
      height: scrolled ? "54px" : "64px",
      background: scrolled ? "rgba(245,242,235,0.93)" : "rgba(245,242,235,0.98)",
      backdropFilter: "blur(22px) saturate(1.5)",
      borderRadius: scrolled ? "14px" : "0",
      border:       scrolled ? "1px solid rgba(224,219,208,0.9)" : "none",
      borderBottom: scrolled ? "none" : "1px solid #e0dbd0",
      boxShadow:    scrolled ? "0 8px 40px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.05)" : "none",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding: scrolled ? "0 28px" : "0 48px",
      transition:"all 0.42s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Left tabs */}
      <div style={{ display:"flex", gap:"28px" }}>
        {["SHOP","ECO RANKS","REWARDS","AI STYLIST"].map(item => (
          <button key={item} onClick={() => setActiveTab(item)} style={{
            background:"none", border:"none", cursor:"pointer",
            fontFamily:"var(--font-jost,sans-serif)", fontSize:"11px", fontWeight:600, letterSpacing:"0.1em",
            color: activeTab===item ? "#1a3a2a" : "#7a8a7a",
            borderBottom: activeTab===item ? "2px solid #2d6a4f" : "2px solid transparent",
            paddingBottom:"2px", transition:"all 0.2s",
          }}>{item}</button>
        ))}
      </div>

      {/* Logo */}
      <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:scrolled?"19px":"22px",fontWeight:700,letterSpacing:"-0.02em",color:"#1a1a1a",transition:"font-size 0.3s",userSelect:"none" }}>
        Eco<span style={{ color:"#2d6a4f",fontStyle:"italic" }}>Verse</span>
      </div>

      {/* Right actions */}
      <div style={{ display:"flex", alignItems:"center", gap:"13px" }}>
        {!user && (
          <button style={{ display:"flex",alignItems:"center",gap:6,background:"white",border:"1.5px solid #d0cdc5",borderRadius:20,padding:"5px 12px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:600,color:"#333",cursor:"pointer" }}>
            <span style={{ width:7,height:7,borderRadius:"50%",background:"#2d6a4f",display:"inline-block" }} /> 0 pts
          </button>
        )}
        {user
          ? <UserMenu user={user} onSignOut={onSignOut} />
          : <button onClick={onSignInClick} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",color:"#1a3a2a",textDecoration:"underline",textUnderlineOffset:"3px" }}>SIGN IN</button>
        }
        <button
          style={{ background:"#1a3a2a",color:"white",border:"none",borderRadius:"6px",padding:"9px 18px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",transition:"all 0.2s",boxShadow:"0 2px 10px rgba(26,58,42,0.3)" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background="#2d6a4f"; (e.currentTarget as HTMLElement).style.transform="translateY(-1px)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background="#1a3a2a"; (e.currentTarget as HTMLElement).style.transform="translateY(0)"; }}>
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

  const getUsers = () => { try { return JSON.parse(localStorage.getItem("ecoverse_users") || "{}"); } catch { return {}; } };

  const submit = () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    if (mode === "signup" && !form.name) { setError("Name is required."); return; }
    if (form.password.length < 6) { setError("Password must be 6+ characters."); return; }
    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      if (mode === "signup") {
        if (users[form.email]) { setError("Account exists. Sign in instead."); setLoading(false); return; }
        users[form.email] = { ...form, pts: 0 };
        localStorage.setItem("ecoverse_users", JSON.stringify(users));
        onAuth({ name:form.name, email:form.email, pts:0 });
      } else {
        const u = users[form.email];
        if (!u) { setError("No account found. Sign up first."); setLoading(false); return; }
        if (u.password !== form.password) { setError("Incorrect password."); setLoading(false); return; }
        onAuth({ name:u.name, email:u.email, pts:u.pts });
      }
      setLoading(false);
    }, 600);
  };

  const inp: React.CSSProperties = { width:"100%",padding:"13px 16px",border:"1.5px solid #d8d3c8",background:"white",fontFamily:"var(--font-jost,sans-serif)",fontSize:"14px",color:"#1a1a1a",outline:"none",boxSizing:"border-box",borderRadius:"6px" };

  return (
    <div style={{ position:"fixed",inset:0,zIndex:9999,background:"rgba(10,10,10,0.65)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#f5f2eb",width:420,maxWidth:"94vw",padding:"48px 44px",position:"relative",boxShadow:"0 40px 100px rgba(0,0,0,0.28)",borderRadius:"16px",animation:"modalIn 0.35s cubic-bezier(0.16,1,0.3,1)" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position:"absolute",top:18,right:18,background:"none",border:"none",fontSize:22,color:"#999",cursor:"pointer" }}>×</button>
        <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:22,fontWeight:700,marginBottom:6 }}>Eco<span style={{ color:"#2d6a4f",fontStyle:"italic" }}>Verse</span></div>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:13,color:"#8a9a8a",marginBottom:28 }}>{mode==="signin"?"Welcome back, conscious shopper.":"Join the green movement."}</p>
        <div style={{ display:"flex",borderBottom:"1.5px solid #e0dbd0",marginBottom:24 }}>
          {(["signin","signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{ flex:1,background:"none",border:"none",padding:"9px 0",fontFamily:"var(--font-jost,sans-serif)",fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:mode===m?"#1a3a2a":"#aaa",borderBottom:mode===m?"2px solid #2d6a4f":"2px solid transparent",marginBottom:"-1.5px",cursor:"pointer",transition:"all 0.2s" }}>
              {m==="signin"?"SIGN IN":"CREATE ACCOUNT"}
            </button>
          ))}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {mode==="signup" && <input placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f,name:e.target.value }))} style={inp} />}
          <input placeholder="Email address" type="email" value={form.email} onChange={e => setForm(f => ({ ...f,email:e.target.value }))} onKeyDown={e => e.key==="Enter"&&submit()} style={inp} />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f,password:e.target.value }))} onKeyDown={e => e.key==="Enter"&&submit()} style={inp} />
        </div>
        {error && <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:12,color:"#c0392b",margin:"10px 0 0" }}>⚠ {error}</p>}
        <button onClick={submit} disabled={loading} style={{ width:"100%",marginTop:20,background:loading?"#5a8a6a":"#1a3a2a",color:"white",border:"none",padding:15,borderRadius:8,fontFamily:"var(--font-jost,sans-serif)",fontSize:12,fontWeight:700,letterSpacing:"0.14em",cursor:loading?"default":"pointer",transition:"background 0.2s" }}>
          {loading ? "..." : mode==="signin"?"SIGN IN →":"CREATE ACCOUNT →"}
        </button>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:12,color:"#8a9a8a",textAlign:"center",marginTop:16 }}>
          {mode==="signin"?"No account? ":"Already have one? "}
          <span onClick={() => { setMode(mode==="signin"?"signup":"signin"); setError(""); }} style={{ color:"#2d6a4f",fontWeight:600,cursor:"pointer",textDecoration:"underline" }}>
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
      <button onClick={() => setOpen(o => !o)} style={{ display:"flex",alignItems:"center",gap:8,background:"#1a3a2a",border:"none",borderRadius:20,padding:"6px 14px 6px 8px",cursor:"pointer" }}>
        <div style={{ width:26,height:26,borderRadius:"50%",background:"#2d6a4f",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--font-jost,sans-serif)",fontSize:11,fontWeight:700,color:"white" }}>{user.name[0].toUpperCase()}</div>
        <span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:11,color:"#a8d5a2",fontWeight:600 }}>{user.pts} pts</span>
      </button>
      {open && (
        <div style={{ position:"absolute",top:"calc(100% + 8px)",right:0,background:"white",border:"1px solid #e0dbd0",borderRadius:10,boxShadow:"0 16px 48px rgba(0,0,0,0.13)",minWidth:200,padding:"8px 0",zIndex:300 }}>
          <div style={{ padding:"12px 20px 10px",borderBottom:"1px solid #f0ece3" }}>
            <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:15,fontWeight:700 }}>{user.name}</div>
            <div style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:12,color:"#8a9a8a",marginTop:2 }}>{user.email}</div>
          </div>
          {[["🌿","Eco Points",`${user.pts}`],["📦","My Orders",""],["⚙️","Settings",""]].map(([icon,label,sub]) => (
            <div key={label} style={{ padding:"10px 20px",display:"flex",alignItems:"center",gap:10,fontFamily:"var(--font-jost,sans-serif)",fontSize:13,color:"#333",cursor:"pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background="#f5f2eb")} onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
              {icon} {label} {sub && <span style={{ marginLeft:"auto",color:"#2d6a4f",fontWeight:600,fontSize:12 }}>{sub}</span>}
            </div>
          ))}
          <div style={{ borderTop:"1px solid #f0ece3",marginTop:4 }}>
            <div onClick={() => { onSignOut(); setOpen(false); }} style={{ padding:"10px 20px",fontFamily:"var(--font-jost,sans-serif)",fontSize:13,color:"#c0392b",cursor:"pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background="#fff5f5")} onMouseLeave={e => (e.currentTarget.style.background="transparent")}>
              ↩ Sign Out
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 3D Mesh Bag Canvas ───────────────────────────────────────────────────────
function MeshBag() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x:0, y:0 });
  const rot   = useRef({ x:0.25, y:0 });
  const raf   = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width = 500; const H = canvas.height = 580;

    const pts: [number,number,number][] = [];
    const faces: number[][] = [];
    const segs=20, rings=16;
    for (let r=0;r<=rings;r++) {
      const t=r/rings, c=t<0.1?0.4+t*5:t>0.88?0.5+(1-t)*3.5:0.9-Math.pow(Math.abs(t-0.45)*1.6,2)*0.25;
      const radius=95*c, y=-130+t*280;
      for (let s=0;s<segs;s++) { const a=(s/segs)*Math.PI*2; pts.push([Math.cos(a)*radius,y,Math.sin(a)*radius]); }
    }
    for (let r=0;r<rings;r++) for (let s=0;s<segs;s++) {
      faces.push([r*segs+s, r*segs+(s+1)%segs, (r+1)*segs+(s+1)%segs, (r+1)*segs+s]);
    }
    const mkH = (ox:number) => Array.from({length:12},(_,i) => {
      const a=Math.PI*(i/11); return [ox+Math.cos(a)*32,-130-Math.sin(a)*85,0] as [number,number,number];
    });
    const handles=[mkH(-32),mkH(32)];

    const proj = (p:[number,number,number],rx:number,ry:number):[number,number,number] => {
      let [x,y,z]=p;
      const cy=Math.cos(ry),sy=Math.sin(ry),x1=x*cy+z*sy,z1=-x*sy+z*cy;
      const cx=Math.cos(rx),sx=Math.sin(rx),y2=y*cx-z1*sx,z2=y*sx+z1*cx;
      return [W/2+x1*(460/(460+z2+180)), H/2+y2*(460/(460+z2+180)), z2];
    };

    let time=0;
    const draw = () => {
      ctx.clearRect(0,0,W,H); time+=0.007;
      rot.current.y+=0.007+mouse.current.x*0.00025;
      rot.current.x+=(mouse.current.y*0.00018-(rot.current.x-0.25)*0.04);
      const {x:rx,y:ry}=rot.current;
      const g=ctx.createRadialGradient(W/2,H/2,40,W/2,H/2,260);
      g.addColorStop(0,"rgba(45,106,79,0.14)"); g.addColorStop(1,"rgba(245,242,235,0)");
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      faces.map(f=>{const pp=f.map(i=>proj(pts[i],rx,ry));return{pp,z:pp.reduce((s,p)=>s+p[2],0)/4};}).sort((a,b)=>b.z-a.z).forEach(({pp,z})=>{
        const d=Math.max(0,Math.min(1,(z+220)/340));
        ctx.beginPath();ctx.moveTo(pp[0][0],pp[0][1]);pp.slice(1).forEach(p=>ctx.lineTo(p[0],p[1]));ctx.closePath();
        ctx.fillStyle=`rgba(45,106,79,${0.06+d*0.16})`;ctx.fill();
        ctx.strokeStyle=`rgba(45,106,79,${0.18+d*0.52})`;ctx.lineWidth=0.7;ctx.stroke();
      });
      handles.forEach(h=>{
        const hp=h.map(p=>proj(p,rx,ry));
        ctx.beginPath();ctx.moveTo(hp[0][0],hp[0][1]);hp.forEach(p=>ctx.lineTo(p[0],p[1]));
        ctx.strokeStyle="rgba(45,106,79,0.78)";ctx.lineWidth=4;ctx.lineCap="round";ctx.stroke();
        hp.forEach(p=>{ctx.beginPath();ctx.arc(p[0],p[1],2.2,0,Math.PI*2);ctx.fillStyle="rgba(45,106,79,0.55)";ctx.fill();});
      });
      for(let i=0;i<8;i++){
        const a=time*0.65+(i/8)*Math.PI*2,r=162+Math.sin(time+i)*20;
        ctx.beginPath();ctx.arc(W/2+Math.cos(a)*r,H/2+Math.sin(a)*r*0.48-15,2+Math.sin(time*1.8+i)*1.2,0,Math.PI*2);
        ctx.fillStyle=`rgba(168,213,162,${0.35+Math.sin(time+i)*0.35})`;ctx.fill();
      }
      const sx=W/2+Math.cos(time*0.45)*70,sy=H/2+Math.sin(time*0.45)*90;
      const sh=ctx.createRadialGradient(sx,sy,0,sx,sy,90);
      sh.addColorStop(0,"rgba(255,255,240,0.14)");sh.addColorStop(1,"rgba(255,255,240,0)");
      ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);
      raf.current=requestAnimationFrame(draw);
    };
    draw();
    const onM=(e:MouseEvent)=>{const r=canvas.getBoundingClientRect();mouse.current={x:e.clientX-r.left-W/2,y:e.clientY-r.top-H/2};};
    canvas.addEventListener("mousemove",onM);
    return ()=>{cancelAnimationFrame(raf.current);canvas.removeEventListener("mousemove",onM);};
  },[]);

  return <canvas ref={canvasRef} style={{ width:500,height:580,cursor:"grab",filter:"drop-shadow(0 28px 56px rgba(45,106,79,0.22))" }}/>;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onShopClick }: { onShopClick:()=>void }) {
  const [vis,setVis]=useState(false);
  useEffect(()=>{setTimeout(()=>setVis(true),80);},[]);
  const fade=(d=0):React.CSSProperties=>({opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(28px)",transition:`all 0.9s ${d}s cubic-bezier(0.16,1,0.3,1)`});

  return (
    <section style={{ background:"#f5f2eb",minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",alignItems:"center",padding:"80px 48px 60px 72px",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",inset:0,opacity:0.04,backgroundImage:"radial-gradient(circle,#2d6a4f 1px,transparent 1px)",backgroundSize:"28px 28px",pointerEvents:"none" }} />
      <div style={{ position:"absolute",right:"-60px",top:"50%",transform:"translateY(-52%)",width:700,height:700,borderRadius:"62% 38% 68% 32%/48% 58% 42% 52%",background:"radial-gradient(ellipse at 38% 38%,rgba(45,106,79,0.09) 0%,rgba(168,213,162,0.04) 55%,transparent 80%)",animation:"morphBlob 14s ease-in-out infinite",pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:0,left:"50%",width:1,height:"100%",background:"linear-gradient(to bottom,transparent,rgba(45,106,79,0.1) 25%,rgba(45,106,79,0.1) 75%,transparent)",pointerEvents:"none" }} />
      {/* LEFT */}
      <div style={{ position:"relative",zIndex:2 }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:28,...fade(0) }}>
          <div style={{ width:28,height:1,background:"#2d6a4f" }} />
          <span style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.25em",color:"#2d6a4f" }}>NEW COLLECTION · SS 2025</span>
        </div>
        <h1 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"clamp(48px,5.2vw,82px)",fontWeight:700,lineHeight:1.03,color:"#1a1a1a",margin:"0 0 24px",letterSpacing:"-0.02em",...fade(0.1) }}>
          Wear the<br/><span style={{ color:"#2d6a4f",fontStyle:"italic",animation:"subtleFloat 4.5s ease-in-out infinite",display:"inline-block" }}>Change.</span>
        </h1>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"17px",color:"#5a6a5a",maxWidth:400,lineHeight:1.75,margin:"0 0 36px",...fade(0.2) }}>
          Every piece tells a story of sustainability. Shop conscious, earn Eco Points, and help the planet — one outfit at a time.
        </p>
        <div style={{ display:"flex",gap:12,marginBottom:56,...fade(0.3) }}>
          <button onClick={onShopClick} style={{ background:"#1a3a2a",color:"white",border:"none",padding:"15px 38px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",fontWeight:700,letterSpacing:"0.14em",cursor:"pointer",borderRadius:6,transition:"all 0.25s",boxShadow:"0 4px 16px rgba(26,58,42,0.3)" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";(e.currentTarget as HTMLElement).style.background="#2d6a4f";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0)";(e.currentTarget as HTMLElement).style.background="#1a3a2a";}}>SHOP NOW</button>
          <button style={{ background:"transparent",color:"#1a3a2a",border:"1.5px solid #1a3a2a",padding:"15px 34px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",fontWeight:600,letterSpacing:"0.14em",cursor:"pointer",borderRadius:6,transition:"all 0.25s" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#1a3a2a";(e.currentTarget as HTMLElement).style.color="white";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="transparent";(e.currentTarget as HTMLElement).style.color="#1a3a2a";}}>OUR IMPACT ↗</button>
        </div>
        <div style={{ display:"flex",gap:40,borderTop:"1px solid rgba(45,106,79,0.15)",paddingTop:32 }}>
          {[["349T","Trees Planted"],["48K","kg CO₂ Saved"],["12K","Happy Shoppers"]].map(([n,l],i)=>(
            <div key={l} style={fade(0.45+i*0.1)}>
              <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"30px",fontWeight:700,color:"#2d6a4f" }}>{n}</div>
              <div style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#8a9a8a",letterSpacing:"0.08em",marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* RIGHT */}
      <div style={{ position:"relative",zIndex:2,display:"flex",alignItems:"center",justifyContent:"center",...fade(0.15) }}>
        <div style={{ position:"absolute",top:55,left:10,zIndex:5,background:"#1a3a2a",color:"white",padding:"11px 18px",borderRadius:40,fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",fontWeight:600,display:"flex",alignItems:"center",gap:7,animation:"floatBadge 3.5s ease-in-out infinite",boxShadow:"0 8px 28px rgba(26,58,42,0.32)" }}>
          <span style={{ fontSize:16 }}>🌿</span>ECO SCORE 95/100
        </div>
        <div style={{ position:"absolute",bottom:110,right:5,zIndex:5,background:"white",color:"#1a3a2a",border:"1.5px solid #d8d3c8",padding:"9px 15px",borderRadius:40,fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:600,display:"flex",alignItems:"center",gap:6,animation:"floatBadge 4.2s ease-in-out infinite 0.9s",boxShadow:"0 6px 20px rgba(0,0,0,0.09)" }}>
          <span style={{ fontSize:14 }}>♻️</span>100% Recycled
        </div>
        <div style={{ position:"absolute",top:165,right:0,zIndex:5,background:"#a8d5a2",color:"#1a3a2a",padding:"7px 13px",borderRadius:20,fontFamily:"var(--font-space-mono,monospace)",fontSize:"11px",fontWeight:700,animation:"floatBadge 3.1s ease-in-out infinite 1.7s",boxShadow:"0 4px 16px rgba(45,106,79,0.28)" }}>+80 pts</div>
        <div style={{ position:"absolute",bottom:200,left:0,zIndex:5,background:"#1a3a2a",color:"#a8d5a2",padding:"8px 14px",borderRadius:20,fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:600,animation:"floatBadge 3.8s ease-in-out infinite 0.4s",boxShadow:"0 4px 16px rgba(26,58,42,0.28)" }}>🌍 Carbon Neutral</div>
        <MeshBag />
        <div style={{ position:"absolute",bottom:30,fontFamily:"var(--font-playfair,serif)",fontSize:"14px",color:"#5a6a5a",fontStyle:"italic" }}>Hemp Tote · ₹1,499</div>
      </div>
      <style>{`
        @keyframes subtleFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes floatBadge{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-9px) rotate(1.5deg)}}
        @keyframes morphBlob{0%,100%{border-radius:62% 38% 68% 32%/48% 58% 42% 52%}33%{border-radius:38% 62% 28% 72%/62% 38% 62% 38%}66%{border-radius:72% 28% 52% 48%/38% 52% 58% 48%}}
      `}</style>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────
function Categories() {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"#f5f2eb",padding:"88px 48px" }}>
      <div style={{ textAlign:"center",marginBottom:52,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:"all 0.8s" }}>
        <p style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.22em",color:"#2d6a4f",marginBottom:12 }}>// BROWSE BY CATEGORY</p>
        <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"44px",fontWeight:700,color:"#1a1a1a",margin:0 }}>What are you <span style={{ color:"#2d6a4f",fontStyle:"italic" }}>looking for?</span></h2>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:0 }}>
        {categories.map((cat,i)=>(
          <div key={cat.name} style={{ background:cat.bg,cursor:"pointer",overflow:"hidden",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(32px)",transition:`all 0.7s ${0.08+i*0.07}s cubic-bezier(0.16,1,0.3,1)`,borderRight:i<categories.length-1?"1px solid rgba(255,255,255,0.35)":"none",position:"relative" }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1.03)";(e.currentTarget.querySelector(".cat-img") as HTMLElement).style.transform="scale(1.09)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="scale(1)";(e.currentTarget.querySelector(".cat-img") as HTMLElement).style.transform="scale(1)";}}>
            <div style={{ height:220,overflow:"hidden" }}>
              <img className="cat-img" src={cat.img} alt={cat.name}
                style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.5s ease" }}
                onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80";}}/>
            </div>
            <div style={{ padding:"18px 14px",textAlign:"center" }}>
              <h3 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"15px",fontWeight:600,color:"#1a1a1a",margin:"0 0 3px" }}>{cat.name}</h3>
              <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",color:"#6a7a6a",margin:0 }}>{cat.count} items</p>
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
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"#1a3a2a",padding:"72px 72px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:40 }}>
      <div style={{ opacity:visible?1:0,transform:visible?"translateX(0)":"translateX(-30px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)" }}>
        <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"50px",fontWeight:700,color:"white",lineHeight:1.08,margin:"0 0 6px" }}>Your purchases,</h2>
        <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"50px",fontWeight:700,color:"#a8d5a2",fontStyle:"italic",lineHeight:1.08,margin:0 }}>planet's gain.</h2>
      </div>
      <div style={{ display:"flex",gap:56,flexWrap:"wrap" }}>
        {[["349T","Trees Planted"],["48K","kg CO₂ Offset"],["100%","Sustainable Pkg"],["12K","Happy Shoppers"]].map(([n,l],i)=>(
          <div key={l} style={{ textAlign:"center",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:`all 0.7s ${0.2+i*0.1}s` }}>
            <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"46px",fontWeight:700,color:"#a8d5a2" }}>{n}</div>
            <div style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#6a9a6a",letterSpacing:"0.08em",marginTop:5 }}>{l}</div>
          </div>
        ))}
      </div>
      <button style={{ background:"#a8d5a2",color:"#1a3a2a",border:"none",borderRadius:6,padding:"14px 28px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",fontWeight:700,letterSpacing:"0.12em",cursor:"pointer",whiteSpace:"nowrap",opacity:visible?1:0,transition:"opacity 0.7s 0.5s" }}>SEE OUR IMPACT →</button>
    </section>
  );
}

// ─── Shop ─────────────────────────────────────────────────────────────────────
function Shop() {
  const { ref, visible } = useScrollReveal();
  const [filter,setFilter]=useState<"ALL"|"ORGANIC"|"RECYCLED"|"VEGAN">("ALL");
  const [hovered,setHovered]=useState<number|null>(null);
  const filtered = filter==="ALL" ? products : products.filter(p=>p.tag===filter);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"#f5f2eb",padding:"88px 48px" }}>
      <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:44,flexWrap:"wrap",gap:20,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:"all 0.8s" }}>
        <div>
          <p style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.22em",color:"#2d6a4f",margin:"0 0 8px" }}>// NEW ARRIVALS</p>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"44px",fontWeight:700,color:"#1a1a1a",margin:0 }}>Shop <span style={{ color:"#2d6a4f",fontStyle:"italic" }}>Consciously</span></h2>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          {(["ALL","ORGANIC","RECYCLED","VEGAN"] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{ padding:"9px 20px",border:"1.5px solid #c8c3b8",background:filter===f?"#1a1a1a":"transparent",color:filter===f?"white":"#444",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:600,letterSpacing:"0.08em",cursor:"pointer",transition:"all 0.2s",borderRadius:4 }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",borderTop:"1px solid #e0dbd0",borderLeft:"1px solid #e0dbd0" }}>
        {filtered.map((p,i)=>(
          <div key={p.id} onMouseEnter={()=>setHovered(p.id)} onMouseLeave={()=>setHovered(null)}
            style={{ cursor:"pointer",overflow:"hidden",borderRight:"1px solid #e0dbd0",borderBottom:"1px solid #e0dbd0",background:hovered===p.id?"#faf8f3":"white",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(32px)",transition:`opacity 0.6s ${0.04+i*0.05}s,transform 0.6s ${0.04+i*0.05}s cubic-bezier(0.16,1,0.3,1),background 0.2s` }}>
            <div style={{ height:300,overflow:"hidden",background:p.bgColor,position:"relative" }}>
              <img src={p.img} alt={p.name}
                style={{ width:"100%",height:"100%",objectFit:"cover",display:"block",transition:"transform 0.6s ease",transform:hovered===p.id?"scale(1.07)":"scale(1)" }}
                onError={e=>{(e.target as HTMLImageElement).src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80";}}/>
              <div style={{ position:"absolute",top:12,left:12,background:p.tag==="ORGANIC"?"#d4e6c3":p.tag==="RECYCLED"?"#c8d8e8":"#d4cce8",color:"#1a3a2a",padding:"4px 10px",borderRadius:20,fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em" }}>{p.tag}</div>
              {hovered===p.id && (
                <div style={{ position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(to top,rgba(26,58,42,0.85),transparent)",padding:"20px 16px 14px",display:"flex",justifyContent:"center",animation:"fadeUp 0.25s ease" }}>
                  <button style={{ background:"white",color:"#1a3a2a",border:"none",borderRadius:20,padding:"8px 20px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",cursor:"pointer" }}>ADD TO CART</button>
                </div>
              )}
            </div>
            <div style={{ padding:"16px 16px 20px" }}>
              <div style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.1em",color:"#2d6a4f",marginBottom:5 }}>ECO {p.ecoScore}/100</div>
              <h3 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"16px",fontWeight:600,color:"#1a1a1a",margin:"0 0 3px" }}>{p.name}</h3>
              <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",color:"#8a9a8a",margin:"0 0 12px" }}>{p.material}</p>
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <span style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"17px",fontWeight:700,color:"#1a1a1a" }}>{p.price}</span>
                <span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#2d6a4f",fontWeight:600 }}>🌿 {p.pts}</span>
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
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"#f0ece3",padding:"88px 72px" }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1.6fr",gap:88,alignItems:"center" }}>
        <div style={{ opacity:visible?1:0,transform:visible?"translateX(0)":"translateX(-28px)",transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)" }}>
          <p style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.22em",color:"#2d6a4f",margin:"0 0 16px" }}>// ECO RANKS</p>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"44px",fontWeight:700,color:"#1a1a1a",lineHeight:1.08,margin:"0 0 18px" }}>Level up your <span style={{ color:"#2d6a4f",fontStyle:"italic" }}>green game</span></h2>
          <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"15px",color:"#5a6a5a",lineHeight:1.75,margin:"0 0 32px" }}>Every sustainable purchase earns Eco Points. Rise from Seed to Forest Guardian and unlock exclusive perks.</p>
          <button style={{ background:"#1a1a1a",color:"white",border:"none",padding:"14px 32px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.14em",cursor:"pointer",borderRadius:6 }}>START EARNING</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {ecoRanks.map((rank,i)=>(
            <div key={rank.name} style={{ background:rank.highlight?"#e4ede0":"white",border:rank.highlight?"2px solid #2d6a4f":"1px solid #e0dbd0",borderRadius:8,padding:28,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:`all 0.7s ${0.2+i*0.1}s cubic-bezier(0.16,1,0.3,1)` }}>
              <div style={{ fontSize:32,marginBottom:12 }}>{rank.icon}</div>
              <h3 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"19px",fontWeight:700,color:"#1a1a1a",margin:"0 0 3px" }}>{rank.name}</h3>
              <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#8a9a8a",margin:"0 0 12px",letterSpacing:"0.04em" }}>{rank.range}</p>
              <div style={{ height:3,background:"#e8e3d8",borderRadius:2,marginBottom:12 }}>
                <div style={{ height:"100%",width:visible?`${rank.progress}%`:"0%",background:"#2d6a4f",borderRadius:2,transition:"width 1.4s 0.5s ease" }} />
              </div>
              <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"13px",color:"#4a6a4a",fontWeight:500,margin:0 }}>{rank.perk}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── REAL SCRATCH CARD — Canvas-based foil scratcher ─────────────────────────
function ScratchCard({ reward, index, visible }: { reward:string; index:number; visible:boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [scratchPct, setScratchPct] = useState(0);
  const isPainting = useRef(false);
  const initialized = useRef(false);
  const lastPos = useRef<{x:number,y:number}|null>(null);

  // Build the dark-green foil layer on canvas
  const buildFoil = useCallback(() => {
    const canvas = canvasRef.current; if (!canvas || initialized.current) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = 280; canvas.height = 340;
    initialized.current = true;

    // Base dark green gradient
    const bg = ctx.createLinearGradient(0, 0, 280, 340);
    bg.addColorStop(0,   "#091a10");
    bg.addColorStop(0.3, "#0d2b1a");
    bg.addColorStop(0.6, "#142e1c");
    bg.addColorStop(1,   "#081508");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 280, 340);

    // Noise grain — thousands of tiny dots for texture
    for (let i = 0; i < 5500; i++) {
      const x = Math.random()*280, y = Math.random()*340;
      const bright = Math.random() > 0.6;
      ctx.beginPath(); ctx.arc(x, y, Math.random()*1.4, 0, Math.PI*2);
      ctx.fillStyle = bright
        ? `rgba(${60+Math.random()*80},${100+Math.random()*80},${50+Math.random()*60},${Math.random()*0.55+0.1})`
        : `rgba(5,15,8,${Math.random()*0.5})`;
      ctx.fill();
    }

    // Diagonal foil scratch lines (metallic sheen)
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 80; i++) {
      const x1 = Math.random()*300-10, y1 = Math.random()*360-10;
      const len = 15 + Math.random()*70;
      const angle = -0.4 + Math.random()*0.8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + Math.cos(angle)*len, y1 + Math.sin(angle)*len);
      ctx.strokeStyle = `rgba(${120+Math.random()*80},${180+Math.random()*75},${100+Math.random()*70},${0.3+Math.random()*0.7})`;
      ctx.lineWidth = Math.random()*2; ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Highlight shimmer band
    const shimmer = ctx.createLinearGradient(0, 60, 280, 160);
    shimmer.addColorStop(0, "rgba(168,213,162,0)");
    shimmer.addColorStop(0.4,"rgba(168,213,162,0.22)");
    shimmer.addColorStop(0.6,"rgba(200,240,190,0.28)");
    shimmer.addColorStop(1, "rgba(168,213,162,0)");
    ctx.fillStyle = shimmer; ctx.fillRect(0, 0, 280, 340);

    // Subtle corner gradients for depth
    [[0,0],[280,0],[0,340],[280,340]].forEach(([cx,cy])=>{
      const cg = ctx.createRadialGradient(cx,cy,0,cx,cy,120);
      cg.addColorStop(0,"rgba(0,0,0,0.35)");cg.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=cg;ctx.fillRect(0,0,280,340);
    });

    // EcoVerse branding text
    ctx.font = "bold 18px Georgia, serif";
    ctx.fillStyle = "rgba(168,213,162,0.85)";
    ctx.textAlign = "center";
    ctx.fillText("EcoVerse", 140, 148);

    ctx.font = "600 9px monospace";
    ctx.fillStyle = "rgba(168,213,162,0.5)";
    ctx.letterSpacing = "4px";
    ctx.fillText("SCRATCH TO REVEAL", 140, 175);

    // Animated scratch icon
    ctx.font = "28px sans-serif";
    ctx.fillText("✦", 140, 218);

    // Border glow
    ctx.strokeStyle = "rgba(45,106,79,0.5)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(1, 1, 278, 338);
  }, []);

  useEffect(() => {
    if (visible && !revealed) {
      const t = setTimeout(buildFoil, 60 + index * 80);
      return () => clearTimeout(t);
    }
  }, [visible, revealed, buildFoil, index]);

  const getCoords = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scX = canvas.width / rect.width;
    const scY = canvas.height / rect.height;
    if ("touches" in e) {
      return { x:(e.touches[0].clientX-rect.left)*scX, y:(e.touches[0].clientY-rect.top)*scY };
    }
    return { x:((e as React.MouseEvent).clientX-rect.left)*scX, y:((e as React.MouseEvent).clientY-rect.top)*scY };
  };

  const scratchAt = (x:number, y:number) => {
    if (revealed) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";

    if (lastPos.current) {
      // Draw smooth path between last and current
      const dx = x - lastPos.current.x, dy = y - lastPos.current.y;
      const dist = Math.sqrt(dx*dx+dy*dy);
      const steps = Math.max(1, Math.floor(dist/4));
      for (let i=0;i<=steps;i++) {
        const px = lastPos.current.x + (dx*i/steps);
        const py = lastPos.current.y + (dy*i/steps);
        ctx.beginPath();
        // Irregular brush — multiple circles per stroke for scratchy feel
        for (let j=0;j<4;j++) {
          ctx.arc(px+Math.random()*12-6, py+Math.random()*12-6, 20+Math.random()*12, 0, Math.PI*2);
        }
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      for (let j=0;j<4;j++) ctx.arc(x+Math.random()*10-5,y+Math.random()*10-5,22,0,Math.PI*2);
      ctx.fill();
    }
    lastPos.current = {x,y};

    // Measure how much is revealed
    const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let transparent=0;
    for (let i=3;i<data.length;i+=4) if (data[i]<100) transparent++;
    const pct = Math.round(transparent/(canvas.width*canvas.height)*100);
    setScratchPct(pct);
    if (pct > 52) setRevealed(true);
  };

  const REWARD_META: Record<string,{emoji:string;color:string}> = {
    "🎉 10% OFF":      {emoji:"🎉",color:"#d4e6c3"},
    "🚚 Free Shipping":{emoji:"🚚",color:"#c8dce8"},
    "🌿 2x Points":    {emoji:"🌿",color:"#d4e6c3"},
    "🎁 Mystery Gift": {emoji:"🎁",color:"#e4d4e8"},
    "⭐ 100 Bonus Pts":{emoji:"⭐",color:"#f0e8c8"},
    "💚 5% Cashback":  {emoji:"💚",color:"#d4e6c3"},
    "🌱 Plant a Tree": {emoji:"🌱",color:"#c8e0c8"},
    "✨ VIP Access":   {emoji:"✨",color:"#e8dcc8"},
  };
  const meta = REWARD_META[reward] || {emoji:"🎁",color:"#d4e6c3"};

  return (
    <div style={{ position:"relative",width:280,height:340,borderRadius:16,overflow:"hidden",
      boxShadow: revealed ? "0 20px 60px rgba(26,58,42,0.35),0 0 0 2px rgba(45,106,79,0.4)" : "0 14px 48px rgba(0,0,0,0.22),0 0 0 1px rgba(45,106,79,0.2)",
      opacity:visible?1:0,
      transform:visible?(revealed?"scale(1.05) translateY(-4px)":"scale(1)"):"translateY(48px)",
      transition:`opacity 0.6s ${0.08+index*0.14}s ease,transform 0.6s ${0.08+index*0.14}s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s`,
    }}>
      {/* Reward layer — beneath foil */}
      <div style={{ position:"absolute",inset:0,background:`linear-gradient(145deg,${meta.color},white)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10 }}>
        <div style={{ fontSize:60,animation:revealed?"revealPop 0.55s cubic-bezier(0.34,1.56,0.64,1)":"none",display:"inline-block" }}>{meta.emoji}</div>
        <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"24px",fontWeight:700,color:"#1a3a2a",textAlign:"center",padding:"0 20px",lineHeight:1.2 }}>{reward}</div>
        <div style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",color:"#2d6a4f",fontWeight:600,letterSpacing:"0.05em" }}>Congratulations! 🎊</div>
        {revealed && (
          <button style={{ marginTop:8,background:"#1a3a2a",color:"#a8d5a2",padding:"8px 22px",borderRadius:20,border:"none",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",fontWeight:700,letterSpacing:"0.1em",cursor:"pointer",animation:"revealPop 0.4s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            CLAIM →
          </button>
        )}
      </div>

      {/* Scratchable foil canvas */}
      {!revealed && (
        <canvas
          ref={canvasRef}
          style={{ position:"absolute",inset:0,width:"100%",height:"100%",touchAction:"none",cursor:"crosshair" }}
          onMouseDown={e=>{isPainting.current=true;lastPos.current=null;scratchAt(...Object.values(getCoords(e,canvasRef.current!)) as [number,number]);}}
          onMouseUp={()=>{isPainting.current=false;lastPos.current=null;}}
          onMouseLeave={()=>{isPainting.current=false;lastPos.current=null;}}
          onMouseMove={e=>{if(isPainting.current)scratchAt(...Object.values(getCoords(e,canvasRef.current!)) as [number,number]);}}
          onTouchStart={e=>{e.preventDefault();lastPos.current=null;scratchAt(...Object.values(getCoords(e,canvasRef.current!)) as [number,number]);}}
          onTouchMove={e=>{e.preventDefault();scratchAt(...Object.values(getCoords(e,canvasRef.current!)) as [number,number]);}}
          onTouchEnd={()=>{lastPos.current=null;}}
        />
      )}

      {/* Progress indicator */}
      {!revealed && scratchPct > 5 && scratchPct < 52 && (
        <div style={{ position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.55)",backdropFilter:"blur(8px)",color:"white",padding:"4px 14px",borderRadius:20,fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",fontWeight:600,whiteSpace:"nowrap",letterSpacing:"0.04em" }}>
          {scratchPct}% — keep scratching!
        </div>
      )}

      <style>{`@keyframes revealPop{0%{transform:scale(0) rotate(-15deg)}75%{transform:scale(1.15) rotate(4deg)}100%{transform:scale(1) rotate(0)}}`}</style>
    </div>
  );
}

// ─── Eco Rewards Section ──────────────────────────────────────────────────────
function EcoRewards() {
  const { ref, visible } = useScrollReveal(0.08);
  // Stable reward assignments per card slot
  const cardRewards = useRef(
    [0,1,2].map(i => SCRATCH_REWARDS[i % SCRATCH_REWARDS.length])
  );

  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"linear-gradient(165deg,#091a10 0%,#0d2b1a 35%,#142e1c 65%,#091810 100%)",padding:"100px 48px",textAlign:"center",position:"relative",overflow:"hidden" }}>
      {/* Atmospheric orbs */}
      <div style={{ position:"absolute",top:"8%",left:"4%",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(45,106,79,0.18) 0%,transparent 68%)",animation:"orbFloat 9s ease-in-out infinite",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:"8%",right:"6%",width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(168,213,162,0.1) 0%,transparent 68%)",animation:"orbFloat 11s ease-in-out infinite 3s",pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:"40%",right:"2%",width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(240,208,128,0.07) 0%,transparent 68%)",animation:"orbFloat 7s ease-in-out infinite 1.5s",pointerEvents:"none" }} />

      {/* Header */}
      <div style={{ position:"relative",zIndex:1,opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(24px)",transition:"all 0.8s cubic-bezier(0.16,1,0.3,1)" }}>
        <p style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.24em",color:"#a8d5a2",margin:"0 0 16px",opacity:0.8 }}>// SCRATCH & WIN</p>
        <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"54px",fontWeight:700,color:"white",margin:"0 0 16px",lineHeight:1.05 }}>
          Your <span style={{ color:"#a8d5a2",fontStyle:"italic" }}>Eco Rewards</span>
        </h2>
        <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"16px",color:"rgba(168,213,162,0.7)",maxWidth:500,margin:"0 auto 20px",lineHeight:1.75 }}>
          Every purchase unlocks a real scratch card. Hold & drag to scratch the dark foil — reveal your hidden reward.
        </p>
        {/* Instruction pill */}
        <div style={{ display:"inline-flex",alignItems:"center",gap:10,background:"rgba(45,106,79,0.18)",border:"1px solid rgba(168,213,162,0.22)",borderRadius:24,padding:"9px 22px",marginBottom:64,backdropFilter:"blur(8px)" }}>
          <span style={{ fontSize:15,animation:"subtleFloat 2s ease-in-out infinite" }}>✦</span>
          <span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#a8d5a2",fontWeight:700,letterSpacing:"0.1em" }}>HOLD + DRAG ACROSS CARD TO SCRATCH</span>
          <span style={{ fontSize:15,animation:"subtleFloat 2s ease-in-out infinite 0.5s" }}>✦</span>
        </div>
      </div>

      {/* Cards */}
      <div style={{ display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap",position:"relative",zIndex:1 }}>
        {[0,1,2].map(i => (
          <ScratchCard key={i} reward={cardRewards.current[i]} index={i} visible={visible} />
        ))}
      </div>

      {/* Footer note */}
      <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",color:"rgba(168,213,162,0.38)",marginTop:52,letterSpacing:"0.04em",position:"relative",zIndex:1,opacity:visible?1:0,transition:"opacity 0.8s 0.7s" }}>
        New cards unlock with every purchase · Level up your Eco Rank for bonus cards
      </p>

      <style>{`@keyframes orbFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-28px) scale(1.07)}}`}</style>
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

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const text = input.trim(); setInput(""); setLoading(true);
    setMessages(m => [...m, {from:"user",text}]);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:"You are EcoBot, an AI guide for EcoVerse — sustainable fashion in India. Help with eco scores, outfit ideas, carbon savings, Eco Points. Be warm, brief (2-4 sentences), use emojis. Use ₹ for prices.",messages:[{role:"user",content:text}]})});
      const d = await res.json();
      setMessages(m => [...m, {from:"bot",text:d.content?.map((c:{type:string;text?:string})=>c.text||"").join("")||"Sorry, try again! 🌿"}]);
    } catch { setMessages(m => [...m, {from:"bot",text:"Connection issue. Please try again! 🌿"}]); }
    finally { setLoading(false); }
  },[input,loading]);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background:"#f0ece3",padding:"88px 72px" }}>
      <div style={{ maxWidth:1100,margin:"0 auto" }}>
        <div style={{ opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(20px)",transition:"all 0.8s",marginBottom:40 }}>
          <p style={{ fontFamily:"var(--font-space-mono,monospace)",fontSize:"10px",letterSpacing:"0.22em",color:"#2d6a4f",margin:"0 0 12px" }}>// AI STYLIST</p>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"52px",fontWeight:700,color:"#1a1a1a",margin:"0 0 12px" }}>Meet <span style={{ color:"#2d6a4f",fontStyle:"italic" }}>EcoBot</span></h2>
          <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"16px",color:"#5a6a5a",maxWidth:480,lineHeight:1.75,margin:0 }}>Your personal AI sustainability guide — eco scores, outfit ideas, carbon savings, and style tips.</p>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 0.56fr",gap:28,alignItems:"start" }}>
          <div style={{ borderRadius:12,overflow:"hidden",border:"1px solid #d8d3c8",boxShadow:"0 8px 32px rgba(0,0,0,0.07)",opacity:visible?1:0,transform:visible?"translateY(0)":"translateY(28px)",transition:"all 0.9s 0.2s" }}>
            <div style={{ background:"#1a3a2a",padding:"18px 24px",display:"flex",alignItems:"center",gap:14 }}>
              <div style={{ width:44,height:44,borderRadius:"50%",background:"#2d6a4f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🤖</div>
              <div>
                <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"18px",fontWeight:700,color:"white" }}>EcoBot</div>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginTop:2 }}>
                  <span style={{ width:6,height:6,borderRadius:"50%",background:"#a8d5a2",display:"inline-block",animation:"pulse 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#a8d5a2" }}>Claude AI · Active</span>
                </div>
              </div>
            </div>
            <div style={{ background:"white",padding:24,minHeight:300,maxHeight:360,overflowY:"auto" }}>
              {messages.map((msg,i)=>(
                <div key={i} style={{ display:"flex",justifyContent:msg.from==="user"?"flex-end":"flex-start",marginBottom:14 }}>
                  <div style={{ maxWidth:"80%",padding:"13px 17px",background:msg.from==="user"?"#1a3a2a":"#f5f2eb",color:msg.from==="user"?"white":"#1a1a1a",borderRadius:msg.from==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"14px",lineHeight:1.6 }}>{msg.text}</div>
                </div>
              ))}
              {loading && <div style={{ display:"flex",gap:5,padding:"13px 17px",background:"#f5f2eb",borderRadius:"18px 18px 18px 4px",width:"fit-content" }}>{[0,1,2].map(i=><div key={i} style={{ width:8,height:8,borderRadius:"50%",background:"#2d6a4f",animation:"bounce 1s infinite",animationDelay:`${i*0.2}s` }}/>)}</div>}
              <div ref={bottomRef}/>
            </div>
            <div style={{ background:"white",padding:"0 24px 14px",display:"flex",gap:8,flexWrap:"wrap" }}>
              {["🎓 College look","🌿 Eco points","💧 Water saving","🌱 Vegan picks"].map(s=>(
                <button key={s} onClick={()=>setInput(s.split(" ").slice(1).join(" "))} style={{ padding:"5px 13px",border:"1.5px solid #d0cdc5",borderRadius:20,background:"transparent",fontFamily:"var(--font-jost,sans-serif)",fontSize:"11px",color:"#4a5a4a",cursor:"pointer" }}>{s}</button>
              ))}
            </div>
            <div style={{ background:"white",padding:"0 24px 24px",display:"flex",gap:10 }}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask EcoBot anything..." style={{ flex:1,padding:"13px 16px",border:"1.5px solid #d8d3c8",borderRadius:6,fontFamily:"var(--font-jost,sans-serif)",fontSize:"14px",background:"#faf9f5",outline:"none",color:"#1a1a1a" }}/>
              <button onClick={send} disabled={loading} style={{ background:"#1a3a2a",color:"white",border:"none",borderRadius:6,padding:"13px 22px",fontFamily:"var(--font-jost,sans-serif)",fontSize:"12px",fontWeight:700,letterSpacing:"0.08em",cursor:"pointer",opacity:loading?0.7:1 }}>ASK →</button>
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
            {[{icon:"🌍",title:"Eco Impact Explainer",desc:"Break down carbon savings, water usage, and material traceability for any product."},{icon:"✨",title:"AI Styling Assistant",desc:"Get personalised eco outfit combinations for any occasion — all sustainability-certified."},{icon:"🏷️",title:"Smart Product Tagging",desc:"Auto-labels every item: organic, vegan leather, recycled, biodegradable, zero-waste."}].map((card,i)=>(
              <div key={card.title} style={{ background:"white",border:"1px solid #e0dbd0",borderRadius:8,padding:22,display:"flex",gap:16,alignItems:"flex-start",opacity:visible?1:0,transform:visible?"translateX(0)":"translateX(28px)",transition:`all 0.7s ${0.35+i*0.1}s cubic-bezier(0.16,1,0.3,1)` }}>
                <span style={{ fontSize:26,flexShrink:0 }}>{card.icon}</span>
                <div><h4 style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"16px",fontWeight:700,color:"#1a1a1a",margin:"0 0 5px" }}>{card.title}</h4><p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"13px",color:"#6a7a6a",lineHeight:1.6,margin:0 }}>{card.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)}}
      `}</style>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background:"#0f2218",padding:"60px 72px 32px" }}>
      <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:48,marginBottom:48 }}>
        <div>
          <div style={{ fontFamily:"var(--font-playfair,serif)",fontSize:"24px",fontWeight:700,color:"white",marginBottom:14 }}>Eco<span style={{ color:"#a8d5a2",fontStyle:"italic" }}>Verse</span></div>
          <p style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"14px",lineHeight:1.75,color:"#6a9a6a",maxWidth:260 }}>Sustainable fashion for a conscious generation. Every purchase makes a real impact.</p>
        </div>
        {[["Shop",["New Arrivals","Tops & Tees","Bottoms","Outerwear","Footwear","Accessories"]],["Company",["About Us","Our Mission","Impact Report","Careers","Press"]],["Support",["FAQ","Shipping","Returns","Contact","Sustainability"]]].map(([title,links])=>(
          <div key={title as string}>
            <h4 style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"10px",letterSpacing:"0.18em",color:"white",margin:"0 0 18px",fontWeight:700 }}>{(title as string).toUpperCase()}</h4>
            {(links as string[]).map(l=>(
              <div key={l} style={{ fontFamily:"var(--font-jost,sans-serif)",fontSize:"13px",color:"#6a9a6a",marginBottom:9,cursor:"pointer",transition:"color 0.2s" }}
                onMouseEnter={e=>(e.currentTarget.style.color="#a8d5a2")} onMouseLeave={e=>(e.currentTarget.style.color="#6a9a6a")}>{l}</div>
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState("SHOP");
  const [showAuth,  setShowAuth]  = useState(false);
  const [user,      setUser]      = useState<AuthUser|null>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { const s = localStorage.getItem("ecoverse_session"); if (s) setUser(JSON.parse(s)); } catch {}
  }, []);

  const handleAuth    = (u:AuthUser) => { setUser(u); localStorage.setItem("ecoverse_session",JSON.stringify(u)); setShowAuth(false); };
  const handleSignOut = ()           => { setUser(null); localStorage.removeItem("ecoverse_session"); };
  const scrollToShop  = ()           => { setActiveTab("SHOP"); setTimeout(()=>shopRef.current?.scrollIntoView({behavior:"smooth"}),50); };

  const renderSection = () => {
    switch (activeTab) {
      case "ECO RANKS":  return <EcoRanks/>;
      case "REWARDS":    return <EcoRewards/>;
      case "AI STYLIST": return <EcoBot/>;
      default: return (
        <><Hero onShopClick={scrollToShop}/><Categories/><ImpactStrip/><div ref={shopRef}><Shop/></div><EcoRanks/><EcoRewards/><EcoBot/></>
      );
    }
  };

  return (
    <div style={{ minHeight:"100vh",background:"#f5f2eb" }}>
      <CustomCursor/>
      {showAuth && <AuthModal onClose={()=>setShowAuth(false)} onAuth={handleAuth}/>}
      <AnnouncementBar/>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} onSignInClick={()=>setShowAuth(true)} user={user} onSignOut={handleSignOut}/>
      <div style={{ paddingTop: activeTab==="SHOP" ? 0 : 70 }}>{renderSection()}</div>
      <Footer/>
    </div>
  );
}
