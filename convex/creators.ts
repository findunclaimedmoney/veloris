import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const registerAsCreator = mutation({
  args: { userId: v.id('users'), displayName: v.string(), bio: v.string(), avatarImage: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query('creators').withIndex('by_userId', q => q.eq('userId', args.userId)).first();
    if (existing) throw new Error('Already a creator');
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');
    await ctx.db.insert('creators', { userId: args.userId, displayName: args.displayName, bio: args.bio, avatarImage: args.avatarImage, totalEarnings: 0, pendingBalance: 0, status: 'active', defaultTier: 'basic' });
    await ctx.db.patch(user._id, { isCreator: true, role: 'creator' });
    return { success: true };
  },
});

export const getAllActiveCreators = query({
  handler: async (ctx) => {
    const creators = await ctx.db.query('creators').filter(q => q.eq(q.field('status'), 'active')).collect();
    return await Promise.all(creators.map(async (c) => {
      const user = await ctx.db.get(c.userId);
      return { ...c, user: user ? { name: user.name, email: user.email } : null };
    }));
  },
});

export const getCreatorEarnings = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    const creator = await ctx.db.query('creators').withIndex('by_userId', q => q.eq('userId', args.userId)).first();
    if (!creator) return null;
    const allSessions = await ctx.db.query('sessions').withIndex('by_creator', q => q.eq('creatorId', creator._id)).collect();
    const completed = allSessions.filter(s => s.status === 'active' || s.status === 'expired');
    const pending = allSessions.filter(s => s.status === 'pending');
    const tierBreakdown = completed.reduce((acc: any, s) => {
      const tier = s.tier || 'basic';
      if (!acc[tier]) acc[tier] = { count: 0, revenue: 0 };
      acc[tier].count += 1;
      acc[tier].revenue += s.creatorShare || 0;
      return acc;
    }, {});
    return {
      ...creator,
      totalEarnings: creator.totalEarnings,
      pendingBalance: creator.pendingBalance,
      totalSessions: completed.length,
      pendingSessions: pending.length,
      sessions: allSessions.sort((a, b) => b.startTime - a.startTime),
      tierBreakdown,
    };
  },
});