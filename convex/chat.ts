import { action } from './_generated/server';
import { v } from 'convex/values';

export const sendCustomerServiceMessage = action({
  args: { message: v.string(), role: v.string(), contextUserId: v.optional(v.id('users')) },
  handler: async (ctx, args) => {
    let userContext = '';
    if (args.contextUserId) {
      const user = await ctx.db.get(args.contextUserId);
      if (user) {
        const sessions = await ctx.db.query('sessions').withIndex('by_user', q => q.eq('userId', args.contextUserId)).collect();
        userContext = `User: ${user.name} (${user.email})
Role: ${args.role}
Credits: ${user.credits}
Sessions: ${sessions.length}
Total spent: $${sessions.reduce((sum, s) => sum + s.amount, 0) / 100}`;
      }
    }
    const systemPrompt = `You are Veloris Customer Service AI. Context: ${userContext || 'No specific user context.'}. Platform Rules: In-house avatars: Platform keeps 100%. Creator avatars: Creator 68%, Platform 32%. Referrers earn 5% from platform. Sessions cost $10 for 5 min. Creator Studio removes backgrounds. Be helpful, concise, and warm.`;
    let reply = `Thanks for your question! I'm checking our system.\n\n`;
    if (args.message.toLowerCase().includes('credit')) reply += `You have ${userContext.includes('Credits') ? 'some' : '0'} credits. Each session costs 1 credit ($10).`;
    else if (args.message.toLowerCase().includes('creator')) reply += `Creators keep 68% of all revenue. You can withdraw from your Creator Dashboard.`;
    else if (args.message.toLowerCase().includes('referral')) reply += `Share your referral code to earn 5% of your friend's first purchase.`;
    else reply += `I'm here to help with any questions about Veloris. Please be specific so I can assist you better.`;
    return { reply };
  },
});