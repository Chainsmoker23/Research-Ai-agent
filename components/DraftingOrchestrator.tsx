
import React, { useState, useEffect, useRef } from 'react';
import { AuthorMetadata, ResearchTopic, Reference, MethodologyOption, LatexTemplate, EditorialLog, ReviewReport, WritingStyle, DraftSection } from '../types';
import * as GeminiService from '../services/geminiService';
import * as DeepSearchService from '../services/deepSearchService';
import * as EditorialService from '../services/editorialService';
import * as ReviewService from '../services/reviewService';
import * as CritiqueService from '../services/quality/critiqueService';
import * as SynthesisService from '../services/quality/synthesisService';
import * as TableService from '../services/quality/tableService';
import * as CoherenceService from '../services/quality/coherenceService';
import * as CitationGraphService from '../services/quality/citationGraphService';
import * as AppendixService from '../services/quality/appendixService';
import * as RoadmapService from '../services/roadmapService';

import { AuthorMetadataForm } from './AuthorMetadataForm';
import { LatexPreview } from './LatexPreview';
import { ReviewReportView } from './ReviewReportView';
import { CritiqueVisualizer } from './CritiqueVisualizer';
import { WritingStyleSelector } from './WritingStyleSelector';
import { TEMPLATES } from '../constants';
import { CheckCircle2, Circle, Loader2, Play, RefreshCw, AlertTriangle, BookOpen, Database, ScanSearch, History, TrendingUp, Microscope, SearchX, Gavel, FileCode, CheckCheck, UserCheck, ShieldAlert, X, BrainCircuit, Terminal, Scale, PenTool, GitBranch, Link, Map, FilePlus2 } from 'lucide-react';

interface DraftingOrchestratorProps {
  topic: ResearchTopic;
  methodology: MethodologyOption;
  template: LatexTemplate;
  references: Reference[];
  onComplete: () => void;
}

