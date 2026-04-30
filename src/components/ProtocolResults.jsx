import { useEffect, useState, useRef } from "react";
import { getSolasLink } from '../lib/solasLinks';
import { trackProtocolOutput, trackSolasClick } from '../lib/trackSession';

// ── Vial image component (transparent PNG from /public) ──────────────────────
function Vial({ active }) {
  return (
    <img
      src="/STERILE_VIAL_.SINGLE.VIAL__98456.webp"
      alt=""
      draggable={false}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        opacity: active ? 1 : 0.45,
        filter: active
          ? 'drop-shadow(0 0 24px rgba(74,158,255,0.35))'
          : 'brightness(0.6)',
        transition: 'opacity 0.4s ease, filter 0.4s ease',
        pointerEvents: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserDrag: 'none',
        userSelect: 'none',
      }}
    />
  );
}

// ── Fetch function (unchanged) ────────────────────────────────────────────────
async function generateProtocol(answers) {
  const res = await fetch("/api/protocol", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Server error ${res.status}`);
  return data;
}

// ── Section label with trailing gradient line ────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      fontFamily: "'Space Mono',monospace", fontSize: 9,
      letterSpacing: ".22em", color: "#4a9eff", marginBottom: 11,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,rgba(74,158,255,.2),transparent)" }} />
    </div>
  );
}

// ── Info card rendered below the orbit ───────────────────────────────────────
function InfoCard({ peptide, visible, sessionId }) {
  if (!peptide) return null;
  const { name, purpose, personalizedReason, dose, frequency, administration, researchBacking, rank } = peptide;
  const solasUrl = getSolasLink(name);

  return (
    <div className="info-card-wrap" style={{
      margin: "28px 16px 0",
      background: "#0b0e1a",
      border: "1px solid rgba(74,158,255,.2)",
      borderRadius: 20,
      overflow: "hidden",
      position: "relative",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
      transition: "opacity .38s ease, transform .38s ease",
    }}>
      {/* Top highlight line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg,transparent,rgba(74,158,255,.45),transparent)",
      }} />

      {/* Card header */}
      <div className="card-header" style={{ padding: "22px 22px 18px", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
        <div className="card-header-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: ".22em", color: "#4a9eff" }}>
            ◈ COMPOUND {String(rank).padStart(2, "0")}
          </span>
          <span className="card-range-pill" style={{
            fontFamily: "'Space Mono',monospace", fontSize: 9, color: "rgba(80,105,150,.4)",
            border: "1px solid rgba(255,255,255,.08)", borderRadius: 100,
            padding: "4px 12px", background: "rgba(255,255,255,.03)",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontSize: 8, letterSpacing: ".1em" }}>RESEARCH RANGE</span>
            <span style={{ fontSize: 10, color: "rgba(140,165,210,.7)" }}>{dose}</span>
          </span>
        </div>
        <div className="card-peptide-name" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 46, lineHeight: 1, letterSpacing: ".04em", color: "#fff", marginBottom: 5 }}>
          {name}
        </div>
        <div style={{ fontSize: 12, color: "rgba(140,165,210,.58)", fontWeight: 300, letterSpacing: ".03em" }}>
          {purpose}
        </div>
      </div>

      {/* Card body */}
      <div className="card-body" style={{ padding: "0 22px 24px" }}>

        {/* WHY THIS FOR YOU */}
        <div style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <SectionLabel>WHY THIS FOR YOU</SectionLabel>
          <div style={{
            background: "rgba(74,158,255,.04)", border: "1px solid rgba(74,158,255,.08)",
            borderRadius: 10, padding: "13px 15px",
            fontSize: 13, lineHeight: 1.78, color: "rgba(220,232,255,.7)", fontWeight: 300,
          }}>
            {personalizedReason}
          </div>
        </div>

        {/* QUICK STATS — 3 pills in a row */}
        <div style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,.05)" }}>
          <SectionLabel>QUICK STATS</SectionLabel>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[administration, frequency, "Research compound"].map((val, i) => (
              <div key={i} style={{
                background: "rgba(74,158,255,.06)",
                border: "1px solid rgba(74,158,255,.2)",
                borderRadius: 100, padding: "6px 14px",
                fontFamily: "'Space Mono',monospace", fontSize: 10,
                color: "rgba(140,165,210,.8)", whiteSpace: "nowrap",
              }}>
                {val}
              </div>
            ))}
          </div>
        </div>

        {/* RESEARCH BACKING */}
        <div style={{ padding: "16px 0", borderBottom: solasUrl ? "1px solid rgba(255,255,255,.05)" : "none" }}>
          <SectionLabel>RESEARCH BACKING</SectionLabel>
          <p style={{
            fontFamily: "'Space Mono',monospace", fontSize: 10.5,
            lineHeight: 1.82, color: "rgba(80,105,150,.4)", fontStyle: "italic", margin: 0,
          }}>{researchBacking}</p>
        </div>

        {/* Solas Science affiliate link */}
        {solasUrl && (
          <a
            href={solasUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackSolasClick(sessionId)}
            style={{
              display: "block", marginTop: 16, padding: "12px 18px",
              background: "rgba(74,158,255,.1)", border: "1px solid rgba(74,158,255,.3)",
              borderRadius: 10, textAlign: "center",
              fontFamily: "'Space Mono',monospace", fontSize: 10,
              letterSpacing: ".18em", color: "#4a9eff", textDecoration: "none",
            }}
          >
            VIEW ON SOLAS SCIENCE →
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ProtocolResults({ quizAnswers, email, sessionId }) {
  // ── State (loading/error/ready preserved exactly) ─────────────────────────
  const [status,    setStatus]   = useState("loading");
  const [protocol,  setProtocol] = useState(null);
  const [error,     setError]    = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [cardVisible, setCardVisible] = useState(false);
  const called = useRef(false);

  // ── Keep latest sessionId/email in refs so the fetch closure always reads current values ──
  const sessionIdRef = useRef(sessionId);
  const emailRef     = useRef(email);
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);
  useEffect(() => { emailRef.current     = email;     }, [email]);

  // ── Orbit animation refs ──────────────────────────────────────────────────
  const vialRefs   = useRef([null, null, null]);
  const glowRefs   = useRef([null, null, null]);
  const labelRefs  = useRef([null, null, null]);
  const angleRef      = useRef(-Math.PI / 2);
  const rafRef        = useRef(null);
  const activeCardRef = useRef(0);

  // ── Fetch protocol (logic unchanged) ─────────────────────────────────────
  useEffect(() => {
    if (called.current) return;
    called.current = true;
    generateProtocol(quizAnswers)
      .then(p  => {
        setProtocol(p);
        setStatus("ready");
        console.log('[results] protocol loaded, calling trackProtocolOutput → sessionId:', sessionIdRef.current, '| email:', emailRef.current);
        trackProtocolOutput(sessionIdRef.current, emailRef.current, p);
      })
      .catch(e => { setError(e.message); setStatus("error"); });
  }, []);

  // ── Peptides array (structure preserved) ─────────────────────────────────
  const peptides = protocol ? [
    protocol.primaryPeptide   && { ...protocol.primaryPeptide,   rank: 1, label: "PRIMARY"   },
    protocol.secondaryPeptide && { ...protocol.secondaryPeptide, rank: 2, label: "SECONDARY" },
    protocol.supportPeptide   && { ...protocol.supportPeptide,   rank: 3, label: "SUPPORT"   },
  ].filter(Boolean) : [];

  // ── Orbit animation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== "ready") return;
    const count = peptides.length;
    if (count === 0) return;

    const RX = 95, RY = 28, CY = 20, speed = 0.002;

    // Show info card
    setTimeout(() => setCardVisible(true), 300);

    // RAF orbit loop
    function frame() {
      angleRef.current += speed;
      for (let i = 0; i < count; i++) {
        const a     = angleRef.current + i * ((2 * Math.PI) / count);
        const x     = Math.cos(a) * RX;
        const y     = Math.sin(a) * RY + CY;
        const depth = (Math.sin(a) + 1) / 2;
        const isActive = i === activeCardRef.current;
        const glowO = isActive ? 0.7 : depth > 0.75 ? (depth - 0.75) * 2.5 : 0;

        if (vialRefs.current[i]) {
          vialRefs.current[i].style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${(0.52 + 0.48 * depth).toFixed(3)})`;
          vialRefs.current[i].style.opacity   = (0.28 + 0.72 * depth).toFixed(2);
          vialRefs.current[i].style.zIndex    = Math.round(depth * 10);
          vialRefs.current[i].style.filter    = `brightness(${(0.32 + 0.68 * depth).toFixed(2)}) saturate(${(0.3 + 0.7 * depth).toFixed(2)})${isActive ? " drop-shadow(0 0 16px rgba(74,158,255,.5))" : ""}`;
        }
        if (glowRefs.current[i])  glowRefs.current[i].style.opacity  = glowO.toFixed(2);
        if (labelRefs.current[i]) labelRefs.current[i].style.color   = isActive ? "#4a9eff" : "rgba(80,105,150,.4)";
      }
      rafRef.current = requestAnimationFrame(frame);
    }
    frame();

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Vial tap handler ──────────────────────────────────────────────────────
  const handleTap = (i) => {
    const count = peptides.length;
    activeCardRef.current = i;
    let diff = (Math.PI / 2 - i * ((2 * Math.PI) / count)) - angleRef.current;
    while (diff >  Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    angleRef.current += diff * 0.18;

    setCardVisible(false);
    setTimeout(() => { setActiveIdx(i); setCardVisible(true); }, 150);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "fixed", inset: 0, background: "#060810", overflowY: "auto", zIndex: 200, scrollbarWidth: "none" }}>
      <style>{`
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:.18} }
        @keyframes wobble { 0%,100%{transform:perspective(400px) rotateY(-18deg)} 50%{transform:perspective(400px) rotateY(18deg)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        ::-webkit-scrollbar { display:none }
        .orbit-scene { background: transparent !important; }
        @media (max-width: 480px) {
          .info-card-wrap { margin: 16px 8px 0 !important; }
          .card-header    { padding: 14px 14px 12px !important; }
          .card-header-row { flex-direction: column !important; align-items: flex-start !important; gap: 6px !important; }
          .card-range-pill { font-size: 8px !important; padding: 3px 8px !important; }
          .card-peptide-name { font-size: 26px !important; margin-bottom: 4px !important; }
          .card-body      { padding: 0 14px 16px !important; }
        }
      `}</style>

      {/* Background radial gradients */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: [
          "radial-gradient(ellipse 90% 45% at 50% -8%,rgba(20,70,200,.2) 0%,transparent 65%)",
          "radial-gradient(ellipse 50% 50% at 15% 80%,rgba(10,35,120,.1) 0%,transparent 60%)",
        ].join(","),
      }} />

      {/* ── LOADING ── */}
      {status === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(74,158,255,.15)", borderTop: "2px solid #4a9eff", animation: "spin 1s linear infinite" }} />
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: ".22em", color: "#4a9eff" }}>
            BUILDING YOUR PROTOCOL...
          </h2>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "rgba(140,165,210,.5)", textAlign: "center", maxWidth: 300, lineHeight: 1.65 }}>
            Analyzing your biology and cross-referencing peer-reviewed research.
          </p>
        </div>
      )}

      {/* ── ERROR (logic + retry preserved exactly) ── */}
      {status === "error" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 16, textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 40 }}>⚠️</div>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: "#F87171", letterSpacing: ".04em" }}>
            SOMETHING WENT WRONG
          </h2>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 12, color: "rgba(140,165,210,.6)", maxWidth: 360, lineHeight: 1.65 }}>
            {error}
          </p>
          <p style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "rgba(140,165,210,.35)", maxWidth: 340, lineHeight: 1.65 }}>
            Make sure the API server is running: <code style={{ color: "rgba(74,158,255,.55)" }}>node server.js</code>
          </p>
          <button
            onClick={() => {
              called.current = false;
              setStatus("loading");
              setError("");
              generateProtocol(quizAnswers)
                .then(p  => { setProtocol(p); setStatus("ready"); })
                .catch(e => { setError(e.message); setStatus("error"); });
            }}
            style={{
              marginTop: 8, padding: "12px 32px",
              background: "rgba(74,158,255,.08)", border: "1px solid rgba(74,158,255,.3)",
              borderRadius: 10, color: "#4a9eff",
              fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, letterSpacing: ".14em",
              cursor: "pointer",
            }}
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {/* ── RESULTS ── */}
      {status === "ready" && protocol && (
        <div style={{ position: "relative", zIndex: 1, maxWidth: 480, margin: "0 auto", paddingBottom: 60 }}>

          {/* Disclaimer banner */}
          <div style={{
            margin: "20px 16px 0", padding: "11px 14px",
            background: "rgba(74,158,255,.06)", border: "1px solid rgba(74,158,255,.15)",
            borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 13, flexShrink: 0, marginTop: 1 }}>⚠</span>
            <span style={{ fontFamily: "'Space Mono',monospace", fontSize: 9.5, lineHeight: 1.7, color: "rgba(140,165,210,.7)", letterSpacing: ".02em" }}>
              Educational content only. Not medical advice. Pepti AI does not recommend dosages or protocols. Consult a licensed physician before using any research compound.
            </span>
          </div>

          {/* Badge */}
          <div style={{ textAlign: "center", padding: "40px 24px 0" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: "1px solid rgba(74,158,255,.2)", borderRadius: 100,
              padding: "7px 18px", fontFamily: "'Space Mono',monospace",
              fontSize: 10, letterSpacing: ".18em", color: "#4a9eff",
              background: "rgba(74,158,255,.1)",
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4a9eff", boxShadow: "0 0 8px #4a9eff", animation: "blink 2.4s ease-in-out infinite" }} />
              EDUCATION OVERVIEW
            </div>
          </div>

          {/* Orbit scene */}
          <div
            className="orbit-scene"
            style={{ position: "relative", height: 300, marginTop: -24, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}
          >
            {peptides.slice(0, 3).map((peptide, i) => (
              <div
                key={i}
                ref={el => { vialRefs.current[i] = el; }}
                onClick={() => handleTap(i)}
                style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", willChange: "transform,opacity,filter", width: 160, height: 240 }}
              >
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <div
                    ref={el => { glowRefs.current[i] = el; }}
                    style={{
                      position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
                      borderRadius: "50%", width: 70, height: 16, opacity: 0,
                      background: "radial-gradient(ellipse,rgba(74,158,255,.65) 0%,transparent 70%)",
                      filter: "blur(9px)", pointerEvents: "none",
                    }}
                  />
                  <Vial active={i === activeIdx} />
                </div>
                <span
                  ref={el => { labelRefs.current[i] = el; }}
                  style={{
                    fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: ".14em",
                    marginTop: -20, color: "rgba(80,105,150,.4)", whiteSpace: "nowrap",
                  }}
                >
                  {peptide.name}
                </span>
              </div>
            ))}
          </div>

          {/* Tap hint */}
          <p style={{ textAlign: "center", fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: ".2em", color: "rgba(80,105,150,.4)", paddingTop: 40 }}>
            TAP A VIAL TO EXPLORE
          </p>

          {/* Info card */}
          <InfoCard
            peptide={peptides[activeIdx]}
            visible={cardVisible}
            sessionId={sessionId}
          />

          {/* Consult CTA */}
          <div style={{
            margin: "16px 16px 0", padding: "16px 18px",
            border: "1px solid rgba(74,158,255,.15)", borderRadius: 14,
            background: "rgba(74,158,255,.04)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}>
            <span style={{ fontSize: 12, color: "rgba(140,165,210,.58)", lineHeight: 1.6, fontWeight: 300 }}>
              Research compounds require medical supervision. Work with a licensed physician to determine if any compound is appropriate for you.
            </span>
            <span style={{
              fontFamily: "'Space Mono',monospace", fontSize: 9, letterSpacing: ".14em",
              color: "#4a9eff", border: "1px solid rgba(74,158,255,.2)", borderRadius: 100,
              padding: "7px 14px", whiteSpace: "nowrap", cursor: "pointer",
              background: "rgba(74,158,255,.1)", flexShrink: 0,
            }}>
              FIND A CLINIC
            </span>
          </div>

        </div>
      )}
    </div>
  );
}
