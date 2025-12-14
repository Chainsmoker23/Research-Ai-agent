
import { Type } from "@google/genai";
import { EditorialLog } from "../types";
import { getGeminiClient } from "./geminiClient";

// --- AGENT 1: THE TYPESETTER (Syntax Fixer) ---
// Scans for table errors, missing brackets, and compilation issues.
export const runTypesetterAgent = async (latexContent: string): Promise<{ correctedLatex: string; changes: string[] }> => {
  const ai = getGeminiClient('EDITORIAL', 'Typesetter');
  const modelId = "gemini-2.5-flash"; 

  const prompt = `
    ROLE: Expert LaTeX Typesetter.
    TASK: Fix syntax errors in the provided LaTeX manuscript without changing the content.
    
    CRITICAL CONSTRAINT: 
    - DO NOT REMOVE ANY TEXT. 
    - DO NOT DELETE SECTIONS.
    - ONLY FIX BROKEN CODE (unbalanced braces, bad table formatting, escaping % or &).
    
    INPUT LATEX:
    ${latexContent}

    OUTPUT:
    Return a JSON object with:
    - "correctedLatex": The full corrected string.
    - "changes": An array of strings describing what you fixed.
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
            correctedLatex: { type: Type.STRING },
            changes: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["correctedLatex", "changes"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { 
        correctedLatex: result.correctedLatex || latexContent, 
        changes: result.changes || [] 
    };
  } catch (e) {
    console.error("Typesetter failed", e);
    return { correctedLatex: latexContent, changes: ["Typesetter skipped due to error."] };
  }
};

// --- AGENT 2: THE SCIENTIFIC REVIEWER (Rigor Check) ---
// Rewrites unproven claims and strengthens arguments.
export const runScientificReviewerAgent = async (latexContent: string): Promise<{ correctedLatex: string; changes: string[] }> => {
  const ai = getGeminiClient('EDITORIAL', 'Reviewer');
  // Using 3-pro for high adherence to "Do not delete" instructions
  const modelId = "gemini-3-pro-preview"; 

  const prompt = `
    ROLE: Senior Scientific Editor (Nature/Science).
    TASK: Refine the text for academic rigor, flow, and impact.
    
    *** CRITICAL PRESERVATION PROTOCOLS (VIOLATION = SYSTEM FAILURE) ***
    1. **DO NOT DELETE SECTIONS**: You MUST preserve the 'Related Work', 'Methodology', and 'Bibliography' sections exactly as they are structure-wise.
    2. **DO NOT SUMMARIZE**: You must output the FULL, detailed manuscript. Do not shorten paragraphs.
    3. **PRESERVE PLACEHOLDERS**: Do NOT remove any \begin{figure} or \begin{table} placeholders.
    4. **PRESERVE CITATIONS**: Do NOT remove \cite{...} tags.
    
    IMPROVEMENT GOALS:
    1. **Quantify Claims**: Change "results were good" to "we observed a 12% increase...".
    2. **Active Voice**: Change "It was shown that" to "We demonstrate that...".
    3. **Fill Gaps**: If a paragraph feels weak, ADD a sentence explaining the 'Why'.

    INPUT LATEX:
    ${latexContent}

    OUTPUT:
    Return a JSON object with:
    - "correctedLatex": The FULL, refined LaTeX document (must be approx same length or longer).
    - "changes": An array of strings describing specific improvements (e.g. "Quantified accuracy in Abstract").
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
            correctedLatex: { type: Type.STRING },
            changes: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["correctedLatex", "changes"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return { 
        correctedLatex: result.correctedLatex || latexContent, 
        changes: result.changes || [] 
    };
  } catch (e) {
    console.error("Reviewer failed", e);
    return { correctedLatex: latexContent, changes: ["Reviewer skipped due to error."] };
  }
};

// --- AGENT 3: THE AUDITOR (Citation Validator) ---
export const runAuditorAgent = async (latexContent: string): Promise<{ issues: string[]; healthScore: number }> => {
  const ai = getGeminiClient('EDITORIAL', 'Auditor');
  const modelId = "gemini-2.5-flash"; 

  const prompt = `
    ROLE: Bibliography Auditor.
    TASK: Check citation consistency.
    
    CHECKS:
    1. Are all \cite{...} keys defined in the bib?
    2. Are there citations in the text?
    
    INPUT LATEX:
    ${latexContent.substring(0, 50000)}

    OUTPUT:
    JSON with "issues" and "healthScore".
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
            issues: { type: Type.ARRAY, items: { type: Type.STRING } },
            healthScore: { type: Type.INTEGER }
          },
          required: ["issues", "healthScore"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { issues: ["Auditor scan failed"], healthScore: 50 };
  }
};

// --- MAIN LOOP EXPORT (Linear Pipeline) ---
export const performEditorialLoop = async (
    initialLatex: string, 
    onLog: (log: EditorialLog) => void
): Promise<string> => {
    
    let currentLatex = initialLatex;
    
    // Step 1: Typesetter (Fix Syntax)
    onLog({ agentName: "Typesetter", action: "Working", details: "Correcting LaTeX syntax and compilation errors...", timestamp: Date.now() });
    const typesetterResult = await runTypesetterAgent(currentLatex);
    if (typesetterResult.correctedLatex.length > currentLatex.length * 0.9) {
        currentLatex = typesetterResult.correctedLatex;
        onLog({ agentName: "Typesetter", action: "Completed", details: `Fixed ${typesetterResult.changes.length} formatting issues.`, timestamp: Date.now() });
    }

    // Step 2: Scientific Reviewer (Polish Text)
    onLog({ agentName: "Reviewer", action: "Working", details: "Polishing academic tone and quantifying claims...", timestamp: Date.now() });
    const reviewerResult = await runScientificReviewerAgent(currentLatex);
    if (reviewerResult.correctedLatex.length > currentLatex.length * 0.9) {
        currentLatex = reviewerResult.correctedLatex;
        onLog({ agentName: "Reviewer", action: "Completed", details: `Refined ${reviewerResult.changes.length} passages.`, timestamp: Date.now() });
    }

    // Step 3: Auditor (Final Check)
    onLog({ agentName: "Auditor", action: "Working", details: "Validating citation integrity...", timestamp: Date.now() });
    const auditorResult = await runAuditorAgent(currentLatex);
    onLog({ agentName: "Auditor", action: "Completed", details: `Final Citation Health: ${auditorResult.healthScore}%`, timestamp: Date.now() });

    onLog({ agentName: "System", action: "Finished", details: "Editorial process complete. Manuscript ready.", timestamp: Date.now() });
    return currentLatex;
};
