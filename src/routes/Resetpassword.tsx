"use client";

import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Lock, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

const inputClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[11px] text-slate-400 block mb-1.5 font-medium";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (!resetToken) {
    return (
      <div className="min-h-screen bg-[#06050a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
        <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-white">Invalid reset link</h2>
                <p className="text-xs text-slate-400">This password reset link is missing or invalid</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 text-center">
              The link you used appears to be incomplete. Please request a new password reset email.
            </p>
            <Link
              to="/forgot-password"
              className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl text-center hover:opacity-90 transition-opacity"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06050a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white">New password</h2>
              <p className="text-xs text-slate-400">Enter your new password below</p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-lg">Password reset!</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Your password has been successfully updated.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Log in with new password
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className={labelClass}>New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    autoFocus
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={inputClass + " pl-10"}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Resetting...
                  </>
                ) : (
                  "Reset password"
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
