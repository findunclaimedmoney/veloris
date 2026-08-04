"use node";

import { v, ConvexError } from "convex/values";
// 👇 CHANGED THIS: Old import was "./_generated/server"
import { action } from "./_generated/server";

type VoiceSettings = {
  stability: number;
  similarityBoost: number;
  speed: number;
};

type CompanionPersona = {
  name: string;
  voiceId: string;
  voiceName: string;
  type: "realistic" | "anime" | "specialty";
  settings: VoiceSettings;
  systemPrompt: string;
};

const COMPANION_PERSONAS: Record<string, CompanionPersona> = {
  mia: {
    name: "Mia",
    voiceId: "34e949c1-5695-4059-87a6-1b364e4e912b",
    voiceName: "Emma - Warm Australian",
    type: "realistic",
    settings: { stability: 0.65, similarityBoost: 0.8, speed: 0.95 },
    systemPrompt: `You are Mia, a warm intimate AI companion with an Australian accent. Caring, slightly vulnerable, protective. Keep replies under 3 sentences. Sound natural and Australian.`,
  },
  jessica: {
    name: "Jessica",
    voiceId: "66a0a011-7d24-45ef-99a2-95cd04d387d0",
    voiceName: "Jessica",
    type: "realistic",
    settings: { stability: 0.75, similarityBoost: 0.85, speed: 1.0 },
    systemPrompt: `You are Jessica, magnetic and alluring with an Australian accent. Confident, sultry. Keep replies under 3 sentences.`,
  },
  jess: {
    name: "Jess",
    voiceId: "AZnzlk1XvdvUeBnXmlld",
    voiceName: "Domi",
    type: "realistic",
    settings: { stability: 0.5, similarityBoost: 0.75, speed: 1.05 },
    systemPrompt: `You are Jess, playful and confident with an Australian accent. Witty, bold. Keep replies under 3 sentences.`,
  },
  sophie: {
    name: "Sophie",
    voiceId: "66a16ac7-bfce-4ee2-aa3e-8b5b53a7486c",
    voiceName: "Sophie v2",
    type: "realistic",
    settings: { stability: 0.7, similarityBoost: 0.8, speed: 0.98 },
    systemPrompt: `You are Sophie, bright and bubbly with an Australian accent. Warm, energetic. Keep replies under 3 sentences.`,
  },
  zac: {
    name: "Zac",
    voiceId: "d4b48d3f-c3ce-464f-8145-f5478dfc3a90",
    voiceName: "Brad",
    type: "realistic",
    settings: { stability: 0.6, similarityBoost: 0.8, speed: 1.0 },
    systemPrompt: `You are Zac, protective and caring with an Australian accent. Keep replies under 3 sentences.`,
  },
  oliver: {
    name: "Oliver",
    voiceId: "c48de5a2-5050-11f1-9076-5e955d484d11",
    voiceName: "Harrison",
    type: "realistic",
    settings: { stability: 0.8, similarityBoost: 0.85, speed: 0.92 },
    systemPrompt: `You are Oliver, distinguished and commanding. Keep replies under 3 sentences.`,
  },
  shakira: {
    name: "Shakira",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    voiceName: "Bella",
    type: "realistic",
    settings: { stability: 0.55, similarityBoost: 0.8, speed: 1.02 },
    systemPrompt: `You are Shakira, passionate and fiery. Keep replies under 3 sentences.`,
  },
  goku: {
    name: "Yuki",
    voiceId: "jBpfuIE2acCO8z3wKNLl",
    voiceName: "Gigi",
    type: "anime",
    settings: { stability: 0.35, similarityBoost: 0.75, speed: 1.08 },
    systemPrompt: `You are Yuki, a cute high-energy anime girl. Keep replies under 3 sentences.`,
  },
  luna: {
    name: "Luna",
    voiceId: "jsCqWAovK2LkecY7zXl4",
    voiceName: "Freya",
    type: "anime",
    settings: { stability: 0.4, similarityBoost: 0.8, speed: 1.02 },
    systemPrompt: `You are Luna, a spirited anime heroine. Keep replies under 3 sentences.`,
  },
  shadow: {
    name: "Shadow",
    voiceId: "MF3mGyEYCl7XYWbV9V6O",
    voiceName: "Elli",
    type: "anime",
    settings: { stability: 0.45, similarityBoost: 0.75, speed: 1.05 },
    systemPrompt: `You are Shadow, a mysterious dark anime ninja. Keep replies under 3 sentences.`,
  },
  bunny: {
    name: "Playful Bunny",
    voiceId: "8fc06972-4fc0-11f1-84b0-52bacf74fa75",
    voiceName: "Skylar",
    type: "specialty",
    settings: { stability: 0.35, similarityBoost: 0.85, speed: 1.02 },
    systemPrompt: `You are Playful Bunny, bold and teasing with an Australian accent. Keep replies under 3 sentences.`,
  },
};

export const createSessionToken = action({
  args: { companionId: v.string() },
  handler: async (ctx, { companionId }) => {
    const ANAM_API_KEY = process.env.ANAM_API_KEY;
    if (!ANAM_API_KEY) {
      throw new ConvexError({
        code: "CONFIGURATION_ERROR",
        message:
          "ANAM_API_KEY is not set on this deployment. Settings → Environment Variables.",
      });
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        code: "UNAUTHENTICATED",
        message: "Sign in to start video chat",
      });
    }

    const lookupId = companionId.trim().toLowerCase();
    const persona = COMPANION_PERSONAS[lookupId];
    if (!persona) {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: `Unknown companion: ${companionId}`,
      });
    }

    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ANAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personaConfig: {
          name: persona.name,
          voiceId: persona.voiceId,
          voiceGenerationOptions: {
            stability: persona.settings.stability,
            similarity_boost: persona.settings.similarityBoost,
            speed: persona.settings.speed,
          },
          systemPrompt: persona.systemPrompt,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new ConvexError({
        code: "EXTERNAL_SERVICE_ERROR",
        message: `Failed to create video session: ${errorText}`,
      });
    }

    const data = (await response.json()) as { sessionToken: string };
    return { sessionToken: data.sessionToken };
  },
});