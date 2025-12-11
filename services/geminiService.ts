import { GoogleGenAI, Type } from "@google/genai";
import { Reference, MethodologyOption, ResearchTopic } from "../types";

// Helper to get client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

// Now accepts references to base topics on actual literature
export const generateNovelTopics = async (domain: string, references: Reference[]): Promise<ResearchTopic[]> => {
  const ai = getClient();
  const modelId = "gemini-3-pro-preview"; // High reasoning model for novelty

  // Prioritize verified papers with abstracts for the reasoning context
  // This enables the model to perform "deep reading" rather than just title skimming
  const richContext = references
    .filter(r => r.isVerified && r.abstract)
    .slice(0, 15) // Top 15 verified with abstracts to fit context efficiently
    .map((r, i) => `
      PAPER [${i+1}]
      Title: ${r.title}
      Year: ${r.year}
      Venue: ${r.venue || r.source}
      Citations: ${r.citationCount || 'N/A'}
      Abstract: ${r.abstract}
    `).join("\n\n");
    
  // Fallback/Supplementary context for papers without abstracts
  const basicContext = references
     .filter(r => !r.isVerified || !r.abstract)
     .slice(0, 20)
     .map(r => `[Paper] ${r.title} (${r.year})`)
     .join("\n");

  const prompt = `
    I have conducted a systematic literature review and deep validation in the domain of: "${domain}".
    
    Here is the Verified Knowledge Graph (Top Papers with Abstracts):
    ${richContext}
    
    Additional Scanned Papers:
    ${basicContext}

    ROLE: Senior Research Scientist.
    TASK: Perform a high-level meta-analysis to generate 5 NOVEL Research Topics.
    
    REASONING MODULE INSTRUCTIONS:
    1. READ the abstracts to identify specific technical limitations.
    2. FIND CONTRADICTIONS: Where do papers disagree?
    3. IDENTIFY SATURATION: What is over-researched?
    4. SYNTHESIZE: Propose "Synthetic Contributions" (e.g., combining Algorithm A from Paper [1] with Framework B from Paper [3]).

    Output a JSON array of objects.
    Schema:
    [
      {
        "id": "1",
        "title": "Precise Research Title",
        "description": "Brief explanation of the research idea",
        "gap": "Explicitly state the overlap/contradiction found. E.g., 'While [1] proposes X, it fails to account for Y shown in [3].'",
        "noveltyScore": 85, (Number 1-100 based on uniqueness)
        "feasibility": "High" (High/Medium/Low)
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              gap: { type: Type.STRING },
              noveltyScore: { type: Type.INTEGER },
              feasibility: { type: Type.STRING },
            },
            required: ["id", "title", "description", "gap", "noveltyScore", "feasibility"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ResearchTopic[];
    }
    return [];
  } catch (error) {
    console.error("Topic generation failed:", error);
    throw error;
  }
};

// --- MULTI-ENGINE SEARCH INFRASTRUCTURE ---

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
    // Fallback extraction
    const firstBracket = text.indexOf('[');
    const lastBracket = text.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
         try {
            return JSON.parse(text.substring(firstBracket, lastBracket + 1));
         } catch (e2) { return []; }
    }
    return [];
  }
};

const runSpecializedAgent = async (
  agentName: string, 
  focusInstructions: string, 
  topic: string, 
  allowPreprints: boolean
): Promise<Reference[]> => {
  const ai = getClient();
  const modelId = "gemini-2.5-flash"; // Fast model for parallel execution

  const prompt = `
    ROLE: Specialized Research Agent for ${agentName}.
    TASK: Find 12-15 high-impact academic papers on the topic: "${topic}".
    
    STRICT SOURCE CONSTRAINTS:
    ${focusInstructions}
    
    PREPRINT POLICY: ${allowPreprints ? "High-quality preprints (arXiv/bioRxiv) ARE allowed if relevant." : "NO preprints. Strictly peer-reviewed."}

    REQUIREMENTS:
    1. Verify DOIs/URLs. Fake citations are prohibited.
    2. Prioritize papers from 2020-2025.
    3. Output raw JSON array.

    Output Format: [{"title": "...", "authors": ["..."], "year": "...", "url": "...", "doi": "...", "snippet": "...", "source": "${agentName}", "isPreprint": boolean, "isVerified": false}]
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] },
    });
    
    const refs = extractJson(response.text || "");
    // Tag the source explicitly if the model didn't
    return refs.map(r => ({ ...r, source: r.source || agentName, isVerified: false }));
  } catch (error) {
    console.warn(`Agent ${agentName} failed:`, error);
    return [];
  }
};

