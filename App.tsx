import React, { useState, useEffect } from 'react';
import { AppStep, Reference, MethodologyOption, LatexTemplate, ResearchTopic } from './types';
import { TEMPLATES } from './constants';
import * as GeminiService from './services/geminiService';
import { TopicInput } from './components/TopicInput';
import { TopicGenerator } from './components/TopicGenerator';
import { ReferenceList } from './components/ReferenceList';
import { MethodologySelector } from './components/MethodologySelector';
import { TemplateSelector } from './components/TemplateSelector';
import { LatexPreview } from './components/LatexPreview';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [step, setStep] = useState<AppStep>(AppStep.TOPIC_INPUT);
  const [domain, setDomain] = useState<string>("");
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ResearchTopic | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Processing...");
  const [includePreprints, setIncludePreprints] = useState<boolean>(false);
  
  const [references, setReferences] = useState<Reference[]>([]);
  const [methodologies, setMethodologies] = useState<MethodologyOption[]>([]);
  const [selectedMethodology, setSelectedMethodology] = useState<MethodologyOption | null>(null);
  const [generatedLatex, setGeneratedLatex] = useState<string>("");

  // Cycle loading messages
  useEffect(() => {
    if (!isLoading) return;
    
    // Different messages based on phase
    const researchMessages = [
      "Deploying Multi-Agent Search Grid...",
      "Agent IEEE: Querying Xplore Database...",
      "Agent Springer: Scanning Nature Portfolio...",
      "Agent Elsevier: Retrieving ScienceDirect Articles...",
      "Agent General: Validating Metadata...",
      "Aggregating and Deduplicating 40+ Sources...",
      "Verifying Impact Factors..."
    ];

    const topicMessages = [
        "Scanning literature for inconsistencies...",
        "Identifying open problems in recent papers...",
        "Calculating novelty scores...",
        "Evaluating feasibility of proposed gaps..."
    ];

    let messages = researchMessages;
    if (step === AppStep.TOPIC_GENERATION) messages = topicMessages;

    let i = 0;
    const interval = setInterval(() => {
      setLoadingMessage(messages[i % messages.length]);
      i++;
    }, 2500);

    return () => clearInterval(interval);
  }, [isLoading, step]);

  // Handler: Step 1 - Domain Input -> Systematic Review
  const handleDomainSubmit = async (searchDomain: string) => {
    setDomain(searchDomain);
    setStep(AppStep.RESEARCHING);
    await performLiteratureSearch(searchDomain, includePreprints);
  };

  const performLiteratureSearch = async (query: string, preprints: boolean) => {
    setIsLoading(true);
    setReferences([]); // Clear old refs on new search
    setLoadingMessage("Initializing Multi-Engine Literature Search...");
    
    try {
      const refs = await GeminiService.searchLiterature(query, preprints);
      setReferences(refs);
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
  const handleConfirmReferences = async () => {
    setIsLoading(true);
    setLoadingMessage("Identifying novel research gaps based on literature...");
    try {
      const generatedTopics = await GeminiService.generateNovelTopics(domain, references);
      setTopics(generatedTopics);
      setStep(AppStep.TOPIC_GENERATION);
    } catch (error) {
      console.error(error);
      alert("Failed to generate topics.");
    } finally {
      setIsLoading(false);
    }
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

  // Handler: Step 5 - Select Template -> Generate
  const handleSelectTemplate = async (template: LatexTemplate) => {
    if (!selectedMethodology || !selectedTopic) return;
    
    setStep(AppStep.DRAFTING);
    setIsLoading(true);
    setGeneratedLatex("% Initializing Research Agent...\n% Analyzing References...\n% Structuring Arguments...\n");

    try {
      await GeminiService.generateLatexManuscript(
        selectedTopic.title,
        selectedMethodology,
        template.name,
        references,
        (chunk) => setGeneratedLatex(chunk)
      );
      setStep(AppStep.FINISHED);
    } catch (error) {
      console.error(error);
      setGeneratedLatex(prev => prev + "\n% ERROR: Generation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  // Render Helpers
  const renderStep = () => {
    switch (step) {
      case AppStep.TOPIC_INPUT:
        return <TopicInput onSearch={handleDomainSubmit} isLoading={isLoading} />;
      
      case AppStep.RESEARCHING:
        if (isLoading && references.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center h-64 space-y-6 animate-fade-in text-center">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-indigo-50 rounded-full animate-pulse opacity-50"></div>
                </div>
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{loadingMessage}</p>
                <p className="text-sm text-slate-500 mt-2">Deploying parallel agents to 4 academic databases...</p>
                <div className="w-64 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 overflow-hidden">
                   <div className="h-full bg-indigo-600 animate-progress origin-left w-full"></div>
                </div>
              </div>
            </div>
          );
        }
        return (
          <ReferenceList 
            references={references} 
            onConfirm={handleConfirmReferences} 
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
         return <LatexPreview content={generatedLatex} />;

      case AppStep.FINISHED:
        return <LatexPreview content={generatedLatex} />;

      default:
        return null;
    }
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
            <span className="font-bold text-slate-900 text-lg">ScholarAgent</span>
          </div>
          
          {/* Progress Steps */}
          <div className="hidden md:flex items-center gap-2 text-sm">
            {[
              "Domain", "Literature", "Gap Analysis", "Methodology", "Template", "Draft"
            ].map((label, idx) => {
              // Mapping step enum to visual index
              // Input=0, Research=1, TopicGen=2, Method=3, Templ=4, Draft=5
              const currentStep = step === AppStep.FINISHED ? 6 : step;
              let isActive = currentStep === idx;
              let isCompleted = currentStep > idx;
              
              return (
                <div key={label} className="flex items-center">
                  <span className={`
                    px-3 py-1 rounded-full transition-colors
                    ${isActive ? 'bg-indigo-100 text-indigo-700 font-medium' : ''}
                    ${isCompleted ? 'text-indigo-600' : ''}
                    ${!isActive && !isCompleted ? 'text-slate-400' : ''}
                  `}>
                    {label}
                  </span>
                  {idx < 5 && <div className="w-4 h-px bg-slate-300 mx-1" />}
                </div>
              )
            })}
          </div>

          <div className="w-8"></div> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 flex flex-col items-center justify-start pt-8">
        {renderStep()}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 text-sm">
        <p>Powered by Google Gemini • Validated Research Engine</p>
      </footer>
    </div>
  );
};

export default App;