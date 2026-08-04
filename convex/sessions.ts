import { query, mutation } from './_generated/server';
import { v } from 'convex/values';

export const getUserSessions = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sessions')
      .withIndex('by_user', (q) => q.eq('userId', args.userId))
      .collect();
  },
});

export const expireSession = mutation({
  args: { sessionId: v.id('sessions') },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error('Session not found');
    await ctx.db.patch(args.sessionId, { 
      status: 'expired', 
      endTime: Date.now() 
    });
  },
});