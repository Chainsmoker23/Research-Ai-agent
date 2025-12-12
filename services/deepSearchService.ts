
import { GoogleGenAI } from "@google/genai";
import { Reference } from "../types";
import * as CitationService from './citationService';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export interface AgentProgress {
    name: string;
    role: string;
    status: 'idle' | 'analyzing' | 'searching' | 'processing' | 'completed' | 'error';
    foundCount: number;
    description: string;
    color: string;
}

const AGENTS_CONFIG = [
    { 
        name: "Archive Sentinel", 
        role: "Historian", 
        description: "Searching for foundational theories and seminal papers (Pre-2020).",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        promptSuffix: "Focus on highly cited, foundational papers from 2010-2020. Look for seminal definitions and core theories."
    },
    { 
        name: "Trend Scout", 
        role: "Futurist", 
        description: "Scanning for State-of-the-Art results and preprints (2023-2025).",
        color: "text-emerald-600 bg-emerald-50 border-emerald-200",
        promptSuffix: "Focus strictly on papers from 2023, 2024, and 2025. Include high-quality arXiv preprints if they are SOTA."
    },
    { 
        name: "Method Miner", 
        role: "Methodologist", 
        description: "Identifying papers with similar or contrasting methodologies.",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        promptSuffix: "Focus on the RESEARCH METHODOLOGY. Find papers that use similar algorithms, datasets, or experimental designs."
    },
    { 
        name: "Gap Hunter", 
        role: "Critic", 
        description: "Finding limitations, negative results, and opposing viewpoints.",
        color: "text-rose-600 bg-rose-50 border-rose-200",
        promptSuffix: "Find papers that discuss LIMITATIONS, challenges, or provide counter-evidence to the current trends."
    }
];

// Helper to clean JSON
const extractJson = (text: string): any[] => {
    try {
      let jsonString = text.trim();
      if (jsonString.startsWith("```json")) {
          jsonString = jsonString.replace(/^```json/, "").replace(/```$/, "");
      } else if (jsonString.startsWith("```")) {
          jsonString = jsonString.replace(/^```/, "").replace(/```$/, "");
      }
      const parsed = JSON.parse(jsonString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      // Fallback regex
      const match = text.match(/\[.*\]/s);
      if (match) {
          try { return JSON.parse(match[0]); } catch (e2) { return []; }
      }
      return [];
    }
};

const runSingleAgent = async (
    agentConfig: typeof AGENTS_CONFIG[0],
    topic: string,
    abstract: string,
    onUpdate: (progress: AgentProgress) => void
): Promise<Reference[]> => {
    const ai = getClient();
    const modelId = "gemini-2.5-flash"; // Flash for speed

    // 1. Generate Query
    onUpdate({ ...agentConfig, status: 'analyzing', foundCount: 0 } as AgentProgress);
    
    const prompt = `
        ROLE: You are the ${agentConfig.name} (${agentConfig.role}).
        TASK: Find 15-20 distinct academic citations related to the Research Topic.
        
        TOPIC: "${topic}"
        ABSTRACT SUMMARY: "${abstract.slice(0, 300)}..."
        
        YOUR SPECIFIC FOCUS: ${agentConfig.promptSuffix}
        
        INSTRUCTIONS:
        1. Use Google Search to find real papers.
        2. Verify they exist.
        3. Output a raw JSON array. Do not include markdown formatting like \`\`\`json.
        
        OUTPUT FORMAT: [{"title": "...", "authors": ["..."], "year": "...", "doi": "...", "venue": "..."}]
    `;

    try {
        onUpdate({ ...agentConfig, status: 'searching', foundCount: 0 } as AgentProgress);
        
        let response;
        // Retry logic for rate limits (429)
        for (let i = 0; i < 3; i++) {
            try {
                response = await ai.models.generateContent({
                    model: modelId,
                    contents: prompt,
                    config: { 
                        tools: [{ googleSearch: {} }],
                        // responseMimeType: "application/json" // REMOVED: Incompatible with googleSearch tool in current API version
                    },
                });
                break;
            } catch (e: any) {
                // Check for rate limit error
                if (e.status === 429 || e.code === 429 || (e.message && e.message.includes('429'))) {
                    console.warn(`${agentConfig.name} hit rate limit (429). Retrying in ${(i + 1) * 2}s...`);
                    await new Promise(r => setTimeout(r, (i + 1) * 2000));
                    continue;
                }
                throw e; // Rethrow other errors
            }
        }

        if (!response) throw new Error("Failed to get response after retries");

        const rawRefs = extractJson(response.text || "[]");
        
        // Map to Reference type
        const refs: Reference[] = rawRefs.map((r: any) => ({
            title: r.title || "Unknown",
            authors: Array.isArray(r.authors) ? r.authors : [r.authors || "Unknown"],
            year: r.year?.toString() || "n.d.",
            doi: r.doi,
            venue: r.venue,
            source: agentConfig.name,
            snippet: "",
            isPreprint: false,
            isVerified: false
        }));

        onUpdate({ ...agentConfig, status: 'processing', foundCount: refs.length } as AgentProgress);
        return refs;

    } catch (error) {
        console.error(`${agentConfig.name} failed`, error);
        onUpdate({ ...agentConfig, status: 'error', foundCount: 0 } as AgentProgress);
        return [];
    }
};

export const orchestrateDeepSearch = async (
    topic: string,
    abstract: string,
    onAgentUpdate: (agentName: string, progress: AgentProgress) => void,
    onGlobalProgress: (msg: string) => void
): Promise<Reference[]> => {
    
    // 1. Launch all agents in parallel (with stagger)
    const agentPromises = AGENTS_CONFIG.map(async (config, index) => {
        // Initial state
        onAgentUpdate(config.name, { ...config, status: 'idle', foundCount: 0 } as AgentProgress);
        
        // Stagger execution by 1.5s each to prevent hitting burst rate limits (429)
        await new Promise(resolve => setTimeout(resolve, index * 1500));

        return runSingleAgent(config, topic, abstract, (p) => onAgentUpdate(config.name, p));
    });

    const results = await Promise.all(agentPromises);
    const allRawRefs = results.flat();

    // 2. Deduplication
    onGlobalProgress(`Consolidating ${allRawRefs.length} raw citations...`);
    const uniqueMap = new Map<string, Reference>();
    allRawRefs.forEach(r => {
        // Simple normalization
        const key = r.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, r);
        }
    });
    
    const uniqueRefs = Array.from(uniqueMap.values());

    // 3. Parallel Validation
    // We split the unique refs into chunks to not overwhelm the browser/network
    onGlobalProgress(`Validating ${uniqueRefs.length} unique papers against OpenAlex/Crossref...`);
    
    // Update agents to "completed" visually
    AGENTS_CONFIG.forEach(c => {
        onAgentUpdate(c.name, { ...c, status: 'completed', foundCount: 0 } as AgentProgress); 
    });

    // Use existing CitationService but we can optimize the call
    // CitationService.validateBatch handles parallel internally via Promise.all
    const validatedRefs = await CitationService.validateBatch(uniqueRefs, (curr, total, title) => {
        onGlobalProgress(`Validating: ${Math.round((curr/total)*100)}% (${title.substring(0, 20)}...)`);
    });

    // Filter to ensure quality (must have valid DOI or be verified)
    const finalRefs = validatedRefs.filter(r => r.isVerified || (r.doi && r.doi.includes("10.")));

    return finalRefs;
};
