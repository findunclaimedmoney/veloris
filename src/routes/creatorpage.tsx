"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api.js";
import {
  User,
  Video,
  Camera,
  Mic,
  Monitor,
  Coins,
  Clock,
  Rocket,
  Upload,
  Shield,
  CircleDot,
  Sparkles,
  CreditCard,
  DollarSign,
  Power,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

type PanelId =
  | "profile"
  | "stage"
  | "camera"
  | "mic"
  | "screen"
  | "earn"
  | "time"
  | "golive";

const NAV_ITEMS: { id: PanelId; label: string; icon: typeof User }[] = [
  { id: "profile", label: "Profile·KYC", icon: User },
  { id: "stage", label: "Live Stage", icon: Video },
  { id: "camera", label: "4K Cam·HD Photos", icon: Camera },
  { id: "mic", label: "Mic·Voice Control", icon: Mic },
  { id: "screen", label: "Screen Modes", icon: Monitor },
  { id: "earn", label: "Earn·Crypto", icon: Coins },
  { id: "time", label: "Time·Monitoring", icon: Clock },
  { id: "golive", label: "Go-Live & Payouts", icon: Rocket },
];

const glassPanel =
  "bg-[rgba(16,14,24,0.92)] backdrop-blur-lg border border-white/10 rounded-xl";
const inputClass =
  "bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white w-full outline-none focus:border-pink-500/50 transition-colors";
const labelClass = "text-[10px] text-slate-500 block mb-1";
const btnAccent =
  "bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-medium px-4 py-2 rounded-lg cursor-pointer hover:opacity-90 transition-opacity";

// ─── Header Component ──────────────────────────────────────────

function Header({ isLive, broadcastTime, isAvatar, setIsAvatar }: { isLive: boolean; broadcastTime: string; isAvatar: boolean; setIsAvatar: (val: boolean) => void }) {
  return (
    <header className={`h-14 flex items-center justify-between px-4 lg:px-6 ${glassPanel} rounded-none border-x-0 border-t-0 z-40 relative`}>
      {/* Clickable Home Logo */}
      <Link to="/" className="flex items-center gap-3 group cursor-pointer">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center font-serif font-bold text-sm group-hover:opacity-90 transition-opacity">
          L
        </div>
        <span className="text-sm font-medium text-white hidden sm:inline group-hover:text-pink-400 transition-colors">
          Lensflow Hub &larr; Home
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          to="/rooms"
          className="text-[10px] bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-medium"
        >
          🌐 View Live Directory
        </Link>

        <button
          onClick={() => setIsAvatar(!isAvatar)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
            isAvatar 
              ? 'bg-purple-500/25 border-purple-500/60 text-purple-300 hover:bg-purple-500/35' 
              : 'bg-emerald-500/25 border-emerald-500/60 text-emerald-300 hover:bg-emerald-500/35'
          }`}
        >
          {isAvatar ? '🤖 AI Avatar Mode' : '👤 Live Human Mode'}
        </button>

        <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold border ${isLive ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`} />
          {isLive ? `LIVE • ${broadcastTime}` : "OFFLINE"}
        </div>
      </div>
    </header>
  );
}

// ─── Sidebar Component ─────────────────────────────────────────

