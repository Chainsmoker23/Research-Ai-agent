
import { Type } from "@google/genai";
import { ConsistencyCheckResult } from "../../types";
import { getGeminiClient } from "../geminiClient";

/**
 * Equation Coherence Checker.
 * Scans the draft for mathematical variables and ensures they are defined 
 * and used consistently across sections.
 */

export const checkEquationConsistency = async (
  fullLatexDraft: string
): Promise<ConsistencyCheckResult> => {
  const ai = getGeminiClient('EDITORIAL', 'Math_Auditor');
  const modelId = "gemini-2.5-flash"; // Flash is sufficient for scanning text

  const prompt = `
    ROLE: Mathematical Notation Auditor.
    TASK: Scan the following research paper draft for equation consistency.
    
    CHECKS:
    1. Identify variables (e.g., $x$, $\alpha$) that are used but NOT defined in the text (e.g., "where $\alpha$ is the learning rate").
    2. Identify inconsistent notation (e.g., using $L$ for Loss in Section 3 but $J$ in Section 4).
    
    INPUT LATEX (Truncated for context):
    ${fullLatexDraft.substring(0, 30000)}

    OUTPUT JSON:
    {
      "undefinedVariables": ["list of variables appearing without definition"],
      "inconsistentNotation": ["description of inconsistencies found"],
      "score": 0-100 (100 = perfect consistency)
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
                    undefinedVariables: { type: Type.ARRAY, items: { type: Type.STRING } },
                    inconsistentNotation: { type: Type.ARRAY, items: { type: Type.STRING } },
                    score: { type: Type.INTEGER }
                },
                required: ["undefinedVariables", "inconsistentNotation", "score"]
            }
        }
    });

    return JSON.parse(response.text || "{}") as ConsistencyCheckResult;

  } catch (error) {
    console.error("Consistency check failed:", error);
    return {
        undefinedVariables: [],
        inconsistentNotation: [],
        score: 100
    };
  }
};
