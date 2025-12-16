
import { GoogleGenAI } from "@google/genai";

// --- API KEY CONFIGURATION INSTRUCTIONS ---
// To use the Multi-Key Rotation System:
// 1. Create a .env file in your root directory.
// 2. Add API_KEY=key1,key2,key3 (comma-separated, no spaces).
// 
// The system below automatically splits this string.
// If you only have one key, it works normally.
// If you have multiple, it shards agents across them to maximize quota.
// ------------------------------------------

// Parse keys from comma-separated string
const RAW_KEYS = process.env.API_KEY || "";
const KEYS = RAW_KEYS.split(',').map(k => k.trim()).filter(k => k.length > 0);

if (KEYS.length === 0) {
    console.warn("ScholarAgent: No API Keys found in process.env.API_KEY");
} else {
    console.log(`ScholarAgent: ${KEYS.length} API Key(s) loaded for agent swarm.`);
}

export type AgentPurpose = 
  | 'DISCOVERY' 
  | 'VALIDATION' 
  | 'DEEP_SEARCH' 
  | 'REVIEW' 
  | 'EDITORIAL' 
  | 'DRAFTING' 
  | 'GENERAL';

/**
 * Returns a GoogleGenAI client instance with a key assigned based on the agent's purpose and unique ID.
 * This enables "Key Sharding" where different agents use different keys to maximize quota.
 */
export const getGeminiClient = (purpose: AgentPurpose, distinctId?: string) => {
    let keyIndex = 0;
    
    if (KEYS.length > 1) {
        // Create a deterministic hash based on the purpose + distinct ID (e.g. "DEEP_SEARCH-Archive Sentinel")
        const inputString = distinctId ? `${purpose}-${distinctId}` : purpose;
        let hash = 0;
        for (let i = 0; i < inputString.length; i++) {
            hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
        }
        keyIndex = Math.abs(hash) % KEYS.length;
    }
    
    const selectedKey = KEYS[keyIndex];
    return new GoogleGenAI({ apiKey: selectedKey });
};

/**
 * NEW: Explicitly select a client by index.
 * Used for rotation logic when hitting quota limits.
 */
export const getGeminiClientByIndex = (index: number) => {
    // If no keys, this fallback ensures we don't crash, though auth will fail.
    const validIndex = Math.abs(index) % (KEYS.length || 1);
    const selectedKey = KEYS[validIndex];
    return new GoogleGenAI({ apiKey: selectedKey });
};

export const getKeyCount = () => KEYS.length;

// --- ROTATION UTILITIES ---

const isQuotaError = (e: any) => {
  return e.status === 429 || 
         (e.message && (
            e.message.includes('429') || 
            e.message.includes('Quota') || 
            e.message.includes('Resource has been exhausted')
         ));
};

/**
 * Executes a Gemini operation with automatic key rotation on Quota errors.
 * This ensures that if Key 1 is exhausted, Key 2 takes over immediately.
 */
export const executeGeminiCall = async <T>(
  operation: (ai: GoogleGenAI) => Promise<T>,
  seed: string = "default"
): Promise<T> => {
  const totalKeys = KEYS.length;
  if (totalKeys === 0) throw new Error("No API Keys configured in .env");
  
  // Start with a deterministic key based on seed (e.g. section name)
  let keyIndex = Math.abs(seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  
  // We allow retrying through the entire pool plus a buffer for transient errors
  const maxAttempts = Math.max(totalKeys, 3);

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const ai = getGeminiClientByIndex(keyIndex);
      return await operation(ai);
    } catch (error: any) {
      if (isQuotaError(error)) {
        console.warn(`ScholarAgent: Quota hit on Key Index ${keyIndex % totalKeys}. Rotating to next key...`);
        keyIndex++; // Move to next key in sequence
        await new Promise(r => setTimeout(r, 1000 + (i * 500))); // Exponential backoff
        continue;
      }
      throw error; // Rethrow non-quota errors (e.g. safety, bad request)
    }
  }
  throw new Error("ScholarAgent: All API keys exhausted. Please add more keys or try again later.");
};
