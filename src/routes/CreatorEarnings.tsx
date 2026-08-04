import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function CreatorEarnings() {
  const user = useQuery(api['convex-queries'].getMe);
  const earnings = useQuery(api.creators.getCreatorEarnings, user ? { userId: user._id } : 'skip');

  if (!user) {
    return <div className="text-white p-8">Please log in.</div>;
  }

  if (earnings === undefined) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (!earnings) {
    return <div className="text-white p-8">No earnings data found.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">
      <h1 className="text-3xl font-bold">📊 Earnings Dashboard</h1>
      <p className="text-slate-400">
        Total: ${(earnings.totalEarnings / 100).toFixed(2)} | Pending: ${(earnings.pendingBalance / 100).toFixed(2)}
      </p>
    </div>
  );
}