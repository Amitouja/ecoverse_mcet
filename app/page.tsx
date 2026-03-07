"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  material: string;
  price: string;
  pts: string;
  tag: "ORGANIC" | "RECYCLED" | "VEGAN";
  ecoScore: number;
  img: string;
  bgColor: string;
}

interface Category {
  name: string;
  count: number;
  img: string;
  bg: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const categories: Category[] = [
  { name: "Tops & Tees", count: 24, img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80", bg: "#d4e6c3" },
  { name: "Bottoms", count: 18, img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4a4c?w=400&q=80", bg: "#e8d9c0" },
  { name: "Outerwear", count: 12, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", bg: "#c8d8e8" },
  { name: "Footwear", count: 9, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", bg: "#d8cce8" },
];

const products: Product[] = [
  { id: 1, name: "Organic Linen Tee", material: "100% Organic Cotton", price: "₹1,299", pts: "+50 pts", tag: "ORGANIC", ecoScore: 95, img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80", bgColor: "#f0ebe3" },
  { id: 2, name: "Recycled Bomber Jacket", material: "Post-Consumer Polyester", price: "₹3,499", pts: "+70 pts", tag: "RECYCLED", ecoScore: 88, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", bgColor: "#e8ede3" },
  { id: 3, name: "Hemp Canvas Kicks", material: "Natural Hemp Fibre", price: "₹2,799", pts: "+60 pts", tag: "VEGAN", ecoScore: 91, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", bgColor: "#e3eaf0" },
  { id: 4, name: "Bamboo Blend Joggers", material: "Organic Bamboo Blend", price: "₹1,899", pts: "+45 pts", tag: "ORGANIC", ecoScore: 86, img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4a4c?w=600&q=80", bgColor: "#f0ebe3" },
  { id: 5, name: "Cactus Leather Jacket", material: "Nopal Cactus Leather", price: "₹5,999", pts: "+80 pts", tag: "VEGAN", ecoScore: 82, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80", bgColor: "#e8ede3" },
];

const ecoChatMessages = [
  { from: "bot", text: "Hello! 🌿 I'm EcoBot, powered by Gemini AI. Ask me about eco scores, sustainable outfits, or how to earn more Eco Points!" },
  { from: "user", text: "How eco-friendly is the Recycled Bomber?" },
  { from: "bot", text: "Great pick! 🧥 The Recycled Bomber uses 100% post-consumer polyester — that's 12 plastic bottles given new life. ECO Score: 88/100. Saves 40% water vs traditional fabric!" },
];

const ecoRanks = [
  { icon: "🌱", name: "Seed", range: "0 – 499 pts", perk: "+5% bonus points", progress: 100 },
  { icon: "🌿", name: "Sapling", range: "500 – 1,499 pts", perk: "Free eco-packaging", progress: 65 },
  { icon: "🌳", name: "Tree", range: "1,500 – 4,999 pts", perk: "Priority scratch cards", progress: 30 },
  { icon: "🌍", name: "Forest Guardian", range: "5,000+ pts", perk: "20% off + exclusive drops", progress: 10, highlight: true },
];

// ─── Sub-Components ───────────────────────────────────────────────────────────

function AnnouncementBar() {
  const items = [
    "🌿 FREE SHIPPING ON ORDERS ABOVE ₹999",
    "✦ EARN 2X ECO POINTS THIS WEEK",
    "🌱 PLANTED 48K TREES SO FAR",
    "♻️ 100% SUSTAINABLE PACKAGING",
    "🌍 CARBON-NEUTRAL DELIVERIES",
    "✦ NEW ARRIVALS EVERY FRIDAY",
    "🌿 FREE SHIPPING ON ORDERS ABOVE ₹999",
    "✦ EARN 2X ECO POINTS THIS WEEK",
    "🌱 PLANTED 48K TREES SO FAR",
    "♻️ 100% SUSTAINABLE PACKAGING",
    "🌍 CARBON-NEUTRAL DELIVERIES",
    "✦ NEW ARRIVALS EVERY FRIDAY",
  ];
  return (
    <div style={{ background: "#1a3a2a", overflow: "hidden", padding: "10px 0", position: "relative" }}>
      <div style={{
        display: "flex", gap: "0",
        animation: "marquee 28s linear infinite",
        width: "max-content",
      }}>
        {items.map((item, i) => (
          <span key={i} style={{
            fontFamily: "var(--font-space-mono, monospace)",
            fontSize: "11px", letterSpacing: "0.15em",
            color: i % 3 === 1 ? "#f0d080" : "#a8d5a2",
            padding: "0 32px", whiteSpace: "nowrap",
          }}>{item}</span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// ─── Custom Cursor ────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const hoveredRef = useRef(false);
  const frameRef = useRef(0);

  useEffect(() => {
    // Hide native cursor globally
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      const el = e.target as HTMLElement;
      hoveredRef.current = !!(el.closest("button") || el.closest("a") || el.closest("[data-hover]"));
    };

    const animate = () => {
      const { x, y } = posRef.current;
      // Dot snaps instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      }
      // Ring lags behind with lerp
      ringPosRef.current.x += (x - ringPosRef.current.x) * 0.12;
      ringPosRef.current.y += (y - ringPosRef.current.y) * 0.12;
      if (ringRef.current) {
        const rx = ringPosRef.current.x;
        const ry = ringPosRef.current.y;
        const scale = hoveredRef.current ? 1.9 : 1;
        ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px) scale(${scale})`;
        ringRef.current.style.opacity = hoveredRef.current ? "0.5" : "1";
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <>
      {/* Inner dot — sharp black */}
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99999,
        width: "8px", height: "8px", borderRadius: "50%",
        background: "#0a0a0a",
        boxShadow: "0 0 8px 2px rgba(0,0,0,0.6), 0 0 20px 4px rgba(0,0,0,0.2)",
        pointerEvents: "none",
        willChange: "transform",
        transition: "width 0.15s, height 0.15s",
      }} />
      {/* Outer ring — lagging glow halo */}
      <div ref={ringRef} style={{
        position: "fixed", top: 0, left: 0, zIndex: 99998,
        width: "40px", height: "40px", borderRadius: "50%",
        border: "1.5px solid rgba(0,0,0,0.55)",
        boxShadow: "0 0 12px 3px rgba(0,0,0,0.18), inset 0 0 8px rgba(0,0,0,0.06)",
        background: "rgba(0,0,0,0.04)",
        pointerEvents: "none",
        willChange: "transform",
        transition: "opacity 0.2s, transform 0.08s linear",
      }} />
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
interface AuthUser { name: string; email: string; pts: number; }

function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (u: AuthUser) => void }) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const STORAGE_KEY = "ecoverse_users";

  const getUsers = (): Record<string, AuthUser & { password: string }> => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch { return {}; }
  };

  const submit = () => {
    setError("");
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    if (mode === "signup" && !form.name) { setError("Name is required."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setTimeout(() => {
      const users = getUsers();
      if (mode === "signup") {
        if (users[form.email]) { setError("Account already exists. Sign in instead."); setLoading(false); return; }
        const user = { name: form.name, email: form.email, password: form.password, pts: 0 };
        users[form.email] = user;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        onAuth({ name: user.name, email: user.email, pts: user.pts });
      } else {
        const user = users[form.email];
        if (!user) { setError("No account found. Sign up first."); setLoading(false); return; }
        if (user.password !== form.password) { setError("Incorrect password."); setLoading(false); return; }
        onAuth({ name: user.name, email: user.email, pts: user.pts });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(10,10,10,0.55)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "#f5f2eb", width: "420px", maxWidth: "94vw",
        padding: "48px 44px", position: "relative",
        boxShadow: "0 32px 80px rgba(0,0,0,0.22)",
        animation: "modalIn 0.35s cubic-bezier(0.16,1,0.3,1)",
      }} onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{
          position: "absolute", top: "20px", right: "20px",
          background: "none", border: "none", fontSize: "20px",
          color: "#999", cursor: "pointer", lineHeight: 1,
        }}>×</button>

        {/* Logo */}
        <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>
          Eco<span style={{ color: "#2d6a4f", fontStyle: "italic" }}>Verse</span>
        </div>
        <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "13px", color: "#8a9a8a", marginBottom: "32px" }}>
          {mode === "signin" ? "Welcome back, conscious shopper." : "Join the green movement."}
        </p>

        {/* Tab toggle */}
        <div style={{ display: "flex", borderBottom: "1.5px solid #e0dbd0", marginBottom: "28px" }}>
          {(["signin", "signup"] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
              flex: 1, background: "none", border: "none", padding: "10px 0",
              fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px",
              fontWeight: 600, letterSpacing: "0.1em",
              color: mode === m ? "#1a3a2a" : "#aaa",
              borderBottom: mode === m ? "2px solid #2d6a4f" : "2px solid transparent",
              marginBottom: "-1.5px", cursor: "pointer", transition: "all 0.2s",
            }}>{m === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}</button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "signup" && (
            <input placeholder="Full name" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inputStyle} />
          )}
          <input placeholder="Email address" type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={inputStyle} />
          <input placeholder="Password" type="password" value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && submit()}
            style={inputStyle} />
        </div>

        {error && (
          <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#c0392b", margin: "12px 0 0" }}>⚠ {error}</p>
        )}

        <button onClick={submit} disabled={loading} style={{
          width: "100%", marginTop: "24px",
          background: loading ? "#5a8a6a" : "#1a3a2a", color: "white",
          border: "none", padding: "15px",
          fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px",
          fontWeight: 700, letterSpacing: "0.14em", cursor: loading ? "default" : "pointer",
          transition: "background 0.2s",
        }}>
          {loading ? "..." : mode === "signin" ? "SIGN IN →" : "CREATE ACCOUNT →"}
        </button>

        <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#8a9a8a", textAlign: "center", marginTop: "20px" }}>
          {mode === "signin" ? "No account? " : "Already have one? "}
          <span onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            style={{ color: "#2d6a4f", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>
            {mode === "signin" ? "Sign up free" : "Sign in"}
          </span>
        </p>

        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(24px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "13px 16px",
  border: "1.5px solid #d8d3c8", background: "white",
  fontFamily: "var(--font-jost, sans-serif)", fontSize: "14px", color: "#1a1a1a",
  outline: "none", boxSizing: "border-box",
  transition: "border-color 0.2s",
};

// ─── User Menu Dropdown ───────────────────────────────────────────────────────
function UserMenu({ user, onSignOut }: { user: AuthUser; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: "8px",
        background: "#1a3a2a", border: "none", borderRadius: "20px",
        padding: "7px 14px 7px 8px", cursor: "pointer",
      }}>
        <div style={{
          width: "26px", height: "26px", borderRadius: "50%",
          background: "#2d6a4f", display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-jost, sans-serif)", fontSize: "11px", fontWeight: 700, color: "white",
        }}>{user.name[0].toUpperCase()}</div>
        <span style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#a8d5a2", fontWeight: 600 }}>
          {user.pts} pts
        </span>
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "white", border: "1px solid #e0dbd0",
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)", minWidth: "200px",
          padding: "8px 0", zIndex: 200,
          animation: "modalIn 0.2s ease",
        }}>
          <div style={{ padding: "12px 20px 8px", borderBottom: "1px solid #f0ece3" }}>
            <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "15px", fontWeight: 700, color: "#1a1a1a" }}>{user.name}</div>
            <div style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#8a9a8a", marginTop: "2px" }}>{user.email}</div>
          </div>
          {[["🌿", "My Eco Points", `${user.pts} pts`], ["📦", "My Orders", ""], ["⚙️", "Settings", ""]].map(([icon, label, sub]) => (
            <div key={label} style={{
              padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px",
              fontFamily: "var(--font-jost, sans-serif)", fontSize: "13px", color: "#333",
              cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#f5f2eb")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span>{icon}</span><span>{label}</span>
              {sub && <span style={{ marginLeft: "auto", color: "#2d6a4f", fontWeight: 600, fontSize: "12px" }}>{sub}</span>}
            </div>
          ))}
          <div style={{ borderTop: "1px solid #f0ece3", marginTop: "4px" }}>
            <div onClick={() => { onSignOut(); setOpen(false); }} style={{
              padding: "10px 20px", fontFamily: "var(--font-jost, sans-serif)",
              fontSize: "13px", color: "#c0392b", cursor: "pointer", transition: "background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#fff5f5")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >↩ Sign Out</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Navigation({ activeTab, setActiveTab, onSignInClick, user, onSignOut }:
  { activeTab: string; setActiveTab: (t: string) => void; onSignInClick: () => void; user: AuthUser | null; onSignOut: () => void }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(245, 242, 235, 0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #e0dbd0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: "64px",
    }}>
      <div style={{ display: "flex", gap: "32px" }}>
        {["SHOP", "ECO RANKS", "REWARDS", "AI STYLIST"].map(item => (
          <button key={item} onClick={() => setActiveTab(item)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px",
              fontWeight: 500, letterSpacing: "0.1em",
              color: activeTab === item ? "#1a3a2a" : "#5a6a5a",
              borderBottom: activeTab === item ? "2px solid #2d6a4f" : "2px solid transparent",
              paddingBottom: "2px", transition: "all 0.2s",
            }}>
            {item}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", color: "#1a1a1a" }}>
        Eco<span style={{ color: "#2d6a4f", fontStyle: "italic" }}>Verse</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {!user && (
          <button style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "white", border: "1.5px solid #d0cdc5", borderRadius: "20px",
            padding: "6px 14px", fontFamily: "var(--font-jost, sans-serif)",
            fontSize: "12px", fontWeight: 500, color: "#333", cursor: "pointer",
          }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2d6a4f", display: "inline-block" }} />
            0 pts
          </button>
        )}
        {user ? (
          <UserMenu user={user} onSignOut={onSignOut} />
        ) : (
          <button onClick={onSignInClick} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px",
            fontWeight: 600, letterSpacing: "0.08em", color: "#1a3a2a",
            textDecoration: "underline", textUnderlineOffset: "3px",
          }}>SIGN IN</button>
        )}
        <button style={{
          background: "#1a3a2a", color: "white", border: "none",
          padding: "10px 20px", fontFamily: "var(--font-jost, sans-serif)",
          fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", cursor: "pointer",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => (e.currentTarget.style.background = "#2d6a4f")}
          onMouseLeave={e => (e.currentTarget.style.background = "#1a3a2a")}
        >SHOP NOW</button>
      </div>
    </nav>
  );
}

function MeshBag() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rotRef = useRef({ x: 0.3, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width = 480;
    const H = canvas.height = 560;

    // Generate mesh bag geometry
    const bagPoints: [number, number, number][] = [];
    const bagFaces: number[][] = [];

    // Body: tapered cylinder (bag shape)
    const segs = 18, rings = 14;
    for (let r = 0; r <= rings; r++) {
      const t = r / rings;
      // Shape: wider in middle, narrower at top and bottom
      const radiusCurve = t < 0.15
        ? 0.55 + t * 2  // bottom taper
        : t > 0.85
          ? 0.55 + (1 - t) * 2.5 // top taper (becomes handles)
          : 0.85 - Math.abs(t - 0.5) * 0.3; // body
      const radius = 90 * radiusCurve;
      const y = -120 + t * 260;
      for (let s = 0; s < segs; s++) {
        const angle = (s / segs) * Math.PI * 2;
        bagPoints.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius]);
      }
    }

    for (let r = 0; r < rings; r++) {
      for (let s = 0; s < segs; s++) {
        const a = r * segs + s;
        const b = r * segs + (s + 1) % segs;
        const c = (r + 1) * segs + (s + 1) % segs;
        const d = (r + 1) * segs + s;
        bagFaces.push([a, b, c, d]);
      }
    }

    // Handle points (arc above bag)
    const handleL: [number, number, number][] = [];
    const handleR: [number, number, number][] = [];
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const angle = Math.PI * t;
      handleL.push([-28 + Math.cos(angle) * 28, -120 - Math.sin(angle) * 70, 0]);
      handleR.push([28 - Math.cos(angle) * 28, -120 - Math.sin(angle) * 70, 0]);
    }

    function project(p: [number, number, number], rx: number, ry: number): [number, number, number] {
      let [x, y, z] = p;
      // Rotate Y
      const cosY = Math.cos(ry), sinY = Math.sin(ry);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      // Rotate X
      const cosX = Math.cos(rx), sinX = Math.sin(rx);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const fov = 420 / (420 + z2 + 160);
      return [W / 2 + x1 * fov, H / 2 + y2 * fov, z2];
    }

    let time = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      time += 0.008;

      // Gentle auto-rotation + mouse influence
      rotRef.current.y += 0.006 + mouseRef.current.x * 0.0003;
      rotRef.current.x += (mouseRef.current.y * 0.0002 - rotRef.current.x * 0.05);

      const rx = rotRef.current.x;
      const ry = rotRef.current.y;

      // Ambient glow background
      const grad = ctx.createRadialGradient(W / 2, H / 2, 60, W / 2, H / 2, 280);
      grad.addColorStop(0, "rgba(45, 106, 79, 0.12)");
      grad.addColorStop(1, "rgba(245, 242, 235, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Draw mesh faces
      const projFaces = bagFaces.map(face => {
        const pts = face.map(i => project(bagPoints[i], rx, ry));
        const avgZ = pts.reduce((s, p) => s + p[2], 0) / pts.length;
        return { pts, avgZ, face };
      }).sort((a, b) => b.avgZ - a.avgZ);

      projFaces.forEach(({ pts, avgZ }) => {
        const depth = Math.max(0, Math.min(1, (avgZ + 200) / 320));
        const alpha = 0.08 + depth * 0.18;
        const lineAlpha = 0.15 + depth * 0.45;

        // Face fill
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.slice(1).forEach(p => ctx.lineTo(p[0], p[1]));
        ctx.closePath();
        ctx.fillStyle = `rgba(45, 106, 79, ${alpha})`;
        ctx.fill();

        // Mesh lines
        ctx.strokeStyle = `rgba(45, 106, 79, ${lineAlpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw handles
      [handleL, handleR].forEach(handle => {
        const pts = handle.map(p => project(p, rx, ry));
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.strokeStyle = "rgba(45, 106, 79, 0.7)";
        ctx.lineWidth = 3.5;
        ctx.lineCap = "round";
        ctx.stroke();

        // Handle mesh texture
        for (let i = 0; i < pts.length - 1; i++) {
          ctx.beginPath();
          ctx.arc(pts[i][0], pts[i][1], 2, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(45, 106, 79, 0.6)";
          ctx.fill();
        }
      });

      // Floating eco particles
      for (let i = 0; i < 6; i++) {
        const angle = time * 0.7 + (i / 6) * Math.PI * 2;
        const r = 155 + Math.sin(time + i) * 18;
        const px = W / 2 + Math.cos(angle) * r;
        const py = H / 2 + Math.sin(angle) * r * 0.5 - 10;
        const size = 2.5 + Math.sin(time * 1.5 + i) * 1;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 213, 162, ${0.4 + Math.sin(time + i) * 0.3})`;
        ctx.fill();
      }

      // Shimmer highlight sweep
      const shimmerX = W / 2 + Math.cos(time * 0.5) * 60;
      const shimmerY = H / 2 + Math.sin(time * 0.5) * 80;
      const shimmer = ctx.createRadialGradient(shimmerX, shimmerY, 0, shimmerX, shimmerY, 80);
      shimmer.addColorStop(0, "rgba(255,255,240, 0.12)");
      shimmer.addColorStop(1, "rgba(255,255,240, 0)");
      ctx.fillStyle = shimmer;
      ctx.fillRect(0, 0, W, H);

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left - W / 2,
        y: e.clientY - rect.top - H / 2,
      };
    };
    canvas.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(frameRef.current);
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return (
    <canvas ref={canvasRef}
      style={{ width: "480px", height: "560px", cursor: "grab", filter: "drop-shadow(0 24px 48px rgba(45,106,79,0.2))" }}
    />
  );
}

function Hero({ onShopClick }: { onShopClick: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      background: "#f5f2eb",
      minHeight: "92vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      alignItems: "center",
      padding: "0 48px 0 72px",
      position: "relative", overflow: "hidden",
      gap: "0",
    }}>
      {/* Organic blob background */}
      <div style={{
        position: "absolute", right: "-80px", top: "50%", transform: "translateY(-50%)",
        width: "680px", height: "680px", borderRadius: "60% 40% 70% 30% / 50% 60% 40% 50%",
        background: "radial-gradient(ellipse at 40% 40%, rgba(45,106,79,0.08) 0%, rgba(168,213,162,0.04) 60%, transparent 80%)",
        animation: "morphBlob 12s ease-in-out infinite",
        pointerEvents: "none",
      }} />

      {/* Fine dot grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.035,
        backgroundImage: "radial-gradient(circle, #2d6a4f 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Diagonal accent line */}
      <div style={{
        position: "absolute", top: 0, right: "44%", width: "1px", height: "100%",
        background: "linear-gradient(to bottom, transparent, rgba(45,106,79,0.12) 30%, rgba(45,106,79,0.12) 70%, transparent)",
      }} />

      {/* LEFT: Text content */}
      <div style={{
        position: "relative", zIndex: 2,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          <div style={{ width: "32px", height: "1px", background: "#2d6a4f" }} />
          <span style={{
            fontFamily: "var(--font-space-mono, monospace)", fontSize: "10px",
            letterSpacing: "0.25em", color: "#2d6a4f", textTransform: "uppercase",
          }}>New Collection 2025</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-playfair, serif)",
          fontSize: "clamp(52px, 5.5vw, 86px)",
          fontWeight: 700, lineHeight: 1.02,
          color: "#1a1a1a", margin: "0 0 24px",
          letterSpacing: "-0.02em",
        }}>
          Wear the<br />
          <span style={{
            color: "#2d6a4f", fontStyle: "italic",
            display: "inline-block",
            animation: "subtleFloat 4s ease-in-out infinite",
          }}>Change.</span>
        </h1>

        <p style={{
          fontFamily: "var(--font-jost, sans-serif)", fontSize: "17px", color: "#5a6a5a",
          maxWidth: "420px", lineHeight: 1.75, margin: "0 0 40px",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.9s 0.3s",
        }}>
          Every piece tells a story of sustainability. Shop conscious, earn Eco Points, and help the planet — one outfit at a time.
        </p>

        <div style={{ display: "flex", gap: "14px", marginBottom: "56px", flexWrap: "wrap" }}>
          <button onClick={onShopClick} style={{
            background: "#1a3a2a", color: "white", border: "none",
            padding: "16px 40px", fontFamily: "var(--font-jost, sans-serif)",
            fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", cursor: "pointer",
            transition: "all 0.25s",
            position: "relative", overflow: "hidden",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#2d6a4f"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1a3a2a"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
          >SHOP NOW</button>
          <button style={{
            background: "transparent", color: "#1a3a2a", border: "1.5px solid #1a3a2a",
            padding: "16px 36px", fontFamily: "var(--font-jost, sans-serif)",
            fontSize: "12px", fontWeight: 600, letterSpacing: "0.14em", cursor: "pointer",
            transition: "all 0.25s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#1a3a2a"; (e.currentTarget as HTMLElement).style.color = "white"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#1a3a2a"; }}
          >OUR IMPACT ↗</button>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: "40px",
          borderTop: "1px solid rgba(45,106,79,0.15)", paddingTop: "36px",
        }}>
          {[["349T", "Trees Planted"], ["48K", "kg CO₂ Saved"], ["12K", "Happy Shoppers"]].map(([num, label], i) => (
            <div key={label} style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `all 0.7s ${0.5 + i * 0.12}s`,
            }}>
              <div style={{
                fontFamily: "var(--font-playfair, serif)", fontSize: "32px",
                fontWeight: 700, color: "#2d6a4f", lineHeight: 1,
              }}>{num}</div>
              <div style={{
                fontFamily: "var(--font-jost, sans-serif)", fontSize: "11px",
                color: "#8a9a8a", letterSpacing: "0.08em", marginTop: "4px",
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: 3D Mesh Bag */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex", alignItems: "center", justifyContent: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0) scale(1)" : "translateX(40px) scale(0.95)",
        transition: "all 1.1s 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Floating badge: ECO SCORE */}
        <div style={{
          position: "absolute", top: "60px", left: "20px", zIndex: 5,
          background: "#1a3a2a", color: "white",
          padding: "12px 18px", borderRadius: "40px",
          fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", fontWeight: 600,
          letterSpacing: "0.06em",
          animation: "floatBadge 3.5s ease-in-out infinite",
          boxShadow: "0 8px 24px rgba(26,58,42,0.3)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          <span style={{ fontSize: "16px" }}>🌿</span>
          ECO SCORE 95/100
        </div>

        {/* Floating badge: Recycled */}
        <div style={{
          position: "absolute", bottom: "100px", right: "10px", zIndex: 5,
          background: "white", color: "#1a3a2a",
          border: "1.5px solid #d8d3c8",
          padding: "10px 16px", borderRadius: "40px",
          fontFamily: "var(--font-jost, sans-serif)", fontSize: "11px", fontWeight: 600,
          letterSpacing: "0.06em",
          animation: "floatBadge 4s ease-in-out infinite 0.8s",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <span style={{ fontSize: "14px" }}>♻️</span>
          100% Recycled
        </div>

        {/* Floating badge: +80 pts */}
        <div style={{
          position: "absolute", top: "160px", right: "0px", zIndex: 5,
          background: "#a8d5a2", color: "#1a3a2a",
          padding: "8px 14px", borderRadius: "20px",
          fontFamily: "var(--font-space-mono, monospace)", fontSize: "11px", fontWeight: 700,
          animation: "floatBadge 3s ease-in-out infinite 1.6s",
          boxShadow: "0 4px 16px rgba(45,106,79,0.25)",
        }}>+80 pts</div>

        <MeshBag />

        {/* Label below bag */}
        <div style={{
          position: "absolute", bottom: "40px",
          fontFamily: "var(--font-playfair, serif)", fontSize: "15px",
          color: "#5a6a5a", fontStyle: "italic", letterSpacing: "0.04em",
        }}>Hemp Tote · ₹1,499</div>
      </div>

      <style>{`
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes floatBadge {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes morphBlob {
          0%, 100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
          33% { border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%; }
          66% { border-radius: 70% 30% 50% 50% / 40% 50% 60% 50%; }
        }
      `}</style>
    </section>
  );
}

function Categories() {
  return (
    <section style={{ background: "#f5f2eb", padding: "80px 48px" }}>
      <h2 style={{
        fontFamily: "var(--font-playfair, serif)", fontSize: "42px",
        fontWeight: 700, textAlign: "center", marginBottom: "48px",
        color: "#1a1a1a",
      }}>
        What are you <span style={{ color: "#2d6a4f", fontStyle: "italic" }}>looking for?</span>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0" }}>
        {categories.map((cat) => (
          <div key={cat.name} style={{
            background: cat.bg, cursor: "pointer", overflow: "hidden",
            transition: "transform 0.3s",
          }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div style={{ height: "260px", overflow: "hidden" }}>
              <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ padding: "24px", textAlign: "center" }}>
              <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "18px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 6px" }}>{cat.name}</h3>
              <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "13px", color: "#6a7a6a", margin: 0 }}>{cat.count} items</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ImpactStrip() {
  return (
    <section style={{ background: "#1a3a2a", padding: "72px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "40px" }}>
      <div style={{ maxWidth: "480px" }}>
        <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "48px", fontWeight: 700, color: "white", lineHeight: 1.1, margin: "0 0 8px" }}>
          Your purchases,
        </h2>
        <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "48px", fontWeight: 700, color: "#a8d5a2", fontStyle: "italic", lineHeight: 1.1, margin: 0 }}>
          planet's gain.
        </h2>
      </div>
      <div style={{ display: "flex", gap: "64px", flexWrap: "wrap" }}>
        {[["349T", "Trees Planted"], ["48K", "kg CO₂ Offset"], ["100%", "Sustainable Packaging"]].map(([num, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "48px", fontWeight: 700, color: "#a8d5a2" }}>{num}</div>
            <div style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#6a9a6a", letterSpacing: "0.08em", marginTop: "6px" }}>{label}</div>
          </div>
        ))}
      </div>
      <button style={{
        background: "#a8d5a2", color: "#1a3a2a", border: "none", borderRadius: "4px",
        padding: "14px 28px", fontFamily: "var(--font-jost, sans-serif)",
        fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer",
        whiteSpace: "nowrap",
      }}>SEE OUR IMPACT →</button>
    </section>
  );
}

function Shop() {
  const [filter, setFilter] = useState<"ALL" | "ORGANIC" | "RECYCLED" | "VEGAN">("ALL");
  const filters = ["ALL", "ORGANIC", "RECYCLED", "VEGAN"] as const;
  const filtered = filter === "ALL" ? products : products.filter(p => p.tag === filter);

  return (
    <section style={{ background: "#f5f2eb", padding: "80px 48px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "11px", letterSpacing: "0.2em", color: "#2d6a4f", margin: "0 0 8px" }}>// NEW ARRIVALS</p>
          <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "42px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
            Shop <span style={{ color: "#2d6a4f", fontStyle: "italic" }}>Consciously</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "10px 20px", border: "1.5px solid #c8c3b8",
              background: filter === f ? "#1a1a1a" : "transparent",
              color: filter === f ? "white" : "#333",
              fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px",
              fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer", transition: "all 0.2s",
            }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0" }}>
        {filtered.map(p => (
          <div key={p.id} style={{ cursor: "pointer", overflow: "hidden", borderRight: "1px solid #e0dbd0" }}
            onMouseEnter={e => { (e.currentTarget.querySelector(".prod-img") as HTMLElement).style.transform = "scale(1.05)"; }}
            onMouseLeave={e => { (e.currentTarget.querySelector(".prod-img") as HTMLElement).style.transform = "scale(1)"; }}
          >
            <div style={{ height: "340px", overflow: "hidden", background: p.bgColor }}>
              <img className="prod-img" src={p.img} alt={p.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }} />
            </div>
            <div style={{ padding: "20px 16px", borderTop: "1px solid #e0dbd0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "10px", letterSpacing: "0.1em", color: "#2d6a4f" }}>{p.tag} · ECO {p.ecoScore}</span>
              </div>
              <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "17px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 4px" }}>{p.name}</h3>
              <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "13px", color: "#8a9a8a", margin: "0 0 12px" }}>{p.material}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "18px", fontWeight: 700, color: "#1a1a1a" }}>{p.price}</span>
                <span style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#2d6a4f", fontWeight: 600 }}>🌿 {p.pts}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EcoRanks() {
  return (
    <section style={{ background: "#f0ece3", padding: "80px 48px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "80px", alignItems: "center" }}>
        <div>
          <p style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "11px", letterSpacing: "0.2em", color: "#2d6a4f", margin: "0 0 16px" }}>// ECO RANKS</p>
          <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "42px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.1, margin: "0 0 20px" }}>
            Level up your <span style={{ color: "#2d6a4f", fontStyle: "italic" }}>green game</span>
          </h2>
          <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "15px", color: "#5a6a5a", lineHeight: 1.7, margin: "0 0 32px" }}>
            Every sustainable purchase earns Eco Points. Rise through the ranks from Seed to Forest Guardian and unlock exclusive perks.
          </p>
          <button style={{
            background: "#1a1a1a", color: "white", border: "none",
            padding: "14px 32px", fontFamily: "var(--font-jost, sans-serif)",
            fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer",
          }}>START EARNING</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {ecoRanks.map(rank => (
            <div key={rank.name} style={{
              background: rank.highlight ? "#e8ede3" : "white",
              border: rank.highlight ? "2px solid #2d6a4f" : "1px solid #e0dbd0",
              borderRadius: "4px", padding: "28px",
            }}>
              <div style={{ fontSize: "32px", marginBottom: "12px" }}>{rank.icon}</div>
              <h3 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "20px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px" }}>{rank.name}</h3>
              <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#8a9a8a", margin: "0 0 12px", letterSpacing: "0.04em" }}>{rank.range}</p>
              <div style={{ height: "3px", background: "#e8e3d8", borderRadius: "2px", marginBottom: "12px" }}>
                <div style={{ height: "100%", width: `${rank.progress}%`, background: "#2d6a4f", borderRadius: "2px" }} />
              </div>
              <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "13px", color: "#4a6a4a", fontWeight: 500, margin: 0 }}>{rank.perk}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcoRewards() {
  const [scratched, setScratched] = useState<{ [k: number]: string | null }>({});
  const rewards = ["🎉 10% OFF", "🚚 Free Shipping", "🌿 2x Points", "🎁 Mystery Gift", "⭐ 100 Bonus Pts"];

  const scratch = (i: number) => {
    if (scratched[i]) return;
    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    setScratched(s => ({ ...s, [i]: reward }));
  };

  return (
    <section style={{ background: "#f5f2eb", padding: "80px 48px", textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "11px", letterSpacing: "0.2em", color: "#2d6a4f", margin: "0 0 16px" }}>// SCRATCH & WIN</p>
      <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "48px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px" }}>
        Your <span style={{ color: "#2d6a4f", fontStyle: "italic" }}>Eco Rewards</span>
      </h2>
      <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "16px", color: "#6a7a6a", maxWidth: "480px", margin: "0 auto 56px", lineHeight: 1.7 }}>
        Every purchase unlocks a mystery scratch card. Tap to reveal your reward — discounts, free shipping, double points and more.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "32px", flexWrap: "wrap" }}>
        {[0, 1, 2].map(i => (
          <div key={i} onClick={() => scratch(i)} style={{
            width: "220px", height: "300px",
            background: scratched[i] ? "linear-gradient(135deg, #e8ede3, #d4e6c3)" : "white",
            border: "1px solid #e0dbd0",
            borderRadius: "8px", cursor: scratched[i] ? "default" : "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
            transition: "transform 0.3s, box-shadow 0.3s",
            transform: scratched[i] ? "scale(1.04)" : "scale(1)",
          }}
            onMouseEnter={e => { if (!scratched[i]) (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; }}
            onMouseLeave={e => { if (!scratched[i]) (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            {scratched[i] ? (
              <>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
                <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "22px", fontWeight: 700, color: "#1a3a2a" }}>{scratched[i]}</div>
                <div style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#2d6a4f", marginTop: "8px" }}>Congratulations!</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "18px", fontWeight: 700, color: "#2d6a4f", marginBottom: "8px" }}>EcoVerse</div>
                <div style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "11px", letterSpacing: "0.12em", color: "#8a9a8a", marginBottom: "16px" }}>TAP TO SCRATCH</div>
                <div style={{ fontSize: "28px" }}>👆</div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function EcoBot() {
  const [messages, setMessages] = useState(ecoChatMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(m => [...m, { from: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are EcoBot, an AI sustainability guide for EcoVerse — a sustainable fashion brand. You help users understand eco scores, sustainability of clothing materials, outfit ideas, carbon savings, water usage, and how to earn Eco Points. Be friendly, informative, and use relevant emojis. Keep responses concise (2-4 sentences). Use Indian Rupee (₹) for prices.",
          messages: [{ role: "user", content: userMsg }],
        }),
      });
      const data = await response.json();
      const reply = data.content?.map((c: { type: string; text?: string }) => c.text || "").join("") || "Sorry, I couldn't process that. Please try again!";
      setMessages(m => [...m, { from: "bot", text: reply }]);
    } catch {
      setMessages(m => [...m, { from: "bot", text: "Sorry, I'm having trouble connecting. Please try again! 🌿" }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["College look", "Eco points", "Water saving", "Vegan picks"];

  return (
    <section style={{ background: "#f0ece3", padding: "80px 48px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "11px", letterSpacing: "0.2em", color: "#2d6a4f", margin: "0 0 12px" }}>// AI STYLIST</p>
        <h2 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "52px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 12px" }}>
          Meet <span style={{ color: "#2d6a4f", fontStyle: "italic" }}>EcoBot</span>
        </h2>
        <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "16px", color: "#5a6a5a", margin: "0 0 40px", maxWidth: "500px", lineHeight: 1.7 }}>
          Your personal AI sustainability guide — eco scores, outfit ideas, carbon savings, and sustainable style tips.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 0.6fr", gap: "32px", alignItems: "start" }}>
          {/* Chat */}
          <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #d8d3c8" }}>
            {/* Header */}
            <div style={{ background: "#1a3a2a", padding: "20px 24px", display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "50%",
                background: "#2d6a4f", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "20px",
              }}>🤖</div>
              <div>
                <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "18px", fontWeight: 700, color: "white" }}>EcoBot</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a8d5a2", display: "inline-block" }} />
                  <span style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#a8d5a2" }}>Claude AI · Active</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div style={{ background: "white", padding: "24px", minHeight: "320px", maxHeight: "380px", overflowY: "auto" }}>
              {messages.map((msg, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start",
                  marginBottom: "16px",
                }}>
                  <div style={{
                    maxWidth: "80%", padding: "14px 18px",
                    background: msg.from === "user" ? "#1a3a2a" : "#f5f2eb",
                    color: msg.from === "user" ? "white" : "#1a1a1a",
                    borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    fontFamily: "var(--font-jost, sans-serif)", fontSize: "14px", lineHeight: 1.6,
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", gap: "6px", padding: "14px 18px", background: "#f5f2eb", borderRadius: "18px 18px 18px 4px", width: "fit-content" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: "8px", height: "8px", borderRadius: "50%", background: "#2d6a4f",
                      animation: "bounce 1s infinite", animationDelay: `${i * 0.2}s`,
                    }} />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestion chips */}
            <div style={{ background: "white", padding: "0 24px 16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => setInput(s)} style={{
                  padding: "6px 14px", border: "1.5px solid #d0cdc5", borderRadius: "20px",
                  background: "transparent", fontFamily: "var(--font-jost, sans-serif)",
                  fontSize: "12px", color: "#4a5a4a", cursor: "pointer", transition: "all 0.2s",
                }}>
                  {s === "College look" ? "🎓" : s === "Eco points" ? "🌿" : s === "Water saving" ? "💧" : "🌱"} {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ background: "white", padding: "0 24px 24px", display: "flex", gap: "12px" }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                placeholder="Ask EcoBot anything..."
                style={{
                  flex: 1, padding: "14px 18px", border: "1.5px solid #d8d3c8", borderRadius: "4px",
                  fontFamily: "var(--font-jost, sans-serif)", fontSize: "14px", background: "#faf9f5",
                  outline: "none", color: "#1a1a1a",
                }}
              />
              <button onClick={sendMessage} disabled={loading} style={{
                background: "#1a3a2a", color: "white", border: "none", borderRadius: "4px",
                padding: "14px 24px", fontFamily: "var(--font-jost, sans-serif)",
                fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}>ASK →</button>
            </div>
          </div>

          {/* Feature cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { icon: "🌍", title: "Eco Impact Explainer", desc: "Ask Claude to break down carbon savings, water usage, and material traceability for any product." },
              { icon: "✨", title: "AI Styling Assistant", desc: "Get personalised eco outfit combinations for any occasion — all sustainability-certified." },
              { icon: "🏷️", title: "Smart Product Tagging", desc: "Claude auto-labels every item: organic, vegan leather, recycled, biodegradable, Zero-waste." },
            ].map(card => (
              <div key={card.title} style={{
                background: "white", border: "1px solid #e0dbd0", borderRadius: "4px",
                padding: "24px", display: "flex", gap: "16px", alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "28px", flexShrink: 0 }}>{card.icon}</span>
                <div>
                  <h4 style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "17px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>{card.title}</h4>
                  <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "13px", color: "#6a7a6a", lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0f2218", padding: "60px 48px 32px", color: "#a8d5a2" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
        <div>
          <div style={{ fontFamily: "var(--font-playfair, serif)", fontSize: "24px", fontWeight: 700, color: "white", marginBottom: "16px" }}>
            Eco<span style={{ color: "#a8d5a2", fontStyle: "italic" }}>Verse</span>
          </div>
          <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "14px", lineHeight: 1.7, color: "#6a9a6a", maxWidth: "280px" }}>
            Sustainable fashion for a conscious generation. Every purchase makes an impact.
          </p>
        </div>
        {[
          { title: "Shop", links: ["New Arrivals", "Tops & Tees", "Bottoms", "Outerwear", "Footwear"] },
          { title: "Company", links: ["About Us", "Our Mission", "Impact Report", "Careers"] },
          { title: "Support", links: ["FAQ", "Shipping", "Returns", "Contact"] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "11px", letterSpacing: "0.15em", color: "white", margin: "0 0 20px", fontWeight: 600 }}>{col.title.toUpperCase()}</h4>
            {col.links.map(l => (
              <div key={l} style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "14px", color: "#6a9a6a", marginBottom: "10px", cursor: "pointer" }}>{l}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #1a3a2a", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-jost, sans-serif)", fontSize: "12px", color: "#3a6a4a", margin: 0 }}>© 2025 EcoVerse. All rights reserved.</p>
        <p style={{ fontFamily: "var(--font-space-mono, monospace)", fontSize: "11px", color: "#3a6a4a", margin: 0 }}>Made with 🌿 for the planet</p>
      </div>
    </footer>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState("SHOP");
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  // Restore session on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ecoverse_session");
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  const handleAuth = (u: AuthUser) => {
    setUser(u);
    localStorage.setItem("ecoverse_session", JSON.stringify(u));
    setShowAuth(false);
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem("ecoverse_session");
  };

  const scrollToShop = () => {
    setActiveTab("SHOP");
    shopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderSection = () => {
    switch (activeTab) {
      case "ECO RANKS":  return <EcoRanks />;
      case "REWARDS":    return <EcoRewards />;
      case "AI STYLIST": return <EcoBot />;
      default:
        return (
          <>
            <Hero onShopClick={scrollToShop} />
            <Categories />
            <ImpactStrip />
            <div ref={shopRef}><Shop /></div>
            <EcoRanks />
            <EcoRewards />
            <EcoBot />
          </>
        );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f2eb" }}>
      <CustomCursor />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
      <AnnouncementBar />
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSignInClick={() => setShowAuth(true)}
        user={user}
        onSignOut={handleSignOut}
      />
      {renderSection()}
      <Footer />
    </div>
  );
}
