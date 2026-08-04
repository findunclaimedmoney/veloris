import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Video, Shield, Lock, Mail, ArrowRight } from "lucide-react";

const SLIDES = [
  {
    name: "Mia",
    src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "Jess",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "Monica",
    src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "Ava",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1280&q=80",
  },
  {
    name: "Natalie",
    src: "/images/natalie.png",
  },
  {
    name: "Lily",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0a3b3c8ad?auto=format&fit=crop&w=1280&q=80",
  },
];

// --- LOGIN CARD COMPONENT EMBEDDED HERE ---
const glassPanel = "bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl";
const inputClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[11px] text-slate-400 block mb-1.5 font-medium";

function LoginCard() {
  const [role, setRole] = useState<"user" | "creator">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "creator") {
      navigate("/creator");
    } else {
      navigate("/user/dashboard");
    }
  };

  return (
    <div className={`max-w-md w-full ${glassPanel} p-8 shadow-2xl relative z-10 border-pink-500/20 space-y-6 mx-auto`}>
      {/* Role Toggle Tabs */}
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

      {/* Dynamic Title */}
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

      {/* Form Fields - Email and Password are HERE */}
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
              placeholder={role === "creator" ? "creator@lensflow.app" : "user@example.com"}
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
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-opacity cursor-pointer mt-2"
        >
          <span>{role === "creator" ? "Sign In as Creator" : "Sign In as User"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-[11px] text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-pink-400 hover:text-pink-300 font-semibold">
          Register now
        </Link>
      </div>

      {/* Security Footer Note */}
      <div className="pt-2 border-t border-white/5 flex items-center justify-center gap-2 text-[10px] text-slate-500">
        <Shield className="w-3.5 h-3.5 text-emerald-400" />
        <span>End-to-End Encrypted &bull; Secure Authentication</span>
      </div>
    </div>
  );
}
// --- END LOGIN CARD ---

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center">
      {/* Slideshow background */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.name}
            className="absolute inset-0 bg-cover bg-[center_20%] transition-opacity duration-[1200ms]"
            style={{
              backgroundImage: `url('${slide.src}')`,
              opacity: i === current ? 1 : 0,
            }}
          >
            <div className="absolute left-6 bottom-6 rounded-full bg-black/50 px-4 py-2 text-sm text-white tracking-wider">
              {slide.name}
            </div>
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#06050a] via-[#06050a]/55 to-black/35" />

      {/* Content - Side by Side Layout */}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT SIDE: Text and Buttons */}
        <div className="text-center lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 text-base font-semibold text-emerald-300">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            {"She's online right now"}
          </div>

          <h1 className="mb-4 max-w-lg font-serif text-[clamp(2.75rem,8vw,4.5rem)] font-bold leading-[1.05] text-white">
            {"She's waiting"}
            <br />
            <span className="text-pink-400">for you.</span>
          </h1>

          <p className="mb-7 max-w-md text-[clamp(1.05rem,2.5vw,1.25rem)] leading-relaxed text-slate-200">
            Private live sessions. Cinematic rooms. Real voice. Pay in crypto — what you see is who you get.
          </p>

          <div className="mb-3 flex flex-wrap gap-3">
            <a
              href="#companions"
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-7 py-4 text-lg font-bold text-white no-underline transition hover:brightness-110"
            >
              Meet companions
            </a>
            <Link
              to="/jess-session"
              className="rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-lg font-bold text-white no-underline transition hover:bg-white/20"
            >
              One-time session
            </Link>
          </div>

          <p className="text-sm text-slate-400">
            Packages from A$10 - USDT / USDC - 18+
          </p>
        </div>

        {/* RIGHT SIDE: Login Card */}
        <div className="w-full">
          <LoginCard />
        </div>
      </div>
    </section>
  );
}