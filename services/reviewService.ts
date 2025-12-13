
import { GoogleGenAI, Type } from "@google/genai";
import { ReviewReport, ReviewAgentResult, ReferenceAudit, Reference } from "../types";
import * as CitationService from './citationService';



const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // Remove the Data URL prefix (e.g. "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// 1. Extract References from PDF using Gemini Vision
const extractReferencesFromPdf = async (base64Pdf: string, mimeType: string): Promise<Reference[]> => {
    const ai = getClient();
    const modelId = "gemini-2.5-flash"; // Flash is fast enough for extraction

    const prompt = `
      TASK: Extract the bibliography/references section from this academic PDF.
      
      INSTRUCTIONS:
      1. Identify the "References" or "Bibliography" section.
      2. Extract each entry into a structured JSON object.
      3. Do your best to parse Title, Author, Year, and DOI/URL.
      4. If DOI is missing, leave it empty.
      
      OUTPUT: JSON Array of objects matching schema: { title, authors (array of strings), year, doi, source: "Extracted" }
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: [
                { inlineData: { mimeType, data: base64Pdf } },
                { text: prompt }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            authors: { type: Type.ARRAY, items: { type: Type.STRING } },
                            year: { type: Type.STRING },
                            doi: { type: Type.STRING },
                        }
                    }
                }
            }
        });

        const rawRefs = JSON.parse(response.text || "[]");
        
        // Map to our Reference type
        return rawRefs.map((r: any) => ({
            title: r.title || "Unknown Title",
            authors: r.authors || [],
            year: r.year || "n.d.",
            doi: r.doi || undefined,
            source: "PDF Extraction",
            snippet: "",
            isPreprint: false,
            isVerified: false
        }));

    } catch (error) {
        console.error("Reference extraction failed:", error);
        return [];
    }
};

// Individual Agent Prompt Runner
const runReviewAgent = async (
  agentName: string,
  roleDescription: string,
  focusArea: string,
  base64Pdf: string,
  mimeType: string,
  auditContext?: string
): Promise<ReviewAgentResult> => {
    const ai = getClient();
    const modelId = "gemini-3-pro-preview"; 

    // Inject audit context if available (specifically for Citation Police)
    const contextInjection = auditContext ? `
      
      [CRITICAL DATA FROM REFERENCE AUDIT SYSTEM]
      ${auditContext}
      
      Use the above data to support your critique. If there are many unverified references, penalize the score heavily.
    ` : "";

    const prompt = `
      ROLE: You are ${agentName}, a ${roleDescription}.
      TASK: Review the attached academic manuscript PDF focusing specifically on: ${focusArea}.
      ${contextInjection}
      
      OUTPUT REQUIREMENTS:
      1. Provide a rigorous, critical academic review.
      2. Score the paper from 1-10 based on your focus area.
      3. List 2-3 key strengths and 2-3 key weaknesses.
      4. Provide a final verdict (Accept, Minor Revision, Major Revision, Reject).
      
      Output strictly in JSON format matching the schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Pdf
                    }
                },
                { text: prompt }
            ],
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER },
                        summary: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                        verdict: { type: Type.STRING, enum: ['Accept', 'Minor Revision', 'Major Revision', 'Reject'] }
                    },
                    required: ["score", "summary", "strengths", "weaknesses", "verdict"]
                }
            }
        });

        const data = JSON.parse(response.text || "{}");
        
        return {
            agentName,
            role: roleDescription,
            score: data.score,
            summary: data.summary,
            strengths: data.strengths || [],
            weaknesses: data.weaknesses || [],
            verdict: data.verdict
        };
    } catch (error) {
        console.error(`Agent ${agentName} failed:`, error);
        return {
            agentName,
            role: roleDescription,
            score: 0,
            summary: "Agent failed to analyze the document due to technical error.",
            strengths: [],
            weaknesses: ["Processing Error"],
            verdict: "Reject"
        };
    }
};

