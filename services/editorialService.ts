
import { GoogleGenAI, Type } from "@google/genai";
import { EditorialLog } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

// --- AGENT 1: THE TYPESETTER (Syntax Fixer) ---
// Scans for table errors, missing brackets, and compilation issues.
export const runTypesetterAgent = async (latexContent: string): Promise<{ correctedLatex: string; changes: string[] }> => {
  const ai = getClient();
  const modelId = "gemini-2.5-flash"; // Fast and good at code/structure

  const prompt = `
    ROLE: Expert LaTeX Typesetter.
    TASK: Scan the following LaTeX academic manuscript for syntax errors, compilation bugs, and formatting issues.
    
    CHECKLIST:
    1. Check for unbalanced braces { }.
    2. Fix malformed tables (missing & or \\\\).
    3. Ensure equations are properly enclosed.
    4. Verify \begin{...} has matching \end{...}.
    5. Fix common special character escaping issues (e.g. % -> \\%).
    
    INPUT LATEX:
    ${latexContent}

    OUTPUT:
    Return a JSON object with:
    - "correctedLatex": The full corrected string.
    - "changes": An array of strings describing what you fixed (e.g., "Fixed unbalanced brace in Abstract").
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
  const ai = getClient();
  const modelId = "gemini-3-pro-preview"; // High reasoning capability

  const prompt = `
    ROLE: Senior Scientific Reviewer (Peer Review Simulation).
    TASK: Evaluate the scientific rigor of the text. Identify unproven claims, vague statements, or logical fallacies.
    
    INSTRUCTIONS:
    1. Look for phrases like "It is well known", "obviously", or "perfect results" and rewrite them to be objective.
    2. Check if the Conclusion follows logically from the Results.
    3. Ensure the Methodology is described with sufficient detail.
    4. REWRITE the specific paragraphs that are weak.
    
    INPUT LATEX:
    ${latexContent}

    OUTPUT:
    Return a JSON object with:
    - "correctedLatex": The full revised latex with your improvements applied.
    - "changes": An array of strings describing the scientific improvements (e.g., "Tempered claim about 'perfect accuracy' in Conclusion").
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
// Checks if cited references exist in bib and vice versa.
export const runAuditorAgent = async (latexContent: string): Promise<{ issues: string[]; healthScore: number }> => {
  const ai = getClient();
  const modelId = "gemini-2.5-flash"; 

  const prompt = `
    ROLE: Bibliography Auditor.
    TASK: Cross-reference the citations in the text (\cite{...}) with the bibliography at the end.
    
    CHECKS:
    1. Does every \cite{key} have a corresponding entry in bibliography?
    2. Does every bib entry appear in the text (or flag as unused)?
    3. Are the keys formatted consistently?
    
    INPUT LATEX:
    ${latexContent}

    OUTPUT:
    JSON with:
    - "issues": Array of warnings (e.g. "Citation 'smith2020' used in text but missing from bib").
    - "healthScore": 0-100 score of citation integrity.
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
    console.error("Auditor failed", e);
    return { issues: ["Auditor scan failed"], healthScore: 50 };
  }
};

// --- AGENT 4: EDITOR-IN-CHIEF (Orchestrator) ---
// Decides what to do next based on previous reports.
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
    const ai = getClient();
    const modelId = "gemini-3-pro-preview";

    const prompt = `
      ROLE: Editor-in-Chief of a high-impact journal.
      TASK: Decide the next step for this manuscript revision process.
      
      CONTEXT:
      - Iteration: ${currentIteration} / 4 (Max)
      - Last Changes Made: ${JSON.stringify(lastChanges)}
      - Auditor Health Score: ${auditorReport.healthScore}/100
      - Auditor Issues: ${JSON.stringify(auditorReport.issues)}
      
      MANUSCRIPT PREVIEW (First 2000 chars):
      ${latexContent.substring(0, 2000)}...

      DECISION LOGIC:
      1. If iteration >= 3, you MUST 'FINALIZE'.
      2. If Auditor Health Score < 80, you MUST 'IMPROVE_RIGOR' (instructing to fix citations).
      3. If syntax seems broken in the preview, 'FIX_SYNTAX'.
      4. If rigorous but needs polish, 'IMPROVE_RIGOR'.
      5. If excellent, 'FINALIZE'.

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
        return { decision: 'FINALIZE', reasoning: "Error in decision logic, finalizing for safety.", instructions: "" };
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

    while (keepGoing && iteration <= 4) {
        const timestamp = Date.now();
        onLog({ agentName: "Editor-in-Chief", action: "Evaluating", details: `Starting Iteration ${iteration}...`, timestamp });

        // 1. Auditor Check (Fast check to inform Editor)
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
            currentLatex = result.correctedLatex;
            lastChanges = result.changes;
            onLog({ agentName: "Typesetter", action: "Completed", details: `Fixed ${result.changes.length} syntax issues.`, timestamp: Date.now() });
        } 
        else if (editorDecision.decision === 'IMPROVE_RIGOR') {
            onLog({ agentName: "Reviewer", action: "Working", details: "Rewriting weak arguments...", timestamp: Date.now() });
            const result = await runScientificReviewerAgent(currentLatex);
            currentLatex = result.correctedLatex;
            lastChanges = result.changes;
            onLog({ agentName: "Reviewer", action: "Completed", details: `Improved ${result.changes.length} sections for rigor.`, timestamp: Date.now() });
        }

        iteration++;
        await new Promise(r => setTimeout(r, 1000)); // Pacing
    }

    onLog({ agentName: "Editor-in-Chief", action: "Approved", details: "Manuscript ready for publication.", timestamp: Date.now() });
    return currentLatex;
};
