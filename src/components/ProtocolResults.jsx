import { useEffect, useState, useRef } from "react";

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

// ── Pharmaceutical Glass Vial ────────────────────────────────────────────────
function VialObject({ peptide }) {
  const { name, rgb } = peptide;
  return (
    <div style={{ width: 58, height: 170, position: "relative", userSelect: "none" }}>

      {/* Rubber stopper */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 40, height: 22, borderRadius: "4px 4px 0 0",
        background: "linear-gradient(160deg,#334155 0%,#1e293b 55%,#0f172a 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 -3px 10px rgba(0,0,0,0.55), inset 0 1px 3px rgba(255,255,255,0.06)",
      }}>
        {[5, 10, 15].map(t => (
          <div key={t} style={{ position: "absolute", top: t, left: 7, right: 7, height: 2, background: "rgba(0,0,0,0.28)", borderRadius: 1 }} />
        ))}
      </div>

      {/* Neck */}
      <div style={{
        position: "absolute", top: 21, left: "50%", transform: "translateX(-50%)",
        width: 28, height: 10,
        background: "linear-gradient(180deg,rgba(51,65,85,0.85),rgba(10,15,30,0.95))",
        border: "1px solid rgba(255,255,255,0.06)", borderTop: "none",
      }} />

      {/* Glass body */}
      <div style={{
        position: "absolute", top: 30, left: 0, right: 0, bottom: 0,
        background: `linear-gradient(108deg,
          rgba(255,255,255,0.08) 0%,
          rgba(${rgb},0.04) 14%,
          rgba(6,10,24,0.93) 32%,
          rgba(${rgb},0.05) 56%,
          rgba(6,10,24,0.9) 80%,
          rgba(255,255,255,0.05) 100%)`,
        border: `1px solid rgba(${rgb},0.4)`,
        borderRadius: "3px 3px 14px 14px",
        overflow: "hidden",
        boxShadow: `inset 0 0 20px rgba(${rgb},0.08), 0 4px 28px rgba(0,0,0,0.55)`,
      }}>
        {/* Left glass shine */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 9,
          background: "linear-gradient(180deg,rgba(255,255,255,0.2) 0%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.02) 100%)",
          borderRadius: "3px 0 0 14px",
        }} />
        {/* Right shadow edge */}
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: 5,
          background: "rgba(0,0,0,0.3)", borderRadius: "0 3px 14px 0",
        }} />
        {/* Liquid fill */}
        <div style={{
          position: "absolute", bottom: 0, left: 1, right: 1, height: "60%",
          background: `linear-gradient(180deg,transparent 0%,rgba(${rgb},0.07) 38%,rgba(${rgb},0.22) 100%)`,
          borderRadius: "0 0 13px 13px",
        }} />
        {/* Meniscus line */}
        <div style={{
          position: "absolute", bottom: "59%", left: 2, right: 2, height: 3,
          background: `rgba(${rgb},0.28)`, borderRadius: 2, filter: "blur(1.5px)",
        }} />
        {/* Bubble details */}
        <div style={{ position: "absolute", bottom: "34%", left: 9, width: 5, height: 5, borderRadius: "50%", background: `rgba(${rgb},0.35)`, boxShadow: `0 0 5px rgba(${rgb},0.6)` }} />
        <div style={{ position: "absolute", bottom: "50%", right: 8, width: 3, height: 3, borderRadius: "50%", background: `rgba(${rgb},0.22)` }} />
        {/* Label area */}
        <div style={{
          position: "absolute", top: "22%", bottom: "24%", left: 9, right: 9,
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.07)", borderRadius: 3,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{
            writingMode: "vertical-rl", textOrientation: "mixed",
            transform: "rotate(180deg)",
            fontSize: 7, letterSpacing: "0.24em",
            fontFamily: "'Inter',sans-serif", fontWeight: 700,
            color: `rgba(${rgb},0.9)`, textTransform: "uppercase",
            textShadow: `0 0 8px rgba(${rgb},0.65)`,
          }}>{name}</span>
        </div>
      </div>
    </div>
  );
}

