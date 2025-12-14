
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, Gavel, Loader2, ArrowLeft, ScanSearch, Link2, Microscope, Feather, ShieldAlert, Play } from 'lucide-react';
import { performPeerReview } from '../services/reviewService';
import { ReviewReport } from '../types';
import { ReviewReportView } from '../components/ReviewReportView';

interface PeerReviewPageProps {
  onBack: () => void;
}

// Agent definitions for UI visualization
const AGENTS_UI = [
  { id: "Citation Scanner", name: "Citation Scanner", role: "Verification Bot", icon: <ScanSearch className="w-5 h-5" />, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" },
  { id: "Dr. Methodos", name: "Dr. Methodos", role: "Methodology", icon: <Microscope className="w-5 h-5" />, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
  { id: "The Citation Police", name: "Citation Police", role: "Audit Officer", icon: <Link2 className="w-5 h-5" />, color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200" },
  { id: "Prof. Clarity", name: "Prof. Clarity", role: "Structure & Style", icon: <Feather className="w-5 h-5" />, color: "text-purple-600", bg: "bg-purple-100", border: "border-purple-200" },
  { id: "Reviewer #2", name: "Reviewer #2", role: "The Critic", icon: <ShieldAlert className="w-5 h-5" />, color: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200" },
  { id: "Editor-in-Chief", name: "Editor-in-Chief", role: "Final Verdict", icon: <Gavel className="w-5 h-5" />, color: "text-slate-800", bg: "bg-slate-200", border: "border-slate-300" },
];

export const PeerReviewPage: React.FC<PeerReviewPageProps> = ({ onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [completedAgents, setCompletedAgents] = useState<Set<string>>(new Set());
  const [report, setReport] = useState<ReviewReport | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (f.type === 'application/pdf') {
      setFile(f);
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const startReview = async () => {
    if (!file) return;
    setIsProcessing(true);
    setCompletedAgents(new Set());
    setReport(null);

    try {
      const result = await performPeerReview(
        file,
        (agentName) => setActiveAgent(agentName),
        (agentName) => {
            setCompletedAgents(prev => new Set(prev).add(agentName));
            setActiveAgent(null);
        }
      );
      setReport(result);
    } catch (e) {
      console.error(e);
      alert("Review process failed. Please try again.");
    } finally {
      setIsProcessing(false);
      setActiveAgent(null);
    }
  };

  // --- RENDER: UPLOAD STATE ---
  if (!isProcessing && !report) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-sm">Back to Home</span>
        </button>

        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-xl mb-4 transform rotate-3">
             <Gavel className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900">AI Peer Reviewer</h1>
          <p className="text-slate-600 max-w-xl mx-auto text-lg">
            Upload your manuscript (PDF) and receive a comprehensive, multi-agent evaluation before you submit to a journal.
          </p>
        </div>

        <div 
          className={`
            border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 cursor-pointer
            ${isDragging ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'}
            ${file ? 'bg-indigo-50/30 border-indigo-200' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf" 
            className="hidden" 
          />
          
          {file ? (
            <div className="animate-fade-in-up">
               <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-red-600">
                  <FileText className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">{file.name}</h3>
               <p className="text-slate-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
               <button 
                 onClick={(e) => { e.stopPropagation(); startReview(); }}
                 className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2 mx-auto"
               >
                 Start Review Process <Play className="w-5 h-5 fill-current" />
               </button>
               <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="mt-4 text-sm text-slate-400 hover:text-red-500 underline"
               >
                  Remove file
               </button>
            </div>
          ) : (
            <div>
               <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Upload className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Drop your PDF here</h3>
               <p className="text-slate-500 mb-6">or click to browse your files</p>
               <div className="flex justify-center gap-4 text-xs text-slate-400 uppercase font-semibold tracking-wider">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Secure</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Private</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Instant</span>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- RENDER: PROCESSING STATE ---
  if (isProcessing) {
     return (
        <div className="w-full max-w-5xl mx-auto py-12 px-4 animate-fade-in">
           <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Board in Session</h2>
              <p className="text-slate-500">Our specialized agents are analyzing your manuscript...</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {AGENTS_UI.map((agent) => {
                 const isActive = activeAgent === agent.id;
                 const isDone = completedAgents.has(agent.id);
                 
                 return (
                    <div 
                      key={agent.id}
                      className={`
                        relative p-4 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center text-center
                        ${isActive ? `${agent.border} ${agent.bg} scale-105 shadow-xl` : 'border-slate-100 bg-white opacity-60 grayscale'}
                        ${isDone ? 'border-green-200 bg-green-50 opacity-100 grayscale-0' : ''}
                      `}
                    >
                       <div className="absolute top-2 right-2">
                          {isActive && <Loader2 className={`w-3 h-3 animate-spin ${agent.color}`} />}
                          {isDone && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                       </div>

                       <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isActive || isDone ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                          <div className={agent.color}>{agent.icon}</div>
                       </div>
                       
                       <h3 className={`font-bold text-xs ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{agent.name}</h3>
                       <p className="text-[10px] text-slate-400 mb-2 truncate max-w-full">{agent.role}</p>
                       
                       {isActive && (
                           <div className="mt-auto w-full">
                               <div className="h-1 w-full bg-white/50 rounded-full overflow-hidden">
                                  <div className={`h-full ${agent.color.replace('text', 'bg')} animate-progress`}></div>
                                </div>
                               <p className="text-[9px] mt-1 font-medium text-slate-500 animate-pulse">Processing...</p>
                           </div>
                       )}
                       
                       {isDone && (
                           <div className="mt-auto">
                              <span className="text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">Done</span>
                           </div>
                       )}
                    </div>
                 );
              })}
           </div>

           <style>{`
             @keyframes progress {
               0% { width: 0%; }
               100% { width: 100%; }
             }
             .animate-progress {
                animation: progress 2s ease-in-out infinite;
             }
           `}</style>
        </div>
     );
  }

  // --- RENDER: REPORT STATE ---
  if (report) {
      return (
         <ReviewReportView 
            report={report} 
            onClose={onBack} 
            onUploadNew={() => setFile(null)}
         />
      );
  }

  return null;
};
