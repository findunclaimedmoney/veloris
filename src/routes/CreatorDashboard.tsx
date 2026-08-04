import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function CreatorDashboard() {
  const user = useQuery(api['convex-queries'].getMe);

  if (!user) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">🎨 Creator Dashboard</h1>
      <p className="text-slate-400">Welcome back, {user.name}</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl border-white/10">
          <h3 className="text-sm text-slate-400 uppercase">Total Earnings</h3>
          <p className="text-3xl font-bold text-emerald-400">$0.00</p>
        </div>
        <div className="glass p-6 rounded-2xl border-white/10">
          <h3 className="text-sm text-slate-400 uppercase">Pending Balance</h3>
          <p className="text-3xl font-bold text-yellow-400">$0.00</p>
        </div>
        <div className="glass p-6 rounded-2xl border-white/10">
          <h3 className="text-sm text-slate-400 uppercase">Total Sessions</h3>
          <p className="text-3xl font-bold text-white">0</p>
        </div>
      </div>
    </div>
  );
}