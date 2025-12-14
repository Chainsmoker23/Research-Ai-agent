
import React, { useState, useEffect, useRef } from 'react';
import { Download, Copy, Check, FileText, Code, RefreshCw, AlertCircle, Loader2, Terminal, AlertTriangle, LayoutTemplate, ShieldAlert } from 'lucide-react';
import { LatexTemplate } from '../types';

interface LatexPreviewProps {
  content: string;
  templates?: LatexTemplate[];
  currentTemplateId?: string;
  onTemplateChange?: (templateId: string) => void;
  onAnalyze?: (pdfBlob: Blob) => void;
}

interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const LatexPreview: React.FC<LatexPreviewProps> = ({ 
  content, 
  templates = [], 
  currentTemplateId, 
  onTemplateChange,
  onAnalyze 
}) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'source'>('source');
  const [copied, setCopied] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Validation State
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true });
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // --- INTERNAL LATEX PARSER & VALIDATOR ---
  const validateLatexSyntax = (latex: string): ValidationResult => {
      if (!latex.includes('\\documentclass')) return { isValid: false, error: "Missing \\documentclass" };
      if (!latex.includes('\\begin{document}')) return { isValid: false, error: "Missing \\begin{document}" };
      if (!latex.includes('\\end{document}')) return { isValid: false, error: "Missing \\end{document}" };

      let balance = 0;
      for (let i = 0; i < latex.length; i++) {
          if (latex[i] === '{' && latex[i-1] !== '\\') balance++;
          if (latex[i] === '}' && latex[i-1] !== '\\') balance--;
          if (balance < 0) return { isValid: false, error: "Found closing '}' without opening '{'" };
      }
      if (balance !== 0) return { isValid: false, error: "Unbalanced braces '{ }'. Check for missing closing brackets." };

      const begins = (latex.match(/\\begin\{([a-zA-Z0-9*]+)\}/g) || []).map(s => s.replace(/\\begin\{|\}/g, ''));
      const ends = (latex.match(/\\end\{([a-zA-Z0-9*]+)\}/g) || []).map(s => s.replace(/\\end\{|\}/g, ''));
      
      if (begins.length !== ends.length) {
          return { isValid: false, error: `Mismatched environments: \\begin (${begins.length}) vs \\end (${ends.length})` };
      }

      return { isValid: true };
  };

  const getCleanLatex = (raw: string) => {
    let clean = raw.replace(/^```latex\n?|^```\n?/gm, '').replace(/```$/gm, '');
    const docClassIndex = clean.indexOf('\\documentclass');
    if (docClassIndex > -1) {
      clean = clean.substring(docClassIndex);
    }
    const endDocIndex = clean.indexOf('\\end{document}');
    if (endDocIndex > -1) {
        clean = clean.substring(0, endDocIndex + 14);
    }
    return clean;
  };

  const cleanContent = getCleanLatex(content);

  useEffect(() => {
    setValidation(validateLatexSyntax(cleanContent));
    setPdfUrl(null);
    setPdfBlob(null);
    setCompileError(null);
    setErrorLog(null);
  }, [cleanContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTex = () => {
    const element = document.createElement("a");
    const file = new Blob([cleanContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "manuscript.tex";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const element = document.createElement("a");
      element.href = pdfUrl;
      element.download = "manuscript.pdf";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const compilePdf = async (): Promise<Blob | null> => {
    if (isCompiling) return null;
    
    if (!validation.isValid) {
        alert(`Cannot compile: ${validation.error}`);
        return null;
    }

    setIsCompiling(true);
    setCompileError(null);
    setErrorLog(null);
    setActiveTab('pdf');

    const attemptCompile = async (retryCount = 0): Promise<Blob> => {
      try {
        const formData = new FormData();
        formData.append('text', cleanContent);
        formData.append('command', 'pdflatex');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch('https://latexonline.cc/compile?force=true', {
          method: 'POST',
          body: formData,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(JSON.stringify({ status: response.status, log: errorText }));
        }

        return await response.blob();

      } catch (e: any) {
        if (e.name === 'AbortError') throw new Error("Compilation timed out. The server is busy.");
        if (retryCount < 2) {
          await new Promise(r => setTimeout(r, 2000 * (retryCount + 1)));
          return attemptCompile(retryCount + 1);
        }
        throw e;
      }
    };

    try {
      const blob = await attemptCompile();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfBlob(blob);
      return blob;
    } catch (err: any) {
      console.error(err);
      let friendlyMessage = "PDF Generation failed.";
      let technicalLog = err.message;
      try {
        const parsed = JSON.parse(err.message);
        if (parsed.log) {
          technicalLog = parsed.log;
          const latexErrorMatch = parsed.log.match(/^!.*$/m);
          if (latexErrorMatch) {
            friendlyMessage = `LaTeX Syntax Error: ${latexErrorMatch[0]}`;
          } else {
             friendlyMessage = "Compilation Error. Check the log details.";
          }
        }
      } catch (parseErr) {
        if (err.message.includes("timed out")) friendlyMessage = "Server timed out.";
      }
      setCompileError(friendlyMessage);
      setErrorLog(technicalLog);
      return null;
    } finally {
      setIsCompiling(false);
    }
  };

  const handleRunAnalysis = async () => {
      if (!onAnalyze) return;
      setIsAnalyzing(true);
      
      let blob = pdfBlob;
      if (!blob) {
          blob = await compilePdf();
      }
      
      if (blob) {
          onAnalyze(blob);
      }
      setIsAnalyzing(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-[85vh] animate-fade-in">
      
      {/* Header / Toolbar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Generated Manuscript
            {(isCompiling || isAnalyzing) && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
          </h2>
          <p className="text-sm text-slate-500">Review, compile, and export your research.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {/* Template Switcher */}
          {templates.length > 0 && onTemplateChange && (
              <div className="relative group">
                  <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 hover:border-indigo-300 transition-colors shadow-sm">
                      <LayoutTemplate className="w-4 h-4 text-slate-500" />
                      <select 
                        value={currentTemplateId}
                        onChange={(e) => onTemplateChange(e.target.value)}
                        className="bg-transparent outline-none appearance-none font-medium pr-2 cursor-pointer w-32"
                      >
                          {templates.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                      </select>
                  </div>
              </div>
          )}

          {/* View Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setActiveTab('source')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'source' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Source</span>
            </button>
            <button
              onClick={() => {
                if (!pdfUrl) compilePdf();
                else setActiveTab('pdf');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'pdf' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden xl:block"></div>

          {/* Evaluate Button */}
          {onAnalyze && (
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing || isCompiling}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-bold text-sm disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldAlert className="h-4 w-4" />}
                Evaluate
              </button>
          )}

          {/* Standard Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => compilePdf()}
              disabled={isCompiling || !validation.isValid}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm disabled:opacity-50"
              title="Re-compile PDF"
            >
              <RefreshCw className={`h-4 w-4 ${isCompiling ? 'animate-spin' : ''}`} />
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm whitespace-nowrap">
                <Download className="h-4 w-4" /> Export
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                 <button onClick={handleDownloadTex} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 first:rounded-t-lg flex items-center gap-2">
                   <Code className="h-4 w-4" /> Download .tex
                 </button>
                 <button onClick={handleDownloadPdf} disabled={!pdfUrl} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                   <FileText className="h-4 w-4" /> Download PDF
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-grow relative border rounded-xl overflow-hidden shadow-sm bg-slate-50 ${!validation.isValid ? 'border-red-300 ring-2 ring-red-100' : 'border-slate-300'}`}>
        
        {activeTab === 'source' && (
          <div className="absolute inset-0 flex flex-col bg-[#1e1e1e]">
             <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-[#3e3e3e] justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="ml-2 text-xs text-gray-400 font-mono">main.tex</span>
                </div>
                {!validation.isValid && (
                    <span className="text-xs text-red-400 font-mono flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {validation.error}
                    </span>
                )}
             </div>
            <textarea
              ref={textAreaRef}
              readOnly
              value={cleanContent}
              className="flex-grow p-4 bg-transparent text-gray-200 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
            />
          </div>
        )}

        {activeTab === 'pdf' && (
          <div className="absolute inset-0 flex flex-col bg-slate-100">
            {isCompiling ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-900">Compiling Manuscript...</h3>
                  <p className="text-sm text-slate-500 max-w-md mt-1">
                    Sending to cloud compiler. This usually takes 5-10 seconds.
                  </p>
                </div>
              </div>
            ) : compileError ? (
               <div className="flex-grow flex flex-col items-center justify-center space-y-4 p-8 text-center overflow-auto">
                <div className="bg-red-50 p-4 rounded-full">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Compilation Failed</h3>
                <p className="text-slate-600 font-medium max-w-lg">{compileError}</p>
                {errorLog && (
                  <div className="w-full max-w-2xl mt-4 text-left">
                     <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin scrollbar-thumb-slate-600">
                       {errorLog.slice(0, 2000)}{errorLog.length > 2000 && "\n... (log truncated)"}
                     </pre>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setActiveTab('source')} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50">Edit Source</button>
                  <button onClick={() => compilePdf()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Try Again</button>
                </div>
              </div>
            ) : pdfUrl ? (
              <iframe src={pdfUrl} className="w-full h-full border-none" title="PDF Preview" />
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <p className="text-slate-500">PDF not generated yet.</p>
                <button onClick={() => compilePdf()} className="text-indigo-600 hover:underline">Click to compile</button>
              </div>
            )}
          </div>
        )}

      </div>
      
      <div className="mt-2 flex justify-between items-center text-xs text-slate-400 px-1">
        <span>{cleanContent.length} characters</span>
        <span>{activeTab === 'pdf' ? 'Powered by LatexOnline' : 'LaTeX Mode'}</span>
      </div>
    </div>
  );
};