function Sidebar({ active, setActive }: { active: PanelId; setActive: (id: PanelId) => void }) {
  return (
    <>
      <aside className="hidden lg:flex lg:w-64 flex-col gap-1.5 p-3 overflow-y-auto border-r border-white/10 bg-[rgba(6,5,10,0.4)]">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
                  : "border border-white/[0.08] bg-[rgba(16,14,24,0.92)] text-slate-300 hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex overflow-x-auto gap-1 px-2 py-2 bg-[rgba(6,5,10,0.95)] backdrop-blur-lg border-t border-white/10">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex flex-col items-center gap-0.5 min-w-[56px] px-2 py-1.5 rounded-lg text-[9px] cursor-pointer transition-all ${
                isActive ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white" : "text-slate-400"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="truncate max-w-[52px]">{item.label.split("·")[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

// ─── Profile Panel ─────────────────────────────────────────────

function ProfilePanel() {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-lg font-semibold">Profile · KYC</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${glassPanel} p-4 space-y-3`}>
          <h3 className="text-xs font-medium text-slate-300">Photo &amp; Username</h3>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-6 h-6 text-slate-500" />
            </div>
            <button className={`${btnAccent} text-[10px] px-3 py-1.5`}>
              <Upload className="w-3 h-3 inline mr-1" />
              Upload
            </button>
          </div>
          <div><label className={labelClass}>Username</label><input className={inputClass} placeholder="creator_handle" /></div>
          <div><label className={labelClass}>Display name</label><input className={inputClass} placeholder="Your display name" /></div>
          <div><label className={labelClass}>Email</label><input className={inputClass} placeholder="you@example.com" /></div>
        </div>

        <div className={`${glassPanel} p-4 space-y-3`}>
          <h3 className="text-xs font-medium text-slate-300">Crypto Wallets</h3>
          <div><label className={labelClass}>BTC address</label><input className={inputClass} placeholder="bc1q..." /></div>
          <div><label className={labelClass}>ETH address</label><input className={inputClass} placeholder="0x..." /></div>
          <div>
            <label className={labelClass}>Stablecoin network</label>
            <select className={inputClass}>
              <option value="TRC20">TRC20</option>
              <option value="ERC20">ERC20</option>
              <option value="SOL">SOL</option>
            </select>
          </div>
          <div><label className={labelClass}>Stablecoin address</label><input className={inputClass} placeholder="Wallet address" /></div>
        </div>

        <div className={`${glassPanel} p-4 space-y-3`}>
          <h3 className="text-xs font-medium text-slate-300">Bank &amp; PayID</h3>
          <div><label className={labelClass}>Account name</label><input className={inputClass} placeholder="John Smith" /></div>
          <div><label className={labelClass}>BSB</label><input className={inputClass} placeholder="000-000" /></div>
          <div><label className={labelClass}>Account number</label><input className={inputClass} placeholder="12345678" /></div>
          <div><label className={labelClass}>PayID</label><input className={inputClass} placeholder="you@email.com" /></div>
        </div>
      </div>
    </div>
  );
}

// ─── Live Stage Panel ──────────────────────────────────────────

function LiveStagePanel({ videoRef, canvasRef, aiLoaded, isLive, setIsLive, isCamActive, setIsCamActive, cgiBg, setCgiBg, setLiveStatus, isAvatar }: any) {
  const [showRoadmap, setShowRoadmap] = useState(true);
  const cgiBgRef = useRef(cgiBg);
  const cameraUtilsRef = useRef<any>(null);

  useEffect(() => {
    cgiBgRef.current = cgiBg;
  }, [cgiBg]);

  const startSecureCam = async () => {
    if (!aiLoaded) {
      alert("AI Models are still loading. Please wait a few seconds and try again.");
      return;
    }
    const w = window as any;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        stream.getAudioTracks().forEach((t: any) => t.enabled = false);

        const selfieSegmentation = new w.SelfieSegmentation({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        });
        selfieSegmentation.setOptions({ modelSelection: 1 });
        selfieSegmentation.onResults(onCgiResults);

        cameraUtilsRef.current = new w.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) await selfieSegmentation.send({ image: videoRef.current });
          },
          width: 1280,
          height: 720
        });
        cameraUtilsRef.current.start();
        setIsCamActive(true);
        setShowRoadmap(false);
      }
    } catch (err) {
      console.error(err);
      alert("Camera permission denied or error occurred.");
    }
  };

  const stopSecureCam = async () => {
    if (cameraUtilsRef.current) cameraUtilsRef.current.stop();
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track: any) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setIsCamActive(false);
    setIsLive(false);
    try {
      await setLiveStatus({ isLive: false, activeRoom: "Offline", isAvatar });
    } catch (err) {
      console.error("Failed to update status offline", err);
    }
  };

  const toggleLiveState = async () => {
    if (!isCamActive && !isLive) {
      alert("Start camera first");
      return;
    }
    const nextLive = !isLive;
    setIsLive(nextLive);
    try {
      await setLiveStatus({
        isLive: nextLive,
        activeRoom: cgiBg,
        isAvatar,
      });
    } catch (err) {
      console.error("Failed to sync live status to database", err);
    }
  };

  const onCgiResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;

    // ── YOUR 4 UNSPLASH ROOM IMAGES ──
    const roomImages: Record<string, string> = {
      bedroom: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1280&q=80",
      dungeon: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1280&q=80",
      penthouse: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1280&q=80",
      classic: "https://images.unsplash.com/photo-1505693416388-b5a03a60d834?auto=format&fit=crop&w=1280&q=80",
    };
    // ─────────────────────────────────

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-in';
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'destination-atop';
    if (cgiBgRef.current === 'blur') {
      ctx.filter = 'blur(15px) brightness(0.7)';
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';
    } else {
      const bgImgUrl = roomImages[cgiBgRef.current];
      if (bgImgUrl) {
        let bgImg = (window as any).__cachedRooms?.[cgiBgRef.current];
        if (!bgImg) {
          bgImg = new Image();
          bgImg.crossOrigin = "anonymous";
          bgImg.src = bgImgUrl;
          if (!(window as any).__cachedRooms) (window as any).__cachedRooms = {};
          (window as any).__cachedRooms[cgiBgRef.current] = bgImg;
        }
        if (bgImg.complete) {
          ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = "#121018";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
    }
    ctx.restore();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold">Live Stage & CGI</h2>
          <p className="text-[11px] text-slate-400">Edge AI Privacy Shield & Virtual Set Active</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={cgiBg} 
            onChange={(e) => setCgiBg(e.target.value)}
            className="bg-pink-900/30 border border-pink-500/50 text-amber-400 rounded-lg px-2 py-1.5 text-xs font-bold outline-none cursor-pointer"
          >
            <option value="blur" className="bg-[#06050a] text-amber-400">🛡️ Privacy Blur</option>
            <option value="bedroom" className="bg-[#06050a] text-amber-400">Red Room</option>
            <option value="dungeon" className="bg-[#06050a] text-amber-400">Modern Penthouse</option>
            <option value="penthouse" className="bg-[#06050a] text-amber-400">Lips Lounge</option>
            <option value="classic" className="bg-[#06050a] text-amber-400">Classic Bedroom</option>
          </select>
          
          {!isCamActive ? (
             <button onClick={startSecureCam} className={btnAccent} disabled={!aiLoaded}>
               {aiLoaded ? "Start Secure Camera" : "Loading AI..."}
             </button>
          ) : (
             <button onClick={stopSecureCam} className="bg-red-600/80 hover:bg-red-500 text-white text-xs font-medium px-4 py-2 rounded-lg">Stop Camera</button>
          )}

          <button
            onClick={toggleLiveState}
            className={`${isLive ? "bg-red-600 animate-pulse" : "bg-gradient-to-r from-emerald-500 to-teal-500"} text-white text-xs font-bold px-4 py-2 rounded-lg transition-all`}
          >
            {isLive ? "● LIVE (Active)" : "Go Live"}
          </button>
        </div>
      </div>

      <div className={`${glassPanel} aspect-video flex flex-col items-center justify-center relative overflow-hidden shadow-2xl shadow-pink-500/10`}>
        <video ref={videoRef} className="hidden" playsInline autoPlay muted />
        <canvas ref={canvasRef} className={`w-full h-full object-cover absolute inset-0 z-0 ${isCamActive ? 'block' : 'hidden'}`} />

        {!isCamActive && showRoadmap && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-6 z-30">
            <div className="max-w-md w-full bg-[#121018] border border-pink-500/30 rounded-2xl p-6 shadow-2xl shadow-pink-500/20 text-left space-y-4 relative">
              <button onClick={() => setShowRoadmap(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm">✕</button>
              <div className="flex items-center gap-2 text-pink-400 font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Lensflow Creator Guide</span>
              </div>
              <h3 className="serif text-lg font-bold text-white">How Your Virtual Studio Works</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <p><strong>Choose room</strong> from the dropdown (e.g. The Bedroom or Penthouse).</p>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <p>Click <strong className="text-pink-400">Start Secure Camera</strong> to replace your background with a clean virtual set.</p>
                </div>
                <div className="flex items-start gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <p>Go live in the <strong className="text-amber-400">Go-Live & Payouts</strong> tab.</p>
                </div>
              </div>
              <button onClick={() => setShowRoadmap(false)} className={`${btnAccent} w-full py-2.5 text-center font-bold`}>
                Got it, let's start!
              </button>
            </div>
          </div>
        )}

        {isLive && isCamActive && (
          <div className="absolute top-3 left-3 flex items-center gap-2 z-20 bg-black/60 px-3 py-1.5 rounded-full border border-red-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="text-[10px] text-red-400 font-bold tracking-wider">BROADCASTING LIVE</span>
          </div>
        )}

        {!isCamActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
            <span className="text-4xl mb-2 opacity-50">📷</span>
            <p className="text-xs font-semibold text-slate-400">Studio Offline</p>
            <p className="text-[10px] text-slate-500 mt-1">Click <span className="text-pink-400 font-bold">Start Secure Camera</span> above to launch</p>
            <button onClick={() => setShowRoadmap(true)} className="mt-3 text-[10px] text-pink-400 underline cursor-pointer hover:text-pink-300">
              Show Studio Guide & Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── GoLive Panel ──────────────────────────────────────────────

function GoLivePanel({ isLive, setIsLive, isCamActive, broadcastTime, cgiBg, setLiveStatus, isAvatar }: any) {
  const [payIdActive, setPayIdActive] = useState(true);
  const [stripeActive, setStripeActive] = useState(true);
  const [paypalActive, setPaypalActive] = useState(true);
  const [cryptoActive, setCryptoActive] = useState(true);

  const handleToggleBroadcast = async () => {
    if (!isCamActive && !isLive) {
      alert("Please start your Secure Camera in the Live Stage tab first!");
      return;
    }
    const nextLive = !isLive;
    setIsLive(nextLive);
    try {
      await setLiveStatus({
        isLive: nextLive,
        activeRoom: nextLive ? cgiBg : "Offline",
        isAvatar,
      });
    } catch (err) {
      console.error("Failed to sync broadcast status", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl font-bold">Go-Live Setup & Payout Center</h2>
          <p className="text-[11px] text-slate-400">Manage your front-page broadcast status and multi-payment routing</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Total Revenue:</span>
          <span className="text-sm font-bold text-emerald-400 font-mono">0.00 USDT / AUD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${glassPanel} p-5 space-y-4 border-pink-500/20`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Power className="w-4 h-4 text-pink-400" />
              Front-Page Broadcast Status
            </h3>
            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${isLive ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-slate-800 text-slate-400'}`}>
              {isLive ? 'PUBLICLY VISIBLE' : 'OFFLINE'}
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Toggle this switch when you are ready to display your live feed on the main Lensflow directory.
          </p>

          <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Broadcast Duration:</span>
              <span className="font-mono font-bold text-amber-400">{broadcastTime}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Camera Shield:</span>
              <span className={`font-bold ${isCamActive ? 'text-emerald-400' : 'text-slate-500'}`}>{isCamActive ? 'Protected & Active' : 'Not Started'}</span>
            </div>
          </div>

          <button
            onClick={handleToggleBroadcast}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
              isLive ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30' : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isLive ? "🔴 Stop Broadcast & Take Offline" : "🚀 Go Live & Publish to Front Page"}
          </button>
        </div>

        <div className={`${glassPanel} p-5 space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              Accepted Payment Gateways
            </h3>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Stripe & PayID Linked
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Ensure customers never bounce due to payment restrictions. All options route funds directly to your connected creator account.
          </p>

          <div className="space-y-2.5">
            <label className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded-lg cursor-pointer hover:border-pink-500/50">
              <div className="flex items-center gap-2.5 text-xs text-white">
                <CreditCard className="w-4 h-4 text-pink-400" />
                <span>Credit Card, Apple Pay &amp; Google Pay (Stripe)</span>
              </div>
              <input type="checkbox" checked={stripeActive} onChange={() => setStripeActive(!stripeActive)} className="accent-pink-500" />
            </label>

            <label className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded-lg cursor-pointer hover:border-pink-500/50">
              <div className="flex items-center gap-2.5 text-xs text-white">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span>Custom PayID (Discreet Statement Routing)</span>
              </div>
              <input type="checkbox" checked={payIdActive} onChange={() => setPayIdActive(!payIdActive)} className="accent-pink-500" />
            </label>

            <label className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded-lg cursor-pointer hover:border-pink-500/50">
              <div className="flex items-center gap-2.5 text-xs text-white">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>PayPal Secure Checkout</span>
              </div>
              <input type="checkbox" checked={paypalActive} onChange={() => setPaypalActive(!paypalActive)} className="accent-pink-500" />
            </label>

            <label className="flex items-center justify-between bg-white/5 border border-white/10 p-2.5 rounded-lg cursor-pointer hover:border-pink-500/50">
              <div className="flex items-center gap-2.5 text-xs text-white">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Crypto Stablecoins (USDT / TRC20 / SOL)</span>
              </div>
              <input type="checkbox" checked={cryptoActive} onChange={() => setCryptoActive(!cryptoActive)} className="accent-pink-500" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Camera Panel ──────────────────────────────────────────────

function CameraPanel({ canvasRef, photoUrl, setPhotoUrl }: any) {
  const takePhoto = () => {
    if (!canvasRef.current) {
      alert("Start the Secure Camera in the Live Stage tab first.");
      return;
    }
    const imgData = canvasRef.current.toDataURL("image/jpeg", 0.92);
    setPhotoUrl(imgData);
  };
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-lg font-semibold">HD Photos Buffer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${glassPanel} p-4 space-y-3`}>
          <h3 className="text-xs font-medium text-slate-300">Protected Capture</h3>
          <p className="text-[11px] text-slate-400 mb-2">Capture pulls securely from masked CGI feed.</p>
          <button onClick={takePhoto} className={`${btnAccent} w-full py-2.5`}><CircleDot className="w-3 h-3 inline mr-1" /> Capture HD Photo</button>
        </div>
        <div className={`${glassPanel} p-4 space-y-3`}>
          <h3 className="text-xs font-medium text-slate-300">Preview</h3>
          <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center border border-white/10 overflow-hidden relative">
            {photoUrl ? <img src={photoUrl} className="w-full h-full object-contain" alt="Capture" /> : <p className="text-[10px] text-slate-600">No capture yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Placeholder Panels ────────────────────────────────────────

function MicPanel() { return <div className="p-4"><h2 className="font-serif text-lg font-semibold">Mic & Voice Control</h2></div>; }
function ScreenModesPanel() { return <div className="p-4"><h2 className="font-serif text-lg font-semibold">Screen Modes</h2></div>; }
function EarnPanel() { return <div className="p-4"><h2 className="font-serif text-lg font-semibold">Earn · Crypto</h2></div>; }
function TimePanel() { return <div className="p-4"><h2 className="font-serif text-lg font-semibold">Time Monitoring</h2></div>; }

// ─── Main Page Component ───────────────────────────────────────

export default function CreatorPage() {
  const [activePanel, setActivePanel] = useState<PanelId>("stage");
  const stageCanvasRef = useRef<HTMLCanvasElement>(null);
  const stageVideoRef = useRef<HTMLVideoElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [aiLoaded, setAiLoaded] = useState(false);
  
  const [isLive, setIsLive] = useState(false);
  const [isCamActive, setIsCamActive] = useState(false);
  const [cgiBg, setCgiBg] = useState("bedroom"); // Default to The Red Room
  const [isAvatar, setIsAvatar] = useState(false);

  const setLiveStatus = useMutation<typeof api>(api.users.setCreatorLiveStatus);
  
  const [secondsLive, setSecondsLive] = useState(0);
  useEffect(() => {
    let interval: any = null;
    if (isLive) {
      interval = setInterval(() => setSecondsLive(s => s + 1), 1000);
    } else {
      setSecondsLive(0);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600).toString().padStart(2, '0');
    const mins = Math.floor((totalSecs % 3600) / 60).toString().padStart(2, '0');
    const secs = (totalSecs % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    const loadScript = (src: string) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = "anonymous";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js")
    ]).then(() => {
      setAiLoaded(true);
    }).catch((err) => console.error("AI load error", err));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#06050a] text-white overflow-hidden">
      <Header isLive={isLive} broadcastTime={formatTime(secondsLive)} isAvatar={isAvatar} setIsAvatar={setIsAvatar} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={activePanel} setActive={setActivePanel} />

        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20 lg:pb-6 relative">
          <div className={activePanel === "profile" ? "block" : "hidden"}><ProfilePanel /></div>
          <div className={activePanel === "stage" ? "block" : "hidden"}>
            <LiveStagePanel 
              canvasRef={stageCanvasRef} 
              videoRef={stageVideoRef} 
              aiLoaded={aiLoaded} 
              isLive={isLive} 
              setIsLive={setIsLive} 
              isCamActive={isCamActive} 
              setIsCamActive={setIsCamActive} 
              cgiBg={cgiBg} 
              setCgiBg={setCgiBg}
              setLiveStatus={setLiveStatus}
              isAvatar={isAvatar}
            />
          </div>
          <div className={activePanel === "camera" ? "block" : "hidden"}><CameraPanel canvasRef={stageCanvasRef} photoUrl={photoUrl} setPhotoUrl={setPhotoUrl} /></div>
          <div className={activePanel === "mic" ? "block" : "hidden"}><MicPanel /></div>
          <div className={activePanel === "screen" ? "block" : "hidden"}><ScreenModesPanel /></div>
          <div className={activePanel === "earn" ? "block" : "hidden"}><EarnPanel /></div>
          <div className={activePanel === "time" ? "block" : "hidden"}><TimePanel /></div>
          <div className={activePanel === "golive" ? "block" : "hidden"}>
            <GoLivePanel isLive={isLive} setIsLive={setIsLive} isCamActive={isCamActive} broadcastTime={formatTime(secondsLive)} cgiBg={cgiBg} setLiveStatus={setLiveStatus} isAvatar={isAvatar} />
          </div>
        </main>
      </div>
    </div>
  );
}
