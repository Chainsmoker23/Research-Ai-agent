
import { Type, GoogleGenAI } from "@google/genai";
import { Reference, MethodologyOption, ResearchTopic, NoveltyAssessment, WritingStyle } from "../types";
import { getGeminiClient, getGeminiClientByIndex, getKeyCount, executeGeminiCall } from "./geminiClient";

// --- NEW: NOVELTY CHECKER ---
export const assessTopicNovelty = async (title: string, overview: string, references: Reference[]): Promise<NoveltyAssessment> => {
  return executeGeminiCall(async (ai) => {
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
  }, title);
};

// Now accepts references to base topics on actual literature
export const generateNovelTopics = async (domain: string, references: Reference[]): Promise<ResearchTopic[]> => {
  return executeGeminiCall(async (ai) => {
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
  }, domain);
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
  return executeGeminiCall(async (ai) => {
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

      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] },
      });
      
      const refs = extractJson(response.text || "");
      return refs.map(r => ({ ...r, source: r.source || agentName, isVerified: false }));
  }, agentName);
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

export const proposeMethodologies = async (topic: string, references: Reference[]): Promise<MethodologyOption[]> => {
  return executeGeminiCall(async (ai) => {
      const modelId = "gemini-3-pro-preview";
      const refContext = references.slice(0, 25).map(r => `- ${r.title} (${r.year}) [${r.source}]`).join("\n");

      const prompt = `
        I am researching: "${topic}".
        
        Based on the literature context:
        ${refContext}

        Propose 3 distinct, rigorous research methodologies.
        
        Output JSON.
      `;

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
  }, topic);
};

// --- DRAFTING AGENTS ---

const getStyleInstructions = (style: WritingStyle): string => {
    switch (style) {
        case 'Dense_Technical':
            return `
              TONE: Extremely concise, mathematical, and formal.
              RULES:
              - Use passive voice where appropriate for objectivity.
              - Minimize adjectives.
              - Maximize equation density and formal definitions.
              - Assume the reader is an expert in the field.
            `;
        case 'Narrative_Impact':
            return `
              TONE: Flowing, persuasive, and impact-oriented (Nature/Science style).
              RULES:
              - Use active voice ("We demonstrate...").
              - Focus on the "Why" and the broader implications.
              - Ensure smooth transitions between paragraphs.
              - Make the story of the research compelling.
            `;
        case 'Standard':
        default:
            return `
              TONE: Balanced academic.
              RULES:
              - Clear, structured arguments.
              - Standard third-person academic voice.
              - Balance between technical detail and readability.
            `;
    }
};

const getSectionInstructions = (sectionName: string): string => {
    const name = sectionName.toLowerCase();

    if (name.includes("introduction")) {
        return `
            LENGTH REQUIREMENT: 900-1100 words.
            STRUCTURE REQUIREMENTS:
            - Subsection 1.1: Background & Context.
            - Subsection 1.2: Problem Statement.
            - Subsection 1.3: Limitations of Existing Approaches.
            - Subsection 1.4: Proposed Solution & Contributions.
            - Subsection 1.5: Paper Organization.
        `;
    }
    if (name.includes("related") || name.includes("literature")) {
        return `
            LENGTH REQUIREMENT: 1000-1200 words.
            STRUCTURE REQUIREMENTS:
            - Organize related work by THEME.
            - Critically analyze each cited paper.
            - SYNTHESIZE the literature gaps.
        `;
    }
    if (name.includes("method") || name.includes("framework") || name.includes("architecture")) {
        return `
            LENGTH REQUIREMENT: 1000+ words.
            STRUCTURE REQUIREMENTS:
            - Subsection 3.1: Theoretical Framework.
            - Subsection 3.2: Architecture Overview.
            - Subsection 3.3: Core Algorithm.
            - Subsection 3.4: Implementation Details.
            - Use LaTeX equations (\\begin{equation}...) to define loss functions.
        `;
    }
    if (name.includes("result") || name.includes("experiment") || name.includes("evaluation")) {
        return `
            LENGTH REQUIREMENT: 800-1000 words.
            STRUCTURE REQUIREMENTS:
            - Subsection 4.1: Experimental Setup.
            - Subsection 4.2: Main Results.
            - Subsection 4.3: Ablation Studies.
            - Include standard deviations (e.g., 84.5% ± 0.3%).
        `;
    }
    if (name.includes("discussion")) {
        return `
            LENGTH REQUIREMENT: 600-800 words.
            STRUCTURE REQUIREMENTS:
            - Interpret the findings.
            - Discuss Limitations honestly.
            - Theoretical implications.
        `;
    }
    return "LENGTH REQUIREMENT: 600-800 words. Structure with logical subsections.";
};

// Step 1: The Architect (Generates Outline)
const generateSectionBlueprint = async (
    sectionName: string,
    context: string,
    instructions: string,
    topic: string
): Promise<string> => {
    return executeGeminiCall(async (ai) => {
        const modelId = "gemini-3-pro-preview";
        const prompt = `
          ROLE: Research Architect.
          TASK: Create a detailed, hierarchical outline for the **${sectionName}** section of a paper on "${topic}".
          
          CONTEXT FROM PREVIOUS SECTIONS:
          ${context.substring(0, 3000)}...

          REQUIREMENTS:
          ${instructions}
          
          OUTPUT:
          A structured outline with:
          - Subsection Headers
          - Key Bullet Points for each paragraph to be written.
          - specific mathematical concepts or citations to include in each part.
          
          Format: Text/Markdown.
        `;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt
        });

        return response.text || "Outline generation failed.";
    }, sectionName);
};

