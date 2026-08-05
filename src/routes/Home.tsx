export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0a10] text-white flex items-center justify-center flex-col p-4">
      <h1 className="text-4xl font-serif font-bold mb-4 text-pink-400">Lensflow</h1>
      <p className="text-slate-400 text-lg">The page is loading correctly.</p>
      <a 
        href="/profile/crystal"
        className="mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold"
      >
        View Profile
      </a>
    </div>
  );
}
