import { Link } from "react-router-dom";

const COMPANIONS = [
  { name: "Jess", vibe: "Girl-next-door - warm", image: "/media/jess.png" },
  { name: "Emma", vibe: "Bedroom - heat", image: "/media/emma.png" },
  { name: "Amber", vibe: "Velvet - soft", image: "/media/amber.png" },
  { name: "Jacqueline", vibe: "Natural - close", image: "/media/jacqueline.png" },
  { name: "Monica", vibe: "City - polished", image: "/media/monica.png" },
  { name: "Natalie", vibe: "Penthouse - night", image: "/media/natalie.png" },
  { name: "Pamela", vibe: "Mirror - tease", image: "/media/pamela.png" },
  { name: "Motion", vibe: "Colour - flirt", image: null, video: "/media/asianflirting.mp4" },
];

function CompanionCard({ companion }: { companion: typeof COMPANIONS[number] }) {
  return (
    <Link
      to="/session"
      className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-white/8 bg-[#111] no-underline"
    >
      {companion.video ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
          <source src={companion.video} type="video/mp4" />
        </video>
      ) : (
        <img
          src={companion.image ?? ""}
          alt={companion.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/92 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="mb-1 flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
          <span className="text-xs font-semibold text-emerald-300">Online</span>
        </div>
        <div className="text-xl font-bold text-white">{companion.name}</div>
        <div className="mb-1 text-sm text-slate-300">{companion.vibe}</div>
        <span className="font-semibold text-pink-300">{"Session \u2192"}</span>
      </div>
    </Link>
  );
}

export default function Companions() {
  return (
    <section id="companions" className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-pink-400">
            Roster
          </div>
          <h2 className="font-serif text-[clamp(2rem,5vw,3rem)] font-bold leading-tight text-white">
            Every
            <br />
            <span className="text-pink-400">personality.</span>
          </h2>
        </div>
        <p className="max-w-xs text-base leading-relaxed text-slate-400">
          Pick the face. Book the package. Private session unlocks when payment clears.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {COMPANIONS.map((c) => (
          <CompanionCard key={c.name} companion={c} />
        ))}
      </div>
    </section>
  );
}
