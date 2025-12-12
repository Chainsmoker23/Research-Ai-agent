import React, { useState, useEffect } from 'react';
import { AuthorMetadata, ResearchTopic, Reference, MethodologyOption, LatexTemplate } from '../types';
import * as GeminiService from '../services/geminiService';
import { AuthorMetadataForm } from './AuthorMetadataForm';
import { LatexPreview } from './LatexPreview';
import { CheckCircle2, Circle, Loader2, Play, RefreshCw, AlertTriangle } from 'lucide-react';

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
  topic, methodology, template, references, onComplete
}) => {
  const [step, setStep] = useState<'metadata' | 'abstract' | 'sections' | 'final'>('metadata');
  const [authorData, setAuthorData] = useState<AuthorMetadata | null>(null);
  
  // Abstract State
  const [draftTitle, setDraftTitle] = useState("");
  const [draftAbstract, setDraftAbstract] = useState("");
  const [draftKeywords, setDraftKeywords] = useState<string[]>([]);
  const [isGeneratingAbstract, setIsGeneratingAbstract] = useState(false);

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

  // Assign citation keys on mount
  useEffect(() => {
    references.forEach((r, i) => {
        if (!r.citationKey) {
            // Simple key: FirstAuthorYear
            const author = r.authors[0]?.split(' ').pop()?.replace(/[^a-zA-Z]/g, '') || 'Unknown';
            r.citationKey = `${author}${r.year}${i}`;
        }
    });
  }, [references]);

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

  const handleApproveAbstract = () => {
    setStep('sections');
    generateNextSection(0);
  };

  const generateNextSection = async (index: number) => {
    if (index >= sections.length) {
      assembleFinalDocument();
      return;
    }

    const section = sections[index];
    setCurrentSectionIdx(index);
    
    // Update status
    setSections(prev => prev.map((s, i) => i === index ? { ...s, status: 'drafting' } : s));
    setStreamingContent("");

    // Build context
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
        references, 
        topic.title, 
        methodology,
        (chunk) => setStreamingContent(chunk)
      );

      setSections(prev => prev.map((s, i) => i === index ? { ...s, content: content, status: 'completed' } : s));
    } catch (e) {
      console.error(e);
      // Allow retry manually
    }
  };

  const assembleFinalDocument = () => {
    if (!authorData) return;

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

    const end = `\n${bib}\n\\end{document}`;
    
    setFullLatex(preamble + body + end);
    setStep('final');
  };

  // --- RENDERERS ---

  if (step === 'metadata') {
    return <AuthorMetadataForm onSubmit={handleMetadataSubmit} isLoading={false} />;
  }

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
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Keywords</label>
                 <div className="flex flex-wrap gap-2">
                    {draftKeywords.map((k, i) => (
                       <span key={i} className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-700 border border-slate-200">
                         {k}
                       </span>
                    ))}
                 </div>
               </div>
               
               <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleApproveAbstract}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    Approve & Start Drafting <Play className="w-4 h-4" />
                  </button>
               </div>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (step === 'sections') {
    return (
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto h-[85vh]">
        {/* Sidebar Progress */}
        <div className="w-full lg:w-1/4 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
               Drafting Queue
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
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 text-center">
               Gemini 1.5 Pro | Extended Context
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
                     <button 
                       onClick={() => generateNextSection(currentSectionIdx)}
                       className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                     >
                        <RefreshCw className="w-4 h-4" /> Regenerate
                     </button>
                     <button 
                       onClick={() => generateNextSection(currentSectionIdx + 1)}
                       className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 flex items-center gap-2"
                     >
                        {currentSectionIdx === sections.length - 1 ? "Finalize Manuscript" : "Next Section"} <Play className="w-4 h-4" />
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

  // Final Step
  return <LatexPreview content={fullLatex} />;
};