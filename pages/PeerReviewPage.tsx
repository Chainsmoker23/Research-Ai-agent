
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp, Play, Microscope, Feather, ShieldAlert, Gavel, Loader2, ArrowLeft, ScanSearch, Link2 } from 'lucide-react';
import { performPeerReview } from '../services/reviewService';
import { ReviewReport } from '../types';

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
  const [activeTab, setActiveTab] = useState<number>(0);
  
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  const getVerdictBadge = (verdict: string) => {
      switch(verdict) {
          case 'Accept': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200">Accept</span>;
          case 'Minor Revision': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold border border-blue-200">Minor Revision</span>;
          case 'Major Revision': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-bold border border-amber-200">Major Revision</span>;
          case 'Reject': return <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-bold border border-rose-200">Reject</span>;
          default: return null;
      }
  };

  // --- RENDER: UPLOAD STATE ---
  if (!isProcessing && !report) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 animate-fade-in">
        {/* Back Button */}
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
                       {/* Status Indicator */}
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
      const citationScore = report.referenceAudit?.healthScore || 0;
      const citationColor = citationScore >= 90 ? 'text-green-600' : citationScore >= 60 ? 'text-amber-600' : 'text-rose-600';

      return (
         <div className="w-full max-w-5xl mx-auto py-12 px-4 animate-fade-in pb-24">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
               <div>
                  <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-700 transition-colors mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium text-sm">Close Report</span>
                    </button>
                  <h1 className="text-3xl font-bold text-slate-900">Manuscript Evaluation</h1>
                  <p className="text-slate-500 text-sm">Generated by ScholarAgent Peer Review Board</p>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setFile(null)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50">Upload New</button>
                  <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2">
                     <FileText className="w-4 h-4" /> Export PDF
                  </button>
               </div>
            </div>

            {/* Score Cards */}
            <div className="grid md:grid-cols-4 gap-4 mb-10">
               {/* Overall Score */}
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                   <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                       <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="#f1f5f9" strokeWidth="6" fill="none" />
                          <circle 
                             cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="none" 
                             className={getScoreColor(report.overallScore)}
                             strokeDasharray={`${report.overallScore * 1.75} 175`}
                          />
                       </svg>
                       <span className={`absolute text-lg font-bold ${getScoreColor(report.overallScore)}`}>{report.overallScore}</span>
                   </div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Overall Score</h3>
               </div>

                {/* Citation Health (NEW) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center relative overflow-hidden">
                   {/* Background Graph Pattern */}
                   <div className="absolute inset-0 opacity-5 pointer-events-none">
                       <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                           <path d="M0 100 L 20 80 L 40 90 L 60 40 L 80 50 L 100 20" fill="none" stroke="currentColor" strokeWidth="2" className={citationColor} />
                       </svg>
                   </div>
                   <div className={`text-3xl font-black mb-1 ${citationColor}`}>{citationScore}%</div>
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                       <Link2 className="w-3 h-3" /> Citation Health
                   </h3>
                   <div className="text-[10px] text-slate-400 mt-1">
                       {report.referenceAudit?.verified} Verified / {report.referenceAudit?.total} Total
                   </div>
               </div>

               {/* Verdict */}
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Final Verdict</h3>
                   <div className="flex items-center gap-2">
                      {getVerdictBadge(report.finalVerdict)}
                   </div>
               </div>

               {/* Probability */}
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Acceptance Prob.</h3>
                   <div className="text-xl font-bold text-slate-900">
                      {report.acceptanceProbability}
                   </div>
               </div>
            </div>

            {/* Detailed Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
                <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
                    {report.agentReviews.map((agent, idx) => {
                        const uiAgent = AGENTS_UI.find(a => a.name === agent.agentName);
                        return (
                            <button
                            key={idx}
                            onClick={() => setActiveTab(idx)}
                            className={`
                                px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2
                                ${activeTab === idx ? 'border-b-2 border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}
                            `}
                            >
                            {uiAgent?.icon}
                            {agent.agentName}
                            </button>
                        );
                    })}
                </div>

                <div className="p-8 animate-fade-in key={activeTab}">
                    {/* Active Agent Content */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                           <h2 className="text-xl font-bold text-slate-900 mb-1">{report.agentReviews[activeTab].agentName}</h2>
                           <p className="text-sm text-slate-500">{report.agentReviews[activeTab].role}</p>
                        </div>
                        <div className="text-right">
                           <div className="text-2xl font-black text-slate-900">{report.agentReviews[activeTab].score}<span className="text-sm text-slate-400 font-normal">/10</span></div>
                           <div className="text-xs text-slate-400 uppercase font-bold">Agent Score</div>
                        </div>
                    </div>

                    <div className="prose prose-slate max-w-none">
                       <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-slate-700 leading-relaxed italic">
                          "{report.agentReviews[activeTab].summary}"
                       </div>

                       <div className="grid md:grid-cols-2 gap-8">
                           <div>
                              <h3 className="flex items-center gap-2 font-bold text-green-700 mb-3">
                                 <CheckCircle2 className="w-5 h-5" /> Key Strengths
                              </h3>
                              <ul className="space-y-2">
                                 {report.agentReviews[activeTab].strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></span>
                                       {s}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                           
                           <div>
                              <h3 className="flex items-center gap-2 font-bold text-rose-700 mb-3">
                                 <AlertTriangle className="w-5 h-5" /> Weaknesses & Flaws
                              </h3>
                              <ul className="space-y-2">
                                 {report.agentReviews[activeTab].weaknesses.map((w, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                       <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                                       {w}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                       </div>
                    </div>
                </div>
            </div>
         </div>
      );
  }

  return null;
};
