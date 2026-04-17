import { useEffect, useRef } from "react";

export default function QuizCTASection({ onStart }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{
      padding: "clamp(80px, 12vw, 130px) clamp(20px, 6vw, 60px)",
      textAlign: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 500, height: 300,
        background: "radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div ref={ref} className="reveal" style={{ position: "relative" }}>
        <span style={{
          display: "block",
          fontSize: 10, letterSpacing: "0.32em",
          color: "rgba(96,165,250,0.5)",
          fontFamily: "'Inter', sans-serif", fontWeight: 500,
          marginBottom: 20,
        }}>
          BUILD YOUR PROTOCOL
        </span>

        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(40px, 8vw, 72px)",
          letterSpacing: "0.04em", color: "#FFFFFF",
          lineHeight: 1.05, marginBottom: 16,
          textShadow: "0 0 60px rgba(59,130,246,0.3)",
        }}>
          READY TO BUILD YOUR PROTOCOL?
        </h2>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "clamp(14px, 2.5vw, 17px)",
          fontWeight: 300, color: "rgba(147,197,253,0.6)",
          marginBottom: 36,
        }}>
          Takes 7 minutes. Free. No account needed.
        </p>

        <button
          onClick={onStart}
          style={{
            padding: "18px 48px",
            background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
            border: "none", borderRadius: 100,
            color: "#FFFFFF",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(18px, 3vw, 22px)",
            letterSpacing: "0.14em",
            cursor: "pointer",
            boxShadow: "0 0 40px rgba(59,130,246,0.5), 0 4px 20px rgba(0,0,0,0.4)",
            animation: "glowPulse 2.8s ease-in-out infinite",
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px) scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0) scale(1)"; }}
        >
          START NOW →
        </button>
      </div>
    </section>
  );
}
