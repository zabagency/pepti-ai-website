import { useState, useRef, useEffect } from "react";
import Nav from "./components/Nav.jsx";
import HeroSection from "./components/HeroSection.jsx";
import ValuePropsSection from "./components/ValuePropsSection.jsx";
import QuizCTASection from "./components/QuizCTASection.jsx";
import PeptiQuiz from "./components/PeptiQuiz.jsx";
import WaitlistGate from "./components/WaitlistGate.jsx";
import ProtocolResults from "./components/ProtocolResults.jsx";
import { createSession, trackQuizAnswers } from "./lib/trackSession.js";

// mode: "page" | "quiz" | "waitlist" | "results"
export default function App() {
  const [mode, setMode]           = useState("page");
  const [quizAnswers, setQuizAnswers] = useState(null);
  const [email, setEmail]         = useState("");
  const [sessionId, setSessionId] = useState(null);
  const quizAnchorRef = useRef(null);

  // Lock/unlock body scroll based on mode
  useEffect(() => {
    document.body.style.overflow = mode === "page" ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [mode]);

  const startQuiz = () => {
    quizAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Brief delay so scroll feels intentional before quiz overlay appears
    setTimeout(() => setMode("quiz"), 300);
  };

  const handleQuizComplete = (answers) => {
    setQuizAnswers(answers);
    setMode("waitlist");
  };

  const handleWaitlistSubmit = async (emailVal) => {
    const resolvedEmail = emailVal ?? "";
    console.log('[app] handleWaitlistSubmit → email:', resolvedEmail, '| quizAnswers keys:', quizAnswers ? Object.keys(quizAnswers).length : 0);
    setEmail(resolvedEmail);
    const sid = await createSession(resolvedEmail, navigator.userAgent);
    console.log('[app] sessionId returned:', sid);
    setSessionId(sid);
    if (sid && quizAnswers) {
      trackQuizAnswers(sid, quizAnswers);
    } else {
      console.warn('[app] trackQuizAnswers skipped — sid:', sid, '| quizAnswers:', !!quizAnswers);
    }
    setMode("results");
  };

  return (
    <>
      {/* ── Scrollable marketing page ── */}
      {mode === "page" && (
        <div style={{ background: "#0A0A1A", minHeight: "100vh" }}>
          <Nav onJoinWaitlist={startQuiz} />
          <HeroSection onStart={startQuiz} />
          <ValuePropsSection />
          <QuizCTASection onStart={startQuiz} />
          {/* Scroll sentinel — quiz overlay activates when we reach here */}
          <div ref={quizAnchorRef} style={{ height: 1 }} />
        </div>
      )}

      {/* ── Full-screen fixed overlays ── */}
      {mode === "quiz"     && <PeptiQuiz onComplete={handleQuizComplete} />}
      {mode === "waitlist" && <WaitlistGate onUnlock={handleWaitlistSubmit} />}
      {mode === "results"  && <ProtocolResults quizAnswers={quizAnswers} email={email} sessionId={sessionId} />}
    </>
  );
}