// Step 2: The Author (Executes Blueprint with KEY ROTATION)
export const generateDraftSection = async (
  sectionName: string,
  fullDraftContext: string,
  references: Reference[],
  topic: string,
  methodology: MethodologyOption,
  onChunk: (chunk: string) => void,
  style: WritingStyle = 'Standard',
  customInstructions?: string // NEW: Override instructions from Roadmap
): Promise<string> => {
  // --- BLUEPRINT PHASE ---
  const specializedInstructions = customInstructions || getSectionInstructions(sectionName);
  const blueprint = await generateSectionBlueprint(sectionName, fullDraftContext, specializedInstructions, topic);

  // --- DRAFTING PHASE (Streaming with Manual Rotation Logic) ---
  // Note: executeGeminiCall supports Promises, but streaming requires custom handling to capture chunks.
  // We reimplement a specific streaming rotation here using the same principles.
  
  const modelId = "gemini-3-pro-preview";
  const refString = references.map((r, i) => {
    const key = r.citationKey || `ref${i+1}`; 
    return `[${key}] ${r.title} (${r.year})`;
  }).join("\n");
  
  const styleInstructions = getStyleInstructions(style);

  const prompt = `
    ROLE: Senior Lead Researcher & Academic Author.
    TASK: Write the **${sectionName}** section of a high-impact research paper.
    
    RESEARCH TOPIC: ${topic}
    METHODOLOGY: ${methodology.name} (${methodology.description})
    
    *** BLUEPRINT (FOLLOW THIS STRUCTURE EXACTLY) ***
    ${blueprint}
    *************************************************

    AVAILABLE REFERENCES (You MUST cite these frequently using \\cite{key}):
    ${refString}

    ================================================================
    STYLE GUIDELINES (${style}):
    ${styleInstructions}
    ================================================================

    GENERAL WRITING RULES:
    1. **ACADEMIC DENSITY**: Avoid fluff. Write dense, high-entropy academic prose. Use specific terminology.
    2. **SUBSECTIONS**: You MUST use \\subsection{} and \\subsubsection{} to structure the text logically. Do not output a wall of text.
    3. **VISUAL PLACEHOLDERS - FIGURES**: 
       - **DO NOT** output \\begin{figure}... blocks.
       - Instead, insert explicit comments:
         % ---------------------------------------------------------
         % [INSERT FIGURE 2 HERE]: Architecture Diagram showing...
         % ---------------------------------------------------------
    4. **TABLES (REAL DATA)**:
       - You MUST generate valid LaTeX tables (\\begin{table}...) containing plausible data if relevant (e.g. Results).
       - Do not worry about column width; our formatter handles that.
       - Focus on the CONTENT of the table (header, rows, values).
    5. **MATH**: Use LaTeX environments \\begin{equation} ... \\end{equation} for all formulas. Define all variables.
    6. **LENGTH**: adhere strictly to the length requirements defined in the blueprint. 
    7. **NO SECTION HEADERS**: Do NOT output \\section{...} for the main title (e.g. "Introduction"). The system adds this automatically. Start writing the paragraph content immediately (or use \\subsection for parts).
    8. **NO CHATTY INTROS**: Do NOT write "Here is the section..." or "Certainly!". Output ONLY the LaTeX content body.
    
    OUTPUT FORMAT:
    - ONLY valid LaTeX code for the section content. 
    - Do NOT include \\documentclass or \\begin{document}. 
    - Do NOT wrap in markdown blocks like \`\`\`latex.
  `;

  // Streaming Rotation Logic
  const totalKeys = getKeyCount();
  const maxRetries = Math.max(totalKeys, 3);
  let keyIndex = Math.abs(sectionName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));

  for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
          const ai = getGeminiClientByIndex(keyIndex);
          
          const result = await ai.models.generateContentStream({
            model: modelId,
            contents: prompt,
            config: { 
                thinkingConfig: { thinkingBudget: 8192 } 
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

          if (!fullText || fullText.trim().length === 0) {
              throw new Error("Agent produced empty output (possibly due to safety filter).");
          }

          return fullText;

      } catch (error: any) {
          if (error.status === 429 || (error.message && (error.message.includes('429') || error.message.includes('Quota')))) {
              console.warn(`ScholarAgent (Stream): Quota exhausted on Key Index ${keyIndex % totalKeys}. Rotating...`);
              keyIndex++;
              await new Promise(r => setTimeout(r, 1000 + (attempt * 500)));
              continue;
          }
          throw error; 
      }
  }
  
  throw new Error("Failed to generate section after exhausting available API keys.");
};

export const generateDraftAbstract = async (
  topic: string,
  methodology: MethodologyOption
): Promise<{ title: string; abstract: string; keywords: string[] }> => {
  return executeGeminiCall(async (ai) => {
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
  }, topic);
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
