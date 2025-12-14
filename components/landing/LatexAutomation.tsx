
import React from 'react';
import { Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

export const LatexAutomation: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 bg-white border-y border-slate-100 relative overflow-hidden">
         <div className="absolute inset-0 grid-bg opacity-30"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
               
               {/* Left Content */}
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8">
                     <Terminal className="w-4 h-4" /> LATEX_COMPILER_V2
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 text-balance">
                     Zero Syntax Errors. <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Guaranteed.</span>
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed text-balance">
                     Forget missing brackets and broken BibTeX. Our engine generates perfectly valid LaTeX code, compiles it in the cloud, and delivers a pristine PDF.
                  </p>
                  
                  <div className="space-y-4">
                     {['Automatic Package Management', 'BibTeX Formatting & Citation Keys', 'Float Placement Optimization'].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                           <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 group-hover:border-green-300 transition-colors">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                           </div>
                           <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right Visual: Code vs PDF */}
               <div className="relative group perspective-1000 hidden sm:block">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden h-[400px] flex">
                     
                     {/* Code Side (Dark Mode for Code) */}
                     <div className="w-1/2 p-6 border-r border-slate-700 font-mono text-[10px] text-slate-400 leading-relaxed overflow-hidden bg-[#0d1117] relative">
                        {/* Line Numbers */}
                        <div className="absolute left-2 top-6 text-slate-700 select-none text-right w-4 space-y-0.5">
                           <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div><div>7</div><div>8</div><div>9</div><div>10</div>
                        </div>
                        <div className="pl-6">
                            <div className="text-slate-500 mb-2 font-bold opacity-50">// main.tex</div>
                            <p><span className="text-purple-400">\documentclass</span><span className="text-yellow-200">&#123;article&#125;</span></p>
                            <p><span className="text-purple-400">\usepackage</span><span className="text-yellow-200">&#123;amsmath&#125;</span></p>
                            <p><span className="text-purple-400">\title</span><span className="text-yellow-200">&#123;Generative Science&#125;</span></p>
                            <p className="opacity-50 my-1">...</p>
                            <p><span className="text-purple-400">\begin</span><span className="text-yellow-200">&#123;document&#125;</span></p>
                            <p><span className="text-purple-400">\section</span><span className="text-yellow-200">&#123;Introduction&#125;</span></p>
                            <p><span className="text-blue-300">Recent advances in large language models...</span></p>
                            <p><span className="text-purple-400">\end</span><span className="text-yellow-200">&#123;document&#125;</span></p>
                        </div>
                     </div>

                     {/* PDF Side (Light Mode for PDF) */}
                     <div className="w-1/2 bg-white p-6 relative">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] px-2 py-1 font-bold rounded-bl">PDF PREVIEW</div>
                        <div className="space-y-4 opacity-80 scale-90 origin-top">
                           <div className="h-4 w-3/4 bg-slate-800 rounded mx-auto mb-6"></div>
                           <div className="h-2 w-full bg-slate-200 rounded"></div>
                           <div className="h-2 w-full bg-slate-200 rounded"></div>
                           <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                           <div className="grid grid-cols-2 gap-4 mt-6">
                              <div className="h-20 bg-slate-100 rounded border border-slate-200"></div>
                              <div className="space-y-2">
                                 <div className="h-2 w-full bg-slate-200 rounded"></div>
                                 <div className="h-2 w-full bg-slate-200 rounded"></div>
                              </div>
                           </div>
                        </div>
                        
                        {/* "Processing" Overlay */}
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in-up">
                              <CheckCircle2 className="w-4 h-4 text-green-400" /> Compiled Successfully
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
                
               {/* Mobile fallback for Code vs PDF */}
               <div className="block sm:hidden relative bg-slate-900 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                        <span className="text-indigo-400 text-xs font-mono">// Source</span>
                        <ArrowRight className="text-slate-500 w-4 h-4" />
                        <span className="text-white text-xs font-bold">PDF</span>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                        <div className="h-2 w-full bg-slate-700 rounded"></div>
                        <div className="h-20 bg-white/10 rounded border border-slate-700 mt-2 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
               </div>

            </div>
         </div>
      </section>
  );
};
