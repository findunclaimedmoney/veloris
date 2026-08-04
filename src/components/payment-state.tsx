import { Link } from "react-router-dom";

type Props = { onPay: () => void; loading: boolean };

export default function PaymentState({ onPay, loading }: Props) {
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center p-4 bg-[#06050a]">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Unlock Your Session</h2>
        <p className="text-slate-400 mb-6">A$10 for 5 minutes with Jess</p>
        <button
          onClick={onPay}
          disabled={loading}
          className="inline-block px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg hover:shadow-2xl transition"
        >
          {loading ? "Connecting..." : "Pay Now"}
        </button>
        <div className="mt-4 text-center">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300">
            &larr; Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}