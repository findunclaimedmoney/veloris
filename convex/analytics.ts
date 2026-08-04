import { query } from './_generated/server';
import { v } from 'convex/values';

export const getAdminStats = query({
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const sessions = await ctx.db.query('sessions').collect();
    return {
      totalUsers: users.length,
      totalRevenue: sessions.reduce((sum, s) => sum + s.amount, 0),
      platformShare: sessions.reduce((sum, s) => sum + s.platformShare, 0),
      activeSessions: sessions.filter(s => s.status === 'active').length,
      recentUsers: users.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10),
    };
  },
});