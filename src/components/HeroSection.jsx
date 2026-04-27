import { useEffect, useRef } from "react";
import PhoneMockup from "./PhoneMockup.jsx";

export default function HeroSection({ onStart }) {
  const leftRef = useRef(null);

  useEffect(() => {
    // Fade in on mount
    const el = leftRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <section className="hero-section" style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center",
      padding: "clamp(80px, 10vw, 100px) clamp(20px, 6vw, 80px) clamp(60px, 8vw, 80px)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow blobs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{
          position: "absolute", top: "10%", left: "-10%",
          width: "60%", height: "70%",
          background: "radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", right: "5%",
          width: "40%", height: "50%",
          background: "radial-gradient(ellipse, rgba(59,130,246,0.04) 0%, transparent 60%)",
        }} />
        {/* Subtle grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="hero-inner" style={{
        maxWidth: 1200, width: "100%", margin: "0 auto",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "clamp(40px, 5vw, 80px)",
        position: "relative",
      }}>

        {/* ── Left: Text content (55%) ── */}
        <div
          ref={leftRef}
          className="hero-left"
          style={{
            flex: "0 0 55%",
            maxWidth: 580,
          }}
        >
          {/* Pill label */}
          <div className="hero-pill" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            border: "1px solid rgba(59,130,246,0.35)",
            padding: "7px 16px", borderRadius: 100,
            background: "rgba(59,130,246,0.06)",
            marginBottom: "clamp(24px, 4vw, 32px)",
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#3B82F6",
              boxShadow: "0 0 8px rgba(59,130,246,0.9)",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{
              fontSize: 10, letterSpacing: "0.26em",
              color: "#93C5FD",
              fontFamily: "'Inter', sans-serif", fontWeight: 500,
            }}>
              PEPTI AI — NOW IN DEVELOPMENT
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(44px, 6.5vw, 80px)",
            lineHeight: 1.0, letterSpacing: "0.03em",
            color: "#FFFFFF",
            marginBottom: "clamp(16px, 2.5vw, 24px)",
            textShadow: "0 0 60px rgba(59,130,246,0.25)",
          }}>
            Find Your Perfect<br />
            Peptide Protocol<br />
            in Minutes.
          </h1>

          {/* Subheadline */}
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(14px, 1.8vw, 17px)",
            fontWeight: 300, lineHeight: 1.7,
            color: "rgba(147,197,253,0.68)",
            marginBottom: "clamp(28px, 4vw, 40px)",
            maxWidth: 500,
          }}>
            Answer a few questions and our AI builds you a personalized peptide protocol — customized to your biology and backed by real research.
          </p>

          {/* CTA Button */}
          <button
            className="hero-cta"
            onClick={onStart}
            style={{
              display: "inline-block",
              padding: "18px clamp(36px, 5vw, 52px)",
              background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
              border: "none", borderRadius: 100,
              color: "#FFFFFF",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(18px, 2.2vw, 22px)",
              letterSpacing: "0.14em",
              cursor: "pointer",
              boxShadow: "0 0 40px rgba(59,130,246,0.5), 0 4px 20px rgba(0,0,0,0.4)",
              animation: "glowPulse 2.8s ease-in-out infinite",
              transition: "transform 0.15s ease",
              marginBottom: 18,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
          >
            BUILD MY PROTOCOL →
          </button>

          {/* Social proof */}
          <div className="hero-social" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Avatar stack */}
            <div style={{ display: "flex" }}>
              {["#3B82F6","#8B5CF6","#06B6D4"].map((c, i) => (
                <div key={i} style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${c}, rgba(10,10,26,0.8))`,
                  border: "2px solid #0A0A1A",
                  marginLeft: i > 0 ? -8 : 0,
                }} />
              ))}
            </div>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13, fontWeight: 300,
              color: "rgba(147,197,253,0.5)",
            }}>
              200+ people already on the early access list
            </span>
          </div>
        </div>

        {/* ── Right: Phone mockup (45%) ── */}
        <div className="hero-right" style={{
          flex: "0 0 45%",
          display: "flex", justifyContent: "center", alignItems: "center",
          paddingTop: 32,
        }}>
          {/* Glow behind phone */}
          <div className="hero-phone-wrap" style={{ position: "relative" }}>
            <div style={{
              position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
              width: "140%", height: "60%",
              background: "radial-gradient(ellipse, rgba(59,130,246,0.14) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <PhoneMockup />
          </div>
        </div>
      </div>

      {/* Mobile: responsive layout */}
      <style>{`
        @media (max-width: 768px) {
          .hero-inner { flex-direction: column !important; gap: 24px !important; }
          .hero-left  { flex: unset !important; max-width: 100% !important; text-align: center; }
          .hero-right { flex: unset !important; padding-top: 0 !important; }
          .hero-left h1 { font-size: clamp(38px, 10vw, 54px) !important; }
        }
        @media (max-width: 480px) {
          .hero-section   { overflow: visible !important; }
          .hero-inner     { flex-direction: row !important; gap: 8px !important; align-items: center !important; }
          .hero-left      { flex: 0 0 50% !important; max-width: 50% !important; text-align: left !important; min-width: 0 !important; }
          .hero-right     { flex: 0 0 46% !important; padding-top: 0 !important; overflow: visible !important; max-height: none !important; justify-content: center !important; }
          .hero-phone-wrap { transform: scale(0.66) !important; transform-origin: center center !important; }
          .hero-left h1   { font-size: 26px !important; line-height: 1.05 !important; margin-bottom: 10px !important; }
          .hero-left p    { font-size: 11px !important; margin-bottom: 14px !important; line-height: 1.55 !important; }
          .hero-pill      { margin-bottom: 10px !important; padding: 5px 10px !important; }
          .hero-pill span { font-size: 8px !important; }
          .hero-cta       { padding: 11px 18px !important; font-size: 13px !important; margin-bottom: 8px !important; }
          .hero-social    { display: none !important; }
        }
      `}</style>
    </section>
  );
}
