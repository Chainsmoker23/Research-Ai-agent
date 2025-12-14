
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

// --- AGENT 4: EDITOR-IN-CHIEF (Orchestrator) ---
export const runEditorInChief = async (
    currentIteration: number,
    latexContent: string,
    auditorReport: { issues: string[], healthScore: number },
    lastChanges: string[]
): Promise<{ 
    decision: 'FIX_SYNTAX' | 'IMPROVE_RIGOR' | 'FINALIZE'; 
    reasoning: string;
    instructions: string 
}> => {
    const ai = getGeminiClient('EDITORIAL', 'Chief');
    const modelId = "gemini-3-pro-preview";

    const prompt = `
      ROLE: Editor-in-Chief.
      TASK: Manage the revision process.
      
      CONTEXT:
      - Iteration: ${currentIteration} / 3 (Max)
      - Last Changes: ${JSON.stringify(lastChanges)}
      - Citation Health: ${auditorReport.healthScore}/100
      
      DECISION LOGIC:
      1. If iteration >= 3, 'FINALIZE'.
      2. If syntax errors detected in logs, 'FIX_SYNTAX'.
      3. If the paper seems short or weak, 'IMPROVE_RIGOR'.
      4. Default to 'FINALIZE' if it looks good to prevent over-editing.

      OUTPUT JSON.
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
                        decision: { type: Type.STRING, enum: ['FIX_SYNTAX', 'IMPROVE_RIGOR', 'FINALIZE'] },
                        reasoning: { type: Type.STRING },
                        instructions: { type: Type.STRING }
                    },
                    required: ["decision", "reasoning", "instructions"]
                }
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { decision: 'FINALIZE', reasoning: "Error in decision logic, finalizing.", instructions: "" };
    }
};

// --- MAIN LOOP EXPORT ---
export const performEditorialLoop = async (
    initialLatex: string, 
    onLog: (log: EditorialLog) => void
): Promise<string> => {
    
    let currentLatex = initialLatex;
    let iteration = 1;
    let keepGoing = true;
    let lastChanges: string[] = ["Initial Draft"];

    while (keepGoing && iteration <= 3) {
        const timestamp = Date.now();
        onLog({ agentName: "Editor-in-Chief", action: "Evaluating", details: `Starting Iteration ${iteration}...`, timestamp });

        // 1. Auditor Check
        const auditorResult = await runAuditorAgent(currentLatex);
        onLog({ agentName: "Auditor", action: "Scanned", details: `Citation Health: ${auditorResult.healthScore}%`, timestamp: Date.now() });

        // 2. Editor Decision
        const editorDecision = await runEditorInChief(iteration, currentLatex, auditorResult, lastChanges);
        onLog({ agentName: "Editor-in-Chief", action: "Decision", details: `${editorDecision.decision}: ${editorDecision.reasoning}`, timestamp: Date.now() });

        if (editorDecision.decision === 'FINALIZE') {
            keepGoing = false;
            break;
        }

        // 3. Execute Decision
        if (editorDecision.decision === 'FIX_SYNTAX') {
            onLog({ agentName: "Typesetter", action: "Working", details: "Fixing LaTeX syntax errors...", timestamp: Date.now() });
            const result = await runTypesetterAgent(currentLatex);
            
            // Syntax fixer rarely deletes content, but safety check anyway
            if (result.correctedLatex.length < currentLatex.length * 0.9) {
                 onLog({ agentName: "System", action: "Rejected", details: "Typesetter deleted too much content. Reverting.", timestamp: Date.now() });
            } else {
                 currentLatex = result.correctedLatex;
                 lastChanges = result.changes;
                 onLog({ agentName: "Typesetter", action: "Completed", details: `Fixed ${result.changes.length} syntax issues.`, timestamp: Date.now() });
            }
        } 
        else if (editorDecision.decision === 'IMPROVE_RIGOR') {
            onLog({ agentName: "Reviewer", action: "Working", details: "Refining text (Preserving Structure)...", timestamp: Date.now() });
            const result = await runScientificReviewerAgent(currentLatex);
            
            // --- SAFETY NET ---
            // If the new content is significantly shorter (e.g., < 90% of original), the agent likely summarized instead of refining.
            // We reject the change to preserve the "Related Work" and other sections.
            if (result.correctedLatex.length < currentLatex.length * 0.9) {
                onLog({ agentName: "System", action: "Rejected", details: "Reviewer attempted to delete sections (Safety Net Triggered). Reverting to previous draft.", timestamp: Date.now() });
                lastChanges = ["Reviewer changes rejected due to content deletion."];
                // We force finalize if reviewer is failing to preserve content
                keepGoing = false; 
            } else {
                currentLatex = result.correctedLatex;
                lastChanges = result.changes;
                onLog({ agentName: "Reviewer", action: "Completed", details: `Refined ${result.changes.length} passages.`, timestamp: Date.now() });
            }
        }

        iteration++;
        await new Promise(r => setTimeout(r, 1000));
    }

    onLog({ agentName: "Editor-in-Chief", action: "Approved", details: "Manuscript finalized.", timestamp: Date.now() });
    return currentLatex;
};
