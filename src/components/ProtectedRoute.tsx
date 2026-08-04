import { Navigate, Outlet } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function ProtectedRoute({ allowedRoles }: { allowedRoles: ('user' | 'creator' | 'admin')[] }) {
  const user = useQuery(api.auth.getMe);
  if (user === undefined) return <div className="min-h-screen flex items-center justify-center bg-slate-950"><div className="text-white text-xl">Loading...</div></div>;
  if (!user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role as any)) return <Navigate to="/" replace />;
  return <Outlet />;
}