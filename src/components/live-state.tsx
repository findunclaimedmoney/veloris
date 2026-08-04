import { useState, useEffect, useRef } from "react";

type Props = { onEnd: () => void };

export default function LiveState({ onEnd }: Props) {
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onEnd();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onEnd]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="min-h-screen bg-[#06050a] text-white p-6 flex flex-col items-center justify-center">
      <div className="border border-white/10 rounded-2xl p-12 text-center bg-[rgba(22,20,31,0.85)]">
        <h1 className="text-3xl font-bold mb-4">💖 Live with Jess</h1>
        <div className="text-6xl font-mono mb-8 text-pink-400">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
        <p className="text-slate-400 mb-8">Enjoy your private 5-minute session.</p>
        <button 
          onClick={onEnd}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold"
        >
          End Session Early
        </button>
      </div>
    </div>
  );
}