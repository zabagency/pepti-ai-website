import { useEffect, useRef } from "react";

const CARDS = [
  {
    icon: "🧬",
    headline: "Science-Backed Questions",
    body: "23 clinically informed questions mapping your biology, goals, and complete health history.",
  },
  {
    icon: "🤖",
    headline: "AI-Generated Protocol",
    body: "Our AI analyzes your inputs against peer-reviewed research to build your personalized stack.",
  },
  {
    icon: "📋",
    headline: "Built for You",
    body: "Every protocol is unique — customized to your exact biology, goals, and experience level.",
  },
];

function Card({ icon, headline, body, delay }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(59,130,246,0.15)",
        borderRadius: 16,
        padding: "36px 28px",
        height: "100%",
        transition: "border-color 0.3s ease, background 0.3s ease, transform 0.3s ease",
        cursor: "default",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
          e.currentTarget.style.background = "rgba(59,130,246,0.05)";
          e.currentTarget.style.transform = "translateY(-4px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)";
          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "rgba(59,130,246,0.1)",
          border: "1px solid rgba(59,130,246,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, marginBottom: 20,
          boxShadow: "0 0 20px rgba(59,130,246,0.15)",
        }}>
          {icon}
        </div>

        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 22, letterSpacing: "0.04em",
          color: "#FFFFFF", marginBottom: 10,
        }}>
          {headline}
        </h3>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 14, fontWeight: 300, lineHeight: 1.65,
          color: "rgba(147,197,253,0.65)",
        }}>
          {body}
        </p>
      </div>
    </div>
  );
}

export default function ValuePropsSection() {
  return (
    <section style={{
      background: "rgba(255,255,255,0.015)",
      borderTop: "1px solid rgba(59,130,246,0.08)",
      borderBottom: "1px solid rgba(59,130,246,0.08)",
      padding: "clamp(60px, 10vw, 100px) clamp(20px, 6vw, 80px)",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Section label */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 60px)" }}>
          <span style={{
            fontSize: 10, letterSpacing: "0.32em",
            color: "rgba(96,165,250,0.5)",
            fontFamily: "'Inter', sans-serif", fontWeight: 500,
          }}>
            HOW IT WORKS
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "clamp(16px, 3vw, 24px)",
        }}>
          {CARDS.map((card, i) => (
            <Card key={card.headline} {...card} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}
