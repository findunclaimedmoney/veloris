"use client";

import LoginCard from "@/components/logincard/LoginCard";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#06050a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <Link to="/" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
          ← Back to Lensflow
        </Link>

        <LoginCard />
      </div>
    </div>
  );
}
