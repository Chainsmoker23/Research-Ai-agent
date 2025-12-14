
import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, ArrowRight, FileCode, Layers, Zap, Cpu, Sparkles, FileJson, Code2 } from 'lucide-react';

export const LatexAutomation: React.FC = () => {
  const [activeLine, setActiveLine] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationSuccess, setCompilationSuccess] = useState(false);

  // Simple typing simulation loop with compilation trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine(prev => {
        if (prev === 7) {
            // Trigger compilation simulation at end of loop
            setIsCompiling(true);
            setCompilationSuccess(false);
            setTimeout(() => {
                setIsCompiling(false);
                setCompilationSuccess(true);
            }, 600); // Compile takes 600ms
            return 0;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
         
         {/* Ambient Crystal Background */}
         <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-[10%] left-[-10%] w-[70%] h-[70%] bg-indigo-200/20 rounded-full blur-[120px] animate-blob"></div>
             <div className="absolute bottom-[10%] right-[-5%] w-[60%] h-[60%] bg-purple-100/30 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
             <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-emerald-100/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
             
             {/* Subtle Moving Grid */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]"></div>
         </div>

         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
               
               {/* Left Content */}
               <div className="space-y-8 order-2 lg:order-1 relative">
                  {/* Decorative glowing line */}
                  <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-indigo-200 to-transparent hidden lg:block"></div>

                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 shadow-sm text-indigo-600 text-xs font-bold uppercase tracking-wider animate-fade-in hover:shadow-md transition-shadow cursor-default">
                     <Cpu className="w-3 h-3 animate-pulse" /> Autonomous Compilation
                  </div>
                  
                  <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.1]">
                     Zero Syntax Errors. <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
                        Guaranteed.
                     </span>
                  </h2>
                  
                  <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                     Forget missing brackets and "Bibliography undefined". Our engine writes syntactically perfect LaTeX, manages packages automatically, and delivers a pristine, Overleaf-ready PDF.
                  </p>
                  
                  <div className="space-y-4">
                     {[
                        { title: 'Auto-Package Resolution', desc: 'Detects required libraries for charts & math.', icon: <Zap className="w-5 h-5 text-amber-500 fill-amber-50" /> },
                        { title: 'BibTeX Integrity Check', desc: 'Validates every citation key before compiling.', icon: <FileJson className="w-5 h-5 text-emerald-500 fill-emerald-50" /> },
                        { title: 'Float Optimization', desc: 'Places figures exactly where they belong.', icon: <Layers className="w-5 h-5 text-indigo-500 fill-indigo-50" /> }
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-5 p-5 rounded-2xl bg-white/60 border border-white shadow-sm hover:bg-white/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group backdrop-blur-md cursor-default">
                           <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:border-indigo-100 group-hover:bg-indigo-50/50 transition-colors">
                              {item.icon}
                           </div>
                           <div>
                               <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
                               <p className="text-slate-500 text-sm font-medium leading-snug">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right Visual: The "Crystal Compiler" */}
               <div className="relative perspective-1000 order-1 lg:order-2">
                  
                  {/* Back Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 rounded-full blur-[80px]"></div>

                  {/* 3D Floating Container */}
                  <div className="relative transform rotate-y-[-6deg] rotate-x-[4deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out preserve-3d">
                     
                     {/* The Editor Glass Panel */}
                     <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-xl rounded-3xl border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] z-10 translate-z-0 overflow-hidden ring-1 ring-white">
                        
                        {/* Editor Header */}
                        <div className="h-12 border-b border-slate-200/50 flex items-center px-6 justify-between bg-white/50">
                           <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-slate-300/80"></div>
                              <div className="w-3 h-3 rounded-full bg-slate-300/80"></div>
                           </div>
                           <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Code2 className="w-3 h-3" /> Source.tex
                           </div>
                        </div>

                        {/* Editor Body */}
                        <div className="p-6 font-mono text-[11px] leading-loose text-slate-500 relative h-[420px]">
                           {/* Active Line Highlighter */}
                           <div 
                              className="absolute left-0 w-full h-7 bg-gradient-to-r from-indigo-100/80 to-transparent border-l-4 border-indigo-500 transition-all duration-300 ease-out flex items-center"
                              style={{ top: `${24 + activeLine * 28}px` }}
                           >
                              {/* Sparkle following the cursor */}
                              <Sparkles className="w-3 h-3 text-indigo-500 ml-2 animate-spin-slow absolute right-12 opacity-50" />
                           </div>

                           <div className="relative z-10 space-y-1">
                              <div className={activeLine === 0 ? "text-slate-900 font-bold transition-colors" : ""}>
                                 <span className="text-purple-600 font-bold">\documentclass</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">article</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 1 ? "text-slate-900 font-bold transition-colors" : ""}>
                                 <span className="text-purple-600 font-bold">\usepackage</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">neural-nets</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 2 ? "text-slate-900 font-bold transition-colors" : ""}>
                                 <span className="text-purple-600 font-bold">\begin</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">document</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 3 ? "text-slate-900 font-bold transition-colors" : ""}>
                                 <span className="text-purple-600 font-bold">\section</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">Methodology</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 4 ? "text-slate-900 font-bold transition-colors" : ""}>
                                 We propose a <span className="text-indigo-600 font-bold">\textbf</span>&#123;novel&#125; arch...
                              </div>
                              <div className={activeLine === 5 ? "text-slate-900 font-bold transition-colors" : ""}>
                                 <span className="text-purple-600 font-bold">\begin</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">equation</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 6 ? "text-slate-900 font-bold transition-colors" : ""}>
                                 <span className="text-slate-500 pl-4 font-serif italic">L = \sum_{`{i=1}^{N}`} (y_i - \hat{`{y}`}_i)^2</span>
                              </div>
                              <div className={activeLine === 7 ? "text-slate-900 font-bold transition-colors" : ""}>
                                 <span className="text-purple-600 font-bold">\end</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">equation</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* The Preview Glass Panel (Floating in front) */}
                     <div className="relative z-20 ml-24 mt-20 bg-white/80 backdrop-blur-2xl rounded-2xl border border-white/80 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] h-[380px] w-[320px] transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ring-1 ring-white/60 flex flex-col overflow-hidden">
                        
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent skew-x-12 translate-x-[-150%] animate-[shimmer_3s_infinite]"></div>

                        {/* Top Bar */}
                        <div className="bg-slate-50 border-b border-slate-100 p-3 flex justify-between items-center">
                           <div className="text-[9px] font-bold text-slate-400 uppercase">output.pdf</div>
                           {isCompiling ? (
                               <div className="flex items-center gap-1 text-[9px] text-indigo-600 font-bold uppercase animate-pulse">
                                   Compiling <span className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce"></span>
                               </div>
                           ) : (
                               <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.6)]"></div>
                           )}
                        </div>

                        {/* Document Content - Actual Text Simulation */}
                        <div className="p-6 flex-1 flex flex-col gap-2 opacity-90 font-serif text-slate-800">
                           {/* Paper Title */}
                           <div className="text-center pb-2 border-b border-slate-100 mb-2">
                               <h4 className="text-[10px] font-bold leading-tight mb-1 text-slate-900">
                                   Autonomous Generation of Scientific Literature
                               </h4>
                               <div className="text-[7px] italic text-slate-500">
                                   ScholarAgent AI et al., Department of Automated Research
                               </div>
                           </div>

                           {/* Abstract */}
                           <div className="text-justify mb-2">
                                <span className="text-[7px] font-bold uppercase mr-1">Abstract.</span>
                                <span className="text-[7px] leading-[1.4] text-slate-600">
                                    This paper introduces a multi-agent framework for automated research. By leveraging large language models, we achieve zero-shot synthesis of high-fidelity LaTeX manuscripts. Our method reduces drafting time by 94% while maintaining academic rigor.
                                </span>
                           </div>

                           {/* Introduction Header */}
                           <div className="text-[8px] font-bold uppercase text-slate-700 mt-1">1. Introduction</div>
                           
                           {/* Paragraph */}
                           <p className="text-[7px] leading-[1.4] text-justify text-slate-600">
                               The automation of scientific discovery has long been a goal of artificial intelligence. We propose a novel architecture that combines retrieval-augmented generation with formal verification.
                           </p>

                           {/* Equation Box */}
                           <div className="my-1.5 p-2 border border-slate-100 rounded-lg bg-slate-50/50 flex items-center justify-center">
                              <div className="text-slate-800 font-serif italic text-xs">
                                 L = Σ (y - ŷ)² + λ||w||²
                              </div>
                           </div>

                           {/* Paragraph 2 */}
                           <p className="text-[7px] leading-[1.4] text-justify text-slate-600">
                               We evaluate our system on a dataset of 5,000 generated papers. Results indicate a significant improvement in citation accuracy and structural coherence compared to baseline models.
                           </p>
                        </div>

                        {/* Compilation Success Flash */}
                        {compilationSuccess && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] animate-[ping_0.5s_ease-out_reverse]">
                                <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 scale-110">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="font-bold text-xs uppercase tracking-wide">Success</span>
                                </div>
                            </div>
                        )}
                     </div>

                  </div>

                  {/* Orbiting Badges */}
                  <div className="absolute -right-2 top-20 bg-white/90 backdrop-blur-md border border-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float-y z-30 ring-1 ring-slate-100/50">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">TeX</div>
                     <div className="text-xs">
                        <div className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">Class</div>
                        <div className="font-bold text-slate-800">IEEEtran</div>
                     </div>
                  </div>

                   <div className="absolute -left-2 bottom-12 bg-white/90 backdrop-blur-md border border-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed z-30 ring-1 ring-slate-100/50">
                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                        <Layers className="w-4 h-4 text-white" />
                     </div>
                     <div className="text-xs">
                        <div className="text-slate-400 font-bold uppercase tracking-wider text-[8px]">References</div>
                        <div className="font-bold text-slate-800">Formatted</div>
                     </div>
                  </div>

               </div>

            </div>
         </div>
      </section>
  );
};
