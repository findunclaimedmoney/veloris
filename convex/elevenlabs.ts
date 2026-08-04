"use node";

import { v } from "convex/values";
// 👇 CHANGED THIS: Updated import to use the new Hercules SDK
import { action } from "./_generated/server";

// ═══════════════════════════════════════════════════════════════
// LENSFLOW / HeyMia — ElevenLabs Voice (Convex)
// ═══════════════════════════════════════════════════════════════

const MAX_TEXT_LENGTH = 500;
const MAX_REQUESTS_PER_MINUTE = 12;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_MINUTE) return false;
  entry.count++;
  return true;
}

type VoiceConfig = {
  voiceId: string;
  voiceName: string;
  settings: {
    stability: number;
    similarity_boost: number;
    speed: number;
    style: number;
    use_speaker_boost: boolean;
  };
};

// Verified working ElevenLabs voice IDs
const COMPANION_VOICES: Record<string, VoiceConfig> = {
  mia: {
    voiceId: "x3PfG9wL6FOEApZ1VJ9H", // mia aussie accent
    voiceName: "mia aussie accent",
    settings: {
      stability: 0.35,
      similarity_boost: 0.85,
      speed: 0.92,
      style: 0.4,
      use_speaker_boost: true,
    },
  },
  jess: {
    voiceId: "EST9Ui6982FZPSi7gCHi", // elise
    voiceName: "elise",
    settings: {
      stability: 0.4,
      similarity_boost: 0.8,
      speed: 1.0,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  jessica: {
    voiceId: "69h9o7wh5u0isWHzdogD", // jessica
    voiceName: "jessica",
    settings: {
      stability: 0.45,
      similarity_boost: 0.8,
      speed: 0.9,
      style: 0.2,
      use_speaker_boost: true,
    },
  },
  sophie: {
    voiceId: "Njff2H0wp1UQEn3e1y7M", // sophie
    voiceName: "sophie",
    settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 1.05,
      style: 0.3,
      use_speaker_boost: true,
    },
  },
  zac: {
    voiceId: "TxGEqnHWrfWFTfGW9XjX", // josh
    voiceName: "josh",
    settings: {
      stability: 0.4,
      similarity_boost: 0.8,
      speed: 0.95,
      style: 0.2,
      use_speaker_boost: true,
    },
  },
  oliver: {
    voiceId: "L1aJrPa7pLJEyYlh3Ilq", // oliver
    voiceName: "oliver",
    settings: {
      stability: 0.5,
      similarity_boost: 0.75,
      speed: 0.92,
      style: 0.1,
      use_speaker_boost: true,
    },
  },
  bunny: {
    voiceId: "sIrHSk1zRmpowV64JTAC", // playful bunny
    voiceName: "playful bunny",
    settings: {
      stability: 0.35,
      similarity_boost: 0.85,
      speed: 1.0,
      style: 0.45,
      use_speaker_boost: true,
    },
  },
  yuki: {
    voiceId: "eVItLK1UvXctxuaRV2Oq", // Jean - Alluring and Playful Femme Fatale
    voiceName: "Jean - Alluring and Playful Femme Fatale",
    settings: {
      stability: 0.35,
      similarity_boost: 0.85,
      speed: 1.0,
      style: 0.45,
      use_speaker_boost: true,
    },
  },
  luna: {
    voiceId: "vGQNBgLaiM3EdZtxIiuY", // Aerisita - Bubbly, Feminine and Outgoing
    voiceName: "Aerisita - Bubbly, Feminine and Outgoing",
    settings: {
      stability: 0.35,
      similarity_boost: 0.85,
      speed: 1.0,
      style: 0.45,
      use_speaker_boost: true,
    },
  },
  shakira: {
    voiceId: "X6VIT9ZXy5Nr7EmuLOGz", // Daria - Soft, Seductive, Villain, Mysterious voice
    voiceName: "Daria - Soft, Seductive, Villain, Mysterious voice",
    settings: {
      stability: 0.35,
      similarity_boost: 0.85,
      speed: 1.0,
      style: 0.45,
      use_speaker_boost: true,
    },
  },
  shadow: {
    voiceId: "JjsQrIrIBD6TZ656NQfi", // Dylo - Young, Fierce and Determined
    voiceName: "Dylo - Young, Fierce and Determined",
    settings: {
      stability: 0.35,
      similarity_boost: 0.85,
      speed: 1.0,
      style: 0.45,
      use_speaker_boost: true,
    },
  },
};

// 👇 Set a sensible default so the system always has a fallback
const DEFAULT_VOICE = COMPANION_VOICES.mia;

/**
 * Generate speech with ElevenLabs
 * Frontend call: api.voice.generateSpeech({ text, companionId })
 */
export const generateSpeech = action({
  args: {
    text: v.string(),
    companionId: v.optional(v.string()),
  },
  handler: async (ctx, { text, companionId }) => {
    const identity = await ctx.auth.getUserIdentity();
    const userId = identity?.tokenIdentifier ?? "anonymous";
    if (!checkRateLimit(userId)) {
      throw new Error("Too many voice requests. Please wait a moment.");
    }

    const cleanText = text.trim();
    if (!cleanText) throw new Error("Text cannot be empty");
    if (cleanText.length > MAX_TEXT_LENGTH) {
      throw new Error(`Text must be under ${MAX_TEXT_LENGTH} characters`);
    }

    const voiceConfig =
      (companionId && COMPANION_VOICES[companionId]) || DEFAULT_VOICE;

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error("Missing environment variable: ELEVENLABS_API_KEY");
    }

    console.log("generateSpeech", {
      companionId: companionId || "mia",
      voiceId: voiceConfig.voiceId,
      voiceName: voiceConfig.voiceName,
    });

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_flash_v2_5",
          voice_settings: {
            stability: voiceConfig.settings.stability,
            similarity_boost: voiceConfig.settings.similarity_boost,
            speed: voiceConfig.settings.speed,
            style: voiceConfig.settings.style,
            use_speaker_boost: voiceConfig.settings.use_speaker_boost,
          },
        }),
      }
    );

    if (!response.ok) {
      const bodyText = await response.text();
      console.error("ElevenLabs error", response.status, bodyText);
      throw new Error(`ElevenLabs ${response.status}: ${bodyText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return {
      audio: base64,
      contentType: "audio/mpeg",
      voiceName: voiceConfig.voiceName,
      companionId: companionId || "mia",
    };
  },
});

/**
 * Debug helper – returns current voice config
 */
export const getVoiceInfo = action({
  args: { companionId: v.optional(v.string()) },
  handler: async (ctx, { companionId }) => {
    const voiceConfig =
      (companionId && COMPANION_VOICES[companionId]) || DEFAULT_VOICE;
    return {
      companionId: companionId || "mia",
      voiceId: voiceConfig.voiceId,
      voiceName: voiceConfig.voiceName,
      settings: voiceConfig.settings,
      availableCompanions: Object.keys(COMPANION_VOICES),
    };
  },
});