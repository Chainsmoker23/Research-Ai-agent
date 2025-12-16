
import { Type } from "@google/genai";
import { Reference } from "../../types";
import { executeGeminiCall } from "../geminiClient";

/**
 * THE CITATION GRAPH WALKER
 * 
 * Purpose: Transforms a list of references into a connected narrative graph.
 * Instead of: "Paper A did X. Paper B did Y."
 * It writes: "While Paper A established X, Paper B later argued that..."
 */

export const generateNarrativeRelatedWork = async (
  topic: string,
  references: Reference[],
  fullContext: string
): Promise<string> => {
  
  return executeGeminiCall(async (ai) => {
      const modelId = "gemini-3-pro-preview";

      // Prepare reference list with snippets/abstracts for deep analysis
      const refContext = references.map(r => `
        [${r.citationKey}]
        Title: ${r.title}
        Year: ${r.year}
        Summary: ${r.abstract?.substring(0, 400) || r.snippet || "No abstract available."}
      `).join("\n\n");

      const blueprintPrompt = `
        ROLE: Research Historian & Graph Analyst.
        TASK: Analyze the provided references and construct a "Narrative Arc" for the Related Work section of a paper on "${topic}".
        
        REFERENCES:
        ${refContext}
        
        INSTRUCTIONS:
        1. **Identify Themes**: Group papers into 3-4 logical themes (e.g., "Early Heuristics", "Deep Learning Approaches", "Recent Transformers").
        2. **Find Edges**: Identify relationships. Did Paper B fix a flaw in Paper A? Did Paper C apply Paper A's method to a new field?
        3. **Construct the Narrative**: Write the "Related Work" section.
           - Do NOT just list summaries.
           - Use transitions: "Conversely...", "Building on this...", "However, a major limitation remained..."
           - Cite using the keys provided (e.g., \\cite{Smith20230}).
        4. **Gap Transition**: The final paragraph MUST explicitly transition to the current paper's contribution ("Thus, a need remains for...").
        
        OUTPUT FORMAT:
        Return ONLY the LaTeX content for the section. Do not include \\section{Related Work}.
      `;

      try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: blueprintPrompt,
            config: {
                thinkingConfig: { thinkingBudget: 4096 } // Give it time to construct the graph
            }
        });

        return response.text || "";

      } catch (error) {
        console.error("Citation Graph Walker failed:", error);
        throw new Error("Failed to generate narrative related work.");
      }
  }, "Graph_Walker");
};
