
import React from 'react';
import { Radar, Sparkles } from 'lucide-react';
import { LemurMascot } from '../LemurMascot';

export const NoveltyRadar: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
               
               {/* Radar Visual - Crystal Glass Theme */}
               <div className="order-2 lg:order-1 relative flex justify-center py-8 lg:py-0">
                  
                  {/* Outer Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[80px]"></div>

                  {/* Main Crystal Orb */}
                  <div className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full flex items-center justify-center bg-gradient-to-br from-white/60 via-slate-50/40 to-indigo-50/30 backdrop-blur-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/80 ring-1 ring-white/50 overflow-hidden group">
                     
                     {/* Internal Light Grid */}
                     <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(99,102,241,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]"></div>
                     
                     {/* Glass Rings */}
                     <div className="absolute inset-[15%] border border-indigo-100/60 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"></div>
                     <div className="absolute inset-[30%] border border-indigo-100/50 rounded-full"></div>
                     <div className="absolute inset-[45%] border border-indigo-50/40 rounded-full"></div>
                     
                     {/* Scanning Beam (Light) */}
                     <div className="absolute inset-0 rounded-full animate-scan-radar z-10">
                        <div className="w-full h-full bg-[conic-gradient(transparent_270deg,rgba(99,102,241,0.15)_360deg)] rounded-full blur-xl"></div>
                     </div>
                     <div className="absolute inset-0 rounded-full animate-scan-radar z-10">
                        <div className="absolute top-0 left-1/2 w-[1px] h-1/2 bg-gradient-to-b from-indigo-300/50 to-transparent shadow-[0_0_15px_#818cf8]"></div>
                     </div>

                     {/* Center Mascot - In a pure white bubble */}
                     <div className="relative z-20 bg-white/40 backdrop-blur-md p-6 rounded-full border border-white shadow-xl ring-4 ring-white/30">
                        <LemurMascot className="w-24 h-24 sm:w-32 sm:h-32 drop-shadow-xl" variant="telescope" />
                        {/* Specular Highlight */}
                        <div className="absolute top-4 left-6 w-8 h-4 bg-white/60 rounded-full transform -rotate-45 blur-[2px]"></div>
                     </div>

                     {/* Detected Signals (Blips) */}
                     <div className="absolute top-[28%] right-[28%] w-3 h-3 bg-rose-400 rounded-full animate-ping z-20"></div>
                     <div className="absolute top-[28%] right-[28%] w-3 h-3 bg-rose-500 rounded-full z-20 border-2 border-white shadow-sm"></div>
                     
                     <div className="absolute bottom-[32%] left-[22%] w-3 h-3 bg-emerald-400 rounded-full animate-ping animation-delay-2000 z-20"></div>
                     <div className="absolute bottom-[32%] left-[22%] w-3 h-3 bg-emerald-500 rounded-full z-20 border-2 border-white shadow-sm"></div>

                     {/* Score HUD - Floating Frosted Card */}
                     <div className="absolute bottom-10 right-10 sm:bottom-16 sm:right-16 z-30">
                        <div className="backdrop-blur-xl bg-white/70 border border-white p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex flex-col items-center animate-float ring-1 ring-slate-100">
                            <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                               <Sparkles className="w-3 h-3" /> Novelty
                            </span>
                            <div className="text-4xl sm:text-5xl font-mono font-bold text-slate-800 drop-shadow-sm">94%</div>
                            <div className="w-full h-1.5 bg-slate-200/50 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 w-[94%] shadow-[0_0_10px_rgba(99,102,241,0.2)]"></div>
                            </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Right Content */}
               <div className="order-1 lg:order-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-6 sm:mb-8">
                     <Radar className="w-4 h-4" /> GAP_ANALYSIS_ENGINE
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 text-balance">
                     Novelty Verification. <br/>
                     <span className="text-slate-400">Stop Reinventing.</span>
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed text-balance">
                     73% of papers are rejected for lack of novelty. Our engine scans 200M+ papers in real-time to ensure your research gap is genuine before you write a single word.
                  </p>
                  <ul className="space-y-4">
                     {["Semantic Collision Detection", "Saturation Heatmaps", "White-Space Identification"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                           <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-sm"></div>
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>

            </div>
         </div>
      </section>
  );
};
