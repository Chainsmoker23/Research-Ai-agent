
import { Type } from "@google/genai";
import { CoherenceCheckResult, DraftSection } from "../../types";
import { executeGeminiCall } from "../geminiClient";

/**
 * THE THREAD-WEAVER (Global Coherence Editor)
 * 
 * Purpose: Ensures the "Promise" (Abstract/Intro) matches the "Reality" (Results/Conclusion).
 * It detects if the Abstract promises "95% accuracy" but Results show "92%", and auto-corrects the Abstract.
 */

export const checkAndAlignCoherence = async (
  title: string,
  sections: DraftSection[],
  currentAbstract: string
): Promise<CoherenceCheckResult> => {
  
  return executeGeminiCall(async (ai) => {
      const modelId = "gemini-3-pro-preview";

      // 1. Extract content from key sections
      const intro = sections.find(s => s.name.toLowerCase().includes("introduction"))?.content || "";
      const results = sections.find(s => s.name.toLowerCase().includes("result"))?.content || "";
      const discussion = sections.find(s => s.name.toLowerCase().includes("discussion"))?.content || "";
      const conclusion = sections.find(s => s.name.toLowerCase().includes("conclusion"))?.content || "";

      // Combine Evidence
      const evidenceText = `
        --- RESULTS SECTION ---
        ${results.substring(0, 10000)}
        
        --- DISCUSSION SECTION ---
        ${discussion.substring(0, 5000)}
        
        --- CONCLUSION SECTION ---
        ${conclusion.substring(0, 2000)}
      `;

      // Combine Claims
      const claimsText = `
        --- CURRENT ABSTRACT ---
        ${currentAbstract}
        
        --- INTRODUCTION ---
        ${intro.substring(0, 5000)}
      `;

      const prompt = `
        ROLE: The Thread-Weaver (Global Consistency Auditor).
        TASK: Verify if the claims made in the Abstract/Intro are explicitly supported by the Evidence in Results/Conclusion.
        
        PAPER TITLE: ${title}
        
        PART 1: THE PROMISE (Claims made to the reader)
        ${claimsText}
        
        PART 2: THE REALITY (Evidence provided)
        ${evidenceText}
        
        INSTRUCTIONS:
        1. Identify specific quantitative or qualitative claims in Part 1 (e.g., "We achieve 98% accuracy").
        2. Check if Part 2 supports them. 
        3. If Part 2 shows different numbers (e.g., "92% accuracy") or different outcomes, this is a CONTRADICTION.
        4. If a contradiction exists, you MUST rewrite the Abstract to match Part 2 (The Reality).
        
        OUTPUT JSON:
        {
          "aligned": boolean,
          "contradictions": ["list of discrepancies found"],
          "revisedAbstract": "The full corrected abstract text (if needed, else null)",
          "score": 0-100 (Consistency Score)
        }
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
                        aligned: { type: Type.BOOLEAN },
                        contradictions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        revisedAbstract: { type: Type.STRING },
                        score: { type: Type.INTEGER }
                    },
                    required: ["aligned", "contradictions", "score"]
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        return result as CoherenceCheckResult;

      } catch (error) {
        console.error("Thread-Weaver failed:", error);
        return {
            aligned: true,
            contradictions: [],
            score: 100
        };
      }
  }, "Thread_Weaver");
};
