import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ----- QUERIES -----

export const getUserById = query({
  args: { userId: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getSessionByStripeId = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('sessions')
      .withIndex('by_stripe', (q) => q.eq('stripeSessionId', args.stripeSessionId))
      .first();
  },
});

// ----- MUTATIONS -----

export const createSessionRecord = mutation({
  args: {
    userId: v.id('users'),
    companionId: v.string(),
    productType: v.union(v.literal('ai_avatar'), v.literal('human_creator')),
    tier: v.union(v.literal('basic'), v.literal('pro'), v.literal('expert'), v.literal('standard')),
    durationMinutes: v.number(),
    isCreatorSession: v.boolean(),
    creatorId: v.optional(v.id('creators')),
    stripeSessionId: v.string(),
    amount: v.number(),
    platformShare: v.number(),
    creatorShare: v.number(),
    referrerShare: v.number(),
    referrerId: v.optional(v.id('users')),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('sessions', {
      userId: args.userId,
      companionId: args.companionId,
      productType: args.productType,
      tier: args.tier,
      durationMinutes: args.durationMinutes,
      isCreatorSession: args.isCreatorSession,
      creatorId: args.creatorId,
      stripeSessionId: args.stripeSessionId,
      amount: args.amount,
      platformShare: args.platformShare,
      creatorShare: args.creatorShare,
      referrerShare: args.referrerShare,
      referrerId: args.referrerId,
      status: 'pending',
      startTime: Date.now(),
    });
  },
});

export const creditCreator = mutation({
  args: { creatorId: v.id('creators'), amount: v.number() },
  handler: async (ctx, args) => {
    const creator = await ctx.db.get(args.creatorId);
    if (!creator) throw new Error('Creator not found');
    await ctx.db.patch(args.creatorId, {
      totalEarnings: creator.totalEarnings + args.amount,
      pendingBalance: creator.pendingBalance + args.amount,
    });
  },
});

export const creditReferrer = mutation({
  args: { userId: v.id('users'), amount: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error('User not found');
    await ctx.db.patch(args.userId, {
      credits: (user.credits || 0) + args.amount / 100,
    });
  },
});

export const updateSessionStatus = mutation({
  args: {
    sessionId: v.id('sessions'),
    status: v.union(v.literal('pending'), v.literal('active'), v.literal('expired')),
    liveAvatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      status: args.status,
      liveAvatarUrl: args.liveAvatarUrl,
    });
  },
});
