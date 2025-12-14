
import React, { useState, useEffect } from 'react';
import { ShieldAlert, XCircle, AlertTriangle, ScanLine, Search, FileText, CheckCircle2 } from 'lucide-react';
import { LemurMascot } from '../LemurMascot';

export const ReviewerHud: React.FC = () => {
  const [scanPosition, setScanPosition] = useState(0);
  const [detectedIssues, setDetectedIssues] = useState<number[]>([]);

  // Scanning Animation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPosition((prev) => {
        const next = prev + 0.8; // Slightly slower for readability
        if (next > 100) return 0;
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Trigger detections when scan line crosses specific % relative to the paper height
  useEffect(() => {
    // Reset when looping
    if (scanPosition < 5) setDetectedIssues([]);
    
    // Abstract Issue (Passive Voice) ~ 25%
    if (scanPosition > 25 && !detectedIssues.includes(3)) setDetectedIssues(p => [...p, 3]);
    
    // Intro Issue (Logical Fallacy) ~ 45%
    if (scanPosition > 45 && !detectedIssues.includes(1)) setDetectedIssues(p => [...p, 1]);
    
    // Methodology Issue (Weak Baseline) ~ 75%
    if (scanPosition > 75 && !detectedIssues.includes(2)) setDetectedIssues(p => [...p, 2]);
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-indigo-100/30 via-purple-100/30 to-rose-100/30 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="grid lg:grid-cols-5 gap-8 relative z-10 items-center">
                
                {/* LEFT: The "Paper" View */}
                <div className="lg:col-span-3">
                    <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden min-h-[600px] group transform transition-transform hover:scale-[1.01]">
                        
                        {/* 1. Paper Header (Meta Data) */}
                        <div className="px-8 py-6 border-b border-slate-100 bg-white z-10 relative">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Draft ID: 8F-291A</div>
                                    <h3 className="text-lg font-serif font-bold text-slate-900 leading-tight">Optimizing Sparse Attention Mechanisms in Vision Transformers</h3>
                                    <p className="text-xs text-slate-500 font-serif italic">ScholarAgent v2.1, Department of Automated Research</p>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="w-12 h-16 border border-slate-200 bg-slate-50 shadow-sm rounded-sm"></div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Paper Body (The Text) */}
                        <div className="p-8 relative bg-white min-h-[500px]">
                            
                            {/* SCANNING LASER OVERLAY */}
                            <div 
                                className="absolute left-0 right-0 h-[2px] bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)] z-30 pointer-events-none transition-all duration-75 flex flex-col items-end"
                                style={{ top: `${scanPosition}%` }}
                            >
                                {/* Laser Label */}
                                <div className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded-l font-mono font-bold shadow-sm -mt-3">
                                    SCANNING...
                                </div>
                                {/* Trailing Grid Effect */}
                                <div className="w-full h-12 bg-gradient-to-t from-rose-500/10 to-transparent -mt-12" 
                                     style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(244, 63, 94, .1) 25%, rgba(244, 63, 94, .1) 26%, transparent 27%, transparent 74%, rgba(244, 63, 94, .1) 75%, rgba(244, 63, 94, .1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(244, 63, 94, .1) 25%, rgba(244, 63, 94, .1) 26%, transparent 27%, transparent 74%, rgba(244, 63, 94, .1) 75%, rgba(244, 63, 94, .1) 76%, transparent 77%, transparent)', backgroundSize: '20px 20px' }}>
                                </div>
                            </div>

                            {/* TEXT CONTENT (Two Columns) */}
                            <div className="grid grid-cols-2 gap-6 text-[10px] leading-relaxed text-slate-600 font-serif text-justify select-none">
                                
                                {/* Column 1 */}
                                <div className="space-y-4">
                                    {/* Abstract */}
                                    <div className="space-y-1">
                                        <span className="font-bold text-slate-900 uppercase text-[9px] tracking-widest">Abstract</span>
                                        <p>
                                            Vision Transformers (ViTs) have achieved state-of-the-art results in computer vision tasks. However, their quadratic complexity limits scalability. 
                                            <span className={`transition-colors duration-500 rounded px-0.5 ${detectedIssues.includes(3) ? 'bg-emerald-100 text-emerald-800 font-semibold decoration-emerald-500 decoration-wavy underline' : ''}`}>
                                                In this paper, SparseViT is introduced to solve this problem via token pruning.
                                            </span>
                                            {" "}We demonstrate significant FLOPs reduction while maintaining accuracy on ImageNet-1K benchmarks.
                                        </p>
                                        {detectedIssues.includes(3) && (
                                            <div className="absolute left-4 top-[140px] z-40 bg-emerald-600 text-white text-[9px] px-2 py-1 rounded shadow-lg animate-fade-in-up">
                                                Suggestion: Use Active Voice
                                            </div>
                                        )}
                                    </div>

                                    {/* Introduction */}
                                    <div className="space-y-1">
                                        <span className="font-bold text-slate-900 uppercase text-[9px] tracking-widest">1. Introduction</span>
                                        <p>
                                            The attention mechanism is the core component of Transformer architectures. Recent works have attempted to linearize this complexity.
                                            <span className={`relative transition-colors duration-500 rounded px-0.5 ${detectedIssues.includes(1) ? 'bg-rose-100 text-rose-800 font-semibold decoration-rose-500 decoration-wavy underline' : ''}`}>
                                                Our method doubles the inference speed, which clearly proves it is superior to all prior arts.
                                                {detectedIssues.includes(1) && (
                                                    <div className="absolute -right-4 -top-2 animate-bounce-slow z-40">
                                                        <XCircle className="w-4 h-4 text-rose-600 fill-white" />
                                                    </div>
                                                )}
                                            </span>
                                            {" "}However, relying solely on local windows restricts the receptive field. We propose a hybrid approach.
                                        </p>
                                    </div>
                                    
                                    <div className="h-16 bg-slate-50 border border-slate-100 rounded flex items-center justify-center">
                                        <span className="text-[9px] font-mono text-slate-400 italic">[Figure 1: Architecture Diagram]</span>
                                    </div>
                                </div>

                                {/* Column 2 */}
                                <div className="space-y-4">
                                    <p>
                                        Global context is preserved through a novel "hub-and-spoke" token mixing strategy. This allows information to flow across partitions without full quadratic attention matrix calculation.
                                    </p>

                                    {/* Methodology */}
                                    <div className="space-y-1">
                                        <span className="font-bold text-slate-900 uppercase text-[9px] tracking-widest">2. Methodology</span>
                                        <p>
                                            We evaluate our model on the standard ImageNet validation set.
                                            <span className={`relative transition-colors duration-500 rounded px-0.5 ${detectedIssues.includes(2) ? 'bg-amber-100 text-amber-800 font-semibold decoration-amber-500 decoration-wavy underline' : ''}`}>
                                                We compare performance primarily against ResNet-50 as the baseline.
                                                {detectedIssues.includes(2) && (
                                                    <div className="absolute -right-2 -top-3 animate-bounce-slow z-40" style={{ animationDelay: '0.1s' }}>
                                                        <AlertTriangle className="w-4 h-4 text-amber-500 fill-white" />
                                                    </div>
                                                )}
                                            </span>
                                            {" "}Training was conducted on 8x A100 GPUs for 300 epochs using AdamW optimizer. Data augmentation includes Mixup and CutMix.
                                        </p>
                                    </div>

                                    {/* Equation */}
                                    <div className="py-2 text-center text-slate-800 font-serif italic text-xs bg-slate-50/50 rounded">
                                        Attention(Q, K, V) = softmax(QK^T / √d)V
                                    </div>

                                    <p>
                                        Unlike standard pruning which permanently discards tokens, our method uses a "soft-masking" technique, allowing gradients to flow back to pruned tokens during the backward pass.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center text-xs font-mono z-20">
                            <div className="flex items-center gap-2 text-slate-700">
                                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                                <span className="font-bold">REVIEWER_BOT_V2.1</span> IS ANALYZING...
                            </div>
                            <div className="flex gap-4">
                                <span className={`font-bold transition-colors ${detectedIssues.includes(1) ? 'text-rose-600' : 'text-slate-300'}`}>ERR: {detectedIssues.includes(1) ? '1' : '0'}</span>
                                <span className={`font-bold transition-colors ${detectedIssues.includes(2) ? 'text-amber-500' : 'text-slate-300'}`}>WARN: {detectedIssues.includes(2) ? '1' : '0'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: The AI Analysis Feed (Floating Glass Cards) */}
                <div className="lg:col-span-2 relative h-full min-h-[400px]">
                    
                    {/* Floating Mascot Head */}
                    <div className="absolute -top-16 -right-8 z-20 hidden lg:block animate-float">
                        <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-2xl border border-white ring-4 ring-slate-50/50">
                            <LemurMascot className="w-20 h-20" variant="telescope" />
                        </div>
                    </div>

                    <div className="space-y-4 absolute inset-0 pt-8">
                        {/* Issue Card 3 - Suggestion (Appears First) */}
                        <div className={`transform transition-all duration-700 ease-out ${detectedIssues.includes(3) ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
                            <div className="bg-white/90 backdrop-blur-md border-l-4 border-emerald-500 p-5 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-transform border border-t-slate-100 border-r-slate-100 border-b-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <ScanLine className="w-3 h-3" /> Optimization
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">Abstract</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    "Rewrite passive voice. Suggestion: 'We introduce SparseViT' instead of 'SparseViT is introduced'."
                                </p>
                            </div>
                        </div>

                        {/* Issue Card 1 - Critical (Appears Second) */}
                        <div className={`transform transition-all duration-700 ease-out ${detectedIssues.includes(1) ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
                            <div className="bg-white/90 backdrop-blur-md border-l-4 border-rose-500 p-5 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-transform border border-t-slate-100 border-r-slate-100 border-b-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <XCircle className="w-3 h-3" /> Logical Fallacy
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">Ln 14</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    "The claim that 'performance doubles' lacks statistical significance (p > 0.05). Use specific metrics."
                                </p>
                            </div>
                        </div>

                        {/* Issue Card 2 - Warning (Appears Third) */}
                        <div className={`transform transition-all duration-700 ease-out ${detectedIssues.includes(2) ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
                            <div className="bg-white/90 backdrop-blur-md border-l-4 border-amber-500 p-5 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:scale-[1.02] transition-transform border border-t-slate-100 border-r-slate-100 border-b-slate-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                                        <AlertTriangle className="w-3 h-3" /> Weak Baseline
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-400">Ln 42</span>
                                </div>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    "Comparing against ResNet-50 is outdated. Recommend comparing with ViT-L or ConvNeXt."
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
