"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Upload, Save, ArrowLeft } from "lucide-react";

const glassPanel = "bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-2xl";
const inputClass = "bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[11px] text-slate-400 block mb-1.5 font-medium";

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: In the future, you will save this data to the database using useMutation(api.users.updateProfile)
    // For now, we just move them to their dashboard.
    navigate("/user/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#06050a] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20" />

      <div className={`max-w-md w-full ${glassPanel} p-8 shadow-2xl relative z-10 border-pink-500/20 space-y-6`}>
        
        <div className="flex items-center gap-2 text-slate-400 cursor-pointer hover:text-white" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Create Your Account</h2>
          <p className="text-xs text-slate-400 mt-1">
            Set up your profile to start exploring cinematic rooms.
          </p>
        </div>

        <form onSubmit={handleCompleteProfile} className="space-y-5">
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-pink-500/50 transition-colors">
              <User className="w-8 h-8 text-slate-500" />
            </div>
            <button type="button" className="text-[10px] text-pink-400 underline">
              Upload Profile Picture
            </button>
          </div>

          <div>
            <label className={labelClass}>Display Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. John Doe"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Username</label>
            <div className="relative">
              <span className="text-slate-500 absolute left-3.5 top-3.5 text-xs">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="unique_handle"
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 hover:opacity-90 transition-opacity cursor-pointer mt-2"
          >
            <Save className="w-4 h-4" />
            Create My Account & Enter
          </button>
        </form>
      </div>
    </div>
  );
}