
import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, ArrowRight, FileCode, Layers, Zap, Cpu, Sparkles, FileJson } from 'lucide-react';

export const LatexAutomation: React.FC = () => {
  const [activeLine, setActiveLine] = useState(0);

  // Simple typing simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLine(prev => (prev + 1) % 8);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden">
         
         {/* Ambient Crystal Background */}
         <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/30 rounded-full blur-[100px] animate-blob"></div>
             <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-emerald-100/40 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
             {/* Grid Overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
         </div>

         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
               
               {/* Left Content */}
               <div className="space-y-8 order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-sm text-indigo-600 text-xs font-bold uppercase tracking-wider animate-fade-in">
                     <Cpu className="w-3 h-3" /> Autonomous Compilation
                  </div>
                  
                  <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-[1.15]">
                     Zero Syntax Errors. <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Guaranteed.</span>
                  </h2>
                  
                  <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                     Forget missing brackets and "Bibliography undefined". Our engine writes syntactically perfect LaTeX, manages packages automatically, and delivers a pristine, Overleaf-ready PDF.
                  </p>
                  
                  <div className="space-y-4">
                     {[
                        { title: 'Auto-Package Resolution', desc: 'Detects required libraries for charts & math.', icon: <Zap className="w-4 h-4 text-amber-500" /> },
                        { title: 'BibTeX Integrity Check', desc: 'Validates every citation key before compiling.', icon: <FileJson className="w-4 h-4 text-emerald-500" /> },
                        { title: 'Float Optimization', desc: 'Places figures exactly where they belong.', icon: <Layers className="w-4 h-4 text-indigo-500" /> }
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/40 border border-white/60 shadow-sm hover:bg-white/60 hover:shadow-md transition-all group backdrop-blur-sm">
                           <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-white group-hover:scale-110 transition-transform">
                              {item.icon}
                           </div>
                           <div>
                               <h3 className="font-bold text-slate-900 text-sm mb-0.5">{item.title}</h3>
                               <p className="text-slate-500 text-xs font-medium">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right Visual: The "Crystal Compiler" */}
               <div className="relative perspective-1000 order-1 lg:order-2">
                  
                  {/* Floating Elements (Background) */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-2xl opacity-40 animate-pulse"></div>

                  {/* The Glass Terminal */}
                  <div className="relative bg-white/30 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.08)] overflow-hidden transform rotate-y-[-5deg] hover:rotate-y-0 transition-transform duration-700 ring-1 ring-white/50">
                     
                     {/* Window Controls */}
                     <div className="flex items-center gap-2 px-6 py-4 border-b border-white/30 bg-white/20">
                        <div className="flex gap-1.5">
                           <div className="w-3 h-3 rounded-full bg-red-400/80 border border-red-500/10"></div>
                           <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/10"></div>
                           <div className="w-3 h-3 rounded-full bg-green-400/80 border border-green-500/10"></div>
                        </div>
                        <div className="ml-auto text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider bg-white/30 px-2 py-1 rounded-md">
                           <Terminal className="w-3 h-3" /> compiler_v2.log
                        </div>
                     </div>

                     {/* Content Grid */}
                     <div className="grid grid-cols-2 h-[450px]">
                        
                        {/* Editor Side (Light Mode) */}
                        <div className="p-6 font-mono text-[11px] leading-loose text-slate-600 bg-white/20 relative overflow-hidden border-r border-white/30">
                           {/* Line Highlight - Soft Crystal Gradient */}
                           <div 
                              className="absolute left-0 w-full h-7 bg-gradient-to-r from-indigo-100/50 to-transparent border-l-2 border-indigo-400 transition-all duration-300"
                              style={{ top: `${24 + activeLine * 28}px` }}
                           ></div>

                           <div className="relative z-10 space-y-1">
                              <div className={activeLine === 0 ? "text-slate-900 font-bold" : ""}>
                                 <span className="text-purple-600 font-bold">\documentclass</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">article</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 1 ? "text-slate-900 font-bold" : ""}>
                                 <span className="text-purple-600 font-bold">\usepackage</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">neural-nets</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 2 ? "text-slate-900 font-bold" : ""}>
                                 <span className="text-purple-600 font-bold">\begin</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">document</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 3 ? "text-slate-900 font-bold" : ""}>
                                 <span className="text-purple-600 font-bold">\section</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">Methodology</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 4 ? "text-slate-900 font-bold" : ""}>
                                 We propose a <span className="text-indigo-600 font-bold">\textbf</span>&#123;novel&#125; arch...
                              </div>
                              <div className={activeLine === 5 ? "text-slate-900 font-bold" : ""}>
                                 <span className="text-purple-600 font-bold">\begin</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">equation</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                              <div className={activeLine === 6 ? "text-slate-900 font-bold" : ""}>
                                 <span className="text-slate-500 pl-4 font-serif italic">L = \sum_{`{i=1}^{N}`} (y_i - \hat{`{y}`}_i)^2</span>
                              </div>
                              <div className={activeLine === 7 ? "text-slate-900 font-bold" : ""}>
                                 <span className="text-purple-600 font-bold">\end</span>
                                 <span className="text-slate-400">&#123;</span>
                                 <span className="text-emerald-600">equation</span>
                                 <span className="text-slate-400">&#125;</span>
                              </div>
                           </div>
                           
                           {/* Cursor */}
                           <div className="mt-4 animate-pulse w-2 h-4 bg-indigo-500/50"></div>
                        </div>

                        {/* Preview Side */}
                        <div className="bg-white/40 relative flex flex-col items-center justify-center p-6 overflow-hidden">
                           <div className="absolute top-0 right-0 bg-indigo-50/80 backdrop-blur text-indigo-700 border-l border-b border-indigo-100 text-[9px] px-3 py-1.5 font-bold rounded-bl-xl shadow-sm">
                              PDF GENERATED
                           </div>
                           
                           {/* The Document Visual */}
                           <div className="w-full h-full bg-white shadow-lg border border-slate-100 flex flex-col gap-3 scale-95 origin-center transition-all duration-500 p-6 rounded-md">
                               <div className="h-4 w-3/4 bg-slate-800 rounded mx-auto mb-2 opacity-10"></div>
                               <div className="h-2 w-1/2 bg-slate-400 rounded mx-auto mb-6 opacity-20"></div>
                               
                               <div className="space-y-2">
                                  <div className="h-2 w-full bg-slate-300 rounded opacity-20"></div>
                                  <div className="h-2 w-full bg-slate-300 rounded opacity-20"></div>
                                  <div className="h-2 w-5/6 bg-slate-300 rounded opacity-20"></div>
                               </div>

                               <div className="my-4 p-4 border border-slate-100 rounded-lg bg-slate-50/50 flex items-center justify-center">
                                  {/* Simulated Math Formula */}
                                  <div className="text-slate-700 font-serif italic text-lg opacity-80">
                                     L = Σ (y - ŷ)²
                                  </div>
                               </div>

                               <div className="space-y-2">
                                  <div className="h-2 w-full bg-slate-300 rounded opacity-20"></div>
                                  <div className="h-2 w-full bg-slate-300 rounded opacity-20"></div>
                               </div>
                           </div>

                           {/* Success Overlay Animation - Glass Badge */}
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-xl flex items-center gap-4 transform transition-all duration-500 hover:scale-105 cursor-default animate-bounce-slow ring-1 ring-emerald-100">
                                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200">
                                     <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                                  </div>
                                  <div>
                                     <div className="font-bold text-slate-900 text-sm">Compilation Complete</div>
                                     <div className="text-[10px] text-slate-500 font-mono font-medium">Time: 0.42s • 0 Errors</div>
                                  </div>
                              </div>
                           </div>
                        </div>

                     </div>
                  </div>

                  {/* Floating Badges */}
                  <div className="absolute -right-6 top-10 bg-white/70 backdrop-blur-md border border-white p-3 rounded-2xl shadow-lg flex items-center gap-3 animate-float-y ring-1 ring-slate-100">
                     <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">TeX</div>
                     <div className="text-xs">
                        <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Class</div>
                        <div className="font-bold text-slate-900">IEEEtran</div>
                     </div>
                  </div>

                   <div className="absolute -left-6 bottom-20 bg-white/70 backdrop-blur-md border border-white p-3 rounded-2xl shadow-lg flex items-center gap-3 animate-float-delayed ring-1 ring-slate-100">
                     <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-md">
                        <Layers className="w-4 h-4 text-white" />
                     </div>
                     <div className="text-xs">
                        <div className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">References</div>
                        <div className="font-bold text-slate-900">Formatted</div>
                     </div>
                  </div>

               </div>

            </div>
         </div>
      </section>
  );
};
