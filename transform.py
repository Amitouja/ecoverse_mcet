import sys
import re

with open(r'f:\app\app\page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Replace ToteBag component with AnimatedAd
animated_ad_code = '''// ─── Animated Marquee Ad ──────────────────────────────────────────────────────
function AnimatedAd({ darkMode }: { darkMode: boolean }) {
  const messages = [
    "Sustainable is the new luxury",
    "Earn while saving the planet",
    "Carbon-neutral fashion",
    "Every purchase makes an impact",
    "Zero-waste packaging"
  ];
  return (
    <div style={{ position:"relative", width:480, height:520, borderRadius:"24px", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", background: darkMode ? "rgba(45,106,79,0.15)" : "rgba(168,213,162,0.2)", border: darkMode ? "1px solid rgba(74,124,89,0.3)" : "1px solid rgba(220,215,200,0.8)", boxShadow:"0 24px 48px rgba(80,55,20,0.1)" }}>
      {/* Decorative bg shapes */}
      <div style={{ position:"absolute", top:"-20%", left:"-20%", width:"70%", height:"70%", background:"radial-gradient(circle, rgba(168,213,162,0.4) 0%, transparent 70%)", borderRadius:"50%", animation:"pulse 6s infinite alternate" }} />
      <div style={{ position:"absolute", bottom:"-20%", right:"-20%", width:"70%", height:"70%", background:"radial-gradient(circle, rgba(45,106,79,0.3) 0%, transparent 70%)", borderRadius:"50%", animation:"pulse 8s infinite alternate-reverse" }} />
      
      {/* Marquee Container */}
      <div style={{ padding: "0 40px", textAlign: "center", zIndex: 10 }}>
        <div style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"32px", fontWeight:700, color: darkMode ? "#c8e6c8" : "#1a3a2a", lineHeight:1.4, fontStyle: "italic", marginBottom: 20 }}>
          <span style={{ fontSize:"64px", display:"block", marginBottom:10 }}>🌍</span>
          Join the Movement
        </div>
        <div style={{ height: "40px", overflow: "hidden", position: "relative" }}>
          <div style={{ animation: "verticalMarquee 15s linear infinite", display: "flex", flexDirection: "column", gap: "40px" }}>
            {[...messages, messages[0]].map((msg, i) => (
              <div key={i} style={{ height: "40px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily:"var(--font-jost,sans-serif)", fontSize:"16px", fontWeight:600, color: darkMode ? "#a8d5a2" : "#2d6a4f", letterSpacing:"0.05em", whiteSpace: "nowrap" }}>
                ✨ {msg} ✨
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes verticalMarquee {
          0% { transform: translateY(0); }
          100% { transform: translateY(-400px); }
        }
      `}</style>
    </div>
  );
}'''

text = re.sub(r'// ─── CLEAN 3D TOTE BAG.*?function ToteBag\(\) \{.*?return \(\n\s*<canvas ref=\{canvasRef\}.*?\/>\n\s*\);\n\}', animated_ad_code, text, flags=re.DOTALL)

# 2. Add CarbonAwareness section
carbon_awareness_code = '''
// ─── Carbon Awareness ────────────────────────────────────────────────────────
function CarbonAwareness({ darkMode }: { darkMode: boolean }) {
  const { ref, visible } = useScrollReveal();
  return (
    <section ref={ref as React.RefObject<HTMLElement>} style={{ background: darkMode ? "#0f2218" : "#1a3a2a", padding:"80px 72px", position:"relative", zIndex:2, overflow:"hidden", color: "white" }}>
      <div style={{ position:"absolute", top:0, left:0, bottom:0, width:"40%", background:"linear-gradient(90deg, rgba(45,106,79,0.4) 0%, transparent 100%)", pointerEvents:"none" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div style={{ opacity:visible?1:0, transform:visible?"translateX(0)":"translateX(-28px)", transition:"all 0.9s cubic-bezier(0.16,1,0.3,1)" }}>
          <span style={{ fontFamily:"var(--font-space-mono,monospace)", fontSize:"11px", letterSpacing:"0.22em", color:"#a8d5a2", display:"block", marginBottom:16 }}>// THE GLOBAL IMPACT</span>
          <h2 style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"42px", fontWeight:700, lineHeight:1.1, marginBottom:24 }}>
            Why <span style={{ color:"#a8d5a2", fontStyle:"italic" }}>Carbon Limits</span> Matter.
          </h2>
          <p style={{ fontFamily:"var(--font-jost,sans-serif)", fontSize:"16px", color:"#c8e6c8", lineHeight:1.8, marginBottom:32 }}>
            Did you know? Under systems like the <strong>Emission Trading Scheme (ETS)</strong>, large corporations have strict carbon emission caps. Exceeding these limits results in heavy fines or the need to purchase <strong>Carbon Credits</strong>.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { icon: "🏛️", title: "Government Caps", desc: "Industries are given a fixed carbon allowance." },
              { icon: "📉", title: "Trade & Offset", desc: "Companies under the limit can sell credits." },
              { icon: "🌱", title: "Your Role", desc: "By choosing eco-friendly, you reduce the global footprint directly." }
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:16, background: "rgba(255,255,255,0.05)", padding: 20, borderRadius: 12, border: "1px solid rgba(168,213,162,0.1)" }}>
                <span style={{ fontSize:28 }}>{item.icon}</span>
                <div>
                  <h4 style={{ fontFamily:"var(--font-jost,sans-serif)", fontSize:"16px", fontWeight:600, color:"white", margin:"0 0 4px" }}>{item.title}</h4>
                  <p style={{ fontFamily:"var(--font-jost,sans-serif)", fontSize:"13px", color:"rgba(255,255,255,0.7)", margin:0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position:"relative", opacity:visible?1:0, transform:visible?"scale(1)":"scale(0.95)", transition:"all 0.9s 0.2s cubic-bezier(0.16,1,0.3,1)" }}>
          <div style={{ width: "100%", height: 500, borderRadius: 24, background: "url('https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&q=80') center/cover", boxShadow: "0 24px 48px rgba(0,0,0,0.4)" }} />
          <div style={{ position:"absolute", bottom: -24, left: -24, background: "white", padding: 24, borderRadius: 16, boxShadow: "0 12px 32px rgba(0,0,0,0.2)" }}>
            <div style={{ fontFamily:"var(--font-playfair,serif)", fontSize:"24px", fontWeight:700, color:"#1a3a2a" }}>48,000+</div>
            <div style={{ fontFamily:"var(--font-jost,sans-serif)", fontSize:"12px", color:"#4a7c59", fontWeight:600 }}>Tons of CO₂ offset globally</div>
          </div>
        </div>
      </div>
    </section>
  );
}
'''

text = text.replace('// ─── Impact Strip', carbon_awareness_code + '\n// ─── Impact Strip')

# 3. Replace ToteBag with AnimatedAd inside Hero component
text = text.replace('<ToteBag/>', '<AnimatedAd darkMode={darkMode} />')

# 4. Modify HomePage state initialization and component usage
# Find: const [darkMode, setDarkMode] = useState(false);
text = text.replace('const [darkMode, setDarkMode] = useState(false);', 'const [darkMode, setDarkMode] = useState(false);\\n  const [activeTab, setActiveTab] = useState("HOME");')

# Replace Navigation call
old_nav = '<Navigation activeTab="SHOP" setActiveTab={()=>{}} onSignInClick={() => setAuthModalOpen(true)} user={user} onSignOut={handleSignOut} darkMode={darkMode} />'
new_nav = '<Navigation activeTab={activeTab === "HOME" ? "SHOP" : activeTab} setActiveTab={setActiveTab} onSignInClick={() => setAuthModalOpen(true)} user={user} onSignOut={handleSignOut} darkMode={darkMode} />'
text = text.replace(old_nav, new_nav)

# Replace exact main body inside HomePage
main_replacement = """<main style={{ position:"relative", zIndex:2, minHeight: "80vh" }}>
        {activeTab === "HOME" && (
          <>
            <Hero onShopClick={() => setActiveTab("SHOP")} darkMode={darkMode} />
            <Categories darkMode={darkMode} />
            <ImpactStrip darkMode={darkMode} />
            <CarbonAwareness darkMode={darkMode} />
          </>
        )}
        {activeTab === "SHOP" && <div style={{paddingTop: 80}}><Shop onAddToCart={handleAddToCart} darkMode={darkMode} /></div>}
        {activeTab === "ECO RANKS" && <div style={{paddingTop: 80}}><EcoRanks darkMode={darkMode} /></div>}
        {activeTab === "REWARDS" && <div style={{paddingTop: 80}}><EcoRewards /></div>}
        {activeTab === "AI STYLIST" && <div style={{paddingTop: 80}}><EcoBot /></div>}
        {activeTab === "TRAVEL IMPACT" && <div style={{paddingTop: 80}}><TravelData darkMode={darkMode} /></div>}
        {activeTab === "ELECTRICITY IMPACT" && <div style={{paddingTop: 80}}><ElectricityUsage darkMode={darkMode} /></div>}
      </main>"""

text = re.sub(r'<main style=\{\{\s*position:"relative",\s*zIndex:2\s*\}\}\>.*?</main>', main_replacement, text, flags=re.DOTALL)

# Let's verify changes and write
with open(r'f:\app\app\page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print("Transformation completed.")
