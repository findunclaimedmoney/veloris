import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import AIChat from '../components/AIChat';

export default function AdminDashboard() {
  const stats = useQuery(api.analytics.getAdminStats);

  if (!stats) {
    return <div className="text-white p-8">Loading admin data...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8">🛡️ Admin Portal – Veloris</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-2xl border-white/10">
          <h3 className="text-sm text-slate-400 uppercase">Total Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-white/10">
          <h3 className="text-sm text-slate-400 uppercase">Total Revenue</h3>
          <p className="text-3xl font-bold text-emerald-400">${(stats.totalRevenue / 100).toFixed(2)}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-white/10">
          <h3 className="text-sm text-slate-400 uppercase">Platform Share</h3>
          <p className="text-3xl font-bold text-blue-400">${(stats.platformShare / 100).toFixed(2)}</p>
        </div>
        <div className="glass p-6 rounded-2xl border-white/10">
          <h3 className="text-sm text-slate-400 uppercase">Active Sessions</h3>
          <p className="text-3xl font-bold text-pink-400">{stats.activeSessions}</p>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border-white/10">
        <h2 className="text-xl font-bold mb-4">💬 Customer Service AI Chat</h2>
        <AIChat role="admin" />
      </div>
    </div>
  );
}