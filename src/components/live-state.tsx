import { useState, useEffect, useRef } from "react";

type Props = {
  onEnd: () => void;
};

const QUICK_PROMPTS = [
  "Tell me about yourself",
  "What do you like to do?",
  "Make me laugh",
];

const JESS_RESPONSES = [
  "I love that! Tell me more about what you're thinking...",
  "That's so interesting. I never thought about it that way before.",
  "Mmm, I like where this is going. Keep talking to me.",
  "You're making me smile. What else is on your mind?",
  "I wish we had more than 5 minutes together...",
];

type ChatMsg = { sender: "user" | "jess"; text: string };

export default function LiveState({ onEnd }: Props) {
  const [timeLeft, setTimeLeft] = useState(300);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(true);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { sender: "jess", text: "Welcome to my private Lensflow! We have 5 minutes together. What's on your mind today?" },
  ]);
  const [inputText, setInputText] = useState("");
  const [jessStatus, setJessStatus] = useState("Listening to you");
  const chatRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          onEnd();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onEnd]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const timerClass =
    timeLeft <= 60
      ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
      : timeLeft <= 120
        ? "bg-amber-500/15 text-amber-200 border-amber-500/30"
        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timerDisplay = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  function sendMessage(text: string) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: text.trim() }]);
    setInputText("");
    setJessStatus("Thinking...");

    setTimeout(() => {
      const response = JESS_RESPONSES[Math.floor(Math.random() * JESS_RESPONSES.length)];
      setMessages((prev) => [...prev, { sender: "jess", text: response }]);
      setJessStatus("Listening to you");
    }, 1500);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(inputText);
  }

  async function toggleCam() {
    if (isCamOff) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCamOff(false);
      } catch {
        // Permission denied
      }
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setIsCamOff(true);
    }
  }

  function toggleMic() {
    setIsMicMuted((m) => {
      if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach((t) => {
          t.enabled = m;
        });
      }
      return !m;
    });
  }

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-[#06050a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0b0a10]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-sm font-bold text-white">
              J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-base font-bold text-white">Lensflow</h1>
                <span className="rounded-full border border-pink-500/30 bg-pink-500/20 px-2 py-0.5 text-[10px] font-semibold text-pink-300">
                  SPARK &middot; 5 MIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Private studio &bull; Jess</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-lg font-bold shadow-lg transition-all ${timerClass}`}>
            <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
            <span>{timerDisplay}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex flex-1 max-w-7xl flex-col gap-6 p-4 md:p-6 lg:flex-row">
        {/* Video Stage */}
        <div className="flex-1 space-y-4 lg:w-2/3">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Jess Video */}
            <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-slate-950 p-4 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0a10] via-transparent to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/10" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span>Jess</span>
                  <span className="text-[10px] font-semibold uppercase text-pink-400">Live</span>
                </div>
                <div className="rounded-full bg-pink-600/80 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-md">
                  A$10 &middot; 5min
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="rounded-2xl border border-white/10 bg-[rgba(15,13,23,0.75)] p-3 backdrop-blur-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-pink-500/30 bg-pink-500/20 text-xs text-pink-400">
                        &#10024;
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight text-white">Jess Avatar</p>
                        <p className="text-[10px] text-pink-300">{jessStatus}</p>
                      </div>
                    </div>
                    <div className="flex h-6 items-center gap-0.5 rounded-full border border-white/10 bg-black/40 px-2 py-1">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-[3px] rounded-sm bg-gradient-to-t from-pink-500 to-purple-500 transition-all duration-100"
                          style={{ height: `${Math.random() * 12 + 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Video */}
            <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-slate-950 p-4 shadow-2xl">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`absolute inset-0 h-full w-full -scale-x-100 object-cover ${isCamOff ? "hidden" : ""}`}
              />

              {isCamOff && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/95 p-6 text-center">
                  <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border-2 border-pink-500/30 bg-slate-800 text-2xl text-pink-400 shadow-inner">
                    &#128100;
                  </div>
                  <h4 className="text-sm font-bold text-white">Your Camera is Off</h4>
                  <p className="mt-1 max-w-xs text-xs text-slate-400">
                    Enable your webcam so Jess can see you too.
                  </p>
                  <button
                    onClick={toggleCam}
                    className="mt-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(255,42,141,0.35)]"
                  >
                    Enable Webcam
                  </button>
                </div>
              )}

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                  <span className={`h-2 w-2 rounded-full ${isCamOff ? "bg-amber-400" : "bg-emerald-400 animate-pulse"}`} />
                  <span>You</span>
                </div>
                <div className="rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-slate-300 backdrop-blur-md">
                  Private
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="rounded-2xl border border-white/10 bg-[rgba(15,13,23,0.75)] p-3 backdrop-blur-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs text-slate-300">
                        {isMicMuted ? "🔇" : "🎤"}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">
                        {isMicMuted ? "Muted" : "Microphone On"}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">WebRTC HD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="flex items-center justify-between gap-2 rounded-2xl border border-white/8 bg-[rgba(22,20,31,0.85)] p-3.5 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                  isMicMuted
                    ? "border-red-500/40 bg-red-500/20 text-red-400"
                    : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isMicMuted ? "Unmute" : "Mute"}
              </button>
              <button
                onClick={toggleCam}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                  isCamOff
                    ? "border-red-500/40 bg-red-500/20 text-red-400"
                    : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {isCamOff ? "Start Cam" : "Cam On"}
              </button>
            </div>
            <button
              onClick={onEnd}
              className="flex items-center gap-2 rounded-xl bg-red-600/80 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-red-600"
            >
              End Session
            </button>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="flex h-[500px] flex-col rounded-3xl border border-white/8 bg-[rgba(22,20,31,0.85)] p-4 shadow-2xl backdrop-blur-xl lg:h-auto lg:w-1/3">
          <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-pink-400">&#128172;</span>
              <span className="text-xs font-bold uppercase tracking-wider text-white">Studio Chat</span>
            </div>
            <span className="rounded-full bg-pink-500/10 px-2 py-0.5 text-[10px] font-medium text-pink-300">
              Real-time
            </span>
          </div>

          <div ref={chatRef} className="flex-1 space-y-3 overflow-y-auto pr-2">
            {messages.map((msg, i) => (
              <div key={i} className={msg.sender === "user" ? "text-right" : "text-left"}>
                <div
                  className={`inline-block max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                    msg.sender === "user"
                      ? "rounded-br-sm bg-gradient-to-br from-pink-500 to-purple-500 text-white"
                      : "rounded-bl-sm border border-white/8 bg-[rgba(30,27,45,0.95)] text-slate-200"
                  }`}
                >
                  <p className="mb-1 text-[10px] font-bold opacity-75">
                    {msg.sender === "user" ? "You" : "Jess"}
                  </p>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-3">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Prompts:
            </p>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-left text-[11px] text-slate-300 transition hover:border-pink-500/40 hover:bg-pink-500/20"
                >
                  {`"${prompt}"`}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Speak to Jess or type..."
                className="w-full rounded-xl border border-white/15 bg-slate-950 py-3 pl-4 pr-12 text-xs text-white transition focus:border-pink-500 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-xs text-white shadow-[0_0_20px_rgba(255,42,141,0.35)]"
              >
                &#9654;
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
