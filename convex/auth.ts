import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
// 👆 NO "use node" – this runs in default Convex runtime

export const registerUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: v.union(v.literal('user'), v.literal('creator')),
    referralCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // NOTE: We're NOT using crypto here directly
    // We'll hash in a separate action
    const existing = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
    if (existing) throw new Error('Email already registered');

    const code = `VELORIS-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    let referredBy = null;
    if (args.referralCode) {
      const referrer = await ctx.db
        .query('users')
        .withIndex('by_referralCode', (q) => q.eq('referralCode', args.referralCode))
        .first();
      if (referrer) referredBy = referrer._id;
    }

    // We'll hash the password in the action that calls this
    const userId = await ctx.db.insert('users', {
      name: args.name,
      email: args.email,
      passwordHash: 'PENDING_HASH', // Temporary – will be updated
      referralCode: code,
      referredBy,
      credits: 0,
      isCreator: args.role === 'creator',
      role: args.role,
      createdAt: Date.now(),
    });

    if (args.role === 'creator') {
      await ctx.db.insert('creators', {
        userId,
        displayName: args.name,
        bio: '',
        avatarImage: '',
        totalEarnings: 0,
        pendingBalance: 0,
        status: 'active',
        defaultTier: 'basic',
      });
    }

    return { userId, referralCode: code };
  },
});

export const loginUser = query({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_email', (q) => q.eq('email', args.email))
      .first();
    if (!user) throw new Error('User not found');
    // Password check will be handled by action
    return { userId: user._id, role: user.role };
  },
});

// ❌ REMOVED: getMe – now in convex-queries.ts