export enum AppStep {
  TOPIC_INPUT = 0,
  TOPIC_GENERATION = 1,
  RESEARCHING = 2,
  METHODOLOGY_SELECTION = 3,
  TEMPLATE_SELECTION = 4,
  DRAFTING = 5,
  FINISHED = 6,
}

export interface ResearchTopic {
  id: string;
  title: string;
  description: string;
  gap: string;
  noveltyScore: number; // 1-100
  feasibility: string; // High, Medium, Low
}

export interface Reference {
  title: string;
  authors: string[];
  year: string;
  url?: string;
  doi?: string;
  snippet: string;
  source: string;
  isPreprint: boolean;
  isVerified: boolean;
}

export interface MethodologyOption {
  id: string;
  name: string;
  description: string;
  implications: string;
  justification: string;
}

export interface LatexTemplate {
  id: string;
  name: string;
  description: string;
  classFile: string;
}

export interface ResearchState {
  domain: string;
  selectedTopic: ResearchTopic | null;
  references: Reference[];
  methodologies: MethodologyOption[];
  selectedMethodology: MethodologyOption | null;
  selectedTemplate: LatexTemplate | null;
  generatedLatex: string;
  logs: string[];
}