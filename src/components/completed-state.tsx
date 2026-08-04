import { Link } from "react-router-dom";

type Props = { sessionId: string; onReset: () => void };

export default function CompletedState({ sessionId, onReset }: Props) {
  return (
    <div className="min-h-screen bg-[#06050a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center border border-white/10 rounded-2xl p-8 bg-[rgba(22,20,31,0.85)]">
        <div className="text-4xl mb-4">💖</div>
        <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
        <p className="text-slate-400 mb-6">Hope you enjoyed your time with Jess!</p>
        <button
          onClick={onReset}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 font-bold text-white mb-3"
        >
          Book Another Session
        </button>
        <Link to="/" className="text-xs text-slate-500 hover:text-slate-300">
          &larr; Back to Lensflow
        </Link>
      </div>
    </div>
  );
}