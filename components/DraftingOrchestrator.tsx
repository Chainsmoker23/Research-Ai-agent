
import React, { useState, useEffect, useRef } from 'react';
import { AuthorMetadata, ResearchTopic, Reference, MethodologyOption, LatexTemplate, EditorialLog } from '../types';
import * as GeminiService from '../services/geminiService';
import * as DeepSearchService from '../services/deepSearchService';
import * as EditorialService from '../services/editorialService';
import { AuthorMetadataForm } from './AuthorMetadataForm';
import { LatexPreview } from './LatexPreview';
import { CheckCircle2, Circle, Loader2, Play, RefreshCw, AlertTriangle, BookOpen, Database, ScanSearch, History, TrendingUp, Microscope, SearchX, Gavel, FileCode, CheckCheck, UserCheck } from 'lucide-react';

interface DraftingOrchestratorProps {
  topic: ResearchTopic;
  methodology: MethodologyOption;
  template: LatexTemplate;
  references: Reference[];
  onComplete: () => void;
}

type DraftSection = {
  id: string;
  name: string;
  content: string;
  status: 'pending' | 'drafting' | 'completed';
};

export const DraftingOrchestrator: React.FC<DraftingOrchestratorProps> = ({
  topic, methodology, template, references: initialReferences, onComplete
}) => {
  const [step, setStep] = useState<'metadata' | 'abstract' | 'gathering_citations' | 'sections' | 'editorial_polish' | 'final'>('metadata');
  const [authorData, setAuthorData] = useState<AuthorMetadata | null>(null);
  
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

  // Sections State
  const [sections, setSections] = useState<DraftSection[]>([
    { id: 'intro', name: 'Introduction', content: '', status: 'pending' },
    { id: 'related', name: 'Related Work', content: '', status: 'pending' },
    { id: 'method', name: 'Methodology', content: '', status: 'pending' },
    { id: 'results', name: 'Results & Analysis', content: '', status: 'pending' },
    { id: 'discussion', name: 'Discussion', content: '', status: 'pending' },
    { id: 'conclusion', name: 'Conclusion', content: '', status: 'pending' },
  ]);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [streamingContent, setStreamingContent] = useState("");
  
  // Final Assembly
  const [fullLatex, setFullLatex] = useState("");

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
      
      const combined = [...references, ...expandedRefs];
      const uniqueMap = new Map<string, Reference>();
      combined.forEach(r => {
          const key = r.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
          if (!uniqueMap.has(key)) uniqueMap.set(key, r);
          else {
              if (r.isVerified) uniqueMap.set(key, r);
          }
      });
      
      const uniqueList = Array.from(uniqueMap.values());
      const readyRefs = assignCitationKeys(uniqueList);
      
      setReferences(readyRefs);
      setGatheredCount(readyRefs.length);
      
      setGatheringStatus(`Deep search complete. Found ${readyRefs.length} validated references.`);
      await new Promise(r => setTimeout(r, 1500));

      setStep('sections');
      generateNextSection(0, readyRefs);

    } catch (e) {
      console.error("Gathering failed", e);
      alert("Deep search failed, proceeding with initial references.");
      setStep('sections');
      generateNextSection(0, references);
    }
  };

  const generateNextSection = async (index: number, currentRefs: Reference[] = references) => {
    if (index >= sections.length) {
      // Instead of final, go to editorial polish
      startEditorialBoard();
      return;
    }

    const section = sections[index];
    setCurrentSectionIdx(index);
    
    setSections(prev => prev.map((s, i) => i === index ? { ...s, status: 'drafting' } : s));
    setStreamingContent("");

    const context = `
      Title: ${draftTitle}
      Abstract: ${draftAbstract}
      
      Paper Structure:
      ${sections.map(s => s.name).join(", ")}

      Completed Sections:
      ${sections.slice(0, index).map(s => `--- ${s.name} ---\n${s.content}`).join("\n\n")}
    `;

    try {
      const content = await GeminiService.generateDraftSection(
        section.name, 
        context, 
        currentRefs, 
        topic.title, 
        methodology,
        (chunk) => setStreamingContent(chunk)
      );

      setSections(prev => prev.map((s, i) => i === index ? { ...s, content: content, status: 'completed' } : s));
    } catch (e) {
      console.error(e);
    }
  };

  const compileRawLatex = () => {
      if (!authorData) return "";
      
      const preamble = `
${template.classFile}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}

\\begin{document}

\\title{${draftTitle}}

\\author{
    \\IEEEauthorblockN{${authorData.fullName}}
    \\IEEEauthorblockA{\\textit{${authorData.department}} \\\\
    \\textit{${authorData.affiliation}} \\\\
    ${authorData.email} \\\\
    ${authorData.orcid ? `ORCID: ${authorData.orcid}` : ''}}
}

\\maketitle

\\begin{abstract}
${draftAbstract}
\\end{abstract}

\\begin{IEEEkeywords}
${draftKeywords.join(", ")}
\\end{IEEEkeywords}
    `;

    const body = sections.map(s => `
\\section{${s.name}}
${s.content}
    `).join("\n");

    const bib = GeminiService.generateBibliography(references);

    return preamble + body + `\n${bib}\n\\end{document}`;
  };

  const startEditorialBoard = async () => {
      setStep('editorial_polish');
      const rawLatex = compileRawLatex();
      
      try {
          const polishedLatex = await EditorialService.performEditorialLoop(rawLatex, (log) => {
              setEditorialLogs(prev => [...prev, log]);
          });
          
          setFullLatex(polishedLatex);
          setStep('final');
      } catch (e) {
          console.error("Editorial failed", e);
          setFullLatex(rawLatex);
          setStep('final');
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
               <div className="flex justify-end pt-4">
                  <button onClick={handleApproveAbstract} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

  // EDITORIAL BOARD UI
  if (step === 'editorial_polish') {
      const activeAgent = editorialLogs[editorialLogs.length - 1]?.agentName || "Editor-in-Chief";
      
      const agents = [
          { name: "Typesetter", role: "LaTeX Fixer", icon: <FileCode className="w-6 h-6"/>, color: "bg-blue-100 text-blue-600" },
          { name: "Reviewer", role: "Scientific Rigor", icon: <UserCheck className="w-6 h-6"/>, color: "bg-purple-100 text-purple-600" },
          { name: "Auditor", role: "Citation Check", icon: <CheckCheck className="w-6 h-6"/>, color: "bg-emerald-100 text-emerald-600" },
          { name: "Editor-in-Chief", role: "Orchestrator", icon: <Gavel className="w-6 h-6"/>, color: "bg-slate-800 text-white" }
      ];

      return (
          <div className="max-w-5xl mx-auto py-12 px-4 animate-fade-in">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Editorial Board in Session</h2>
                  <p className="text-slate-500">Autonomous agents are reviewing and polishing the final manuscript...</p>
              </div>

              {/* Agent Avatars */}
              <div className="flex justify-center gap-8 mb-12">
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
                              <span className={`${log.agentName === 'Editor-in-Chief' ? 'text-amber-400' : 'text-blue-400'} font-bold`}>{log.agentName}</span>:{" "}
                              <span className="text-slate-300">{log.details}</span>
                          </div>
                      ))}
                      <div ref={logsEndRef} />
                  </div>
                  
                  {/* Progress Indication */}
                  <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                      <span>Status: <span className="text-green-400 animate-pulse">Active</span></span>
                      <span>Target Quality: &gt;95/100</span>
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
                 `}>
                    {s.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
                     idx === currentSectionIdx ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                     <Circle className="w-4 h-4 text-slate-300" />}
                    {s.name}
                 </div>
               ))}
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col overflow-hidden relative">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 Drafting: {sections[currentSectionIdx].name}
                 {sections[currentSectionIdx].status === 'drafting' && <span className="text-xs font-normal text-indigo-600 animate-pulse">(Writing...)</span>}
               </h3>
            </div>
            
            <div className="flex-grow p-6 overflow-y-auto bg-slate-900 text-slate-300 font-mono text-sm">
                <pre className="whitespace-pre-wrap">
                   {sections[currentSectionIdx].status === 'drafting' 
                      ? streamingContent 
                      : sections[currentSectionIdx].content || "Waiting for agent..."}
                </pre>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
               {sections[currentSectionIdx].status === 'completed' ? (
                  <>
                     <button onClick={() => generateNextSection(currentSectionIdx, references)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" /> Regenerate
                     </button>
                     <button onClick={() => generateNextSection(currentSectionIdx + 1, references)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2">
                        {currentSectionIdx === sections.length - 1 ? "Start Editorial Review" : "Next Section"} <Play className="w-4 h-4" />
                     </button>
                  </>
               ) : (
                  <span className="text-sm text-slate-500 italic flex items-center gap-2">
                     <Loader2 className="w-4 h-4 animate-spin" /> Agent is thinking...
                  </span>
               )}
            </div>
        </div>
      </div>
    );
  }

  return <LatexPreview content={fullLatex} />;
};
