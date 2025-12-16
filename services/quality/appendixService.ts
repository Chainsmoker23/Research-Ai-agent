
import { executeGeminiCall } from "../geminiClient";

/**
 * THE APPENDIX ARCHITECT
 * 
 * Purpose: Generates supplementary material that doesn't fit in the main body.
 * - Hyperparameter tables
 * - Reproducibility checklists
 * - Extra proofs
 */

export const generateAppendix = async (
  title: string,
  methodology: string
): Promise<string> => {
  return executeGeminiCall(async (ai) => {
      const modelId = "gemini-3-pro-preview";

      const prompt = `
        ROLE: Research Scientist & Appendix Architect.
        TASK: Generate a comprehensive Appendix and Supplementary Material section for a paper titled "${title}" using methodology "${methodology}".
        
        CONTENT REQUIREMENTS:
        1. **Hyperparameter Configuration**: A detailed table of all parameters (learning rate, batch size, etc.) with plausible values for this type of research.
        2. **Reproducibility Checklist**: A standard NeurIPS-style checklist confirming code availability, random seeds, and computing infrastructure.
        3. **Proof Sketches / Mathematical Derivations**: If the methodology implies math, provide a "Proof of Convergence" or "Complexity Analysis" derivation. If empirical, provide "Additional Statistical Tests".
        
        FORMATTING:
        - Use valid LaTeX.
        - Start with \\appendix.
        - Use \\section{...} for subsections.
        - Wrap tables in \\begin{table}[h] ... \\end{table}.
        - Do NOT include the document preamble (\\documentclass, etc.), just the appendix content.
        
        OUTPUT:
        Return ONLY the raw LaTeX string.
      `;

      try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt
        });

        return response.text || "";

      } catch (error) {
        console.error("Appendix generation failed:", error);
        return "\\appendix\n\\section{Supplementary Material}\n\\textit{Supplementary material generation failed due to agent error.}";
      }
  }, "Appendix_Architect");
};
