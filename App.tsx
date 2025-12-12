import React, { useState, useEffect } from 'react';
import { AppStep, Reference, MethodologyOption, LatexTemplate, ResearchTopic, NoveltyAssessment } from './types';
import { TEMPLATES } from './constants';
import * as GeminiService from './services/geminiService';
import * as CitationService from './services/citationService';
import { TopicGenerator } from './components/TopicGenerator';
import { ReferenceList } from './components/ReferenceList';
import { MethodologySelector } from './components/MethodologySelector';
import { TemplateSelector } from './components/TemplateSelector';
import { LatexPreview } from './components/LatexPreview';
import { DraftingOrchestrator } from './components/DraftingOrchestrator';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';
import { LemurMascot } from './components/LemurMascot';
import { ResearchProgress } from './components/ResearchProgress';

// Pages
import { LandingPage } from './pages/LandingPage';
import { ModeSelectionPage } from './pages/ModeSelectionPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { ValidationPage } from './pages/ValidationPage';
import { PeerReviewPage } from './pages/PeerReviewPage'; // New Import

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [domain, setDomain] = useState<string>("");
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ResearchTopic | null>(null);
  
  // Validation Mode State
  const [noveltyAssessment, setNoveltyAssessment] = useState<NoveltyAssessment | null>(null);
  
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
    if (!isLoading || (step !== AppStep.RESEARCHING && step !== AppStep.NOVELTY_CHECK)) return;
    
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
    setStep(AppStep.MODE_SELECTION);
  };

  // Handler: Step 0 - Mode Selection
  const handleModeSelection = (mode: 'discovery' | 'validation') => {
    if (mode === 'discovery') {
       setStep(AppStep.TOPIC_INPUT);
    } else {
       setStep(AppStep.NOVELTY_CHECK);
    }
  };

  // --- DISCOVERY PATH ---

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

  // --- VALIDATION PATH ---

  const handleNoveltyAnalysis = async (title: string, overview: string) => {
     setIsLoading(true);
     // 1. First we need literature context to validate against. 
     // We re-use the search function but with the title as query.
     setLoadingPhase('searching');
     setSearchLogs([]);
     setLoadingMessage(`Scanning global databases for "${title}"...`);
     
     try {
        const candidates = await GeminiService.searchLiterature(title, false, (agentName, count) => {
            setSearchLogs(prev => [...prev, `${agentName}: Retrieved ${count} papers.`]);
        });
        
        setLoadingPhase('validating');
        const validatedRefs = await CitationService.validateBatch(candidates, (current, total, t) => {
            setValidationProgress({ current, total, lastProcessed: t });
        });
        
        setReferences(validatedRefs);

        // 2. Assess Novelty
        setLoadingPhase('analyzing');
        setLoadingMessage("Reasoning Engine: Comparing your idea against retrieved papers...");
        
        const assessment = await GeminiService.assessTopicNovelty(title, overview, validatedRefs);
        setNoveltyAssessment(assessment);
        
        // Temporarily create a topic object in case they proceed
        setSelectedTopic({
             id: 'user-topic',
             title: title,
             description: overview,
             gap: assessment.analysis,
             noveltyScore: assessment.score,
             feasibility: 'Unknown'
        });

     } catch (e) {
         console.error(e);
         alert("Validation failed.");
     } finally {
         setIsLoading(false);
     }
  };

  const handleValidationProceed = async () => {
      // Proceed to Methodology using the validated refs and the user's topic
      if (!selectedTopic) return;
      
      setIsLoading(true);
      setLoadingPhase('analyzing');
      setLoadingMessage("Simulating methodologies for your validated topic...");
      
      try {
        const methods = await GeminiService.proposeMethodologies(selectedTopic.title, references);
        setMethodologies(methods);
        setStep(AppStep.METHODOLOGY_SELECTION);
      } catch (e) {
          console.error(e);
          alert("Failed to generate methodologies");
      } finally {
          setIsLoading(false);
      }
  };

  // --- COMMON PATH ---

  // Handler: Step 3 - Select Topic -> Method
  const handleSelectTopic = async (topic: ResearchTopic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setLoadingPhase('analyzing');
    setLoadingMessage("Simulating rigorous research methodologies and checking feasibility...");
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
    // Global Loading Overlay for transitions that are not initial search
    // If we are "analyzing" or doing heavy lifting between steps, show the rich loader.
    const showRichLoader = isLoading; 

    switch (step) {
      case AppStep.LANDING:
        return <LandingPage onStart={handleStartApp} />;

      case AppStep.MODE_SELECTION:
        return <ModeSelectionPage onSelectMode={handleModeSelection} />;
      
      case AppStep.PEER_REVIEW: // New Case
        return <PeerReviewPage onBack={handleStartApp} />;

      case AppStep.TOPIC_INPUT:
        return <DiscoveryPage onSearch={handleDomainSubmit} isLoading={isLoading} onBack={() => setStep(AppStep.MODE_SELECTION)} />;
      
      case AppStep.NOVELTY_CHECK:
        if (showRichLoader) {
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
            <ValidationPage 
                onAnalyze={handleNoveltyAnalysis}
                isLoading={isLoading}
                assessment={noveltyAssessment}
                onProceed={handleValidationProceed}
                onReset={() => setNoveltyAssessment(null)}
                onBack={() => setStep(AppStep.MODE_SELECTION)}
            />
        );

      case AppStep.RESEARCHING:
        // Case 1: Searching/Validating (Initial) -> showRichLoader is true
        // Case 2: Confirming Refs (Analyzing) -> showRichLoader is true
        if (showRichLoader) {
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
         if (showRichLoader) {
            return (
                <ResearchProgress 
                   phase={loadingPhase}
                   searchLogs={searchLogs}
                   validationProgress={validationProgress}
                   message={loadingMessage}
                />
             );
         }
         return <TopicGenerator topics={topics} onSelectTopic={handleSelectTopic} isLoading={isLoading} />;

      case AppStep.METHODOLOGY_SELECTION:
        if (showRichLoader) {
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
    "Mode", "Topic", "Literature", "Analysis", "Method", "Draft"
  ];
  
  // Is research process active? (Updated to exclude Peer Review from std progress bar if desired, or handle it specially)
  const isProcessActive = step !== AppStep.LANDING && step !== AppStep.PEER_REVIEW;

  // Calculate generic progress index for header bar
  const currentProgressIndex = () => {
      if (step === AppStep.MODE_SELECTION) return 0;
      if (step === AppStep.TOPIC_INPUT || step === AppStep.NOVELTY_CHECK) return 1;
      if (step === AppStep.RESEARCHING) return 2;
      if (step === AppStep.TOPIC_GENERATION) return 3;
      if (step === AppStep.METHODOLOGY_SELECTION) return 4;
      if (step >= AppStep.TEMPLATE_SELECTION) return 5;
      return 0;
  };

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
                const currentIdx = currentProgressIndex();
                let isActive = currentIdx === idx;
                let isCompleted = currentIdx > idx;
                
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

          {/* Peer Review Title Overlay */}
          {step === AppStep.PEER_REVIEW && (
             <div className="hidden md:block text-sm font-bold text-slate-600 uppercase tracking-wider">
                Peer Review Module
             </div>
          )}

          {/* Mobile Step Indicator - Only show if active */}
          {isProcessActive && (
            <div className="md:hidden flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Step</span>
              <span className="flex items-center justify-center bg-indigo-100 text-indigo-700 text-sm font-bold w-6 h-6 rounded-full">
                {currentProgressIndex() + 1}
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-sm text-slate-400 font-medium">6</span>
            </div>
          )}

          {/* Spacer or simple button if on landing */}
          {step === AppStep.LANDING ? (
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
      <main className={`flex-grow flex flex-col items-center justify-start ${isProcessActive || step === AppStep.PEER_REVIEW ? 'p-4 md:p-8' : ''}`}>
        {renderStep()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={(newStep) => setStep(newStep)} />
    </div>
  );
};

export default App;