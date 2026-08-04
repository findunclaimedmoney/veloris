import { Link, useNavigate } from 'react-router-dom';

const creatorTips = [
  {
    title: 'Edit Username',
    description: 'Creators can update their profile name so their creator page shows correctly on the front page.',
    href: '/creator',
  },
  {
    title: 'Link Creator Page',
    description: 'Sign in as a creator and connect your profile to the live directory instantly.',
    href: '/creator/dashboard',
  },
  {
    title: 'Go Live',
    description: 'Activate live status in Creator Studio and appear as live on the main front page.',
    href: '/creator',
  },
  {
    title: 'Front Page Spotlight',
    description: 'Live creators are featured first for faster bookings and more visibility.',
    href: '/creator/dashboard',
  },
];

const companions = [
  { id: 'crystal', name: 'Crystal', tagline: 'Crystal & Asian Video', live: true, image: '/images/jess.jpg', video: '/images/asianflirting.mp4' },
  { id: 'jess', name: 'Jess', tagline: 'Playful & Witty', live: true, image: '/images/jess.jpg' },
  { id: 'monica', name: 'Monica', tagline: 'Sultry & Confident', live: true, image: '/images/monica2.png' },
  { id: 'natalie', name: 'Natalie', tagline: 'Gorgeous & Alluring', live: false, image: '/images/natalie.png' },
  { id: 'pamela', name: 'Pamela', tagline: 'Bold & Beautiful', live: false, image: '/images/pamela.png' },
  { id: 'zac', name: 'Zac', tagline: 'Driven & Athletic', live: false, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
  { id: 'oliver', name: 'Oliver', tagline: 'Wise & Reassuring', live: false, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
  { id: 'yuki', name: 'Yuki', tagline: 'Cute & Bubbly Anime', live: false, image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=400&q=80' },
  { id: 'luna', name: 'Luna', tagline: 'Spirited Action Heroine', live: false, image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80' },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-950 pt-20 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Your AI Companion <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Awaits</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">Choose your perfect match – each with a unique voice, personality, and style.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/try" className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/40 transition">🎬 Try Free 5-Minute Demo</a>
            <a href="/creators" className="px-8 py-4 rounded-2xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition">👥 Book a Creator</a>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {creatorTips.map((tip) => (
              <Link
                key={tip.title}
                to={tip.href}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-pink-500/40 hover:bg-white/10"
              >
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300 mb-3">{tip.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{tip.description}</p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold text-white opacity-80 group-hover:text-pink-300">
                  Open Creator Studio →
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {companions.map((comp) => (
            <div key={comp.id} onClick={() => navigate(`/profile/${comp.id}`)} className="glass p-4 rounded-2xl border border-white/10 cursor-pointer transition-all duration-300 hover:translate-y-[-4px] hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-950">
                {comp.video ? (
                  <video
                    src={comp.video}
                    className="w-full h-full object-cover object-center"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={comp.image}
                  />
                ) : (
                  <img
                    src={comp.image}
                    alt={comp.name}
                    className="w-full h-full object-cover object-center transform scale-75"
                  />
                )}
                {comp.live && (
                  <div className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-red-500/30">
                    Live Now
                  </div>
                )}
              </div>
              <h3 className="text-xl font-bold text-white">{comp.name}</h3>
              <p className="text-sm text-slate-400">{comp.tagline}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}