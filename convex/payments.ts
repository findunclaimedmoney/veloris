"use node";

import { action } from './_generated/server';
import { v } from 'convex/values';
import Stripe from 'stripe';

const TIER_CONFIG = {
  ai_avatar: { priceId: 'price_ai_avatar_5min', duration: 5, ratePerMin: 2.00, platformSplit: 1.0 },
  creator_basic: { priceId: 'price_creator_basic_per_min', ratePerMin: 0.99, platformSplit: 0.32, creatorSplit: 0.68 },
  creator_pro: { priceId: 'price_creator_pro_per_min', ratePerMin: 2.99, platformSplit: 0.32, creatorSplit: 0.68 },
  creator_expert: { priceId: 'price_creator_expert_per_min', ratePerMin: 9.99, platformSplit: 0.32, creatorSplit: 0.68 },
};

function calculateSplits(amount: number, config: any, hasReferrer: boolean) {
  if (config.platformSplit === 1.0) return { platform: amount, creator: 0, referrer: 0 };
  let platformShare = amount * config.platformSplit;
  const creatorShare = amount * config.creatorSplit;
  let referrerShare = 0;
  if (hasReferrer) {
    referrerShare = amount * 0.05;
    platformShare = amount * (config.platformSplit - 0.05);
  }
  return { platform: Math.round(platformShare), creator: Math.round(creatorShare), referrer: Math.round(referrerShare) };
}

export const createCheckoutSession = action({
  args: {
    userId: v.id('users'),
    companionId: v.string(),
    productType: v.union(v.literal('ai_avatar'), v.literal('human_creator')),
    tier: v.union(v.literal('basic'), v.literal('pro'), v.literal('expert'), v.literal('standard')),
    durationMinutes: v.number(),
    creatorId: v.optional(v.id('creators')),
  },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_LIVE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });
    
    // Get user data
    const user = await ctx.runQuery('getUserById', { userId: args.userId });
    if (!user) throw new Error('User not found');

    const key = args.productType === 'ai_avatar' ? 'ai_avatar' : `creator_${args.tier}`;
    const config = TIER_CONFIG[key as keyof typeof TIER_CONFIG];
    if (!config) throw new Error('Invalid tier');

    const amount = Math.round(config.ratePerMin * args.durationMinutes * 100);
    const referrerId = user.referredBy || null;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: config.priceId, quantity: 1 }],
      success_url: `${process.env.VITE_FRONTEND_URL}/session-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_FRONTEND_URL}/`,
      metadata: {
        userId: args.userId,
        companionId: args.companionId,
        productType: args.productType,
        tier: args.tier,
        durationMinutes: String(args.durationMinutes),
        creatorId: args.creatorId || '',
        referrerId: referrerId || '',
        ratePerMin: String(config.ratePerMin),
      },
    });

    const splits = calculateSplits(amount, config, !!referrerId);

    // Store session using a mutation
    await ctx.runMutation('createSessionRecord', {
      userId: args.userId,
      companionId: args.companionId,
      productType: args.productType,
      tier: args.tier,
      durationMinutes: args.durationMinutes,
      isCreatorSession: args.productType === 'human_creator',
      creatorId: args.creatorId,
      stripeSessionId: session.id,
      amount,
      platformShare: splits.platform,
      creatorShare: splits.creator,
      referrerShare: splits.referrer,
      referrerId: referrerId || null,
    });

    return { url: session.url };
  },
});

export const handleStripeWebhook = action({
  args: { payload: v.string(), signature: v.string() },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_LIVE_SECRET_KEY!, { apiVersion: '2025-02-24.acacia' });
    const event = stripe.webhooks.constructEvent(args.payload, args.signature, process.env.STRIPE_WEBHOOK_SECRET!);
    
    if (event.type === 'checkout.session.completed') {
      const stripeSession = event.data.object;
      const sessionId = stripeSession.id;
      
      const pending = await ctx.runQuery('getSessionByStripeId', { stripeSessionId: sessionId });
      if (!pending) return;

      if (pending.isCreatorSession && pending.creatorId) {
        await ctx.runMutation('creditCreator', {
          creatorId: pending.creatorId,
          amount: pending.creatorShare,
        });
      }

      if (pending.referrerId && pending.referrerShare > 0) {
        await ctx.runMutation('creditReferrer', {
          userId: pending.referrerId,
          amount: pending.referrerShare,
        });
      }

      let liveUrl = null;
      if (pending.productType === 'ai_avatar') {
        const avatarRes = await fetch('https://api.liveavatar.com/v2/embeddings', {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.LIVE_AVATAR_KEY!,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            avatar_id: process.env.JESS_LIVE_AVATAR_ID,
            is_sandbox: false,
          }),
        });
        const avatarData = await avatarRes.json();
        liveUrl = avatarData.data.url;
      }

      await ctx.runMutation('updateSessionStatus', {
        sessionId: pending._id,
        status: 'active',
        liveAvatarUrl: liveUrl,
      });
    }
  },
});