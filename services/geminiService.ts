
import { Type } from "@google/genai";
import { Reference, MethodologyOption, ResearchTopic, NoveltyAssessment } from "../types";
import { getGeminiClient } from "./geminiClient";

// --- NEW: NOVELTY CHECKER ---
export const assessTopicNovelty = async (title: string, overview: string, references: Reference[]): Promise<NoveltyAssessment> => {
  const ai = getGeminiClient('VALIDATION');
  const modelId = "gemini-3-pro-preview";

  const refContext = references.slice(0, 15).map(r => `- ${r.title} (${r.year})`).join("\n");

  const prompt = `
    ROLE: Senior Journal Editor & Peer Reviewer.
    TASK: Evaluate the novelty and acceptance probability of a user's proposed research idea against the retrieved literature.

    USER PROPOSAL:
    Title: "${title}"
    Overview: "${overview}"

    EXISTING LITERATURE FOUND:
    ${refContext}

    INSTRUCTIONS:
    1. Check if the user's idea is already covered by the literature.
    2. Estimate the "Novelty Score" (0-100).
    3. Estimate "Acceptance Probability" (e.g., "High", "Medium", "Low" chance at top tier venues).
    4. Provide a critique/analysis.

    Output JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            verdict: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
            acceptanceProbability: { type: Type.STRING },
            analysis: { type: Type.STRING },
            similarPapers: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING, enum: ['PROCEED', 'REFINE', 'pivot'] }
          },
          required: ["score", "verdict", "acceptanceProbability", "analysis", "similarPapers", "recommendation"]
        }
      }
    });
    
    return JSON.parse(response.text || "{}") as NoveltyAssessment;
  } catch (error) {
    console.error("Novelty assessment failed:", error);
    throw error;
  }
};

// Now accepts references to base topics on actual literature
export const generateNovelTopics = async (domain: string, references: Reference[]): Promise<ResearchTopic[]> => {
  const ai = getGeminiClient('DISCOVERY');
  const modelId = "gemini-3-pro-preview"; 

  const richContext = references
    .filter(r => r.isVerified && r.abstract)
    .slice(0, 15)
    .map((r, i) => `
      PAPER [${i+1}]
      Title: ${r.title}
      Year: ${r.year}
      Venue: ${r.venue || r.source}
      Citations: ${r.citationCount || 'N/A'}
      Abstract: ${r.abstract}
    `).join("\n\n");
    
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
  // Use a specific key for each search agent to parallelize quota
  const ai = getGeminiClient('DISCOVERY', agentName);
  const modelId = "gemini-2.5-flash"; 

  const prompt = `
    ROLE: Specialized Research Agent for ${agentName}.
    TASK: Find 12-15 high-impact academic papers on the topic: "${topic}".
    
    STRICT SOURCE CONSTRAINTS:
    ${focusInstructions}
    
    PREPRINT POLICY: ${allowPreprints ? "High-quality preprints (arXiv/bioRxiv) ARE allowed if relevant." : "Do NOT include preprints. Strictly peer-reviewed."}

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

  const agent1_IEEE = runSpecializedAgent(
    "IEEE Xplore", 
    "Search ONLY: IEEE Transactions, IEEE Journals, IEEE International Conferences. Look for DOIs starting with 10.1109/.", 
    topic, 
    false 
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

  const results = await Promise.all([
    wrapAgent("IEEE Xplore", agent1_IEEE),
    wrapAgent("Springer Nature", agent2_Springer),
    wrapAgent("Elsevier", agent3_Elsevier),
    wrapAgent("General", agent4_General)
  ]);
  
  const allRefs = results.flat();
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

// Deprecated in favor of deepSearchService
export const expandBibliography = async (
  topic: string, 
  abstract: string,
  existingRefs: Reference[],
  onProgress?: (msg: string) => void
): Promise<Reference[]> => {
    return []; 
};


export const proposeMethodologies = async (topic: string, references: Reference[]): Promise<MethodologyOption[]> => {
  const ai = getGeminiClient('DISCOVERY');
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

// --- DRAFTING AGENTS (New Modular Architecture) ---

export const generateDraftAbstract = async (
  topic: string,
  methodology: MethodologyOption
): Promise<{ title: string; abstract: string; keywords: string[] }> => {
  const ai = getGeminiClient('DRAFTING');
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    ROLE: Academic Drafting Agent (Stage 1: Concept).
    TASK: Generate a publication-ready Title, Abstract (150-250 words), and Keywords list (6-10) for a paper.
    
    Topic: ${topic}
    Methodology: ${methodology.name} (${methodology.description})
    
    Constraint: The abstract must be academic, rigorous, and explicitly mention the methodology and expected contribution.

    Output JSON.
  `;

  const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            abstract: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["title", "abstract", "keywords"]
        }
      }
  });

  return JSON.parse(response.text || "{}");
};

export const generateDraftSection = async (
  sectionName: string,
  fullDraftContext: string,
  references: Reference[],
  topic: string,
  methodology: MethodologyOption,
  onChunk: (chunk: string) => void
): Promise<string> => {
  // Use 'DRAFTING' client, potentially sharded by section name if we wanted
  const ai = getGeminiClient('DRAFTING', sectionName);
  const modelId = "gemini-3-pro-preview";

  const refString = references.map((r, i) => {
    const key = r.citationKey || `ref${i+1}`; 
    return `[${key}] ${r.title} (${r.year})`;
  }).join("\n");

  const prompt = `
    ROLE: World-Class Academic Researcher & Technical Writer.
    TASK: Write the "${sectionName}" section of the paper.
    
    Context (Draft So Far):
    ${fullDraftContext.substring(0, 20000)} ... [truncated]

    Current Topic: ${topic}
    Methodology: ${methodology.name}

    Available References (You MUST cite relevant ones using \\cite{key}):
    ${refString}

    CRITICAL INSTRUCTIONS FOR HIGH SCORES:
    1. **MANDATORY Visual Placeholders**: You MUST insert LaTeX placeholders for Figures or Tables in this section if appropriate (e.g. for Results, Methodology, or Architecture). 
       - DO NOT SKIP THIS. The user needs to see where to put their images.
       - Syntax:
         \\begin{figure}[htbp]
           \\centering
           \\fbox{\\begin{minipage}{0.9\\textwidth}\\centering\\vspace{2cm} [PLACEHOLDER: Describe diagram/chart here] \\vspace{2cm}\\end{minipage}}
           \\caption{Descriptive caption.}
           \\label{fig:placeholder}
         \\end{figure}

    2. **Deep Technical Density**: Do not write fluff. Write dense, mathematical, and algorithmic content.
       - If writing Methodology: Define equations, variables, and algorithms formally.
       - If writing Results: Hallucinate PLAUSIBLE, CONSISTENT simulation data. You are a simulation agent. Do not say "we will measure". Say "we measured X and found Y". Use numbers!
    
    3. **Tone**: Rigorous, objective, and authoritative. Avoid passive voice.

    4. **LaTeX Only**: Output ONLY valid LaTeX code for this section. No markdown blocks.
  `;

  const result = await ai.models.generateContentStream({
    model: modelId,
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 4096 } }
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
};

export const generateBibliography = (references: Reference[]): string => {
  let bib = "\\begin{thebibliography}{99}\n";
  references.forEach((r, i) => {
    const key = r.citationKey || `ref${i+1}`;
    bib += `\\bibitem{${key}} ${r.authors.join(", ")}. "${r.title}". \\textit{${r.venue || r.source}}, ${r.year}.\n`;
  });
  bib += "\\end{thebibliography}";
  return bib;
};

export const generateLatexManuscript = async (
  topic: string,
  methodology: MethodologyOption,
  templateName: string,
  references: Reference[],
  onChunk: (chunk: string) => void
): Promise<string> => {
  return ""; 
};
