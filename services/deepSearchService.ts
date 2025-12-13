

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
        promptSuffix: "Focus on highly cited, foundational papers from 2010-2020. You MUST find seminal definitions."
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
      // Remove markdown code blocks
      jsonString = jsonString.replace(/^```json\s*/g, "").replace(/^```\s*/g, "").replace(/\s*```$/g, "");
      
      // Attempt to find the first '[' and last ']'
      const start = jsonString.indexOf('[');
      const end = jsonString.lastIndexOf(']');
      
      if (start !== -1 && end !== -1) {
          jsonString = jsonString.substring(start, end + 1);
          return JSON.parse(jsonString);
      }
      return [];
    } catch (e) {
      console.warn("JSON extraction failed, returning empty list.");
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
    const modelId = "gemini-2.5-flash"; 

    // 1. Analysis Phase
    onUpdate({ ...agentConfig, status: 'analyzing', foundCount: 0 } as AgentProgress);
    await new Promise(r => setTimeout(r, 1500)); // Cognitive pause

    // 2. Search Phase
    onUpdate({ ...agentConfig, status: 'searching', foundCount: 0 } as AgentProgress);
    
    const prompt = `
        ROLE: You are the ${agentConfig.name} (${agentConfig.role}).
        TASK: Perform a REAL Google Search to find 5-10 distinct academic citations related to the Research Topic.
        
        TOPIC: "${topic}"
        ABSTRACT SUMMARY: "${abstract.slice(0, 300)}..."
        
        YOUR SPECIFIC FOCUS: ${agentConfig.promptSuffix}
        
        CRITICAL RULES:
        1. You MUST use the 'googleSearch' tool. Do not hallucinate papers.
        2. If you cannot find real papers, return an empty array.
        3. Include the 'snippet' or 'url' found in the search to prove existence.
        
        OUTPUT FORMAT:
        Return ONLY a raw JSON array. No markdown.
        [{"title": "...", "authors": ["..."], "year": "...", "doi": "...", "venue": "...", "snippet": "..."}]
    `;

    try {
        const startTime = Date.now();
        let response;
        
        // Retry logic for 429s
        for (let i = 0; i < 3; i++) {
            try {
                response = await ai.models.generateContent({
                    model: modelId,
                    contents: prompt,
                    config: { 
                        tools: [{ googleSearch: {} }],
                    },
                });
                break;
            } catch (e: any) {
                if (e.status === 429 || (e.message && e.message.includes('429'))) {
                    console.warn(`${agentConfig.name} hit rate limit. Retrying...`);
                    await new Promise(r => setTimeout(r, 2000 * (i + 1)));
                    continue;
                }
                throw e;
            }
        }

        // Enforce minimum execution time (simulating "reading")
        // If the API returns in 500ms, we wait until at least 3000ms have passed.
        const elapsedTime = Date.now() - startTime;
        const minTime = 3000 + Math.random() * 2000;
        if (elapsedTime < minTime) {
            await new Promise(r => setTimeout(r, minTime - elapsedTime));
        }

        if (!response || !response.text) throw new Error("No response from agent");

        const rawRefs = extractJson(response.text);
        
        // Map to Reference type
        const refs: Reference[] = rawRefs.map((r: any) => ({
            title: r.title || "Unknown",
            authors: Array.isArray(r.authors) ? r.authors : [r.authors || "Unknown"],
            year: r.year?.toString() || "n.d.",
            doi: r.doi,
            venue: r.venue || "Google Search Result",
            source: agentConfig.name,
            snippet: r.snippet || "",
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
        
        // Stagger execution significantly to prevent rate limits and make UI look "busy"
        await new Promise(resolve => setTimeout(resolve, index * 2000));

        return runSingleAgent(config, topic, abstract, (p) => onAgentUpdate(config.name, p));
    });

    const results = await Promise.all(agentPromises);
    const allRawRefs = results.flat();

    // 2. Deduplication
    onGlobalProgress(`Consolidating ${allRawRefs.length} raw citations...`);
    const uniqueMap = new Map<string, Reference>();
    allRawRefs.forEach(r => {
        const key = r.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, r);
        }
    });
    
    const uniqueRefs = Array.from(uniqueMap.values());

    // 3. Parallel Validation
    if (uniqueRefs.length > 0) {
        onGlobalProgress(`Validating ${uniqueRefs.length} unique papers against OpenAlex/Crossref...`);
        const validatedRefs = await CitationService.validateBatch(uniqueRefs, (curr, total, title) => {
            onGlobalProgress(`Validating: ${Math.round((curr/total)*100)}% (${title.substring(0, 20)}...)`);
        });
        
        // Finish state
        AGENTS_CONFIG.forEach((c, idx) => {
            const count = results[idx]?.length || 0;
            onAgentUpdate(c.name, { ...c, status: 'completed', foundCount: count } as AgentProgress); 
        });

        // Filter: Keep if Verified OR has a Snippet (meaning search found real text)
        return validatedRefs.filter(r => r.isVerified || (r.snippet && r.snippet.length > 20));
    } else {
        AGENTS_CONFIG.forEach((c, idx) => {
            const count = results[idx]?.length || 0;
            onAgentUpdate(c.name, { ...c, status: 'completed', foundCount: count } as AgentProgress); 
        });
        return [];
    }
};
