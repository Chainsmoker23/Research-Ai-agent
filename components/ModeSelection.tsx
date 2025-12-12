
import React from 'react';
import { Telescope, SearchCheck, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface ModeSelectionProps {
  onSelectMode: (mode: 'discovery' | 'validation') => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
          How would you like to start?
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          ScholarAgent can help you find a new research gap or validate an existing hypothesis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Discovery Mode */}
        <button 
          onClick={() => onSelectMode('discovery')}
          className="relative group bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 text-left overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Telescope className="w-48 h-48 text-indigo-600" />
           </div>
           
           <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Discovery Mode</h2>
                 <p className="text-slate-600 leading-relaxed">
                   I need a research topic. I will provide a domain (e.g. "Deep Learning"), and you find the gaps.
                 </p>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Systematic Literature Review
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> Gap Identification
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div> 5 Novel Topic Proposals
                 </div>
              </div>

              <div className="pt-4 flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
                 Find a Topic <ArrowRight className="w-5 h-5 ml-2" />
              </div>
           </div>
        </button>

        {/* Validation Mode */}
        <button 
          onClick={() => onSelectMode('validation')}
          className="relative group bg-white rounded-3xl p-8 border border-slate-200 shadow-xl hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 text-left overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <SearchCheck className="w-48 h-48 text-emerald-600" />
           </div>
           
           <div className="relative z-10 space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              
              <div>
                 <h2 className="text-2xl font-bold text-slate-900 mb-2">Validation Mode</h2>
                 <p className="text-slate-600 leading-relaxed">
                   I have an idea. Validate its novelty, check for existing papers, and estimate acceptance probability.
                 </p>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Novelty Scoring
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Competitor Scan
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Acceptance Prediction
                 </div>
              </div>

              <div className="pt-4 flex items-center text-emerald-600 font-bold group-hover:translate-x-2 transition-transform">
                 Validate My Idea <ArrowRight className="w-5 h-5 ml-2" />
              </div>
           </div>
        </button>

      </div>
    </div>
  );
};
