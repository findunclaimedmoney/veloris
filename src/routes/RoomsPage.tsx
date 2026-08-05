import { useState } from "react";
import { Link } from "react-router-dom";
import { ROOMS, LEVELS } from "../_lib/pricing.ts";
import type { Room, Level } from "../_lib/pricing.ts";
import RoomStage from "../_components/room-stage.tsx";
import PackageSelector from "../_components/package-selector.tsx";
import ComparisonTable from "../_components/comparison-table.tsx";
import Footer from "@/components/footer.tsx";

const ROOM_TYPES: Record<string, boolean> = {
  mirror: true,
  penthouse: true,
  bedroom: false,
  dungeon: false,
  lounge: false,
};

export default function RoomsPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room>(ROOMS[0]);
  const [selectedLevel, setSelectedLevel] = useState<Level>(LEVELS[0]);
  const [filterType, setFilterType] = useState<"all" | "human" | "avatar">("all");

  const filteredRooms = ROOMS.filter((room) => {
    const isAvatar = ROOM_TYPES[room.id] || false;
    if (filterType === "human") return !isAvatar;
    if (filterType === "avatar") return isAvatar;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#06050a] text-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-[rgba(16,14,24,0.92)] px-4 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-black text-white no-underline">
            L
          </Link>
          <div>
            <div className="font-serif text-sm font-bold leading-none text-white">Fantasy Rooms</div>
            <div className="text-[9px] font-semibold uppercase tracking-wider text-pink-400">
              Lensflow &middot; 5 rooms &middot; crypto
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="rounded-full bg-white/5 px-2 py-1 text-slate-400">Min 5 min</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-1 font-bold text-emerald-300">
            Packages &middot; crypto
          </span>
          <Link to="/creator" className="rounded-lg border border-white/8 bg-[rgba(16,14,24,0.92)] px-3 py-1.5 font-bold text-slate-300 no-underline backdrop-blur-lg hover:text-white">
            Creator Hub
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-6 p-4">
        <section className="rounded-2xl border border-white/10 bg-[rgba(16,14,24,0.92)] p-5 backdrop-blur-lg">
          <h1 className="mb-2 font-serif text-2xl font-bold text-white">
            Five rooms. One private session. Crypto only.
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
            Live creator presence + cinematic sets + protected media.
            Packages start at <strong className="text-white">5 minutes</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Choose room &amp; filter stream type</div>
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl text-[10px]">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${filterType === "all" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                All Rooms
              </button>
              <button
                onClick={() => setFilterType("human")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${filterType === "human" ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                👤 Live Human
              </button>
              <button
                onClick={() => setFilterType("avatar")}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${filterType === "avatar" ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                🤖 AI Avatar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {filteredRooms.map((room) => {
              const isAvatar = ROOM_TYPES[room.id] || false;
              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room)}
                  className={`rounded-xl border p-3 text-left transition hover:-translate-y-0.5 relative overflow-hidden ${
                    room.id === selectedRoom.id
                      ? "border-pink-500/55 bg-[rgba(16,14,24,0.92)] shadow-[0_0_0_1px_rgba(236,72,153,0.25)]"
                      : "border-white/10 bg-[rgba(16,14,24,0.92)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold text-pink-300">{room.short}</span>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      isAvatar ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}>
                      {isAvatar ? 'Avatar' : 'Human'}
                    </span>
                  </div>
                  <div className="mb-1 text-sm font-bold text-white">{room.name}</div>
                  <div className="text-[10px] leading-snug text-slate-500">{room.vibe}</div>
                  <div className="mt-2 font-mono text-[10px] text-emerald-400/90">
                    from ${room.base5.toFixed(2)} &middot; 5 min
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-3">
            <RoomStage room={selectedRoom} />
            <div className="flex flex-wrap gap-2 text-[10px] text-slate-500">
              <span>Face / full stage modes available in Creator Hub</span>
              <span>&middot;</span>
              <span>Streams are session-locked &middot; no download URLs</span>
            </div>
          </div>

          <div className="space-y-3 lg:col-span-2">
            <PackageSelector
              room={selectedRoom}
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
