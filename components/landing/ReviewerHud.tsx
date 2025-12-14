
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Search, XCircle, AlertTriangle, Eye, ScanLine } from 'lucide-react';
import { LemurMascot } from '../LemurMascot';

export const ReviewerHud: React.FC = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [detectedIssues, setDetectedIssues] = useState<number[]>([]);

  // Scanning Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => {
        const next = prev + 1;
        if (next > 100) return 0;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Trigger detections when scan line crosses specific %
  useEffect(() => {
    if (scanPosition > 20 && !detectedIssues.includes(1)) setDetectedIssues(p => [...p, 1]);
    if (scanPosition > 50 && !detectedIssues.includes(2)) setDetectedIssues(p => [...p, 2]);
    if (scanPosition > 80 && !detectedIssues.includes(3)) setDetectedIssues(p => [...p, 3]);
    if (scanPosition === 0) setDetectedIssues([]); // Reset on loop
  }, [scanPosition, detectedIssues]);

  return (
    <section className="py-24 sm:py-32 bg-slate-50 border-y border-slate-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-6">
                <ShieldAlert className="w-4 h-4" /> ADVERSARIAL_SIMULATION_V3
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                Survive "Reviewer #2"
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Our AI pre-reviews your manuscript with ruthless scrutiny, identifying logical fallacies, weak baselines, and vague claims before a human ever sees them.
            </p>
        </div>

        <div className="relative">
            {/* Background decorative blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-indigo-100/50 via-purple-100/50 to-rose-100/50 blur-3xl rounded-full opacity-60 pointer-events-none"></div>

            <div className="grid lg:grid-cols-5 gap-8 relative z-10 items-center">
                
                {/* LEFT: The "Paper" View */}
                <div className="lg:col-span-3">
                    <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden min-h-[500px] group">
                        
                        {/* Paper Header */}
                        <div className="px-8 py-8 border-b border-slate-100 bg-slate-50/50">
                            <div className="h-6 w-3/4 bg-slate-200 rounded mb-4"></div>
                            <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                        </div>

                        {/* Paper Body */}
                        <div className="p-8 space-y-6 relative">
                            {/* Scanning Laser Line */}
                            <div 
                                className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] z-20 pointer-events-none transition-all duration-75"
                                style={{ top: `${scanPosition}%` }}
                            >
                                <div className="absolute right-0 -top-3 bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-l font-mono font-bold">
                                    SCANNING
                                </div>
                            </div>

                            {/* Paragraph 1 with Issue */}
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                <div className="h-2 w-11/12 bg-slate-100 rounded"></div>
                                <div className={`relative transition-all duration-500 p-1 -m-1 rounded ${detectedIssues.includes(1) ? 'bg-rose-50 ring-1 ring-rose-200' : ''}`}>
                                    <div className="h-2 w-full bg-slate-100 rounded"></div>
                                    {detectedIssues.includes(1) && (
                                        <div className="absolute -right-6 top-0 animate-bounce-slow">
                                            <div className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                                                <XCircle className="w-3 h-3" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="h-2 w-3/4 bg-slate-100 rounded"></div>
                            </div>

                            {/* Paragraph 2 with Issue */}
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                <div className={`relative transition-all duration-500 p-1 -m-1 rounded ${detectedIssues.includes(2) ? 'bg-amber-50 ring-1 ring-amber-200' : ''}`}>
                                    <div className="h-2 w-10/12 bg-slate-100 rounded"></div>
                                    {detectedIssues.includes(2) && (
                                        <div className="absolute -right-6 top-0 animate-bounce-slow" style={{ animationDelay: '0.2s' }}>
                                            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                                                <AlertTriangle className="w-3 h-3" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                            </div>

                             {/* Paragraph 3 */}
                             <div className="space-y-2 opacity-50">
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                <div className="h-2 w-full bg-slate-100 rounded"></div>
                                <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-slate-900 text-white px-6 py-3 flex justify-between items-center text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                                ANALYZING MANUSCRIPT...
                            </div>
                            <div>
                                {Math.round(scanPosition)}% COMPLETE
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: The AI Analysis Feed (Floating Glass Cards) */}
                <div className="lg:col-span-2 relative h-full min-h-[400px]">
                    
                    {/* Floating Mascot Head */}
                    <div className="absolute -top-12 -right-4 z-20 hidden lg:block animate-float">
                        <div className="bg-white p-2 rounded-full shadow-xl border border-slate-100">
                            <LemurMascot className="w-20 h-20" variant="telescope" />
                        </div>
                    </div>

                    <div className="space-y-4 absolute inset-0 pt-8">
                        {/* Issue Card 1 */}
                        <div className={`transform transition-all duration-500 ${detectedIssues.includes(1) ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="bg-white/80 backdrop-blur-md border-l-4 border-rose-500 p-4 rounded-r-xl shadow-lg hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                                        <XCircle className="w-3 h-3" /> Logical Fallacy
                                    </span>
                                    <span className="text-[10px] text-slate-400">Section 2.1</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    "The claim that 'performance doubles' lacks statistical significance (p > 0.05). Use specific metrics."
                                </p>
                            </div>
                        </div>

                        {/* Issue Card 2 */}
                        <div className={`transform transition-all duration-500 delay-100 ${detectedIssues.includes(2) ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="bg-white/80 backdrop-blur-md border-l-4 border-amber-500 p-4 rounded-r-xl shadow-lg hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Weak Baseline
                                    </span>
                                    <span className="text-[10px] text-slate-400">Section 4.3</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    "Comparing against ResNet-50 is outdated. Recommend comparing with ViT-L or ConvNeXt."
                                </p>
                            </div>
                        </div>

                        {/* Issue Card 3 - Suggestion */}
                        <div className={`transform transition-all duration-500 delay-200 ${detectedIssues.includes(3) ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                            <div className="bg-white/80 backdrop-blur-md border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-lg hover:scale-105 transition-transform">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                                        <ScanLine className="w-3 h-3" /> Optimization
                                    </span>
                                    <span className="text-[10px] text-slate-400">Abstract</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    "Rewrite passive voice. Suggestion: 'We introduce SparseViT' instead of 'SparseViT is introduced'."
                                </p>
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