export const searchLiterature = async (
  topic: string, 
  includePreprints: boolean,
  onProgress?: (agentName: string, count: number) => void
): Promise<Reference[]> => {
  
  // Wrapper to intercept completion and report progress
  const wrapAgent = async (name: string, promise: Promise<Reference[]>) => {
    try {
      const results = await promise;
      if (onProgress) onProgress(name, results.length);
      return results;
    } catch (e) {
      if (onProgress) onProgress(name, 0);
      return [];
    }
  };

  // We launch 4 parallel agents
  const agent1_IEEE = runSpecializedAgent(
    "IEEE Xplore", 
    "Search ONLY: IEEE Transactions, IEEE Journals, IEEE International Conferences. Look for DOIs starting with 10.1109/.", 
    topic, 
    false // IEEE is strict peer review
  );

  const agent2_Springer = runSpecializedAgent(
    "Springer Nature", 
    "Search ONLY: SpringerLink, Nature Portfolio, Lecture Notes in Computer Science (LNCS). Look for DOIs starting with 10.1007/ or 10.1038/.", 
    topic, 
    false
  );

  const agent3_Elsevier = runSpecializedAgent(
    "Elsevier", 
    "Search ONLY: ScienceDirect, Cell Press, Elsevier Journals. Look for DOIs starting with 10.1016/.", 
    topic, 
    false
  );

  const agent4_General = runSpecializedAgent(
    "General/ACM/ArXiv", 
    "Search: ACM Digital Library, Wiley, Taylor & Francis. " + (includePreprints ? "ALSO include top-tier arXiv papers." : "Do NOT include preprints."), 
    topic, 
    includePreprints
  );

  // Wait for all agents
  const results = await Promise.all([
    wrapAgent("IEEE Xplore", agent1_IEEE),
    wrapAgent("Springer Nature", agent2_Springer),
    wrapAgent("Elsevier", agent3_Elsevier),
    wrapAgent("General", agent4_General)
  ]);
  
  // Flatten results
  const allRefs = results.flat();

  // Deduplication
  const uniqueRefs: Reference[] = [];
  const seenTitles = new Set<string>();

  for (const ref of allRefs) {
    const normTitle = ref.title.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!seenTitles.has(normTitle)) {
      seenTitles.add(normTitle);
      uniqueRefs.push(ref);
    }
  }

  return uniqueRefs;
};

export const proposeMethodologies = async (topic: string, references: Reference[]): Promise<MethodologyOption[]> => {
  const ai = getClient();
  const modelId = "gemini-3-pro-preview";

  const refContext = references.slice(0, 25).map(r => `- ${r.title} (${r.year}) [${r.source}]`).join("\n");

  const prompt = `
    I am researching: "${topic}".
    
    Based on the literature context:
    ${refContext}

    Propose 3 distinct, rigorous research methodologies.
    
    Output JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              implications: { type: Type.STRING },
              justification: { type: Type.STRING },
            },
            required: ["id", "name", "description", "implications", "justification"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as MethodologyOption[];
    }
    return [];
  } catch (error) {
    console.error("Methodology proposal failed:", error);
    throw error;
  }
};

export const generateLatexManuscript = async (
  topic: string,
  methodology: MethodologyOption,
  templateName: string,
  references: Reference[],
  onChunk: (chunk: string) => void
): Promise<string> => {
  const ai = getClient();
  const modelId = "gemini-3-pro-preview";

  const refString = references.map((r, i) => `[${i+1}] ${r.authors.join(", ")}. "${r.title}". ${r.venue || r.source}, ${r.year}.`).join("\n");

  const prompt = `
    You are an expert academic researcher.
    Write a complete, rigorous scientific manuscript in LaTeX.
    
    Topic: ${topic}
    Selected Methodology: ${methodology.name} - ${methodology.description}
    Target Template Style: ${templateName} (Use appropriate documentclass).
    
    References to Cite (Integrate at least 20-30 of these into the text):
    ${refString}

    Requirements:
    1. Structure: Title, Abstract, Introduction, Related Work (Comprehensive), Methodology, Results/Analysis, Discussion, Conclusion, References.
    2. Content: High academic tone, mathematical formulations if applicable.
    3. BibTeX: Use 'filecontents' or standard \bibliography environment. Ensure citations match.
    4. Output: ONLY LaTeX code.
  `;

  try {
    const result = await ai.models.generateContentStream({
      model: modelId,
      contents: prompt,
      config: {
        thinkingConfig: {
           thinkingBudget: 4096 
        } 
      }
    });

    let fullText = "";
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    return fullText;
  } catch (error) {
    console.error("LaTeX generation failed:", error);
    throw error;
  }
};