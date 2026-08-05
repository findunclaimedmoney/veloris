import { useParams, Link } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#06050a] text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[rgba(16,14,24,0.92)] border border-white/10 rounded-2xl p-8 backdrop-blur-lg text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-3xl font-bold mb-4">
          {id?.charAt(0).toUpperCase() || "?"}
        </div>
        <h1 className="text-3xl font-bold font-serif mb-2">{id || "Profile"}</h1>
        <p className="text-slate-400 mb-6">Welcome to your private Lensflow space.</p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold hover:opacity-90 transition"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
