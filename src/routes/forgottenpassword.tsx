"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";

const inputClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[11px] text-slate-400 block mb-1.5 font-medium";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#06050a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/login" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Log In
        </Link>

        <div className="bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Reset password</h2>
              <p className="text-xs text-slate-400">We'll send you a link to reset it</p>
            </div>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
                If an account exists with that email, you'll receive a password reset link shortly.
              </div>
              <Link
                to="/login"
                className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Back to Log In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className={labelClass}>Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    autoFocus
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass + " pl-10"}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-opacity"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>;
}
