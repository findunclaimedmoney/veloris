import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";

const inputClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[11px] text-slate-400 block mb-1.5 font-medium";

export default function Register() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#06050a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />
      <div className="w-full max-w-md bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white"><UserPlus className="w-5 h-5" /></div>
          <div><h2 className="font-serif text-xl font-bold text-white">Create Account</h2><p className="text-xs text-slate-400">Join Lensflow today</p></div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className={labelClass}>Display Name</label><div className="relative"><UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" className={`${inputClass} pl-10`} required /></div></div>
          <div><label className={labelClass}>Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={`${inputClass} pl-10`} required /></div></div>
          <div><label className={labelClass}>Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={`${inputClass} pl-10`} required /></div></div>
          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-opacity" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account"}
          </button>
        </form>
        <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">Already have an account? <Link to="/login" className="text-pink-400 hover:underline">Log in</Link></div>
      </div>
    </div>
  );
}
