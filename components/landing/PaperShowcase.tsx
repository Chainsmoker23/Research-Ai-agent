
import React, { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

const SHOWCASE_PAPERS = [
    {
        id: 1,
        title: "Attention is Not All You Need: Sparse Activations in Vision Transformers",
        author: "ScholarAgent v2.1",
        journal: "Submitted to CVPR 2025",
        field: "Computer Vision",
        abstract: "While Vision Transformers (ViTs) have achieved state-of-the-art results, their quadratic complexity limits scalability. This paper proposes 'SparseViT', a novel architecture introducing a dynamic token pruning mechanism based on attention scores. We demonstrate a 40% reduction in FLOPs with negligible accuracy loss on ImageNet-1K. Our theoretical analysis proves that high-frequency components in early layers are redundant.",
        citations: 0,
        latexClass: "IEEEtran",
        color: "indigo"
    },
    {
        id: 2,
        title: "Thermodynamic Stability of Lead-Free Perovskites: A DFT Study",
        author: "ScholarAgent v2.1",
        journal: "Journal of Materials Chemistry A",
        field: "Materials Science",
        abstract: "Toxicity remains a barrier for commercializing perovskite solar cells. We conduct a systematic Density Functional Theory (DFT) investigation into Sn-based perovskites doped with Ge. Our simulation results indicate that Ge-doping increases the activation energy for degradation by 0.4 eV, suggesting significantly enhanced thermal stability. We propose a new lattice structure that minimizes strain.",
        citations: 0,
        latexClass: "revtex4-2",
        color: "emerald"
    },
    {
        id: 3,
        title: "Algorithmic Bias in Large Language Model Hiring Pipelines",
        author: "ScholarAgent v2.1",
        journal: "ACM CHI 2025",
        field: "Social Computing",
        abstract: "Automated hiring systems are increasingly powered by LLMs. Through a mixed-methods audit of three open-source hiring agents, we reveal a statistically significant preference for candidates with Western-sounding names (p < 0.001) despite identical qualifications. We frame this within Value Sensitive Design (VSD) and propose a 'Blind-Token' intervention framework.",
        citations: 0,
        latexClass: "acmart",
        color: "amber"
    }
];

export const PaperShowcase: React.FC = () => {
  const [activePaperIndex, setActivePaperIndex] = useState(0);

  return (
    <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                   <span className="text-amber-600 font-bold text-sm tracking-widest uppercase mb-2 block">Output Showcase</span>
                   <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Research We've Generated</h2>
                </div>
                <div className="flex gap-2">
                   <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Computer Science</span>
                   <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Materials</span>
                   <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Social Sci</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* List Column */}
                <div className="lg:w-1/3 space-y-4">
                    {SHOWCASE_PAPERS.map((paper, idx) => (
                        <button 
                            key={paper.id}
                            onClick={() => setActivePaperIndex(idx)}
                            className={`w-full text-left p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group
                                ${activePaperIndex === idx 
                                    ? 'bg-white border-indigo-600 shadow-lg scale-[1.02] z-10' 
                                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 opacity-80 hover:opacity-100'}
                            `}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${activePaperIndex === idx ? `bg-${paper.color}-500` : 'bg-transparent'}`}></div>
                            <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">{paper.field}</div>
                            <h3 className={`font-bold text-sm sm:text-base mb-2 ${activePaperIndex === idx ? 'text-slate-900' : 'text-slate-700'}`}>
                                {paper.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <FileText className="w-3 h-3" />
                                {paper.latexClass}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Preview Column */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden h-full flex flex-col min-h-[500px]">
                        {/* Fake Browser Header */}
                        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400/80 border border-red-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400/80 border border-green-500/20"></div>
                            </div>
                            <div className="flex-1 bg-white h-8 rounded border border-slate-200 flex items-center px-3 text-xs text-slate-500 shadow-inner">
                                <ExternalLink className="w-3 h-3 mr-2 opacity-50" />
                                <span className="opacity-70">scholaragent.ai/preview/{SHOWCASE_PAPERS[activePaperIndex].id}/pdf</span>
                            </div>
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Download className="w-4 h-4" /></button>
                        </div>

                        {/* PDF Preview Area */}
                        <div className="flex-1 p-8 sm:p-12 bg-white relative">
                             <div className="max-w-2xl mx-auto animate-fade-in key={activePaperIndex}">
                                 {/* Paper Header */}
                                 <div className="text-center mb-8 border-b border-slate-100 pb-8">
                                     <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight text-balance">
                                         {SHOWCASE_PAPERS[activePaperIndex].title}
                                     </h1>
                                     <div className="text-sm text-slate-600 font-serif italic mb-2">
                                         {SHOWCASE_PAPERS[activePaperIndex].author}, Department of Automated Science
                                     </div>
                                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                         {SHOWCASE_PAPERS[activePaperIndex].journal}
                                     </div>
                                 </div>

                                 {/* Abstract */}
                                 <div className="mb-8">
                                     <div className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 text-center">Abstract</div>
                                     <p className="text-sm sm:text-base font-serif text-slate-700 leading-relaxed text-justify">
                                         <span className="font-bold text-slate-900 mr-1">{SHOWCASE_PAPERS[activePaperIndex].abstract.split(' ')[0]}</span>
                                         {SHOWCASE_PAPERS[activePaperIndex].abstract.substring(SHOWCASE_PAPERS[activePaperIndex].abstract.indexOf(' ') + 1)}
                                     </p>
                                 </div>

                                 {/* Fake Columns */}
                                 <div className="grid grid-cols-2 gap-6 opacity-30 select-none pointer-events-none">
                                     <div className="space-y-4">
                                         <div className="h-4 bg-slate-800 w-3/4 mb-2"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-5/6"></div>
                                         <div className="h-24 bg-slate-200 w-full mt-4 rounded"></div>
                                     </div>
                                      <div className="space-y-4">
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-4/6"></div>
                                          <div className="h-4 bg-slate-800 w-1/2 mt-6 mb-2"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                     </div>
                                 </div>
                                 
                                 {/* Watermark */}
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <div className="text-slate-100 font-bold text-6xl -rotate-45 uppercase border-4 border-slate-100 p-8 rounded-xl opacity-50 select-none">
                                         Scholar Agent
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
  );
};
