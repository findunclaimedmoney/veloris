import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const SUBSCRIPTION_TIERS = {
  FREE: { id: "free", name: "Free", monthlyMessages: 20, monthlyCredits: 0 },
  STARTER: { id: "starter", name: "Starter", monthlyMessages: 100, monthlyCredits: 0 },
  SPARK: { id: "spark", name: "Spark", monthlyMessages: 500, monthlyCredits: 0 },
  INTIMATE: { id: "intimate", name: "Intimate", monthlyMessages: 2000, monthlyCredits: 0 },
  LIVE: { id: "live", name: "Live", monthlyMessages: 5000, monthlyCredits: 0 },
  VIP: { id: "vip", name: "VIP", monthlyMessages: Infinity, monthlyCredits: 0 },
  ELITE: { id: "elite", name: "Elite", monthlyMessages: Infinity, monthlyCredits: 0 },
  PRO: { id: "pro", name: "Pro", monthlyMessages: Infinity, monthlyCredits: 0 },
  LIVE_VIP: { id: "live_vip", name: "Live VIP", monthlyMessages: Infinity, monthlyCredits: 0 },
} as const;

export default defineSchema({
  // ─── Users Table ─────────────────────────────────────────────
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    plan: v.string(),
    subscriptionTier: v.string(),
    role: v.string(),
    monthlyMessageCount: v.number(),
    messagesUsed: v.optional(v.number()),
    videoCredits: v.number(),
    credits: v.optional(v.number()),
    referralCode: v.optional(v.string()),
    referredBy: v.optional(v.string()),
    contractAccepted: v.boolean(),
    contractAcceptedAt: v.optional(v.string()),
    isLive: v.optional(v.boolean()),
    activeRoom: v.optional(v.string()),
    isAvatar: v.optional(v.boolean()),
  }).index("by_token", ["tokenIdentifier"])
    .index("by_referral_code", ["referralCode"])
    .index("by_live_status", ["isLive"]),

  // ─── Memories Table ──────────────────────────────────────────
  memories: defineTable({
    userId: v.id("users"),
    companionId: v.string(),
    category: v.string(),
    key: v.string(),
    value: v.string(),
    intimacyLevel: v.number(),
    weight: v.number(),
    lastAccessedAt: v.number(),
    accessCount: v.number(),
    createdAt: v.number(),
  }).index("by_user_and_companion", ["userId", "companionId"])
    .index("by_user_companion_key", ["userId", "companionId", "key"]),

  // ─── Session States Table ────────────────────────────────────
  sessionStates: defineTable({
    userId: v.id("users"),
    companionId: v.string(),
    questionsAskedThisSession: v.array(v.string()),
    activeTopic: v.optional(v.string()),
    lastUserMessageTopic: v.optional(v.string()),
    turnCount: v.number(),
    updatedAt: v.number(),
  }).index("by_user_and_companion", ["userId", "companionId"]),

  // ─── NEW: Purchases Table ────────────────────────────────────
  purchases: defineTable({
    userId: v.id("users"),
    sessionType: v.union(v.literal("15min"), v.literal("30min"), v.literal("pro")),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    stripeSessionId: v.optional(v.string()),
    purchasedAt: v.string(),
  }).index("by_user", ["userId"]),

  // ─── NEW: Chat Sessions Table ───────────────────────────────
  chatSessions: defineTable({
    userId: v.id("users"),
    companionId: v.string(),
    companionName: v.string(),
    messageCount: v.number(),
    lastMessageAt: v.string(),
    intimacyLevel: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_and_companion", ["userId", "companionId"]),

  // ─── NEW: Favorites Table ────────────────────────────────────
  favorites: defineTable({
    userId: v.id("users"),
    companionId: v.string(),
  }).index("by_user", ["userId"])
    .index("by_user_and_companion", ["userId", "companionId"]),
});