// ── Inline Info Panel ────────────────────────────────────────────────────────
function InfoPanel({ peptide }) {
  const { name, label, color, rgb, purpose, personalizedReason, dose, frequency, administration, researchBacking } = peptide;
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      border: `1px solid rgba(${rgb},0.2)`,
      borderRadius: 18, padding: "clamp(20px,4vw,30px)",
      animation: "fadeUp 0.42s ease both",
    }}>
      {/* Name + dose */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.22em", fontWeight: 600, fontFamily: "'Inter',sans-serif", color, marginBottom: 6 }}>
            {label}
          </div>
          <h3 style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: "clamp(28px,6vw,42px)",
            letterSpacing: "0.04em", color: "#FFFFFF", lineHeight: 1,
            textShadow: `0 0 40px rgba(${rgb},0.45)`,
          }}>{name}</h3>
        </div>
        <span style={{
          fontSize: 11, letterSpacing: "0.12em", fontWeight: 500,
          fontFamily: "'Inter',sans-serif", color,
          background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.28)`,
          padding: "5px 14px", borderRadius: 100,
          whiteSpace: "nowrap", alignSelf: "flex-start", marginTop: 4,
        }}>{dose}</span>
      </div>

      {/* Purpose */}
      <p style={{
        fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 400,
        lineHeight: 1.7, color: "rgba(226,232,240,0.85)", marginBottom: 16,
      }}>{purpose}</p>

      {/* Why for you */}
      <div style={{
        background: `rgba(${rgb},0.06)`, border: `1px solid rgba(${rgb},0.16)`,
        borderRadius: 10, padding: "14px 16px", marginBottom: 18,
      }}>
        <div style={{ fontSize: 9, letterSpacing: "0.22em", color, fontFamily: "'Inter',sans-serif", fontWeight: 600, marginBottom: 7 }}>
          WHY FOR YOU
        </div>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 300, lineHeight: 1.7, color: "rgba(147,197,253,0.88)", margin: 0 }}>
          {personalizedReason}
        </p>
      </div>

      {/* Detail rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
        {[["FREQUENCY", frequency], ["ADMINISTRATION", administration]].map(([l, v]) => (
          <div key={l} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{
              fontSize: 9, letterSpacing: "0.18em", color: `rgba(${rgb},0.5)`,
              fontFamily: "'Inter',sans-serif", fontWeight: 600,
              flexShrink: 0, marginTop: 2, minWidth: 112,
            }}>{l}</span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(226,232,240,0.82)", lineHeight: 1.55 }}>
              {v}
            </span>
          </div>
        ))}
      </div>

      {/* Research backing */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(96,165,250,0.38)", fontFamily: "'Inter',sans-serif", fontWeight: 500, marginBottom: 7 }}>
          RESEARCH BACKING
        </div>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, fontWeight: 300, lineHeight: 1.7, color: "rgba(147,197,253,0.48)", fontStyle: "italic", margin: 0 }}>
          {researchBacking}
        </p>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ProtocolResults({ quizAnswers, email }) {
  const [status, setStatus]         = useState("loading");
  const [protocol, setProtocol]     = useState(null);
  const [error, setError]           = useState("");
  const [activeIdx, setActiveIdx]   = useState(0);
  const [copied, setCopied]         = useState(false);
  const [isMobile, setIsMobile]     = useState(window.innerWidth < 600);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    generateProtocol(quizAnswers)
      .then(p  => { setProtocol(p); setStatus("ready"); })
      .catch(e => { setError(e.message); setStatus("error"); });
  }, []);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const handleShare = () => {
    if (!protocol) return;
    const lines = [
      `MY PEPTI AI PROTOCOL: ${protocol.protocolName}`, "",
      protocol.summary, "",
      `PRIMARY: ${protocol.primaryPeptide?.name} — ${protocol.primaryPeptide?.dose}, ${protocol.primaryPeptide?.frequency}`,
      `SECONDARY: ${protocol.secondaryPeptide?.name} — ${protocol.secondaryPeptide?.dose}, ${protocol.secondaryPeptide?.frequency}`,
      protocol.supportPeptide ? `SUPPORT: ${protocol.supportPeptide?.name} — ${protocol.supportPeptide?.dose}` : null,
      "", "Built with Pepti AI — peptiai.app",
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(lines).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const peptides = protocol ? [
    protocol.primaryPeptide   && { ...protocol.primaryPeptide,   rank: 1, color: "#3B82F6", rgb: "59,130,246",  label: "PRIMARY"   },
    protocol.secondaryPeptide && { ...protocol.secondaryPeptide, rank: 2, color: "#8B5CF6", rgb: "139,92,246", label: "SECONDARY" },
    protocol.supportPeptide   && { ...protocol.supportPeptide,   rank: 3, color: "#06B6D4", rgb: "6,182,212",  label: "SUPPORT"   },
  ].filter(Boolean) : [];

  // Relative position of each peptide to the active one: -1 (left), 0 (center), +1 (right)
  const getRelPos = (i) => {
    const total = peptides.length;
    let r = ((i - activeIdx) + total) % total;
    if (r >= Math.ceil(total / 2)) r -= total;
    return r; // always in {-1, 0, 1} for 2-3 peptides
  };

  // CSS transform for each vial slot based on screen size + relative position
  const getVialTransform = (relPos) => {
    if (!isMobile) {
      const xGap = peptides.length === 2 ? 140 : 152;
      const x = relPos * xGap;
      const scale = relPos === 0 ? 1 : 0.63;
      return `translate(calc(-50% + ${x}px), -50%) scale(${scale})`;
    }
    // Mobile: active top-center, others below side-by-side
    if (relPos === 0) return "translate(-50%, calc(-50% - 76px)) scale(1)";
    return `translate(calc(-50% + ${relPos * 90}px), calc(-50% + 90px)) scale(0.53)`;
  };

  // Three fixed floor glow positions (left / center / right slots)
  const FLOOR_SLOTS = peptides.length === 2 ? [-1, 0, 1].slice(0, 2) : [-1, 0, 1];
  const floorGlows = peptides.map((p, i) => ({ peptide: p, relPos: getRelPos(i) }))
    .filter(({ relPos }) => FLOOR_SLOTS.includes(relPos));

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(180deg,#05050f 0%,#0a0a1a 100%)",
      overflowY: "auto", zIndex: 200, scrollbarWidth: "none",
    }}>
      <style>{`
        @keyframes vial-spin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }
        @keyframes floor-glow-pulse {
          0%,100% { opacity: 0.65; }
          50%      { opacity: 1; }
        }
        @keyframes particle-float {
          0%   { transform: translateY(0);     opacity: 0; }
          12%  { opacity: 0.55; }
          88%  { opacity: 0.55; }
          100% { transform: translateY(-68px); opacity: 0; }
        }
        .vial-slot {
          position: absolute; top: 50%; left: 50%;
          transition: transform 0.52s cubic-bezier(0.34,1.06,0.64,1), opacity 0.42s ease;
        }
        .vial-slot:not(.is-center) { cursor: pointer; }
        .share-btn:hover {
          border-color: rgba(59,130,246,0.55) !important;
          background: rgba(59,130,246,0.07) !important;
        }
        .results-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── LOADING ── */}
      {status === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid rgba(59,130,246,0.15)", borderTop: "2px solid #3B82F6", animation: "spin 1s linear infinite" }} />
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: "0.22em", color: "#60A5FA", animation: "pulse 1.8s ease infinite" }}>
            BUILDING YOUR PROTOCOL...
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "rgba(147,197,253,0.38)", textAlign: "center", maxWidth: 300, lineHeight: 1.65 }}>
            Analyzing your biology and cross-referencing peer-reviewed research.
          </p>
        </div>
      )}

      {/* ── ERROR ── */}
      {status === "error" && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 16, textAlign: "center", padding: 24 }}>
          <div style={{ fontSize: 40 }}>⚠️</div>
          <h2 style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 30, color: "#F87171", letterSpacing: "0.04em" }}>
            SOMETHING WENT WRONG
          </h2>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, color: "rgba(147,197,253,0.6)", maxWidth: 360, lineHeight: 1.65 }}>
            {error}
          </p>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 12, color: "rgba(147,197,253,0.35)", maxWidth: 340, lineHeight: 1.65 }}>
            Make sure the API server is running: <code style={{ color: "rgba(96,165,250,0.55)" }}>node server.js</code>
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
              background: "rgba(59,130,246,0.08)",
              border: "1px solid rgba(59,130,246,0.3)",
              borderRadius: 10, color: "#93C5FD",
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: 15, letterSpacing: "0.14em",
              cursor: "pointer",
            }}
          >
            TRY AGAIN
          </button>
        </div>
      )}

      {/* ── RESULTS ── */}
      {status === "ready" && protocol && (
        <>
          {/* Background particles */}
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${9 + (i * 59) % 83}%`, top: `${8 + (i * 43) % 85}%`,
                width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2,
                borderRadius: "50%",
                background: i % 2 === 0 ? "rgba(59,130,246,0.2)" : "rgba(139,92,246,0.16)",
                animation: `particle-float ${7 + (i % 4) * 1.4}s ease-in-out ${i * 0.9}s infinite`,
              }} />
            ))}
          </div>

          {/* ── ABOVE VIALS ── */}
          <div style={{
            position: "relative", zIndex: 1,
            textAlign: "center",
            padding: "clamp(44px,9vw,70px) clamp(20px,5vw,40px) 0",
            animation: "fadeUp 0.7s ease both",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              border: "1px solid rgba(59,130,246,0.26)", borderRadius: 100,
              padding: "6px 16px", background: "rgba(59,130,246,0.05)", marginBottom: 20,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 8px #3B82F6" }} />
              <span style={{ fontSize: 9, letterSpacing: "0.26em", color: "#60A5FA", fontFamily: "'Inter',sans-serif", fontWeight: 500 }}>
                YOUR PERSONALIZED PROTOCOL
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue',sans-serif",
              fontSize: "clamp(36px,9vw,66px)",
              letterSpacing: "0.04em", color: "#FFFFFF", lineHeight: 1,
              marginBottom: 16, textShadow: "0 0 60px rgba(59,130,246,0.3)",
            }}>
              {protocol.protocolName}
            </h1>

            <p style={{
              fontFamily: "'Inter',sans-serif",
              fontSize: "clamp(13px,2.3vw,15px)",
              fontWeight: 300, lineHeight: 1.74,
              color: "rgba(147,197,253,0.62)",
              maxWidth: 500, margin: "0 auto",
            }}>
              {protocol.summary}
            </p>

            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 10, color: "rgba(96,165,250,0.28)", letterSpacing: "0.12em", marginTop: 18 }}>
              TAP A VIAL TO EXPLORE
            </p>
          </div>

          {/* ── VIAL SCENE ── */}
          <div style={{
            position: "relative", zIndex: 1,
            width: "100%",
            height: isMobile ? 390 : 310,
          }}>
            {/* Floor radial glows — one per vial position, always present */}
            {floorGlows.map(({ peptide: p, relPos }) => {
              const isActive = relPos === 0;
              const xGap = peptides.length === 2 ? 140 : 152;
              const xOffset = isMobile
                ? (relPos === 0 ? 0 : relPos * 90)
                : relPos * xGap;
              const yBottom = isMobile
                ? (relPos === 0 ? 390 - 220 : 390 - 330) // px from top → convert to bottom
                : 28;
              return (
                <div key={relPos} style={{
                  position: "absolute",
                  bottom: yBottom,
                  left: `calc(50% + ${xOffset}px)`,
                  transform: "translateX(-50%)",
                  width: isActive ? 140 : 82,
                  height: isActive ? 30 : 17,
                  background: `radial-gradient(ellipse, rgba(${p.rgb},${isActive ? 0.55 : 0.22}) 0%, transparent 70%)`,
                  filter: "blur(9px)",
                  animation: `floor-glow-pulse ${isActive ? 2.2 : 3.6}s ease-in-out ${relPos === -1 ? 0.6 : relPos === 1 ? 1.1 : 0}s infinite`,
                  pointerEvents: "none",
                  transition: "width 0.5s ease, height 0.5s ease",
                }} />
              );
            })}

            {/* Vials */}
            {peptides.map((peptide, i) => {
              const relPos = getRelPos(i);
              const isCenter = relPos === 0;
              const spinDuration = isCenter ? "7s" : "11s";
              return (
                <div
                  key={i}
                  className={`vial-slot${isCenter ? " is-center" : ""}`}
                  style={{
                    transform: getVialTransform(relPos),
                    opacity: isCenter ? 1 : 0.42,
                    zIndex: isCenter ? 3 : 1,
                  }}
                  onClick={() => !isCenter && setActiveIdx(i)}
                >
                  {/* Perspective wrapper for 3D spin */}
                  <div style={{ perspective: "500px" }}>
                    <div style={{ animation: `vial-spin ${spinDuration} linear infinite` }}>
                      <VialObject peptide={peptide} />
                    </div>
                  </div>

                  {/* Rank badge below vial */}
                  <div style={{
                    textAlign: "center", marginTop: 10,
                    fontSize: 8, letterSpacing: "0.22em",
                    fontFamily: "'Inter',sans-serif", fontWeight: 600,
                    color: isCenter ? peptide.color : `rgba(${peptide.rgb},0.38)`,
                    transition: "color 0.4s ease",
                  }}>
                    {peptide.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── INFO PANEL + BELOW ── */}
          <div style={{
            position: "relative", zIndex: 1,
            maxWidth: 580, margin: "0 auto",
            padding: "clamp(12px,3vw,22px) clamp(16px,5vw,32px) clamp(64px,10vw,100px)",
          }}>

            {/* Info card — key triggers fresh fade animation on switch */}
            {peptides[activeIdx] && (
              <div key={activeIdx} style={{ marginBottom: 16 }}>
                <InfoPanel peptide={peptides[activeIdx]} />
              </div>
            )}

            {/* Lifestyle optimizations */}
            {protocol.lifestyleNotes?.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(59,130,246,0.1)",
                borderRadius: 16, padding: "clamp(20px,4vw,28px)",
                marginBottom: 14,
                animation: "fadeUp 0.6s ease 200ms both",
              }}>
                <div style={{ fontSize: 9, letterSpacing: "0.26em", color: "rgba(96,165,250,0.4)", fontFamily: "'Inter',sans-serif", fontWeight: 500, marginBottom: 20 }}>
                  LIFESTYLE OPTIMIZATIONS
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {protocol.lifestyleNotes.map((note, i) => (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      <div style={{
                        width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
                        background: "rgba(59,130,246,0.09)", border: "1px solid rgba(59,130,246,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: "#60A5FA", fontFamily: "'Bebas Neue',sans-serif",
                        marginTop: 1,
                      }}>{i + 1}</div>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 14, fontWeight: 300, lineHeight: 1.72, color: "rgba(226,232,240,0.8)", margin: 0 }}>
                        {note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            {protocol.disclaimer && (
              <div style={{
                padding: "14px 18px",
                background: "rgba(248,113,113,0.025)",
                border: "1px solid rgba(248,113,113,0.08)",
                borderRadius: 10, marginBottom: 14,
                animation: "fadeUp 0.6s ease 280ms both",
              }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 300, lineHeight: 1.72, color: "rgba(252,165,165,0.4)", margin: 0 }}>
                  {protocol.disclaimer}
                </p>
              </div>
            )}

            {/* Full app coming soon */}
            <div style={{
              background: "rgba(59,130,246,0.04)",
              border: "1px solid rgba(59,130,246,0.13)",
              borderRadius: 16, padding: "clamp(22px,4vw,30px)",
              textAlign: "center", marginBottom: 12,
              animation: "fadeUp 0.6s ease 360ms both",
            }}>
              <div style={{ fontSize: 24, marginBottom: 10, display: "inline-block", animation: "checkPop 0.6s cubic-bezier(0.34,1.56,0.64,1) 1s both" }}>✓</div>
              <h3 style={{
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: "clamp(18px,4vw,26px)",
                letterSpacing: "0.05em", color: "#DBEAFE", marginBottom: 8,
              }}>
                Full app coming soon — you&apos;re on the list
              </h3>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, fontWeight: 300, color: "rgba(147,197,253,0.4)" }}>
                We&apos;ll notify {email} when Pepti AI launches.
              </p>
            </div>

            {/* Share */}
            <button
              className="share-btn"
              onClick={handleShare}
              style={{
                width: "100%", padding: "15px 24px",
                background: "transparent",
                border: "1px solid rgba(59,130,246,0.24)",
                borderRadius: 10, color: "#93C5FD",
                fontFamily: "'Bebas Neue',sans-serif",
                fontSize: 16, letterSpacing: "0.14em",
                cursor: "pointer", transition: "all 0.3s ease",
                animation: "fadeUp 0.6s ease 420ms both",
              }}
            >
              {copied ? "COPIED TO CLIPBOARD ✓" : "SHARE MY PROTOCOL"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
