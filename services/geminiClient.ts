
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

export const getKeyCount = () => KEYS.length;
