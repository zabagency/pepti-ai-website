import { useState, useEffect } from "react";

export default function Nav({ onJoinWaitlist }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 clamp(20px, 5vw, 60px)",
      background: scrolled ? "rgba(10,10,26,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(59,130,246,0.1)" : "none",
      transition: "background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "rgba(59,130,246,0.15)",
          border: "1px solid rgba(59,130,246,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 8px rgba(59,130,246,0.9)" }} />
        </div>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20, letterSpacing: "0.14em",
          color: "#FFFFFF",
        }}>
          PEPTI AI
        </span>
      </div>

      {/* CTA */}
      <button
        onClick={onJoinWaitlist}
        style={{
          padding: "9px 22px",
          background: "rgba(59,130,246,0.12)",
          border: "1px solid rgba(59,130,246,0.45)",
          borderRadius: 100,
          color: "#93C5FD",
          fontFamily: "'Inter', sans-serif",
          fontSize: 12, fontWeight: 500, letterSpacing: "0.08em",
          cursor: "pointer",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(59,130,246,0.22)";
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.75)";
          e.currentTarget.style.color = "#DBEAFE";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(59,130,246,0.12)";
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.45)";
          e.currentTarget.style.color = "#93C5FD";
        }}
      >
        JOIN WAITLIST
      </button>
    </nav>
  );
}