export const DraftingOrchestrator: React.FC<DraftingOrchestratorProps> = ({
  topic, methodology, template: initialTemplate, references: initialReferences, onComplete
}) => {
  const [step, setStep] = useState<'metadata' | 'abstract' | 'gathering_citations' | 'roadmap' | 'sections' | 'review_choice' | 'editorial_polish' | 'final'>('metadata');
  const [authorData, setAuthorData] = useState<AuthorMetadata | null>(null);
  const [writingStyle, setWritingStyle] = useState<WritingStyle>('Standard');
  
  // Local references state
  const [references, setReferences] = useState<Reference[]>(initialReferences);
  
  // Abstract State
  const [draftTitle, setDraftTitle] = useState("");
  const [draftAbstract, setDraftAbstract] = useState("");
  const [draftKeywords, setDraftKeywords] = useState<string[]>([]);
  const [isGeneratingAbstract, setIsGeneratingAbstract] = useState(false);

  // Multi-Agent Gathering State
  const [agentStates, setAgentStates] = useState<Record<string, DeepSearchService.AgentProgress>>({});
  const [gatheringStatus, setGatheringStatus] = useState("Initializing swarm...");
  const [gatheredCount, setGatheredCount] = useState(0);

  // Editorial State
  const [editorialLogs, setEditorialLogs] = useState<EditorialLog[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Peer Review State
  const [isRunningReview, setIsRunningReview] = useState(false);
  const [reviewReport, setReviewReport] = useState<ReviewReport | null>(null);
  const [reviewAgent, setReviewAgent] = useState<string | null>(null);

  // Appendix State
  const [appendixContent, setAppendixContent] = useState<string>("");
  const [isGeneratingAppendix, setIsGeneratingAppendix] = useState(false);

  // Quality State
  const [currentAction, setCurrentAction] = useState<string>("");

  // Sections State - Initially empty, populated by Roadmap
  const [sections, setSections] = useState<DraftSection[]>([]);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [streamingContent, setStreamingContent] = useState("");
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  
  // Final Assembly & Template Switching
  const [fullLatex, setFullLatex] = useState("");
  const [activeTemplate, setActiveTemplate] = useState<LatexTemplate>(initialTemplate);

  // Helper to assign keys
  const assignCitationKeys = (refs: Reference[]) => {
      refs.forEach((r, i) => {
        if (!r.citationKey) {
            const author = r.authors[0]?.split(' ').pop()?.replace(/[^a-zA-Z]/g, '') || 'Unknown';
            r.citationKey = `${author}${r.year}${i}`;
        }
      });
      return refs;
  };

  useEffect(() => {
    setReferences(prev => assignCitationKeys([...prev]));
  }, []);

  // Auto-scroll logs
  useEffect(() => {
      if (logsEndRef.current) {
          logsEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
  }, [editorialLogs]);

  const handleMetadataSubmit = (data: AuthorMetadata) => {
    setAuthorData(data);
    setStep('abstract');
    generateAbstract(data);
  };

  const generateAbstract = async (meta: AuthorMetadata) => {
    setIsGeneratingAbstract(true);
    try {
      const result = await GeminiService.generateDraftAbstract(topic.title, methodology);
      setDraftTitle(result.title);
      setDraftAbstract(result.abstract);
      setDraftKeywords(result.keywords);
    } catch (e) {
      console.error(e);
      alert("Abstract generation failed. Retrying...");
    } finally {
      setIsGeneratingAbstract(false);
    }
  };

  const handleApproveAbstract = async () => {
    setStep('gathering_citations');
    
    try {
      const expandedRefs = await DeepSearchService.orchestrateDeepSearch(
          topic.title,
          draftAbstract,
          (name, progress) => {
              setAgentStates(prev => ({ ...prev, [name]: progress }));
          },
          (msg) => setGatheringStatus(msg)
      );
      
      const combined: Reference[] = [...references, ...expandedRefs];
      const uniqueMap = new Map<string, Reference>();
      combined.forEach(r => {
          const key = r.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
          if (!uniqueMap.has(key)) uniqueMap.set(key, r);
          else {
              if (r.isVerified) uniqueMap.set(key, r);
          }
      });
      
      const uniqueList: Reference[] = Array.from(uniqueMap.values());
      const readyRefs = assignCitationKeys(uniqueList);
      
      setReferences(readyRefs);
      setGatheredCount(readyRefs.length);
      
      setGatheringStatus(`Deep search complete. Found ${readyRefs.length} validated references.`);
      await new Promise(r => setTimeout(r, 1500));

      // Move to Roadmap generation instead of directly to sections
      setStep('roadmap');
      generateRoadmap(readyRefs);

    } catch (e) {
      console.error("Gathering failed", e);
      alert("Deep search failed, proceeding with initial references.");
      setStep('roadmap');
      generateRoadmap(references);
    }
  };

  const generateRoadmap = async (currentRefs: Reference[]) => {
      setIsGeneratingRoadmap(true);
      try {
          const blueprint = await RoadmapService.generatePaperRoadmap(topic.title, methodology, draftAbstract, currentRefs);
          
          // Convert blueprint to DraftSections
          const newSections: DraftSection[] = blueprint.map((section, idx) => ({
              id: `sec-${idx}`,
              name: section.title,
              content: '',
              status: 'pending',
              purpose: section.purpose,
              customInstructions: section.draftingInstructions,
              estimatedWordCount: section.wordCount
          }));
          
          setSections(newSections);
      } catch (e) {
          console.error("Roadmap failed", e);
          // Fallback to standard sections if AI fails
          setSections([
            { id: 'intro', name: 'Introduction', content: '', status: 'pending' },
            { id: 'related', name: 'Related Work', content: '', status: 'pending' },
            { id: 'method', name: 'Methodology', content: '', status: 'pending' },
            { id: 'results', name: 'Results & Analysis', content: '', status: 'pending' },
            { id: 'discussion', name: 'Discussion', content: '', status: 'pending' },
            { id: 'conclusion', name: 'Conclusion', content: '', status: 'pending' },
          ]);
      } finally {
          setIsGeneratingRoadmap(false);
      }
  };

  const handleApproveRoadmap = () => {
      setStep('sections');
      generateNextSection(0, references);
  };

  const generateNextSection = async (index: number, currentRefs: Reference[] = references) => {
    if (index >= sections.length) {
      setStep('review_choice');
      return;
    }

    const section = sections[index];
    setCurrentSectionIdx(index);
    
    // Reset state for this section
    setSections(prev => prev.map((s, i) => i === index ? { ...s, status: 'drafting', errorMsg: undefined } : s));
    setStreamingContent("");
    
    try {
      // 1. Synthetic Data Injection
      let injectedContext = "";
      if (section.name.toLowerCase().includes("result") || section.name.toLowerCase().includes("method") || section.name.toLowerCase().includes("experiment")) {
         setCurrentAction("Computational Scientist: Simulating experiment...");
         try {
             const syntheticData = await SynthesisService.generateSyntheticExperiment(topic.title, methodology.name);
             if (syntheticData) {
                injectedContext = `
                  [SYSTEM NOTE: SYNTHETIC DATA GENERATED]
                  Python Code: ${syntheticData.pythonCode.substring(0, 300)}...
                  Data Summary: ${syntheticData.description}
                  
                  MANDATORY REQUIREMENT:
                  You MUST include the following LaTeX table in the text exactly as provided below:
                  ${syntheticData.latexTable}
                `;
             }
         } catch (err) {
             console.warn("Synthetic data failed, proceeding without it.");
         }
      }

      // --- FEATURE: CITATION GRAPH WALKER (Related Work) ---
      let content = "";
      
      // Heuristic: If it looks like Related Work, use the specialized walker
      // But verify it's not overridden by custom roadmap instructions
      const isRelatedWork = section.name.toLowerCase().includes("related work") || section.name.toLowerCase().includes("literature");
      
      if (isRelatedWork) {
          setCurrentAction("Graph Walker: Mapping citation lineage & narrative arcs...");
          try {
              // Context from previous sections (Intro)
              const previousContent = sections.slice(0, index).map(s => s.content).join("\n");
              
              // Use the specialized Graph Walker service
              content = await CitationGraphService.generateNarrativeRelatedWork(
                  topic.title,
                  currentRefs,
                  previousContent
              );
              
              // Simulate streaming for UI consistency
              setStreamingContent(content);
          } catch (e) {
              console.warn("Graph Walker failed, falling back to standard drafter.");
              // Fallthrough to standard generation
          }
      }

      // 2. Standard Drafting (if not Related Work or if Graph Walker failed)
      if (!content) {
          const context = `
            Title: ${draftTitle}
            Abstract: ${draftAbstract}
            Structure: ${sections.map(s => s.name).join(", ")}
            Completed Sections: ${sections.slice(0, index).map(s => `--- ${s.name} ---\n${s.content}`).join("\n\n")}
            ${injectedContext}
          `;

          setCurrentAction("Author Agent: Architecting section structure...");
          content = await GeminiService.generateDraftSection(
            section.name, 
            context, 
            currentRefs, 
            topic.title, 
            methodology,
            (chunk) => {
                if (chunk) {
                   setCurrentAction("Author Agent: Writing final prose...");
                   setStreamingContent(chunk);
                }
            },
            writingStyle,
            section.customInstructions // Pass specific instructions from roadmap
          );
      }

      // 3. Iterative Self-Critique & Table Formatting
      setCurrentAction("Reviewer Agent: Critiquing and refining...");
      
      const critiqueResult = await CritiqueService.critiqueAndRefineSection(section.name, content, topic.title);
      const improvedContent = critiqueResult.improvedContent || content;
      
      // Post-Process: Smart Table Formatting
      const formattedContent = TableService.processLatexTables(improvedContent);

      // Update section state to trigger Visualizer
      setSections(prev => prev.map((s, i) => i === index ? { 
          ...s, 
          status: 'critiquing',
          critiqueData: {
              original: content,
              improved: formattedContent, // Use the table-formatted version
              issues: critiqueResult.issuesFound
          }
      } : s));
      
      // The visualizer component will handle the transition to 'completed' via onComplete callback

    } catch (e: any) {
      console.error(`Section ${section.name} failed:`, e);
      setCurrentAction("Error encountered.");
      setSections(prev => prev.map((s, i) => i === index ? { 
          ...s, 
          status: 'error', 
          errorMsg: e.message || "Generation failed." 
      } : s));
    }
  };

  const handleVisualizerComplete = () => {
      // Move current section to completed
      setSections(prev => prev.map((s, i) => i === currentSectionIdx ? { 
          ...s, 
          content: s.critiqueData?.improved || s.content, // Finalize content
          status: 'completed' 
      } : s));

      setCurrentAction("Section complete.");
      
      // Proceed to next section
      setTimeout(() => {
          generateNextSection(currentSectionIdx + 1, references);
      }, 500);
  };

  const handleRetrySection = (index: number) => {
      generateNextSection(index, references);
  };

  const handleGenerateAppendix = async () => {
      setIsGeneratingAppendix(true);
      try {
          const content = await AppendixService.generateAppendix(topic.title, methodology.name);
          setAppendixContent(content);
      } catch (e) {
          console.error("Appendix failed", e);
          alert("Failed to generate appendix.");
      } finally {
          setIsGeneratingAppendix(false);
      }
  };

  const compileRawLatex = (targetTemplate: LatexTemplate = activeTemplate, overrideAbstract?: string) => {
      if (!authorData) return "";
      
      const bib = GeminiService.generateBibliography(references);
      let body = sections.map(s => `
\\section{${s.name}}
${s.content}
    `).join("\n");

      // Append Appendix if it exists
      if (appendixContent) {
          body += `\n\n${appendixContent}\n`;
      }

      // Use the potentially revised abstract
      const abstractToUse = overrideAbstract || draftAbstract;

      if (targetTemplate.rawTemplate) {
          let latex = targetTemplate.rawTemplate;
          const nameParts = authorData.fullName.split(' ');
          const surName = nameParts.length > 1 ? nameParts.pop() || "" : "";
          const firstName = nameParts.join(" ") || authorData.fullName;

          latex = latex.split('{{TITLE}}').join(draftTitle);
          latex = latex.split('{{TITLE_SHORT}}').join(draftTitle.substring(0, 50) + "...");
          latex = latex.split('{{AUTHOR_FNM}}').join(firstName);
          latex = latex.split('{{AUTHOR_SUR}}').join(surName);
          latex = latex.split('{{AUTHOR_EMAIL}}').join(authorData.email);
          latex = latex.split('{{AUTHOR_DEPT}}').join(authorData.department);
          latex = latex.split('{{AUTHOR_AFFIL}}').join(authorData.affiliation);
          latex = latex.split('{{ABSTRACT}}').join(abstractToUse);
          latex = latex.split('{{KEYWORDS}}').join(draftKeywords.join(", "));
          latex = latex.split('{{BODY}}').join(body);
          latex = latex.split('{{BIBLIOGRAPHY}}').join(bib);
          latex = latex.split('{{FUNDING}}').join(authorData.funding || "No funding was received for this work.");
          
          return latex;
      }

      return ""; // Fallback
  };

  const handleSkipReview = () => {
      setFullLatex(compileRawLatex());
      setStep('final');
  };

  const startEditorialBoard = async () => {
      setStep('editorial_polish');
      let currentLatex = compileRawLatex();
      
      try {
          // --- FEATURE: THREAD-WEAVER (Coherence Check) ---
          setEditorialLogs(prev => [...prev, { agentName: "Thread-Weaver", action: "Working", details: "Checking Abstract vs Results consistency...", timestamp: Date.now() }]);
          
          const coherenceResult = await CoherenceService.checkAndAlignCoherence(draftTitle, sections, draftAbstract);
          
          if (!coherenceResult.aligned && coherenceResult.revisedAbstract) {
              setEditorialLogs(prev => [...prev, { agentName: "Thread-Weaver", action: "Intervention", details: "Contradiction found! Rewriting Abstract to match findings.", timestamp: Date.now() }]);
              // Update local state
              setDraftAbstract(coherenceResult.revisedAbstract);
              // Recompile with new abstract
              currentLatex = compileRawLatex(activeTemplate, coherenceResult.revisedAbstract);
          } else {
              setEditorialLogs(prev => [...prev, { agentName: "Thread-Weaver", action: "Verified", details: "Global narrative consistency verified.", timestamp: Date.now() }]);
          }

          // Simplified Linear Pipeline: Typesetter -> Reviewer -> Auditor
          const polishedLatex = await EditorialService.performEditorialLoop(currentLatex, (log) => {
              setEditorialLogs(prev => [...prev, log]);
          });
          
          setFullLatex(polishedLatex);
          setStep('final');
      } catch (e) {
          console.error("Editorial failed", e);
          setFullLatex(currentLatex);
          setStep('final');
      }
  };

  const handleTemplateChange = (templateId: string) => {
      const newTemplate = TEMPLATES.find(t => t.id === templateId);
      if (newTemplate) {
          setActiveTemplate(newTemplate);
          setFullLatex(compileRawLatex(newTemplate));
      }
  };

  const handleRunPeerReview = async (pdfBlob: Blob) => {
      setIsRunningReview(true);
      setReviewReport(null);
      setReviewAgent(null);
      
      try {
          const file = new File([pdfBlob], "manuscript.pdf", { type: "application/pdf" });
          const report = await ReviewService.performPeerReview(
              file,
              (agentName) => setReviewAgent(agentName),
              () => setReviewAgent(null)
          );
          setReviewReport(report);
      } catch (e) {
          console.error("Review failed", e);
          alert("Peer review failed.");
      } finally {
          setIsRunningReview(false);
      }
  };

  const getAgentIcon = (role: string) => {
      switch(role) {
          case 'Historian': return <History className="w-5 h-5" />;
          case 'Futurist': return <TrendingUp className="w-5 h-5" />;
          case 'Methodologist': return <Microscope className="w-5 h-5" />;
          case 'Critic': return <SearchX className="w-5 h-5" />;
          default: return <ScanSearch className="w-5 h-5" />;
      }
  };

  // --- RENDERERS ---

  if (step === 'metadata') return <AuthorMetadataForm onSubmit={handleMetadataSubmit} isLoading={false} />;

  if (step === 'abstract') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {isGeneratingAbstract ? <Loader2 className="animate-spin text-indigo-600" /> : <CheckCircle2 className="text-green-600" />}
            Phase 1: Concept & Abstract
          </h2>
          {isGeneratingAbstract ? (
             <div className="text-center py-12 text-slate-500">
               <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-indigo-300" />
               Drafting high-impact abstract based on {references.length} verified sources...
             </div>
          ) : (
             <div className="space-y-6">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Proposed Title</label>
                 <input 
                   value={draftTitle} 
                   onChange={(e) => setDraftTitle(e.target.value)}
                   className="w-full text-lg font-bold p-3 border rounded-lg" 
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Abstract</label>
                 <textarea 
                   rows={8}
                   value={draftAbstract}
                   onChange={(e) => setDraftAbstract(e.target.value)}
                   className="w-full p-3 border rounded-lg font-serif leading-relaxed" 
                 />
               </div>
               <div className="flex flex-col md:flex-row justify-between items-center pt-4 gap-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                      <WritingStyleSelector 
                        selectedStyle={writingStyle}
                        onChange={setWritingStyle}
                      />
                  </div>
                  
                  <button onClick={handleApproveAbstract} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 w-full md:w-auto justify-center">
                    Approve & Start Deep Research <Play className="w-4 h-4" />
                  </button>
               </div>
             </div>
          )}
        </div>
      </div>
    );
  }

  // MULTI-AGENT GATHERING
  if (step === 'gathering_citations') {
      return (
        <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Deep Knowledge Retrieval</h2>
                <p className="text-slate-500">{gatheringStatus}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 justify-center">
                {Object.values(agentStates).map((agent: DeepSearchService.AgentProgress) => (
                    <div key={agent.name} className={`bg-white rounded-xl border-2 p-6 shadow-sm flex flex-col items-center text-center transition-all ${agent.status === 'searching' ? 'border-indigo-400 shadow-indigo-100 scale-105' : 'border-slate-100'}`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${agent.color.replace('text', 'bg').replace('border', 'bg').split(' ')[1]} ${agent.color.split(' ')[0]}`}>
                            {getAgentIcon(agent.role)}
                        </div>
                        <h3 className="font-bold text-slate-900">{agent.name}</h3>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-2">{agent.role}</p>
                        <p className="text-xs text-slate-500 mb-4 h-8 leading-tight">{agent.description}</p>
                        <div className="mt-auto w-full">
                            {agent.status === 'searching' || agent.status === 'analyzing' ? (
                                <div className="flex items-center justify-center gap-2 text-indigo-600 text-xs font-bold animate-pulse">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Scanning...
                                </div>
                            ) : (
                                <div className="bg-green-50 text-green-700 py-1 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Found {agent.foundCount}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      );
  }

  // --- ROADMAP ARCHITECT VIEW ---
  if (step === 'roadmap') {
      return (
          <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
              <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                      <Map className="w-8 h-8 text-indigo-600" /> Research Roadmap
                  </h2>
                  <p className="text-slate-500">
                      {isGeneratingRoadmap ? "Architecting optimal paper structure..." : "The Roadmap Architect has designed a bespoke structure for your methodology."}
                  </p>
              </div>

              {isGeneratingRoadmap ? (
                  <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-4" />
                      <p className="text-slate-600 font-medium">Analyzing methodology and literature...</p>
                  </div>
              ) : (
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                          <span className="font-bold text-slate-700 uppercase tracking-widest text-xs">Table of Contents</span>
                          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{sections.length} Sections</span>
                      </div>
                      
                      <div className="divide-y divide-slate-100">
                          {sections.map((section, idx) => (
                              <div key={idx} className="p-6 hover:bg-slate-50 transition-colors group">
                                  <div className="flex items-start justify-between">
                                      <div className="flex items-start gap-4">
                                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center shrink-0 border border-slate-200">
                                              {idx + 1}
                                          </div>
                                          <div>
                                              <h3 className="font-bold text-slate-900 text-lg mb-1">{section.name}</h3>
                                              <p className="text-sm text-slate-500 italic mb-2">{section.purpose}</p>
                                              <div className="text-xs text-slate-400 font-mono bg-slate-50 p-2 rounded border border-slate-100 opacity-80 group-hover:opacity-100 transition-opacity">
                                                  {section.estimatedWordCount} words • {section.customInstructions?.substring(0, 100)}...
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>

                      <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                          <button 
                              onClick={handleApproveRoadmap}
                              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2"
                          >
                              Approve & Begin Drafting <Play className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // REVIEW CHOICE UI
  if (step === 'review_choice') {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in text-center space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCheck className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">First Draft Complete</h2>
                <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto">
                    All sections have been written. You can now proceed to the <strong>Editorial Board</strong> for a rigor check, or export the draft as is.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={handleSkipReview}
                        className="px-8 py-4 border-2 border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        <FileCode className="w-5 h-5" /> View/Export Draft
                    </button>
                    <button 
                        onClick={handleGenerateAppendix}
                        disabled={isGeneratingAppendix || !!appendixContent}
                        className="px-8 py-4 border-2 border-indigo-100 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isGeneratingAppendix ? <Loader2 className="w-5 h-5 animate-spin" /> : <FilePlus2 className="w-5 h-5" />}
                        {appendixContent ? "Appendix Generated" : "Generate Appendix"}
                    </button>
                    <button 
                        onClick={startEditorialBoard}
                        className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        Start Editorial Review <Gavel className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
  }

  // EDITORIAL BOARD UI
  if (step === 'editorial_polish') {
      const activeAgent = editorialLogs[editorialLogs.length - 1]?.agentName || "Editor-in-Chief";
      const agents = [
          { name: "Thread-Weaver", role: "Consistency", icon: <GitBranch className="w-6 h-6"/>, color: "bg-amber-100 text-amber-600" },
          { name: "Typesetter", role: "LaTeX Fixer", icon: <FileCode className="w-6 h-6"/>, color: "bg-blue-100 text-blue-600" },
          { name: "Reviewer", role: "Scientific Rigor", icon: <UserCheck className="w-6 h-6"/>, color: "bg-purple-100 text-purple-600" },
          { name: "Auditor", role: "Citation Check", icon: <CheckCheck className="w-6 h-6"/>, color: "bg-emerald-100 text-emerald-600" },
      ];

      return (
          <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Editorial Board in Session</h2>
                  <p className="text-slate-500">Autonomous agents are polishing the final manuscript...</p>
              </div>

              {/* Agent Avatars */}
              <div className="flex justify-center gap-8 mb-12 flex-wrap">
                  {agents.map(a => {
                      const isActive = activeAgent === a.name;
                      return (
                          <div key={a.name} className={`flex flex-col items-center transition-all duration-500 ${isActive ? 'scale-110 opacity-100' : 'opacity-50 scale-90'}`}>
                              <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-3 ${a.color} ${isActive ? 'ring-4 ring-indigo-200' : ''}`}>
                                  {a.icon}
                              </div>
                              <span className="font-bold text-sm text-slate-900">{a.name}</span>
                              <span className="text-xs text-slate-500">{a.role}</span>
                              {isActive && <span className="mt-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>}
                          </div>
                      );
                  })}
              </div>

              {/* Log Console */}
              <div className="bg-slate-900 rounded-xl p-6 shadow-2xl border border-slate-800 max-w-3xl mx-auto overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
                      <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="ml-4 text-xs font-mono text-slate-400">editorial_process.log</span>
                  </div>
                  
                  <div className="h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                      {editorialLogs.map((log, i) => (
                          <div key={i} className="font-mono text-xs animate-fade-in-up">
                              <span className="text-slate-500">[{new Date(log.timestamp).toLocaleTimeString().split(' ')[0]}]</span>{" "}
                              <span className={`${log.agentName === 'Reviewer' ? 'text-purple-400' : log.agentName === 'Thread-Weaver' ? 'text-amber-400' : 'text-blue-400'} font-bold`}>{log.agentName}</span>:{" "}
                              <span className="text-slate-300">{log.details}</span>
                          </div>
                      ))}
                      <div ref={logsEndRef} />
                  </div>
                  
                  {/* Progress Indication */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                      <span>Status: <span className="text-green-400 animate-pulse">Active</span></span>
                      <span>Phase: Final Polish</span>
                  </div>
              </div>
          </div>
      );
  }

  // DRAFTING SECTIONS (Standard)
  if (step === 'sections') {
    return (
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[85vh]">
        {/* Sidebar Progress */}
        <div className="w-full lg:w-1/4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex justify-between items-center">
               <span>Drafting Queue</span>
               <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">{references.length} Refs</span>
            </div>
            <div className="flex-grow overflow-y-auto p-2 space-y-2">
               {sections.map((s, idx) => (
                 <div key={s.id} className={`p-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-colors
                    ${idx === currentSectionIdx ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-slate-600'}
                    ${s.status === 'completed' ? 'bg-green-50 text-green-700' : ''}
                    ${s.status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                 `}>
                    {s.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
                     s.status === 'error' ? <AlertTriangle className="w-4 h-4" /> :
                     idx === currentSectionIdx ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     <Circle className="w-4 h-4 text-slate-300" />}
                    <span className="truncate" title={s.name}>{s.name}</span>
                 </div>
               ))}
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col overflow-hidden relative">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 flex items-center gap-2 truncate max-w-md">
                 <PenTool className="w-4 h-4 text-indigo-600" />
                 Drafting: {sections[currentSectionIdx]?.name}
                 <span className="text-xs font-normal text-slate-500 ml-2 hidden sm:inline">
                     {currentAction ? `(${currentAction})` : ''}
                 </span>
               </h3>
               {/* Use the new Selector, but disabled during active drafting to prevent context switching mid-stream */}
               <div className="scale-90 origin-right">
                   <WritingStyleSelector 
                        selectedStyle={writingStyle}
                        onChange={setWritingStyle}
                        disabled={sections[currentSectionIdx]?.status === 'drafting' || sections[currentSectionIdx]?.status === 'critiquing'}
                   />
               </div>
            </div>
            
            <div className="flex-grow relative bg-slate-900">
                {sections[currentSectionIdx]?.status === 'critiquing' && sections[currentSectionIdx]?.critiqueData ? (
                    <CritiqueVisualizer 
                        originalText={sections[currentSectionIdx].critiqueData!.original}
                        improvedText={sections[currentSectionIdx].critiqueData!.improved}
                        issues={sections[currentSectionIdx].critiqueData!.issues}
                        onComplete={handleVisualizerComplete}
                    />
                ) : sections[currentSectionIdx]?.status === 'error' ? (
                    <div className="flex flex-col items-center justify-center h-full text-red-400 space-y-4 p-6">
                        <AlertTriangle className="w-12 h-12" />
                        <div className="text-center">
                            <h4 className="text-lg font-bold">Generation Failed</h4>
                            <p className="text-sm max-w-md mt-2">{sections[currentSectionIdx].errorMsg}</p>
                        </div>
                        <button 
                            onClick={() => handleRetrySection(currentSectionIdx)}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" /> Retry Agent
                        </button>
                    </div>
                ) : (
                    <div className="p-6 overflow-y-auto h-full text-slate-300 font-mono text-sm">
                        <pre className="whitespace-pre-wrap">
                        {sections[currentSectionIdx]?.status === 'drafting' 
                            ? streamingContent 
                            : sections[currentSectionIdx]?.content || "Waiting for agent..."}
                        </pre>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3 relative z-10">
               {sections[currentSectionIdx]?.status === 'completed' ? (
                  <>
                     <button onClick={() => generateNextSection(currentSectionIdx, references)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Regenerate
                     </button>
                     <button onClick={() => generateNextSection(currentSectionIdx + 1, references)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
                        {currentSectionIdx === sections.length - 1 ? "Finish Drafting" : "Next Section"} <Play className="w-4 h-4" />
                     </button>
                  </>
               ) : sections[currentSectionIdx]?.status !== 'error' ? (
                  <span className="text-sm text-slate-500 italic flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin" /> {currentAction || "Agent is thinking..."}
                  </span>
               ) : null}
            </div>
        </div>
      </div>
    );
  }

  // --- FINAL VIEW with Review Integration ---
  
  return (
    <>
      <LatexPreview 
        content={fullLatex} 
        templates={TEMPLATES}
        currentTemplateId={activeTemplate.id}
        onTemplateChange={handleTemplateChange}
        onAnalyze={handleRunPeerReview}
      />

      {/* Peer Review Overlay */}
      {(isRunningReview || reviewReport) && (
          <div className="fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col relative shadow-2xl">
                  {/* Close Button */}
                  <button 
                    onClick={() => { setIsRunningReview(false); setReviewReport(null); }}
                    className="absolute top-4 right-4 z-10 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                  >
                      <X className="w-5 h-5 text-slate-500" />
                  </button>

                  <div className="overflow-y-auto p-4 flex-grow">
                      {isRunningReview ? (
                          <div className="flex flex-col items-center justify-center h-96 space-y-6">
                              <div className="relative">
                                  <div className="w-24 h-24 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                      <ShieldAlert className="w-10 h-10 text-indigo-600" />
                                  </div>
                              </div>
                              <div className="text-center">
                                  <h3 className="text-2xl font-bold text-slate-900">Peer Review in Progress</h3>
                                  <p className="text-slate-500 mt-2">
                                      {reviewAgent ? `${reviewAgent} is analyzing...` : "Review Board is assembling..."}
                                  </p>
                              </div>
                          </div>
                      ) : reviewReport ? (
                          <ReviewReportView 
                              report={reviewReport} 
                              onClose={() => { setIsRunningReview(false); setReviewReport(null); }} 
                          />
                      ) : null}
                  </div>
              </div>
          </div>
      )}
    </>
  );
};
