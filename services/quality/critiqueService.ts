
import { Type } from "@google/genai";
import { CritiqueResult } from "../../types";
import { getGeminiClient } from "../geminiClient";

/**
 * The "Devil's Advocate" Loop.
 * 1. Critic Agent: Ruthlessly tears down the draft.
 * 2. Fixer Agent: Rewrites the draft to address the critique.
 */

export const critiqueAndRefineSection = async (
  sectionName: string,
  draftContent: string,
  topicContext: string
): Promise<CritiqueResult> => {
  const ai = getGeminiClient('EDITORIAL', 'Devil_Advocate');
  const modelId = "gemini-3-pro-preview";

  // Step 1: The Ruthless Critic
  const critiquePrompt = `
    ROLE: Ruthless Senior Peer Reviewer (The "Devil's Advocate").
    TASK: Critique the following section of a research paper.
    
    SECTION: ${sectionName}
    CONTEXT: ${topicContext}
    
    DRAFT CONTENT:
    ${draftContent}

    CRITERIA:
    1. Is the argumentation logical and rigorous?
    2. Are there vague claims (e.g., "results were good") instead of specific ones?
    3. Is the math/logic consistent?
    4. Is the tone sufficiently academic?

    OUTPUT JSON:
    {
      "issues": ["List of specific specific flaws"],
      "score": 1-10
    }
  `;

  try {
    const critiqueResponse = await ai.models.generateContent({
        model: modelId,
        contents: critiquePrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    issues: { type: Type.ARRAY, items: { type: Type.STRING } },
                    score: { type: Type.INTEGER }
                },
                required: ["issues", "score"]
            }
        }
    });

    const critique = JSON.parse(critiqueResponse.text || "{}");

    // If score is high enough, return early
    if (critique.score >= 8) {
        return {
            issuesFound: [],
            critiqueScore: critique.score,
            isAcceptable: true,
            improvedContent: draftContent
        };
    }

    // Step 2: The Fixer (Self-Correction)
    const fixPrompt = `
      ROLE: Academic Editor.
      TASK: Rewrite the draft section to address the specific critiques found by the reviewer.
      
      ORIGINAL DRAFT:
      ${draftContent}
      
      CRITIQUES TO FIX:
      ${critique.issues.join("\n")}
      
      INSTRUCTIONS:
      - Improve the academic tone.
      - Make claims more concrete.
      - Maintain LaTeX formatting exactly.
      - Do NOT summarize. Rewrite for quality.
      
      OUTPUT: Full rewritten LaTeX content (string).
    `;

    const fixResponse = await ai.models.generateContent({
        model: modelId,
        contents: fixPrompt
    });

    const improvedContent = fixResponse.text || draftContent;

    return {
        issuesFound: critique.issues,
        critiqueScore: critique.score,
        isAcceptable: true,
        improvedContent: improvedContent
    };

  } catch (error) {
    console.error("Critique loop failed:", error);
    return {
        issuesFound: ["Critique system error"],
        critiqueScore: 5,
        isAcceptable: true,
        improvedContent: draftContent
    };
  }
};
