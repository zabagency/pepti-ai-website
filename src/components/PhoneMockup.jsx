import { useState, useEffect, useRef } from "react";
import * as THREE from "three";

// ── Mini Three.js helix rendered into a canvas inside the phone ──────────────
function MiniHelixCanvas({ width, height }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x040c1a);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 60);
    camera.position.set(0, 0.5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const TURNS = 2.4, RAD = 1.0, HGHT = 8, N = 16;

    const nodePositions = Array.from({ length: N }, (_, i) => {
      const t = i / (N - 1), a = t * Math.PI * 2 * TURNS;
      return new THREE.Vector3(RAD * Math.cos(a), t * HGHT - HGHT / 2, RAD * Math.sin(a));
    });

    const strandMat = new THREE.MeshBasicMaterial({ color: 0x2a5cb8, transparent: true, opacity: 0.72 });
    [0, Math.PI].forEach(ph => {
      const pts = Array.from({ length: 60 }, (_, i) => {
        const t = i / 59, a = t * Math.PI * 2 * TURNS + ph;
        return new THREE.Vector3(RAD * Math.cos(a), t * HGHT - HGHT / 2, RAD * Math.sin(a));
      });
      group.add(new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 180, 0.018, 6, false),
        strandMat,
      ));
    });

    const rungMat = new THREE.LineBasicMaterial({ color: 0x60A5FA, transparent: true, opacity: 0.3 });
    nodePositions.forEach((pos, i) => {
      if (i % 3 !== 0) return;
      const t = i / (N - 1), a2 = t * Math.PI * 2 * TURNS + Math.PI;
      const opp = new THREE.Vector3(RAD * Math.cos(a2), pos.y, RAD * Math.sin(a2));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([pos, opp]), rungMat));
    });

    const nodeMeshes = nodePositions.map(pos => {
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0x60A5FA, transparent: true, opacity: 0.22,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 6), glowMat);
      glow.position.copy(pos);
      group.add(glow);

      const main = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 10, 8),
        new THREE.MeshBasicMaterial({ color: 0x60A5FA })
      );
      main.position.copy(pos);
      group.add(main);
      return { glowMat };
    });

    let t = 0, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.004;
      group.rotation.y = t * 0.3;
      nodeMeshes.forEach(({ glowMat }, i) => {
        glowMat.opacity = 0.16 + 0.14 * Math.sin(t * 1.4 - i * 0.3);
      });
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width, height, flexShrink: 0 }} />;
}

// ── Phone screen contents ─────────────────────────────────────────────────────

const F  = "'Inter','Helvetica Neue',sans-serif";
const FH = "'Bebas Neue',sans-serif";

// Screen 1: Helix landing
function Screen1({ phoneW, phoneH }) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#040c1a", overflow: "hidden" }}>
      <MiniHelixCanvas width={phoneW} height={phoneH} />
      {/* Vignette */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 30%, rgba(4,12,26,0.6) 100%)",
      }} />
      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "0 16px",
      }}>
        <div style={{
          border: "1px solid rgba(59,130,246,0.4)", borderRadius: 100,
          padding: "5px 14px", marginBottom: 14,
          background: "rgba(59,130,246,0.08)",
        }}>
          <span style={{ fontSize: 8, letterSpacing: "0.28em", color: "#93C5FD", fontFamily: F, fontWeight: 500 }}>PEPTI AI</span>
        </div>
        <h2 style={{
          fontFamily: FH, fontSize: 22, letterSpacing: "0.05em",
          color: "#FFF", textAlign: "center", lineHeight: 1.1, marginBottom: 10,
          textShadow: "0 0 30px rgba(59,130,246,0.5)",
        }}>
          YOUR PEPTIDE<br />PROTOCOL
        </h2>
        <p style={{ fontSize: 9, color: "rgba(147,197,253,0.6)", fontFamily: F, textAlign: "center", marginBottom: 20, lineHeight: 1.5, maxWidth: 160 }}>
          Customized to your biology. Backed by research.
        </p>
        <div style={{
          background: "linear-gradient(135deg, #2563EB, #3B82F6)",
          borderRadius: 100, padding: "9px 20px",
          boxShadow: "0 0 20px rgba(59,130,246,0.5)",
        }}>
          <span style={{ fontFamily: FH, fontSize: 12, letterSpacing: "0.12em", color: "#FFF" }}>BUILD MY PROTOCOL</span>
        </div>
      </div>
    </div>
  );
}