// Orchestrator
export const performPeerReview = async (
    file: File, 
    onAgentStart: (agentName: string) => void,
    onAgentFinish: (agentName: string) => void
): Promise<ReviewReport> => {
    
    const base64 = await fileToBase64(file);
    const mimeType = file.type;

    // --- PHASE 1: REFERENCE AUDIT ---
    onAgentStart("Citation Scanner");
    const extractedRefs = await extractReferencesFromPdf(base64, mimeType);
    
    // Validate batches against OpenAlex/Crossref
    // We only validate the first 20 to save time/bandwidth, usually enough for a spot check
    const refsToValidate = extractedRefs.slice(0, 20);
    const validatedRefs = await CitationService.validateBatch(refsToValidate);
    
    const totalChecked = validatedRefs.length;
    const verifiedCount = validatedRefs.filter(r => r.isVerified).length;
    const unverifiedRefs = validatedRefs.filter(r => !r.isVerified);
    const hallucinationRate = totalChecked > 0 ? Math.round(((totalChecked - verifiedCount) / totalChecked) * 100) : 0;
    const healthScore = totalChecked > 0 ? Math.round((verifiedCount / totalChecked) * 100) : 100;

    const auditData: ReferenceAudit = {
        total: extractedRefs.length,
        verified: verifiedCount,
        unverified: unverifiedRefs.length,
        hallucinationRate,
        suspiciousRefs: unverifiedRefs.map(r => r.title).slice(0, 5),
        healthScore
    };

    const auditSummaryString = `
      Validation Report:
      - Total References Found: ${extractedRefs.length}
      - Subset Checked: ${totalChecked}
      - Successfully Verified DOIs: ${verifiedCount}
      - Potential Hallucinations/Broken Links: ${unverifiedRefs.length}
      - Citation Health Score: ${healthScore}/100
      - Suspicious Entries: ${unverifiedRefs.map(r => `"${r.title}"`).join(", ")}
    `;
    onAgentFinish("Citation Scanner");

    // --- PHASE 2: AGENT SIMULATION ---

    const agents = [
        {
            name: "Dr. Methodos",
            role: "Senior Statistician & Methodology Expert",
            focus: "Research design, statistical validity, data analysis consistency, and reproducibility.",
            needsAudit: false
        },
        {
            name: "The Citation Police",
            role: "Bibliography Integrity Officer",
            focus: "Check for hallucinated references, self-citation padding, and relevance of cited works. Use the provided audit stats.",
            needsAudit: true // This agent gets the audit context
        },
        {
            name: "Prof. Clarity",
            role: "Linguistic & Structure Specialist",
            focus: "Writing quality, flow, argumentation structure, figure clarity, and adherence to academic tone.",
            needsAudit: false
        },
        {
            name: "Reviewer #2",
            role: "Critical Adversarial Reviewer",
            focus: "Finding fatal flaws, novelty assessment, comparing against state-of-the-art, and identifying missing citations.",
            needsAudit: false
        }
    ];

    const results: ReviewAgentResult[] = [];

    for (const agent of agents) {
        onAgentStart(agent.name);
        const result = await runReviewAgent(
            agent.name, 
            agent.role, 
            agent.focus, 
            base64, 
            mimeType,
            agent.needsAudit ? auditSummaryString : undefined
        );
        results.push(result);
        onAgentFinish(agent.name);
    }

    // Synthesis Step (Editor in Chief)
    onAgentStart("Editor-in-Chief");
    
    const avgScore = results.reduce((acc, r) => acc + r.score, 0) / results.length; // 0-10
    const normalizedScore = Math.round(avgScore * 10); // 0-100

    // Heuristic for final verdict
    // If Citation Health is bad (<60%), immediate reject
    let finalVerdict: ReviewReport['finalVerdict'] = 'Accept';
    
    if (healthScore < 60) {
        finalVerdict = 'Reject'; // Reference fraud detected
    } else {
        const rejectCount = results.filter(r => r.verdict === 'Reject').length;
        const majorCount = results.filter(r => r.verdict === 'Major Revision').length;
        
        if (rejectCount >= 1 || majorCount >= 2) finalVerdict = 'Reject';
        else if (majorCount >= 1) finalVerdict = 'Major Revision';
        else if (avgScore < 8) finalVerdict = 'Minor Revision';
    }

    const report: ReviewReport = {
        overallScore: normalizedScore,
        finalVerdict: finalVerdict,
        acceptanceProbability: normalizedScore > 80 && healthScore > 90 ? "High (>80%)" : normalizedScore > 60 ? "Medium (40-60%)" : "Low (<20%)",
        summary: `The panel has concluded. Citation Health is ${healthScore}%. ${results[1].agentName} flagged ${auditData.unverified} unverified references. ${results[0].agentName} evaluated the methodology.`,
        agentReviews: results,
        referenceAudit: auditData
    };
    
    await new Promise(r => setTimeout(r, 1500));
    onAgentFinish("Editor-in-Chief");

    return report;
};
