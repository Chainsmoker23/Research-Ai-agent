import React, { useState, useEffect, useRef } from 'react';
import { Download, Copy, Check, FileText, Code, RefreshCw, AlertCircle, Loader2, Terminal } from 'lucide-react';

interface LatexPreviewProps {
  content: string;
}

export const LatexPreview: React.FC<LatexPreviewProps> = ({ content }) => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'source'>('source');
  const [copied, setCopied] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [errorLog, setErrorLog] = useState<string | null>(null);
  
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Robust cleaning function
  const getCleanLatex = (raw: string) => {
    // 1. Remove markdown code blocks
    let clean = raw.replace(/^```latex\n?|^```\n?/gm, '').replace(/```$/gm, '');
    
    // 2. Find the start of the documentclass to ignore conversational preambles
    const docClassIndex = clean.indexOf('\\documentclass');
    if (docClassIndex > -1) {
      clean = clean.substring(docClassIndex);
    }
    
    return clean;
  };

  const cleanContent = getCleanLatex(content);

  useEffect(() => {
    // Reset PDF if content changes drastically or on mount
    setPdfUrl(null);
    setCompileError(null);
    setErrorLog(null);
  }, [content]);

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

  const compilePdf = async () => {
    if (isCompiling) return;
    
    setIsCompiling(true);
    setCompileError(null);
    setErrorLog(null);
    setActiveTab('pdf');

    const attemptCompile = async (retryCount = 0): Promise<string> => {
      try {
        const formData = new FormData();
        formData.append('text', cleanContent);
        // Force pdflatex and error mode
        formData.append('command', 'pdflatex');
        
        // 30s timeout
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

        const blob = await response.blob();
        return URL.createObjectURL(blob);

      } catch (e: any) {
        if (e.name === 'AbortError') {
          throw new Error("Compilation timed out. The server is busy.");
        }
        
        // Retry logic for 500s or fetch errors
        if (retryCount < 2) {
          console.warn(`Compilation attempt ${retryCount + 1} failed. Retrying...`);
          await new Promise(r => setTimeout(r, 2000 * (retryCount + 1))); // Exponential backoff
          return attemptCompile(retryCount + 1);
        }
        throw e;
      }
    };

    try {
      const url = await attemptCompile();
      setPdfUrl(url);
    } catch (err: any) {
      console.error(err);
      
      let friendlyMessage = "PDF Generation failed.";
      let technicalLog = err.message;

      try {
        // Try to parse our structured error
        const parsed = JSON.parse(err.message);
        if (parsed.log) {
          technicalLog = parsed.log;
          // Extract the first LaTeX error
          const latexErrorMatch = parsed.log.match(/^!.*$/m);
          if (latexErrorMatch) {
            friendlyMessage = `LaTeX Syntax Error: ${latexErrorMatch[0]}`;
          } else {
             friendlyMessage = "Compilation Error. Check the log details.";
          }
        }
      } catch (parseErr) {
        // Not JSON, just string
        if (err.message.includes("timed out")) friendlyMessage = "Server timed out.";
      }

      setCompileError(friendlyMessage);
      setErrorLog(technicalLog);
    } finally {
      setIsCompiling(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-[85vh] animate-fade-in">
      
      {/* Header / Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Generated Manuscript
            {isCompiling && <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />}
          </h2>
          <p className="text-sm text-slate-500">Review, compile, and export your research.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-lg mr-2">
            <button
              onClick={() => setActiveTab('source')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'source' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="h-4 w-4" />
              Source
            </button>
            <button
              onClick={() => {
                if (!pdfUrl) compilePdf();
                else setActiveTab('pdf');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'pdf' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="h-4 w-4" />
              PDF Preview
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

          {/* Actions */}
          <button
            onClick={compilePdf}
            disabled={isCompiling}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm disabled:opacity-50"
            title="Re-compile PDF"
          >
            <RefreshCw className={`h-4 w-4 ${isCompiling ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Compile</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm"
          >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </button>
          
          <div className="relative group">
            <button
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            {/* Dropdown for export */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
               <button 
                onClick={handleDownloadTex}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 first:rounded-t-lg flex items-center gap-2"
               >
                 <Code className="h-4 w-4" /> Download .tex
               </button>
               <button 
                onClick={handleDownloadPdf}
                disabled={!pdfUrl}
                className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 last:rounded-b-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
               >
                 <FileText className="h-4 w-4" /> Download PDF
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow relative border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-slate-50">
        
        {activeTab === 'source' && (
          <div className="absolute inset-0 flex flex-col bg-[#1e1e1e]">
             <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-[#3e3e3e]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="ml-2 text-xs text-gray-400 font-mono">main.tex</span>
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
                <p className="text-slate-600 font-medium max-w-lg">
                  {compileError}
                </p>
                
                {errorLog && (
                  <div className="w-full max-w-2xl mt-4 text-left">
                     <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <Terminal className="w-3 h-3" /> Compiler Log
                     </div>
                     <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-48 scrollbar-thin scrollbar-thumb-slate-600">
                       {errorLog.slice(0, 2000)}
                       {errorLog.length > 2000 && "\n... (log truncated)"}
                     </pre>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setActiveTab('source')}
                    className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50"
                  >
                    Edit Source
                  </button>
                  <button 
                    onClick={compilePdf}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : pdfUrl ? (
              <iframe 
                src={pdfUrl} 
                className="w-full h-full border-none" 
                title="PDF Preview"
              />
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center space-y-4">
                <p className="text-slate-500">PDF not generated yet.</p>
                <button onClick={compilePdf} className="text-indigo-600 hover:underline">Click to compile</button>
              </div>
            )}
          </div>
        )}

      </div>
      
      {/* Footer Info */}
      <div className="mt-2 flex justify-between items-center text-xs text-slate-400 px-1">
        <span>{cleanContent.length} characters</span>
        <span>{activeTab === 'pdf' ? 'Powered by LatexOnline' : 'LaTeX Mode'}</span>
      </div>
    </div>
  );
};