// Screen 2: Quiz question
function Screen2() {
  const pills = ["Muscle & Performance", "Fat Loss", "Longevity", "Sleep", "Cognitive"];
  return (
    <div style={{ width: "100%", height: "100%", background: "#040c1a", overflow: "hidden", position: "relative" }}>
      {/* Helix glow bg */}
      <div style={{
        position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: "140%", height: "60%",
        background: "radial-gradient(ellipse, rgba(37,99,235,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Top gradient */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        background: "linear-gradient(180deg, rgba(4,12,26,0.9) 0%, transparent 100%)",
        padding: "22px 16px 40px",
      }}>
        <p style={{ fontSize: 8, letterSpacing: "0.3em", color: "rgba(96,165,250,0.4)", fontFamily: F, textAlign: "center", marginBottom: 8 }}>
          01 / 23
        </p>
        {/* Progress dots */}
        <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 18 }}>
          {Array.from({ length: 23 }, (_, i) => (
            <div key={i} style={{
              width: i === 0 ? 8 : 3, height: 3, borderRadius: 2,
              background: i === 0 ? "#3B82F6" : "rgba(96,165,250,0.15)",
            }} />
          ))}
        </div>
        <h2 style={{
          fontFamily: FH, fontSize: 17, letterSpacing: "0.04em",
          color: "#FFF", textAlign: "center", lineHeight: 1.2, maxWidth: 200, margin: "0 auto",
          textShadow: "0 0 30px rgba(37,99,235,0.6)",
        }}>
          SELECT YOUR GOALS
        </h2>
        <p style={{ fontSize: 7.5, letterSpacing: "0.18em", color: "rgba(96,165,250,0.45)", fontFamily: F, textAlign: "center", marginTop: 6 }}>
          CHOOSE 2 TO 3 IN ORDER OF PRIORITY
        </p>
      </div>
      {/* Pills */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        background: "linear-gradient(0deg, rgba(4,12,26,0.98) 70%, transparent 100%)",
        padding: "40px 12px 20px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6,
      }}>
        {pills.map((p, i) => (
          <div key={p} style={{
            background: i === 0 ? "rgba(37,99,235,0.15)" : "rgba(4,12,26,0.6)",
            border: `1px solid ${i === 0 ? "rgba(96,165,250,0.85)" : "rgba(96,165,250,0.18)"}`,
            borderRadius: 100, padding: "8px 10px", textAlign: "center",
            boxShadow: i === 0 ? "0 0 14px rgba(96,165,250,0.3)" : "none",
          }}>
            <span style={{ fontSize: 8, letterSpacing: "0.12em", color: i === 0 ? "#DBEAFE" : "rgba(147,197,253,0.55)", fontFamily: F }}>
              {p}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Screen 3: Profile / assessment progress
function Screen3() {
  const fields = [
    { label: "AGE RANGE", value: "25–34" },
    { label: "TRAINING FREQ.", value: "3–4× / WEEK" },
    { label: "EXPERIENCE", value: "SOME RESEARCH" },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: "#040c1a", overflow: "hidden", position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, padding: "28px 14px 20px",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 8, letterSpacing: "0.28em", color: "rgba(96,165,250,0.4)", fontFamily: F, marginBottom: 6 }}>YOUR ASSESSMENT</p>
          <h2 style={{ fontFamily: FH, fontSize: 20, letterSpacing: "0.04em", color: "#FFF" }}>YOUR PROFILE</h2>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, background: "rgba(59,130,246,0.12)", borderRadius: 2, marginBottom: 16,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "65%", background: "#3B82F6", borderRadius: 2 }} />
        </div>
        <p style={{ fontSize: 8, color: "rgba(96,165,250,0.4)", fontFamily: F, letterSpacing: "0.14em", marginBottom: 14 }}>15 / 23 COMPLETE</p>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {fields.map(f => (
            <div key={f.label} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(59,130,246,0.15)",
              borderRadius: 8, padding: "9px 12px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 7.5, letterSpacing: "0.16em", color: "rgba(96,165,250,0.45)", fontFamily: F }}>{f.label}</span>
              <span style={{ fontSize: 9, color: "#DBEAFE", fontFamily: F, fontWeight: 500 }}>{f.value}</span>
            </div>
          ))}
        </div>

        {/* Goals */}
        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 7.5, letterSpacing: "0.16em", color: "rgba(96,165,250,0.4)", fontFamily: F, marginBottom: 7 }}>TOP GOALS</p>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {["Muscle & Performance", "Longevity", "Sleep"].map((g, i) => (
              <div key={g} style={{
                background: "rgba(37,99,235,0.12)",
                border: "1px solid rgba(96,165,250,0.35)",
                borderRadius: 100, padding: "4px 10px",
              }}>
                <span style={{ fontSize: 7.5, color: "#93C5FD", fontFamily: F }}>{g}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Screen 4: Protocol results
function Screen4() {
  const peptides = [
    { name: "BPC-157", dose: "250mcg", purpose: "Joint repair & gut healing", color: "#3B82F6" },
    { name: "CJC-1295", dose: "100mcg", purpose: "GH release & muscle growth", color: "#8B5CF6" },
  ];
  return (
    <div style={{ width: "100%", height: "100%", background: "#040c1a", overflow: "hidden", position: "relative" }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", height: "40%",
        background: "radial-gradient(ellipse at top, rgba(37,99,235,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ padding: "26px 14px 16px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          border: "1px solid rgba(59,130,246,0.35)", borderRadius: 100,
          padding: "4px 10px", background: "rgba(59,130,246,0.08)", marginBottom: 12,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 6px rgba(59,130,246,0.9)" }} />
          <span style={{ fontSize: 7.5, letterSpacing: "0.22em", color: "#60A5FA", fontFamily: F, fontWeight: 500 }}>PROTOCOL READY</span>
        </div>

        <h2 style={{
          fontFamily: FH, fontSize: 18, letterSpacing: "0.04em", color: "#FFF",
          marginBottom: 4, lineHeight: 1.1,
          textShadow: "0 0 24px rgba(59,130,246,0.4)",
        }}>
          ELITE RECOVERY STACK
        </h2>
        <p style={{ fontSize: 8.5, color: "rgba(147,197,253,0.55)", fontFamily: F, fontWeight: 300, marginBottom: 14, lineHeight: 1.5 }}>
          Optimized for your training volume and recovery goals.
        </p>

        {peptides.map(p => (
          <div key={p.name} style={{
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(59,130,246,0.18)",
            borderRadius: 10, padding: "11px 12px", marginBottom: 8,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontFamily: FH, fontSize: 14, letterSpacing: "0.05em", color: "#DBEAFE" }}>{p.name}</span>
              <span style={{
                fontSize: 8, color: "#60A5FA", background: "rgba(59,130,246,0.12)",
                border: "1px solid rgba(59,130,246,0.3)", borderRadius: 100, padding: "2px 7px", fontFamily: F,
              }}>{p.dose}</span>
            </div>
            <span style={{ fontSize: 8.5, color: "rgba(147,197,253,0.6)", fontFamily: F }}>{p.purpose}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main PhoneMockup ──────────────────────────────────────────────────────────
const SCREEN_COUNT = 4;
const INTERVAL_MS  = 3200;

export default function PhoneMockup() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);

  // Device dimensions
  const DEVICE_W = 264;
  const DEVICE_H = 570;
  const BEZEL    = 6;
  const SCREEN_W = DEVICE_W - BEZEL * 2;
  const SCREEN_H = DEVICE_H - BEZEL * 2;

  useEffect(() => {
    const iv = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setActive(prev => (prev + 1) % SCREEN_COUNT);
        setFading(false);
      }, 350);
    }, INTERVAL_MS);
    return () => clearInterval(iv);
  }, []);

  const screens = [
    <Screen1 key="s1" phoneW={SCREEN_W} phoneH={SCREEN_H} />,
    <Screen2 key="s2" />,
    <Screen3 key="s3" />,
    <Screen4 key="s4" />,
  ];

  return (
    <div style={{
      animation: "float 5s ease-in-out infinite",
      filter: "drop-shadow(0 40px 80px rgba(59,130,246,0.18)) drop-shadow(0 0 1px rgba(59,130,246,0.3))",
    }}>
      {/* Device body */}
      <div style={{
        position: "relative",
        width: DEVICE_W, height: DEVICE_H,
        borderRadius: 50,
        background: "linear-gradient(160deg, #1c1c2e 0%, #0d0d1a 60%, #111122 100%)",
        border: "1.5px solid rgba(255,255,255,0.12)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 0 0.5px rgba(0,0,0,0.8)",
      }}>

        {/* Metallic edge highlight */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: 50, pointerEvents: "none",
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
        }} />

        {/* Left side buttons */}
        {/* Action button (mute) */}
        <div style={{
          position: "absolute", left: -3, top: 100, width: 3, height: 22,
          background: "linear-gradient(180deg, #2a2a3e, #1a1a2e)",
          borderRadius: "3px 0 0 3px",
          boxShadow: "-1px 0 3px rgba(0,0,0,0.5)",
        }} />
        {/* Volume up */}
        <div style={{
          position: "absolute", left: -3, top: 140, width: 3, height: 30,
          background: "linear-gradient(180deg, #2a2a3e, #1a1a2e)",
          borderRadius: "3px 0 0 3px",
          boxShadow: "-1px 0 3px rgba(0,0,0,0.5)",
        }} />
        {/* Volume down */}
        <div style={{
          position: "absolute", left: -3, top: 182, width: 3, height: 30,
          background: "linear-gradient(180deg, #2a2a3e, #1a1a2e)",
          borderRadius: "3px 0 0 3px",
          boxShadow: "-1px 0 3px rgba(0,0,0,0.5)",
        }} />
        {/* Right power button */}
        <div style={{
          position: "absolute", right: -3, top: 148, width: 3, height: 52,
          background: "linear-gradient(180deg, #2a2a3e, #1a1a2e)",
          borderRadius: "0 3px 3px 0",
          boxShadow: "1px 0 3px rgba(0,0,0,0.5)",
        }} />

        {/* Screen area */}
        <div style={{
          position: "absolute",
          top: BEZEL, left: BEZEL, right: BEZEL, bottom: BEZEL,
          borderRadius: 46,
          overflow: "hidden",
          background: "#040c1a",
        }}>
          {/* Screen content with fade transition */}
          <div style={{
            width: "100%", height: "100%",
            opacity: fading ? 0 : 1,
            transition: "opacity 0.35s ease",
          }}>
            {screens[active]}
          </div>

          {/* Dynamic Island */}
          <div style={{
            position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
            width: 88, height: 26, borderRadius: 14,
            background: "#000",
            zIndex: 10,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.03)",
          }} />

          {/* Bottom home indicator */}
          <div style={{
            position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
            width: 100, height: 4, borderRadius: 2,
            background: "rgba(255,255,255,0.25)",
          }} />
        </div>

        {/* Screen indicator dots */}
        <div style={{
          position: "absolute", bottom: -24, left: "50%", transform: "translateX(-50%)",
          display: "flex", gap: 5,
        }}>
          {Array.from({ length: SCREEN_COUNT }, (_, i) => (
            <div key={i} style={{
              width: i === active ? 16 : 5, height: 5, borderRadius: 3,
              background: i === active ? "#3B82F6" : "rgba(59,130,246,0.25)",
              transition: "all 0.35s ease",
              boxShadow: i === active ? "0 0 6px rgba(59,130,246,0.6)" : "none",
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}
