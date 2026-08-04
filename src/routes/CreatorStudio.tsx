import { useState, useRef } from 'react';

export default function CreatorStudio() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);
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
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🎬 Creator Studio</h1>
        <p className="text-slate-400 mb-6">Professional tools for creators – no green screen needed.</p>

        <div className="glass p-4 rounded-2xl border-white/10">
          <div className="aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
            {isCameraOn ? (
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
            ) : (
              <div className="text-slate-500 text-center">
                <p className="text-4xl mb-2">📷</p>
                <p>Camera off</p>
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            {!isCameraOn ? (
              <button onClick={startCamera} className="px-6 py-2 rounded-xl bg-pink-500 text-white font-bold hover:bg-pink-600 transition">
                Start Camera
              </button>
            ) : (
              <button onClick={stopCamera} className="px-6 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition">
                Stop Camera
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}