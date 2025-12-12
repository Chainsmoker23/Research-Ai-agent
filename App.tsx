import React, { useState, useEffect } from 'react';
import { AppStep, Reference, MethodologyOption, LatexTemplate, ResearchTopic } from './types';
import { TEMPLATES } from './constants';
import * as GeminiService from './services/geminiService';
import * as CitationService from './services/citationService';
import { TopicInput } from './components/TopicInput';
import { TopicGenerator } from './components/TopicGenerator';
import { ReferenceList } from './components/ReferenceList';
import { MethodologySelector } from './components/MethodologySelector';
import { TemplateSelector } from './components/TemplateSelector';
import { LatexPreview } from './components/LatexPreview';
import { DraftingOrchestrator } from './components/DraftingOrchestrator';
import { LandingPage } from './components/LandingPage';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';
import { LemurMascot } from './components/LemurMascot';
import { ResearchProgress } from './components/ResearchProgress';

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [domain, setDomain] = useState<string>("");
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ResearchTopic | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Processing...");
  
  // Granular Loading States
  const [loadingPhase, setLoadingPhase] = useState<'searching' | 'validating' | 'analyzing'>('searching');
  const [searchLogs, setSearchLogs] = useState<string[]>([]);
  const [validationProgress, setValidationProgress] = useState({ current: 0, total: 0, lastProcessed: "" });

  const [includePreprints, setIncludePreprints] = useState<boolean>(false);
  
  const [references, setReferences] = useState<Reference[]>([]);
  const [methodologies, setMethodologies] = useState<MethodologyOption[]>([]);
  const [selectedMethodology, setSelectedMethodology] = useState<MethodologyOption | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<LatexTemplate | null>(null); // Added state
  const [generatedLatex, setGeneratedLatex] = useState<string>(""); // Fallback

  // Cycle generic loading messages for non-granular phases
  useEffect(() => {
    if (!isLoading || step === AppStep.RESEARCHING) return;
    
    const topicMessages = [
        "Reading verified abstracts...",
        "Scanning literature for inconsistencies...",
        "Identifying open problems in recent papers...",
        "Synthesizing new conceptual frameworks...",
        "Calculating novelty scores...",
    ];

    let messages = topicMessages;

    let i = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[i % messages.length]);
      i++;
    }, 2000);

    return () => clearInterval(interval);
  }, [isLoading, step]);

  // Handler: Start from Landing
  const handleStartApp = () => {
    setStep(AppStep.TOPIC_INPUT);
  };

  // Handler: Step 1 - Domain Input -> Systematic Review
  const handleDomainSubmit = async (searchDomain: string) => {
    setDomain(searchDomain);
    setStep(AppStep.RESEARCHING);
    await performLiteratureSearch(searchDomain, includePreprints);
  };

  const performLiteratureSearch = async (query: string, preprints: boolean) => {
    setIsLoading(true);
    setReferences([]);
    setSearchLogs([]);
    setValidationProgress({ current: 0, total: 0, lastProcessed: "" });
    setLoadingPhase('searching');
    setLoadingMessage("Deploying Multi-Agent Search Grid...");
    
    try {
      // 1. Fetch Candidate References using Gemini + Google Search
      // We pass a callback to track individual agent completion
      const candidates = await GeminiService.searchLiterature(query, preprints, (agentName, count) => {
         setSearchLogs(prev => [...prev, `${agentName}: Retrieved ${count} candidate papers.`]);
      });
      
      // 2. Validate and Enrich using OpenAlex
      setLoadingPhase('validating');
      setLoadingMessage("Cross-referencing with OpenAlex Knowledge Graph...");
      setValidationProgress({ current: 0, total: candidates.length, lastProcessed: "Initializing..." });

      const validatedRefs = await CitationService.validateBatch(candidates, (current, total, title) => {
         setValidationProgress({ current, total, lastProcessed: title });
      });
      
      setReferences(validatedRefs);
    } catch (error) {
      console.error(error);
      alert("Error searching literature.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePreprints = (enabled: boolean) => {
    setIncludePreprints(enabled);
    if (domain) {
      // Re-run search if toggle changes
      performLiteratureSearch(domain, enabled);
    }
  };

  // Handler: Step 2 - Review Refs -> Generate Topics
  const handleConfirmReferences = async (selectedRefs: Reference[]) => {
    setIsLoading(true);
    setLoadingPhase('analyzing');
    setLoadingMessage(`Analyzing ${selectedRefs.length} selected papers for contradictions and overlaps...`);
    try {
      // Use only the selected subset for the reasoning engine
      const generatedTopics = await GeminiService.generateNovelTopics(domain, selectedRefs);
      setTopics(generatedTopics);
      setStep(AppStep.TOPIC_GENERATION);
    } catch (error) {
      console.error(error);
      alert("Failed to generate topics.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToTopic = () => {
     setStep(AppStep.TOPIC_INPUT);
  };

  // Handler: Step 3 - Select Topic -> Method
  const handleSelectTopic = async (topic: ResearchTopic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setLoadingMessage("Analyzing methodology fit...");
    try {
        const methods = await GeminiService.proposeMethodologies(topic.title, references);
        setMethodologies(methods);
        setStep(AppStep.METHODOLOGY_SELECTION);
    } catch (error) {
        console.error(error);
        alert("Failed to generate methodologies.");
    } finally {
        setIsLoading(false);
    }
  };

  // Handler: Step 4 - Select Method -> Template
  const handleSelectMethodology = (method: MethodologyOption) => {
    setSelectedMethodology(method);
    setStep(AppStep.TEMPLATE_SELECTION);
  };

  // Handler: Step 5 - Select Template -> Start Drafting
  const handleSelectTemplate = (template: LatexTemplate) => {
    if (!selectedMethodology || !selectedTopic) return;
    setSelectedTemplate(template);
    setStep(AppStep.DRAFTING);
  };

  // Render Helpers
  const renderStep = () => {
    switch (step) {
      case AppStep.LANDING:
        return <LandingPage onStart={handleStartApp} />;

      case AppStep.TOPIC_INPUT:
        return <TopicInput onSearch={handleDomainSubmit} isLoading={isLoading} />;
      
      case AppStep.RESEARCHING:
        if (isLoading && references.length === 0) {
          return (
             <ResearchProgress 
                phase={loadingPhase}
                searchLogs={searchLogs}
                validationProgress={validationProgress}
                message={loadingMessage}
             />
          );
        }
        return (
          <ReferenceList 
            references={references} 
            onConfirm={handleConfirmReferences} 
            onBack={handleBackToTopic}
            isLoading={isLoading} 
            onTogglePreprints={handleTogglePreprints}
            includePreprints={includePreprints}
            onRefresh={() => performLiteratureSearch(domain, includePreprints)}
          />
        );

      case AppStep.TOPIC_GENERATION:
         return <TopicGenerator topics={topics} onSelectTopic={handleSelectTopic} isLoading={isLoading} />;

      case AppStep.METHODOLOGY_SELECTION:
        return (
          <MethodologySelector 
            options={methodologies} 
            onSelect={handleSelectMethodology} 
            isLoading={false} 
          />
        );

      case AppStep.TEMPLATE_SELECTION:
        return (
          <TemplateSelector 
            templates={TEMPLATES} 
            onSelect={handleSelectTemplate} 
            isLoading={false} 
          />
        );

      case AppStep.DRAFTING:
         if (selectedTopic && selectedMethodology && selectedTemplate) {
           return (
             <DraftingOrchestrator
               topic={selectedTopic}
               methodology={selectedMethodology}
               template={selectedTemplate}
               references={references}
               onComplete={() => setStep(AppStep.FINISHED)}
             />
           );
         }
         return <div>Error: Missing selection data.</div>;

      case AppStep.FINISHED:
        // Handled internally by DraftingOrchestrator when it switches to 'final'
        // But if we navigate out and back, or if orchestrator calls onComplete:
        return <div>Drafting Complete.</div>;

      default:
        return null;
    }
  };

  // Step labels for desktop
  const STEP_LABELS = [
    "Domain", "Literature", "Gap Analysis", "Methodology", "Template", "Draft"
  ];
  
  // Is research process active?
  const isProcessActive = step !== AppStep.LANDING;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50">
      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 20s ease-out forwards;
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
             className="flex items-center gap-2 cursor-pointer group"
             onClick={() => setStep(AppStep.LANDING)}
          >
            {/* Small Header Mascot Icon */}
            <div className="w-8 h-8 flex items-center justify-center bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
               <LemurMascot className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 text-lg hidden xs:block">ScholarAgent</span>
          </div>
          
          {/* Desktop Progress Steps - Only show if active */}
          {isProcessActive && (
            <div className="hidden md:flex items-center gap-2 text-sm overflow-x-auto scrollbar-hide">
              {STEP_LABELS.map((label, idx) => {
                const currentStep = step === AppStep.FINISHED ? 6 : step;
                let isActive = currentStep === idx;
                let isCompleted = currentStep > idx;
                
                return (
                  <div key={label} className="flex items-center whitespace-nowrap">
                    <span className={`
                      px-3 py-1 rounded-full transition-colors text-xs font-medium
                      ${isActive ? 'bg-indigo-100 text-indigo-700' : ''}
                      ${isCompleted ? 'text-indigo-600' : ''}
                      ${!isActive && !isCompleted ? 'text-slate-400' : ''}
                    `}>
                      {label}
                    </span>
                    {idx < 5 && <div className="w-4 h-px bg-slate-200 mx-1" />}
                  </div>
                )
              })}
            </div>
          )}

          {/* Mobile Step Indicator - Only show if active */}
          {isProcessActive && (
            <div className="md:hidden flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step</span>
              <span className="flex items-center justify-center bg-indigo-100 text-indigo-700 text-sm font-bold w-6 h-6 rounded-full">
                {(step === AppStep.FINISHED ? 5 : step) + 1}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-sm text-slate-400 font-medium">6</span>
            </div>
          )}

          {/* Spacer or simple button if on landing */}
          {!isProcessActive ? (
             <div className="hidden md:block">
                <button 
                  onClick={handleStartApp}
                  className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  Start Project
                </button>
             </div>
          ) : (
            <div className="w-8 md:block hidden"></div> 
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-grow flex flex-col items-center justify-start ${isProcessActive ? 'p-4 md:p-8' : ''}`}>
        {renderStep()}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;