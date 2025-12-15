
import React, { useState, useEffect } from 'react';
import { ScanLine, AlertCircle, CheckCircle2, ArrowRight, BrainCircuit } from 'lucide-react';

interface CritiqueVisualizerProps {
  originalText: string;
  improvedText: string;
  issues: string[];
  onComplete: () => void;
}

export const CritiqueVisualizer: React.FC<CritiqueVisualizerProps> = ({ 
  originalText, 
  improvedText, 
  issues, 
  onComplete 
}) => {
  const [stage, setStage] = useState<'scan' | 'detect' | 'fix' | 'done'>('scan');
  const [scanTop, setScanTop] = useState(0);
  const [activeIssue, setActiveIssue] = useState<string | null>(null);

  useEffect(() => {
    // 1. Scan Phase (1.5s)
    const scanDuration = 1500;
    const interval = 20;
    const step = 100 / (scanDuration / interval);
    
    let currentTop = 0;
    const scanTimer = setInterval(() => {
        currentTop += step;
        setScanTop(Math.min(currentTop, 100));
        if (currentTop >= 100) {
            clearInterval(scanTimer);
            setStage('detect');
        }
    }, interval);

    return () => clearInterval(scanTimer);
  }, []);

  useEffect(() => {
    if (stage === 'detect') {
        // 2. Detection Phase (Show issues one by one)
        let i = 0;
        const showNextIssue = () => {
            if (i < issues.length) {
                setActiveIssue(issues[i]);
                i++;
                setTimeout(showNextIssue, 1000); // 1s per issue
            } else {
                setStage('fix');
            }
        };
        showNextIssue();
    }
  }, [stage, issues]);

  useEffect(() => {
    if (stage === 'fix') {
        // 3. Fix Phase (Morph text)
        setTimeout(() => {
            setStage('done');
            setTimeout(onComplete, 1000); // Wait a moment before closing
        }, 1500);
    }
  }, [stage, onComplete]);

  // Helper to grab a snippet for visualization
  const getPreviewSnippet = (text: string) => text.slice(0, 400) + "...";

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in p-8">
        
        <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-700 relative min-h-[400px]">
            
            {/* Header */}
            <div className="bg-slate-100 p-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <BrainCircuit className={`w-5 h-5 ${stage === 'done' ? 'text-green-600' : 'text-indigo-600 animate-pulse'}`} />
                    <span className="font-bold text-slate-700 text-sm">
                        {stage === 'scan' && "Reviewer Agent: Scanning Draft..."}
                        {stage === 'detect' && "Reviewer Agent: Identifying Flaws..."}
                        {stage === 'fix' && "Author Agent: Applying Refinements..."}
                        {stage === 'done' && "Section Verified"}
                    </span>
                </div>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-8 relative font-mono text-xs leading-relaxed text-slate-600 h-[320px] overflow-hidden bg-slate-50">
                
                {/* Text View */}
                <div className={`transition-opacity duration-1000 ${stage === 'fix' || stage === 'done' ? 'opacity-0 absolute' : 'opacity-100'}`}>
                    {getPreviewSnippet(originalText)}
                </div>
                
                <div className={`transition-opacity duration-1000 absolute top-8 left-8 right-8 ${stage === 'fix' || stage === 'done' ? 'opacity-100' : 'opacity-0'}`}>
                    {getPreviewSnippet(improvedText)}
                </div>

                {/* Scanning Laser */}
                {stage === 'scan' && (
                    <div 
                        className="absolute left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] z-10"
                        style={{ top: `${scanTop}%` }}
                    >
                        <div className="absolute right-0 -top-6 bg-indigo-600 text-white text-[9px] px-2 py-1 rounded">SCANNING</div>
                    </div>
                )}

                {/* Detected Issues Overlay */}
                {stage === 'detect' && activeIssue && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-rose-100 text-rose-800 px-4 py-3 rounded-lg border border-rose-200 shadow-xl flex items-center gap-3 animate-bounce-slow z-20 max-w-md">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span className="font-bold">{activeIssue}</span>
                    </div>
                )}

                {/* Success Overlay */}
                {stage === 'done' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                        <div className="bg-green-100 text-green-800 px-6 py-4 rounded-xl border border-green-200 shadow-lg flex items-center gap-3 scale-110 animate-fade-in-up">
                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                            <span className="font-bold text-lg">Rigor Check Passed</span>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Status */}
            <div className="bg-slate-900 text-slate-400 p-3 text-[10px] font-mono flex justify-between">
                <span>Core: Gemini 3.0 Pro</span>
                <span>
                    {stage === 'scan' && "Reading..."}
                    {stage === 'detect' && "Critiquing..."}
                    {stage === 'fix' && "Rewriting..."}
                    {stage === 'done' && "Complete"}
                </span>
            </div>
        </div>
    </div>
  );
};
