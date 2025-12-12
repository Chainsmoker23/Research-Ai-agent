
export enum AppStep {
  LANDING = -1,
  MODE_SELECTION = 0,
  TOPIC_INPUT = 1,    // Discovery Path
  NOVELTY_CHECK = 2,  // Validation Path
  RESEARCHING = 3,
  TOPIC_GENERATION = 4,
  METHODOLOGY_SELECTION = 5,
  TEMPLATE_SELECTION = 6,
  DRAFTING = 7,
  FINISHED = 8,
  PEER_REVIEW = 9,    // External Reviewer
}

export interface ResearchTopic {
  id: string;
  title: string;
  description: string;
  gap: string;
  noveltyScore: number; // 1-100
  feasibility: string; // High, Medium, Low
}

export interface NoveltyAssessment {
  score: number;
  verdict: 'High' | 'Medium' | 'Low';
  acceptanceProbability: string; // e.g. "75%"
  analysis: string; // Detailed breakdown
  similarPapers: string[]; // Titles of papers that might conflict
  recommendation: 'PROCEED' | 'REFINE' | 'pivot';
}

export interface Reference {
  title: string;
  authors: string[];
  year: string;
  url?: string;
  doi?: string;
  snippet: string;
  source: string; // Original search agent source
  venue?: string; // Validated publication venue (e.g. Journal Name)
  citationCount?: number;
  abstract?: string;
  isPreprint: boolean;
  isVerified: boolean;
  citationKey?: string; // Added for drafting
  bibtex?: string; // Auto-fetched BibTeX
  fieldsOfStudy?: string[]; // Auto-fetched fields
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

export interface AuthorMetadata {
  fullName: string;
  affiliation: string;
  department: string;
  email: string;
  orcid?: string;
  funding?: string;
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
  authorMetadata?: AuthorMetadata;
}

// --- PEER REVIEW TYPES ---

export interface ReviewAgentResult {
  agentName: string;
  role: string;
  score: number; // 1-10
  summary: string;
  strengths: string[];
  weaknesses: string[];
  verdict: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject';
}

export interface ReferenceAudit {
  total: number;
  verified: number;
  unverified: number;
  hallucinationRate: number; // percentage
  suspiciousRefs: string[]; // Titles of unverified refs
  healthScore: number; // 0-100
}

export interface ReviewReport {
  overallScore: number; // 0-100
  finalVerdict: 'Accept' | 'Minor Revision' | 'Major Revision' | 'Reject';
  acceptanceProbability: string;
  summary: string;
  agentReviews: ReviewAgentResult[];
  referenceAudit?: ReferenceAudit;
}

// --- EDITORIAL BOARD TYPES ---

export interface EditorialLog {
  agentName: string;
  action: string;
  details: string;
  timestamp: number;
}

export interface EditorialState {
  iteration: number;
  currentAgent: 'Typesetter' | 'Reviewer' | 'Auditor' | 'Editor-in-Chief' | 'Idle';
  logs: EditorialLog[];
  qualityScore: number;
  isComplete: boolean;
}
