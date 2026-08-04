import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { SUBSCRIPTION_TIERS } from "./schema";

// ─── Helpers ───────────────────────────────────────────────────

function generateReferralCode(name?: string): string {
  const base = name ? name.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6) : "creator";
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomSuffix}`;
}

// ─── Mutations ─────────────────────────────────────────────────

export const updateCurrentUser = mutation({
  args: {
    referredByCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not logged in",
      });
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (user !== null) {
      // Update name/email if changed
      const updates: Partial<typeof user> = {};
      if (identity.name !== user.name) updates.name = identity.name;
      if (identity.email !== user.email) updates.email = identity.email;

      // Ensure existing users have a unique referral code if missing
      if (!user.referralCode) {
        updates.referralCode = generateReferralCode(identity.name);
      }

      // Auto-upgrade admin@lensflow.com.au to admin + elite plan
      if (identity.email === "admin@lensflow.com.au") {
        if (user.role !== "admin") {
          await ctx.db.patch(user._id, { ...updates, role: "admin", plan: "elite" });
        } else if (Object.keys(updates).length > 0) {
          await ctx.db.patch(user._id, updates);
        }
      } else if (Object.keys(updates).length > 0) {
        await ctx.db.patch(user._id, updates);
      }
      return user._id;
    }

    // If it's a new identity, create a new User
    const allUsers = await ctx.db.query("users").take(1);
    const isFirstUser = allUsers.length === 0;
    const isLensflowAdmin = identity.email === "admin@lensflow.com.au";

    const referralCode = generateReferralCode(identity.name);

    let validReferredBy: string | undefined = undefined;
    if (args.referredByCode) {
      const referrer = await ctx.db
        .query("users")
        .withIndex("by_referral_code", (q) => q.eq("referralCode", args.referredByCode))
        .unique();
      if (referrer && referrer.tokenIdentifier !== identity.tokenIdentifier) {
        validReferredBy = referrer.referralCode;
      }
    }

    const userId = await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.tokenIdentifier,
      plan: isLensflowAdmin ? "elite" : "free",
      subscriptionTier: isLensflowAdmin ? "live_vip" : "free",
      role: (isFirstUser || isLensflowAdmin) ? "admin" : "user",
      monthlyMessageCount: 0,
      videoCredits: isLensflowAdmin ? 400 : 0,
      referralCode,
      referredBy: validReferredBy,
      contractAccepted: false,
    });

    // Send welcome email asynchronously
    try {
      if (identity.email) {
        await ctx.scheduler.runAfter(0, internal.emails.sendWelcomeEmail, {
          to: identity.email,
          name: identity.name ?? "there",
        });
      }
    } catch (e) {
      console.error("Failed to schedule welcome email:", e);
    }

    return userId;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Called getCurrentUser without authentication present",
      });
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    return user;
  },
});

export const acceptAgreement = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Not authenticated",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    await ctx.db.patch(user._id, {
      contractAccepted: true,
      contractAcceptedAt: new Date().toISOString(),
    });

    return true;
  },
});

export const getAffiliateStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user || !user.referralCode) return null;

    const referrals = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("referredBy"), user.referralCode))
      .collect();

    // ✅ Fixed: Removed window.location to avoid server-side crash
    const origin = "https://lensflow.app";
    const affiliateUrl = `${origin}/?ref=${user.referralCode}`;

    return {
      referralCode: user.referralCode,
      affiliateUrl,
      totalReferrals: referrals.length,
    };
  },
});

export const checkCanSendMessage = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const tierKey = (user.plan?.toUpperCase() || user.subscriptionTier?.toUpperCase() || "FREE") as keyof typeof SUBSCRIPTION_TIERS;
    const tier = SUBSCRIPTION_TIERS[tierKey] || SUBSCRIPTION_TIERS.FREE;

    if (tier.id === "free") {
      const currentCount = user.monthlyMessageCount || user.messagesUsed || 0;
      if (currentCount >= tier.monthlyMessages) {
        throw new ConvexError({
          code: "LIMIT_REACHED",
          message: "Free message limit reached. Upgrade to Starter for unlimited messaging.",
        });
      }
      return true;
    }

    const FAIR_USE_CAP = 3500;
    const currentCount = user.monthlyMessageCount || user.messagesUsed || 0;
    if (currentCount >= FAIR_USE_CAP && tier.id !== "live_vip" && tier.id !== "elite") {
      throw new ConvexError({
        code: "FAIR_USE_EXCEEDED",
        message: "Monthly fair use limit reached. Please contact support or upgrade to Live VIP.",
      });
    }

    return true;
  },
});

export const incrementMessageCount = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return;

    const currentMonthly = user.monthlyMessageCount || 0;
    const currentTotal = user.messagesUsed || 0;

    await ctx.db.patch(args.userId, {
      monthlyMessageCount: currentMonthly + 1,
      messagesUsed: currentTotal + 1,
    });
  },
});

export const updateUserPlan = mutation({
  args: {
    userId: v.id("users"),
    tierId: v.string(),
  },
  handler: async (ctx, args) => {
    const tierKey = args.tierId.toUpperCase() as keyof typeof SUBSCRIPTION_TIERS;
    const tier = SUBSCRIPTION_TIERS[tierKey];

    if (!tier) {
      throw new ConvexError({
        code: "INVALID_TIER",
        message: "Invalid subscription tier requested",
      });
    }

    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const existingCredits = user.videoCredits || user.credits || 0;

    await ctx.db.patch(args.userId, {
      plan: tier.id as any,
      subscriptionTier: tier.id,
      videoCredits: existingCredits + tier.monthlyCredits,
      credits: existingCredits + tier.monthlyCredits,
    });
  },
});

export const setCreatorLiveStatus = mutation({
  args: {
    isLive: v.boolean(),
    activeRoom: v.string(),
    isAvatar: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "User not logged in",
      });
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "User profile not found",
      });
    }

    const updates: Partial<typeof user> = {
      isLive: args.isLive,
      activeRoom: args.activeRoom,
    };

    if (args.isAvatar !== undefined) {
      updates.isAvatar = args.isAvatar;
    }

    await ctx.db.patch(user._id, updates);

    return { success: true };
  },
});

export const getOnlineCreators = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_live_status", (q) => q.eq("isLive", true))
      .collect();
  },
});