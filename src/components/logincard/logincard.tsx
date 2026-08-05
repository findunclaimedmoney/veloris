import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Video, Shield, Lock, Mail, ArrowRight } from "lucide-react";

const glassPanel = "bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl";
const inputClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[11px] text-slate-400 block mb-1.5 font-medium";

export default function LoginCard() {
  const [role, setRole] = useState<"user" | "creator">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "creator") {
      navigate("/creator");
    } else {
      navigate("/rooms");
    }
  };

  return (
    <div className={`max-w-md w-full ${glassPanel} p-8 shadow-2xl relative z-10 border-pink-500/20 space-y-6`}>
      <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5">
        <button
          type="button"
          onClick={() => setRole("user")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            role === "user"
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <User className="w-4 h-4" />
          User / Viewer
        </button>

        <button
          type="button"
          onClick={() => setRole("creator")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            role === "creator"
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4" />
          Creator Studio
        </button>
      </div>

      <div>
        <h2 className="font-serif text-xl font-bold text-white">
          {role === "creator" ? "Creator Sign In" : "Welcome Back"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {role === "creator" 
            ? "Access your secure live stage, CGI privacy shields, and payout routing." 
            : "Discover live cinematic rooms and private encrypted connections."}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className={labelClass}>Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
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
              placeholder="••••••••"
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-opacity cursor-pointer mt-2"
        >
          <span>{role === "creator" ? "Enter Creator Studio" : "Sign In as User"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
      
      <div className="pt-4 text-center text-xs text-slate-400">
        Don't have an account?{" "}
        <button onClick={() => navigate("/onboarding")} className="text-pink-400 hover:underline">
          Register now
        </button>
      </div>

      <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-slate-500">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span>End-to-End Encrypted &bull; Secure Authentication</span>
      </div>
    </div>
  );
}
