import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, User, Video, Shield } from "lucide-react";

const glassPanel = "bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl";
const inputClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[11px] text-slate-400 block mb-1.5 font-medium";

export default function Login() {
  const [role, setRole] = useState<"user" | "creator">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(role === "creator" ? "/creator" : "/rooms");
  };

  return (
    <div className="min-h-screen bg-[#06050a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />
      <div className={`max-w-md w-full ${glassPanel} p-8 shadow-2xl relative z-10 border-pink-500/20 space-y-6`}>
        <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
          <button onClick={() => setRole("user")} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${role === "user" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"}`}>
            <User className="w-4 h-4" /> User
          </button>
          <button onClick={() => setRole("creator")} className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${role === "creator" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20" : "text-slate-400 hover:text-white"}`}>
            <Video className="w-4 h-4" /> Creator
          </button>
        </div>
        <h2 className="font-serif text-xl font-bold text-white">{role === "creator" ? "Creator Sign In" : "Welcome Back"}</h2>
        <p className="text-xs text-slate-400 mt-1">{role === "creator" ? "Access live studio and payout tools." : "Enter your email and password to continue."}</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className={labelClass}>Email address</label>
            <div className="relative"><Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" /><input type="email" placeholder="you@example.com" className={`${inputClass} pl-10`} required /></div>
          </div>
          <div><label className={labelClass}>Password</label>
            <div className="relative"><Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" /><input type="password" placeholder="••••••••" className={`${inputClass} pl-10`} required /></div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-opacity">
            <span>{role === "creator" ? "Sign In as Creator" : "Sign In"}</span><ArrowRight className="w-4 h-4" />
          </button>
        </form>
        <div className="text-center text-[11px] text-slate-400">Don't have an account? <Link to="/register" className="text-pink-400 hover:text-pink-300 font-semibold">Register now</Link></div>
      </div>
    </div>
  );
}
