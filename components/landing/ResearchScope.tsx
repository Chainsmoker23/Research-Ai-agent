
import React from 'react';
import { CheckCircle2, FlaskConical, Binary } from 'lucide-react';

export const ResearchScope: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50">
         <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-3xl p-8 sm:p-16 flex flex-col md:flex-row gap-8 sm:gap-12 items-center relative overflow-hidden shadow-xl border border-slate-100">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[60px]"></div>
               
               <div className="flex-1 relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Scientific Integrity Protocol</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                     ScholarAgent is restricted to <span className="text-indigo-600 font-bold">Theoretical</span> and <span className="text-indigo-600 font-bold">Simulation-based</span> research. We do not fabricate wet-lab data.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 font-bold">
                     <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><CheckCircle2 className="w-4 h-4 text-green-500" /> Math</span>
                     <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><CheckCircle2 className="w-4 h-4 text-green-500" /> CS</span>
                     <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><CheckCircle2 className="w-4 h-4 text-green-500" /> Social Sci</span>
                  </div>
               </div>
               
               <div className="flex-1 w-full relative z-10">
                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                       <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
                           <FlaskConical className="w-5 h-5 text-slate-400" />
                           <span className="text-slate-500 text-sm font-medium">Physical Experiments</span>
                           <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded font-bold">UNSUPPORTED</span>
                       </div>
                       <div className="flex items-center gap-3">
                           <Binary className="w-5 h-5 text-indigo-600" />
                           <span className="text-slate-900 text-sm font-bold">Computational / Review</span>
                           <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200 font-bold">OPTIMIZED</span>
                       </div>
                   </div>
               </div>
            </div>
         </div>
      </section>
  );
};
