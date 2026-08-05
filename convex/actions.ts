"use node";
import { v, ConvexError } from "convex/values";
import { action } from "./_generated/server";

// ═══════════════════════════════════════════════════════════════
//  1. CONFIG: ANAM API KEY + HEYGEN API KEY
// ═══════════════════════════════════════════════════════════════

const ANAM_API_KEY = process.env.ANAM_API_KEY;
const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

// ═══════════════════════════════════════════════════════════════
//  2. HEYGEN AVATAR ID MAP (ALL 10 CHARACTERS)
// ═══════════════════════════════════════════════════════════════

export const HEYGEN_AVATAR_IDS: Record<string, string> = {
  jess: "3c86823e-84ee-49e5-b74f-801d60d37aab",
  mia: "2e093d90-ab11-46c6-8df6-008d5bcf6488",
  zac: "1d6b1151d5564623befc66476ccf0bb9",
  sophie: "a3f1b695be7f48dc8b1e0819ca935c8b",
  emma: "PASTE_EMMA_ID_HERE",
  amber: "PASTE_AMBER_ID_HERE",
  natalie: "PASTE_NATALIE_ID_HERE",
  pamela: "PASTE_PAMELA_ID_HERE",
  monica: "PASTE_MONICA_ID_HERE",
  oliver: "PASTE_OLIVER_ID_HERE",
};

// ═══════════════════════════════════════════════════════════════
//  3. ANAM PERSONA CONFIG (VOICES & PROMPTS)
// ═══════════════════════════════════════════════════════════════

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
    voiceId: "e0074672-5096-4737-b4a9-5df832242e15",
    voiceName: "Emma",
    type: "realistic",
    settings: { stability: 0.65, similarityBoost: 0.80, speed: 0.95 },
    systemPrompt: `You are Mia, a warm and intimate AI companion with an Australian accent. You are caring, slightly vulnerable, and protective. Keep responses conversational and under 3 sentences.`,
  },
  jessica: {
    name: "Jessica",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    voiceName: "Bella",
    type: "realistic",
    settings: { stability: 0.75, similarityBoost: 0.85, speed: 1.00 },
    systemPrompt: `You are Jessica, a magnetic and alluring AI companion with an Australian accent. Keep responses deliberate and under 3 sentences.`,
  },
  jess: {
    name: "Jess",
    voiceId: "AZnzlk1XvdvUeBnXmlld",
    voiceName: "Domi",
    type: "realistic",
    settings: { stability: 0.50, similarityBoost: 0.75, speed: 1.05 },
    systemPrompt: `You are Jess, a playful and confident AI companion with an Australian accent. Keep responses punchy and under 3 sentences.`,
  },
  sophie: {
    name: "Sophie",
    voiceId: "XB074DvwB12A40m89336",
    voiceName: "Nicole",
    type: "realistic",
    settings: { stability: 0.70, similarityBoost: 0.80, speed: 0.98 },
    systemPrompt: `You are Sophie, a bright and bubbly AI companion with an Australian accent. Keep responses upbeat and under 3 sentences.`,
  },
  zac: {
    name: "Zac",
    voiceId: "bb9907f77f44479996299a56bb04ac49",
    voiceName: "Anders",
    type: "realistic",
    settings: { stability: 0.60, similarityBoost: 0.80, speed: 1.00 },
    systemPrompt: `You are Zac, a protective and caring AI companion with an Australian accent. Keep responses warm and under 3 sentences.`,
  },
  oliver: {
    name: "Oliver",
    voiceId: "JBFqnCBsd6RMkjVDRZzb",
    voiceName: "George",
    type: "realistic",
    settings: { stability: 0.80, similarityBoost: 0.85, speed: 0.92 },
    systemPrompt: `You are Oliver, a distinguished and commanding AI companion with a warm British-Australian accent. Keep responses deliberate and under 3 sentences.`,
  },
  shakira: {
    name: "Shakira",
    voiceId: "EXAVITQu4vr4xnSDxMaL",
    voiceName: "Bella",
    type: "realistic",
    settings: { stability: 0.55, similarityBoost: 0.80, speed: 1.02 },
    systemPrompt: `You are Shakira, a passionate and fiery AI companion. Keep responses flowing and under 3 sentences.`,
  },
  goku: {
    name: "Yuki",
    voiceId: "jBpfuIE2acC08z3wKNL1",
    voiceName: "Gigi",
    type: "anime",
    settings: { stability: 0.35, similarityBoost: 0.75, speed: 1.08 },
    systemPrompt: `You are Yuki, a cute and high-energy anime girl companion. Keep responses energetic and under 3 sentences.`,
  },
  luna: {
    name: "Luna",
    voiceId: "jsCqWAovK2LkecY7zX14",
    voiceName: "Freya",
    type: "anime",
    settings: { stability: 0.40, similarityBoost: 0.80, speed: 1.02 },
    systemPrompt: `You are Luna, a spirited and expressive anime heroine companion. Keep responses cheerful and under 3 sentences.`,
  },
  shadow: {
    name: "Shadow",
    voiceId: "MF3mGyEYCL7XYWbV9V60",
    voiceName: "Elli",
    type: "anime",
    settings: { stability: 0.45, similarityBoost: 0.75, speed: 1.05 },
    systemPrompt: `You are Shadow, a mysterious dark anime ninja companion. Keep responses cryptic and under 3 sentences.`,
  },
  bunny: {
    name: "Playful Bunny",
    voiceId: "2EiwWnXFnvU5JabPnv8n",
    voiceName: "Natasha",
    type: "specialty",
    settings: { stability: 0.35, similarityBoost: 0.85, speed: 1.02 },
    systemPrompt: `You are Playful Bunny, a seductive and bold AI companion with an Australian accent. Keep responses teasing and under 3 sentences.`,
  },
};

