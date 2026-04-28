import { useEffect, useState, useRef } from "react";
import { getSolasLink } from '../lib/solasLinks';
import { trackProtocolOutput, trackSolasClick } from '../lib/trackSession';

// ── Vial image (bg removed via canvas luminance pass) ────────────────────────
const VIAL_SRC = 'data:image/png;base64,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';

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
  const canvasRefs = useRef([null, null, null]);
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

  // ── Canvas orbit animation ────────────────────────────────────────────────
  useEffect(() => {
    if (status !== "ready") return;
    const count = peptides.length;
    if (count === 0) return;

    const RX = 95, RY = 28, CY = 20, speed = 0.002;

    const sourceImg = new Image();
    sourceImg.onload = function () {
      // Luminance-based background removal
      const off = document.createElement("canvas");
      off.width  = sourceImg.naturalWidth;
      off.height = sourceImg.naturalHeight;
      const ctx = off.getContext("2d");
      ctx.drawImage(sourceImg, 0, 0);
      const imgData = ctx.getImageData(0, 0, off.width, off.height);
      const d = imgData.data;
      for (let p = 0; p < d.length; p += 4) {
        const lum = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
        if (lum < 40)       d[p + 3] = 0;
        else if (lum < 80)  d[p + 3] = Math.round(((lum - 40) / 40) * d[p + 3]);
      }
      ctx.putImageData(imgData, 0, 0);

      // Draw processed image to each vial canvas
      for (let i = 0; i < count; i++) {
        const c = canvasRefs.current[i];
        if (c) {
          const cx = c.getContext("2d");
          cx.clearRect(0, 0, c.width, c.height);
          cx.drawImage(off, 0, 0, c.width, c.height);
        }
      }

      // Show info card after image paints
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
    };
    sourceImg.src = VIAL_SRC;

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
        canvas { display: block; background: transparent !important; -webkit-touch-callout: none !important; user-select: none !important; -webkit-user-select: none !important; }
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
            onContextMenu={e => e.preventDefault()}
            style={{ position: "relative", height: 300, marginTop: -24, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", WebkitTouchCallout: "none", userSelect: "none", WebkitUserSelect: "none" }}
          >
            {peptides.slice(0, 3).map((peptide, i) => (
              <div
                key={i}
                ref={el => { vialRefs.current[i] = el; }}
                onClick={() => handleTap(i)}
                onContextMenu={e => e.preventDefault()}
                style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", willChange: "transform,opacity,filter" }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    ref={el => { glowRefs.current[i] = el; }}
                    style={{
                      position: "absolute", bottom: -6, left: "50%", transform: "translateX(-50%)",
                      borderRadius: "50%", width: 70, height: 16, opacity: 0,
                      background: "radial-gradient(ellipse,rgba(74,158,255,.65) 0%,transparent 70%)",
                      filter: "blur(9px)", pointerEvents: "none",
                    }}
                  />
                  <canvas
                    ref={el => { canvasRefs.current[i] = el; }}
                    width={160} height={240}
                    style={{
                      display: "block", pointerEvents: "none",
                      animation: "wobble 6s ease-in-out infinite",
                      animationDelay: `${[0, -2, -4][i]}s`,
                      transformOrigin: "center center",
                    }}
                  />
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
