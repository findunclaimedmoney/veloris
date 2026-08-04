"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Mail, ArrowLeft, Shield } from "lucide-react";

const glassPanel = "bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl";
const inputClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[11px] text-slate-400 block mb-1.5 font-medium";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "creator">("user");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Wire registration backend via Convex action / mutation
    navigate(role === "creator" ? "/creator" : "/user/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#06050a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className={`max-w-md w-full ${glassPanel} p-8 shadow-2xl relative z-10 border-pink-500/20 space-y-6`}>
        <div className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-white" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Create Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose user or creator and sign in with your email and password.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`rounded-xl px-4 py-3 text-xs font-semibold transition ${role === "user" ? "bg-pink-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
          >
            User Account
          </button>
          <button
            type="button"
            onClick={() => setRole("creator")}
            className={`rounded-xl px-4 py-3 text-xs font-semibold transition ${role === "creator" ? "bg-pink-500 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"}`}
          >
            Creator Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-opacity"
          >
            <Shield className="w-4 h-4" />
            Create Account & Continue
          </button>
        </form>
      </div>
    </div>
  );
}