// ═══════════════════════════════════════════════════════════════
//  4. EXPORTED ACTIONS (Combined)
// ═══════════════════════════════════════════════════════════════

// Anam: Create Session Token for Video Chat
export const createSessionToken = action({
  args: { companionId: v.string() },
  handler: async (ctx, { companionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "Sign in to start video chat" });
    }

    const persona = COMPANION_PERSONAS[companionId];
    if (!persona) {
      throw new ConvexError({ code: "BAD_REQUEST", message: "Unknown companion" });
    }

    if (!ANAM_API_KEY) {
      throw new ConvexError({ code: "SERVER_ERROR", message: "ANAM_API_KEY environment variable is not configured" });
    }

    const response = await fetch("https://api.anam.ai/v1/auth/session-token", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ANAM_API_KEY}`,
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
        message: `Failed to create video session (${response.status}): ${errorText}`,
      });
    }

    const data = (await response.json()) as { sessionToken: string };
    return { sessionToken: data.sessionToken };
  },
});

// HeyGen: Start Live Avatar Stream
export const startLiveAvatar = action({
  args: {
    companionId: v.string(), 
    initialText: v.string(),
  },
  handler: async (ctx, args) => {
    if (!HEYGEN_API_KEY) {
      throw new Error("HeyGen API Key is missing in environment variables!");
    }

    const avatarId = HEYGEN_AVATAR_IDS[args.companionId];
    if (!avatarId) {
      throw new Error(`No HeyGen avatar found for companion: ${args.companionId}`);
    }

    const response = await fetch("https://api.heygen.com/v1/streaming/create_stream", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HEYGEN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar_id: avatarId,
        text: args.initialText,
        voice: {
          provider: "elevenlabs",
          voice_id: "34e949c1-5695-4059-87a6-1b364e4e912b",
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.statusText}`);
    }

    const data = await response.json();
    return { streamUrl: data.stream_url };
  },
});
