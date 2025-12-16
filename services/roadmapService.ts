
import { Type } from "@google/genai";
import { SectionBlueprint, Reference, MethodologyOption } from "../types";
import { executeGeminiCall } from "./geminiClient";

/**
 * THE ROADMAP ARCHITECT
 * 
 * Purpose: Design a bespoke Table of Contents based on the topic and methodology.
 * It prevents the "cookie-cutter" paper problem by adapting structure.
 */

export const generatePaperRoadmap = async (
  topic: string,
  methodology: MethodologyOption,
  abstract: string,
  references: Reference[]
): Promise<SectionBlueprint[]> => {
  
  return executeGeminiCall(async (ai) => {
      const modelId = "gemini-3-pro-preview";

      const prompt = `
        ROLE: Senior Research Architect.
        TASK: Design the optimal "Table of Contents" (Roadmap) for a high-impact research paper.
        
        TOPIC: ${topic}
        METHODOLOGY: ${methodology.name} (${methodology.description})
        ABSTRACT: ${abstract}
        
        INSTRUCTIONS:
        1. Do NOT use a generic structure (Introduction, Method, Result, Conclusion) unless absolutely necessary.
        2. ADAPT the section titles to the methodology.
           - If "Systematic Review": Use "Search Strategy", "Thematic Analysis", "Gap Identification".
           - If "Algorithm Proposal": Use "Problem Formulation", "Proposed Architecture", "Complexity Analysis".
           - If "Empirical Study": Use "Experimental Design", "Statistical Analysis", "Discussion".
        3. You must generate 6-8 distinct sections.
        4. For EACH section, provide specific "draftingInstructions" that the writer agent will follow later.
        
        OUTPUT JSON FORMAT:
        [
          {
            "title": "Section Title (e.g. '3. The Sparse-Attention Mechanism')",
            "purpose": "What this section achieves...",
            "draftingInstructions": "Detailed bullet points on what to write, what math to show, what to cite...",
            "wordCount": 1000
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
                            title: { type: Type.STRING },
                            purpose: { type: Type.STRING },
                            draftingInstructions: { type: Type.STRING },
                            wordCount: { type: Type.INTEGER },
                        },
                        required: ["title", "purpose", "draftingInstructions", "wordCount"]
                    }
                }
            }
        });

        const roadmap = JSON.parse(response.text || "[]") as SectionBlueprint[];
        
        // Fallback if empty
        if (roadmap.length === 0) throw new Error("Empty roadmap");
        
        return roadmap;

      } catch (error) {
        console.error("Roadmap generation failed:", error);
        // Fallback to standard structure
        return [
            { title: "Introduction", purpose: "Set the context", draftingInstructions: "Standard introduction structure.", wordCount: 800 },
            { title: "Related Work", purpose: "Literature review", draftingInstructions: "Analyze previous work.", wordCount: 1000 },
            { title: "Methodology", purpose: "Explain approach", draftingInstructions: "Detail the technical approach.", wordCount: 1200 },
            { title: "Experiments & Results", purpose: "Show data", draftingInstructions: "Present quantitative results.", wordCount: 1000 },
            { title: "Discussion", purpose: "Interpret results", draftingInstructions: "Discuss implications and limitations.", wordCount: 800 },
            { title: "Conclusion", purpose: "Wrap up", draftingInstructions: "Summarize findings.", wordCount: 400 }
        ];
      }
  }, "Roadmap_Architect");
};
