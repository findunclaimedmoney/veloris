import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

declare const SelfieSegmentation: any;

const BACKGROUNDS = [
  { name: 'Luxury Living Room', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80' },
  { name: 'Modern Mansion', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80' },
  { name: 'Penthouse View', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Neon City', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80' },
  { name: 'Outer Space', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80' },
  { name: 'Beach Sunset', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { name: 'Mountain View', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80' },
  { name: 'Home Office', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' },
];

export default function GuestDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedBg, setSelectedBg] = useState(BACKGROUNDS[0].url);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);
        setSessionActive(true);
        initBackgroundRemoval();
        startTimer();
      }
    } catch (err) {
      alert('Camera access denied. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);
      setSessionActive(false);
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setSessionActive(false);
          setShowSignupPrompt(true);
          stopCamera();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const initBackgroundRemoval = () => {
    if (typeof SelfieSegmentation === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
      script.onload = () => startSegmentation();
      document.body.appendChild(script);
    } else {
      startSegmentation();
    }
  };

  const startSegmentation = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = 640;
    canvas.height = 480;
    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
    selfieSegmentation.setOptions({ modelSelection: 1 });
    selfieSegmentation.onResults((results: any) => {
      if (!video.paused && !video.ended && sessionActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bgImage = new Image();
        bgImage.crossOrigin = 'anonymous';
        bgImage.src = selectedBg;
        bgImage.onload = () => {
          ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'destination-in';
          ctx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'source-over';
        };
      }
      requestAnimationFrame(() => {
        if (video.paused || video.ended || !sessionActive) return;
        selfieSegmentation.send({ image: video });
      });
    });
    selfieSegmentation.send({ image: video });
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold serif">✨ Try Veloris – Free 5-Minute Demo</h1>
            <p className="text-slate-400">No signup. No contract. Just you, a camera, and your choice of background.</p>
          </div>
          {sessionActive && <div className={`text-2xl font-mono font-bold ${timeLeft <= 60 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>⏱️ {formatTime(timeLeft)}</div>}
        </div>

        {showSignupPrompt ? (
          <div className="glass p-12 rounded-3xl border-white/10 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">That Was Just a Taste!</h2>
            <p className="text-slate-400 mb-6">You experienced Veloris with AI background removal. Imagine what you can do with beauty filters, AR effects, and earning 68% as a creator.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-pink-500/40 transition">🚀 Sign Up – Get 20% Off</button>
              <button onClick={() => navigate('/')} className="px-8 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition">Browse Companions</button>
            </div>
            <p className="text-xs text-slate-500 mt-6">Your demo session has ended. No data was saved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 glass p-4 rounded-2xl border-white/10">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                {isCameraOn ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline muted className="hidden" />
                    <canvas ref={canvasRef} className="w-full h-full object-cover" />
                  </>
                ) : (
                  <div className="text-slate-500 text-center p-8"><p className="text-4xl mb-2">📷</p><p>Click "Start Demo" below</p></div>
                )}
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <button onClick={startCamera} disabled={!name} className="px-8 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:shadow-2xl hover:shadow-pink-500/40 transition disabled:opacity-50 disabled:cursor-not-allowed">🚀 Start Demo</button>
                {isCameraOn && <button onClick={stopCamera} className="px-8 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition">⏹️ End Session</button>}
                {!name && <p className="text-xs text-amber-400 self-center">Please enter your name above to start.</p>}
              </div>
            </div>
            <div className="space-y-4">
              <div className="glass p-4 rounded-2xl border-white/10">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Your Info (Optional)</h4>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full p-2 mb-2 rounded-lg bg-black/50 border border-white/10 text-white text-sm" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (optional – for special offers)" className="w-full p-2 rounded-lg bg-black/50 border border-white/10 text-white text-sm" />
              </div>
              <div className="glass p-4 rounded-2xl border-white/10">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-2">Choose Background</h4>
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {BACKGROUNDS.map((bg) => (
                    <div key={bg.name} onClick={() => setSelectedBg(bg.url)} className={`p-1 rounded-lg cursor-pointer border-2 transition ${selectedBg === bg.url ? 'border-pink-500' : 'border-transparent hover:border-white/20'}`}>
                      <img src={bg.url} alt={bg.name} className="w-full h-12 object-cover rounded-lg" />
                      <p className="text-[8px] text-slate-500 mt-0.5 truncate">{bg.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}