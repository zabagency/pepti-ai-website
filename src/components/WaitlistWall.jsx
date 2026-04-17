import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const TURNS = 2.8, RAD = 2.4, HGHT = 22, NODE_COUNT = 28;

function buildHelix(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const nodePositions = Array.from({ length: NODE_COUNT }, (_, i) => {
    const t = i / (NODE_COUNT - 1);
    return new THREE.Vector3(
      RAD * Math.cos(t * Math.PI * 2 * TURNS),
      t * HGHT - HGHT / 2,
      RAD * Math.sin(t * Math.PI * 2 * TURNS),
    );
  });

  const strandMat = new THREE.MeshBasicMaterial({ color: 0x2a5cb8, transparent: true, opacity: 0.65 });
  [0, Math.PI].forEach(ph => {
    const pts = Array.from({ length: 100 }, (_, i) => {
      const t = i / 99, a = t * Math.PI * 2 * TURNS + ph;
      return new THREE.Vector3(RAD * Math.cos(a), t * HGHT - HGHT / 2, RAD * Math.sin(a));
    });
    group.add(new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 300, 0.034, 7, false), strandMat,
    ));
  });

  const rungMat = new THREE.LineBasicMaterial({ color: 0x60A5FA, transparent: true, opacity: 0.28 });
  nodePositions.forEach((pos, i) => {
    if (i % 3 !== 0) return;
    const t = i / (NODE_COUNT - 1), a2 = t * Math.PI * 2 * TURNS + Math.PI;
    const opp = new THREE.Vector3(RAD * Math.cos(a2), pos.y, RAD * Math.sin(a2));
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([pos, opp]), rungMat));
  });

  const nodeMeshes = nodePositions.map(pos => {
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x60A5FA, transparent: true, opacity: 0.28,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 8), glowMat);
    glow.position.copy(pos);
    group.add(glow);
    const main = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), new THREE.MeshBasicMaterial({ color: 0x60A5FA }));
    main.position.copy(pos);
    group.add(main);
    return { glowMat };
  });

  return { group, nodeMeshes };
}

export default function WaitlistWall({ onSubmit }) {
  const mountRef  = useRef(null);
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [focused, setFocused] = useState(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0A0A1A);

    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 130);
    camera.position.set(0, 1, 28);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);

    const { group, nodeMeshes } = buildHelix(scene);

    const pCount = 200;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i*3]=(Math.random()-.5)*32; pPos[i*3+1]=(Math.random()-.5)*32; pPos[i*3+2]=(Math.random()-.5)*18;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: 0x60A5FA, size: 0.025, transparent: true, opacity: 0.14,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })));

    let t = 0, animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.003;
      group.rotation.y = t * 0.22;
      nodeMeshes.forEach(({ glowMat }, i) => {
        glowMat.opacity = 0.22 + 0.16 * Math.sin(t * 1.5 - i * 0.24);
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nW = el.clientWidth, nH = el.clientHeight;
      camera.aspect = nW / nH; camera.updateProjectionMatrix();
      renderer.setSize(nW, nH);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  const handleSubmit = () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => onSubmit(email.trim(), phone.trim()), 900);
  };

  const inputStyle = (field) => ({
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${focused === field ? "rgba(59,130,246,0.75)" : "rgba(59,130,246,0.2)"}`,
    borderRadius: 10,
    padding: "14px 18px",
    color: "#E2E8F0",
    fontFamily: "'Inter', sans-serif",
    fontSize: 15, fontWeight: 300,
    outline: "none",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    boxShadow: focused === field ? "0 0 20px rgba(59,130,246,0.18)" : "none",
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0A0A1A", overflow: "hidden", zIndex: 200 }}>
      <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at center, transparent 15%, rgba(10,10,26,0.75) 100%)",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px", overflowY: "auto",
      }}>
        <div style={{
          width: "100%", maxWidth: 460,
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)",
          border: "1px solid rgba(59,130,246,0.18)",
          borderRadius: 20,
          padding: "clamp(32px, 6vw, 52px) clamp(24px, 5vw, 44px)",
          boxShadow: "0 0 100px rgba(59,130,246,0.1), 0 32px 80px rgba(0,0,0,0.6)",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
        }}>
          {/* Icon */}
          <div style={{
            width: 60, height: 60, borderRadius: "50%",
            background: "rgba(59,130,246,0.1)",
            border: "1px solid rgba(59,130,246,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 22,
            boxShadow: "0 0 30px rgba(59,130,246,0.25)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(28px, 7vw, 40px)",
            letterSpacing: "0.05em", color: "#FFFFFF",
            lineHeight: 1.1, marginBottom: 12,
            textShadow: "0 0 30px rgba(59,130,246,0.35)",
          }}>
            YOUR PROTOCOL IS READY
          </h2>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(13px, 3vw, 15px)",
            fontWeight: 300, lineHeight: 1.65,
            color: "rgba(147,197,253,0.68)",
            marginBottom: 30, maxWidth: 360,
          }}>
            Join the early access list to unlock your personalized protocol and be first when we launch.
          </p>

          {/* Email */}
          <div style={{ width: "100%", marginBottom: 10 }}>
            <input
              type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="your@email.com"
              style={inputStyle("email")}
            />
          </div>

          {/* Phone */}
          <div style={{ width: "100%", marginBottom: 22 }}>
            <input
              type="tel" value={phone}
              onChange={e => setPhone(e.target.value)}
              onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
              placeholder="Phone number (optional)"
              style={inputStyle("phone")}
            />
          </div>

          {error && (
            <p style={{ color: "#F87171", fontSize: 12, marginBottom: 12, fontFamily: "'Inter',sans-serif" }}>{error}</p>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              width: "100%", padding: "17px 24px",
              background: loading ? "rgba(59,130,246,0.35)" : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
              border: "none", borderRadius: 10,
              color: "#FFFFFF",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 19, letterSpacing: "0.14em",
              cursor: loading ? "default" : "pointer",
              boxShadow: loading ? "none" : "0 0 40px rgba(59,130,246,0.45), 0 4px 16px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease", marginBottom: 16,
              animation: loading ? "none" : "glowPulse 2.8s ease-in-out infinite",
            }}
          >
            {loading ? "GENERATING YOUR PROTOCOL..." : "UNLOCK MY PROTOCOL →"}
          </button>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 12, color: "rgba(147,197,253,0.4)",
            lineHeight: 1.7,
          }}>
            200+ people already on the list &nbsp;·&nbsp; No spam &nbsp;·&nbsp; Unsubscribe anytime
          </p>
        </div>
      </div>
    </div>
  );
}
