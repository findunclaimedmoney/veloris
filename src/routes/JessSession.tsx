import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PaymentState from "../components/payment-state";
import LoadingState from "../components/loading-state";
import LiveState from "../components/live-state";
import CompletedState from "../components/completed-state";

type SessionStage = "payment" | "loading" | "live" | "completed";

export default function JessSession() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [stage, setStage] = useState<SessionStage>(
    sessionId ? "loading" : "payment"
  );
  const navigate = useNavigate();

  // If a session_id is passed in the URL, we treat it as a verified payment
  // and start loading the live session immediately.
  const handlePayment = () => {
    setStage("loading");
    // Simulate a 2-second payment verification, then go live
    setTimeout(() => {
      setStage("live");
    }, 2000);
  };

  const handleEndSession = () => {
    setStage("completed");
  };

  const handleReset = () => {
    navigate("/rooms");
  };

  // ─── Render the correct stage ──────────────────────────────

  return (
    <div className="min-h-screen bg-[#06050a]">
      {stage === "payment" && <PaymentState onPay={handlePayment} loading={false} />}
      
      {stage === "loading" && <LoadingState />}
      
      {stage === "live" && <LiveState onEnd={handleEndSession} />}
      
      {stage === "completed" && (
        <CompletedState
          sessionId={sessionId || "simulated_session_123"}
          onReset={handleReset}
        />
      )}
    </div>
  );
}