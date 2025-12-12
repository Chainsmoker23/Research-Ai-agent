
import React, { useState } from 'react';
import { NoveltyAssessment } from '../types';
import { ShieldCheck, AlertTriangle, ArrowRight, FileText, BarChart3, RotateCcw, ArrowLeft } from 'lucide-react';
import { LemurMascot } from '../components/LemurMascot';

interface ValidationPageProps {
  onAnalyze: (title: string, overview: string) => void;
  isLoading: boolean;
  assessment: NoveltyAssessment | null;
  onProceed: () => void;
  onReset: () => void;
  onBack: () => void;
}

export const ValidationPage: React.FC<ValidationPageProps> = ({ 
  onAnalyze, isLoading, assessment, onProceed, onReset, onBack
}) => {
  const [title, setTitle] = useState('');
  const [overview, setOverview] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && overview) {
      onAnalyze(title, overview);
    }
  };

  if (isLoading) {
      // The parent component handles the specific "ResearchProgress" loading UI. 
      // This component just waits.
      return null; 
  }

  // RESULT VIEW
  if (assessment) {
     const isGood = assessment.score >= 70;
     
     return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
           {/* Back Button for Result View */}
           <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-4"
           >
             <ArrowLeft className="w-4 h-4" />
             <span className="font-medium text-sm">Back to Selection</span>
           </button>

           <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
               {/* Header */}
               <div className={`p-8 border-b ${isGood ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ${isGood ? 'bg-white text-green-600' : 'bg-white text-amber-600'}`}>
                             <span className="text-3xl font-black">{assessment.score}</span>
                          </div>
                          <div>
                             <h2 className="text-2xl font-bold text-slate-900">Novelty Score</h2>
                             <p className="text-slate-600 font-medium">Verdict: <span className={isGood ? 'text-green-700 font-bold' : 'text-amber-700 font-bold'}>{assessment.verdict} Novelty</span></p>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-xl backdrop-blur-sm border border-slate-200/50">
                         <BarChart3 className="w-5 h-5 text-indigo-600" />
                         <div className="text-sm">
                            <span className="block text-slate-500 text-xs font-bold uppercase">Acceptance Probability</span>
                            <span className="font-bold text-slate-900">{assessment.acceptanceProbability}</span>
                         </div>
                      </div>
                  </div>
               </div>

               {/* Content */}
               <div className="p-8 space-y-8">
                  {/* Analysis */}
                  <div className="space-y-2">
                     <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" /> AI Analysis
                     </h3>
                     <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {assessment.analysis}
                     </p>
                  </div>

                  {/* Conflicting Papers */}
                  {assessment.similarPapers.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Closest Existing Work
                        </h3>
                        <ul className="space-y-2">
                            {assessment.similarPapers.map((paper, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                   <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                                   {paper}
                                </li>
                            ))}
                        </ul>
                      </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                      <button 
                        onClick={onReset}
                        className="flex-1 py-3 px-6 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium flex items-center justify-center gap-2 transition-colors"
                      >
                         <RotateCcw className="w-4 h-4" /> Refine Idea
                      </button>
                      
                      <button 
                        onClick={onProceed}
                        className={`flex-1 py-3 px-6 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5
                           ${isGood ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-900 hover:bg-slate-800'}
                        `}
                      >
                         Proceed to Methodology <ArrowRight className="w-4 h-4" />
                      </button>
                  </div>
               </div>
           </div>
        </div>
     );
  }

  // INPUT FORM
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-fade-in px-4 py-8 relative">
        
        {/* Back Button */}
        <div className="w-full flex justify-start mb-4">
             <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors bg-white/50 px-3 py-1.5 rounded-lg hover:bg-white"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium text-sm">Back</span>
            </button>
        </div>

        <div className="text-center mb-10 space-y-4">
             <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 mb-4">
                 <ShieldCheck className="w-10 h-10 text-emerald-600" />
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Validate Your Research Idea</h1>
             <p className="text-slate-600 max-w-lg mx-auto">
                 The agent will scan 200M+ papers to ensure your topic hasn't been solved yet.
             </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
            {/* Mascot Decoration */}
            <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none">
                 <LemurMascot className="w-48 h-48" />
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Proposed Title</label>
                <input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Optimized Transformer Attention for Sparse Arrays"
                  className="w-full p-4 text-lg border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white text-slate-900 placeholder:text-slate-400"
                  required
                />
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Research Overview / Abstract</label>
                <textarea 
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Describe your hypothesis, expected contribution, and problem statement..."
                  className="w-full p-4 h-40 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none bg-white text-slate-900 placeholder:text-slate-400"
                  required
                />
            </div>

            <button 
              type="submit"
              disabled={!title || !overview}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
               Check Novelty <ArrowRight className="w-5 h-5" />
            </button>
        </form>
    </div>
  );
};
