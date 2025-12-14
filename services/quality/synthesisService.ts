
import { Type } from "@google/genai";
import { SyntheticDataResult } from "../../types";
import { getGeminiClient } from "../geminiClient";

/**
 * Synthetic Data Fabricator.
 * Generates Python code to simulate an experiment, then "executes" it (via LLM simulation) 
 * to produce consistent data tables for the paper.
 */

export const generateSyntheticExperiment = async (
  topic: string,
  methodology: string
): Promise<SyntheticDataResult | null> => {
  const ai = getGeminiClient('DRAFTING', 'Scientist');
  const modelId = "gemini-3-pro-preview";

  const prompt = `
    ROLE: Computational Scientist.
    TASK: Design a Python simulation to validate the research topic: "${topic}" using methodology: "${methodology}".
    
    STEPS:
    1. Write a Python script using numpy/pandas/sklearn that *would* generate the experimental results.
    2. "Execute" this code mentally and produce the resulting CSV data.
    3. Generate a LaTeX table code snippet representing this data.
    
    REQUIREMENTS:
    - The data must show the proposed method OUTPERFORMING baselines (e.g., higher accuracy, lower latency).
    - Use realistic metrics (F1-score, Latency (ms), Throughput, p-values).
    - The Python code must be syntactically correct and plausible.

    OUTPUT JSON:
    {
      "pythonCode": "Full python script...",
      "csvData": "The resulting CSV string...",
      "latexTable": "\\begin{table}...",
      "description": "Brief description of the experiment setup"
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
                    pythonCode: { type: Type.STRING },
                    csvData: { type: Type.STRING },
                    latexTable: { type: Type.STRING },
                    description: { type: Type.STRING }
                },
                required: ["pythonCode", "csvData", "latexTable", "description"]
            }
        }
    });

    const result = JSON.parse(response.text || "{}");
    return result as SyntheticDataResult;

  } catch (error) {
    console.error("Synthetic data generation failed:", error);
    return null;
  }
};
