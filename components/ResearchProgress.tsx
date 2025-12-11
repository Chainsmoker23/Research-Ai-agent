import React, { useEffect, useState, useRef } from 'react';
import { Loader2, Database, ShieldCheck, Search, Star } from 'lucide-react';
import { LemurMascot } from './LemurMascot';

interface ResearchProgressProps {
  phase: 'searching' | 'validating' | 'analyzing';
  searchLogs: string[];
  validationProgress: { current: number; total: number; lastProcessed: string };
  message: string;
}

const SEARCH_JOKES = [
  "Do you know I'm married? But here I am, working for you instead of my wife!",
  "Hey, my wife is waiting in Madagascar... hurry up!",
  "Are you married? Oops... what are you doing here reading papers then?",
  "My wife thinks I'm searching for 'Best Bananas', not 'Quantum Physics'.",
  "If I miss dinner tonight, I'm telling her it's YOUR fault.",
  "Relationship status: Married to the job. (Just kidding, she's a lemur too).",
  "I read 5,000 papers for breakfast. They taste like PDF.",
  "Scanning... scanning... oh look, a distraction! No wait, it's a citation.",
  "You know, in Madagascar, we don't have peer review. We just throw fruit.",
  "My wife is calling... should I answer? Nah, let's find one more reference.",
  "Do you think she'll be mad if I'm late? She has a very loud screech.",
];

export const ResearchProgress: React.FC<ResearchProgressProps> = ({ phase, searchLogs, validationProgress, message }) => {
  const [paperCount, setPaperCount] = useState(0);
  const [lastLogIndex, setLastLogIndex] = useState(0);
  const [floatingPapers, setFloatingPapers] = useState<{id: number, left: number, delay: number}[]>([]);
  
  // Joke State
  const [currentJoke, setCurrentJoke] = useState(SEARCH_JOKES[0]);
  const [jokeIndex, setJokeIndex] = useState(0);
  const [showJoke, setShowJoke] = useState(false);

  // Cycle jokes during search phase
  useEffect(() => {
    if (phase !== 'searching') {
        setShowJoke(false);
        return;
    }

    setShowJoke(true);
    const interval = setInterval(() => {
        setJokeIndex(prev => (prev + 1) % SEARCH_JOKES.length);
    }, 5000); // New joke every 5 seconds

    return () => clearInterval(interval);
  }, [phase]);

  // Update text when index changes
  useEffect(() => {
      setCurrentJoke(SEARCH_JOKES[jokeIndex]);
  }, [jokeIndex]);

  // Parse logs to find paper counts and trigger animations
  useEffect(() => {
    if (searchLogs.length > lastLogIndex) {
      const latestLog = searchLogs[searchLogs.length - 1];
      // Try to extract number from "Retrieved X candidate papers"
      const match = latestLog.match(/Retrieved (\d+)/);
      if (match) {
        const count = parseInt(match[1]);
        // Increment the total bucket count
        setPaperCount(prev => prev + count);
        
        // Interrupt joke with excitement
        const prevJoke = currentJoke;
        setCurrentJoke(count > 5 ? "Jackpot! Look at all these!" : "Ooh! Found some!");
        // Restore joke after 2 seconds
        setTimeout(() => setCurrentJoke(SEARCH_JOKES[(jokeIndex + 1) % SEARCH_JOKES.length]), 2000);
        
        // Trigger generic particle explosion of "papers"
        const newPapers = Array.from({ length: 5 }).map((_, i) => ({
            id: Date.now() + i,
            left: Math.random() * 80 + 10, // random % position
            delay: i * 100
        }));
        setFloatingPapers(prev => [...prev, ...newPapers]);
        
        // Cleanup particles after animation
        setTimeout(() => {
           setFloatingPapers(prev => prev.filter(p => p.id < Date.now()));
        }, 2000);
      }
      setLastLogIndex(searchLogs.length);
    }
  }, [searchLogs, lastLogIndex]);

  // Determine Mascot Mode
  const getMascotVariant = () => {
    if (phase === 'searching') return 'telescope';
    if (phase === 'validating') return 'bucket';
    return 'default';
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[600px] animate-fade-in relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 pt-16">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-200 rounded-full blur-3xl animate-blob"></div>
         <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      {/* Floating Papers Animation Layer */}
      {floatingPapers.map(p => (
          <div 
            key={p.id}
            className="absolute top-10 w-6 h-8 bg-white border border-slate-300 shadow-md rounded flex items-center justify-center z-20 animate-fall"
            style={{ 
                left: `${p.left}%`, 
                animationDuration: '1.5s',
                animationDelay: `${p.delay}ms`
            }}
          >
             <div className="w-3 h-0.5 bg-slate-200 mb-1"></div>
             <div className="w-3 h-0.5 bg-slate-200"></div>
          </div>
      ))}

      {/* Main Scene */}
      <div className="relative z-10 flex flex-col items-center space-y-10 mt-8">
        
        {/* Mascot Container with Responsive Comic Speech Bubble */}
        <div className="relative transform hover:scale-105 transition-transform duration-500">
            
            {/* Comic Speech Bubble */}
            {showJoke && (
                <div className={`
                    absolute z-30 bg-white border-2 border-slate-900 shadow-xl animate-bounce-slow
                    
                    /* Mobile: Centered above head */
                    w-[220px] p-4 rounded-2xl
                    -top-40 left-1/2 -translate-x-1/2
                    
                    /* Desktop: Top Right Side */
                    md:w-64 md:p-5 md:rounded-3xl md:rounded-bl-none
                    md:-top-32 md:-right-44 md:left-auto md:translate-x-0
                `}>
                    <p className="text-xs md:text-sm font-bold text-slate-900 italic leading-snug text-center md:text-left">
                        "{currentJoke}"
                    </p>

                    {/* Mobile Tail (Centered Bottom pointing down) */}
                    <div className="md:hidden absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-slate-900 transform rotate-45"></div>

                    {/* Desktop Tail (Bottom Left pointing to mascot) */}
                    <div className="hidden md:block absolute -bottom-3 left-0 w-6 h-6 bg-white border-b-2 border-r-2 border-slate-900 transform rotate-12 skew-x-12"></div>
                </div>
            )}

            <LemurMascot 
                className="w-64 h-64 md:w-80 md:h-80" 
                variant={getMascotVariant()} 
            />
            
            {/* Real-time Counter Badge (Bucket Mode) */}
            {(phase === 'searching' || phase === 'validating') && paperCount > 0 && (
                <div className="absolute -right-4 top-1/2 bg-white p-3 rounded-xl shadow-xl border border-slate-100 flex flex-col items-center animate-bounce-slow z-20">
                    <span className="text-xs text-slate-400 font-bold uppercase">Papers Found</span>
                    <span className="text-3xl font-black text-indigo-600">{paperCount}</span>
                </div>
            )}
        </div>

        {/* Status Bubble */}
        <div className="bg-white/90 backdrop-blur-sm border border-slate-200 px-8 py-5 rounded-2xl shadow-lg max-w-xl text-center transform transition-all duration-300 z-20">
           <div className="flex items-center justify-center gap-2 mb-3">
              {phase === 'searching' && <Search className="w-5 h-5 text-indigo-600 animate-pulse" />}
              {phase === 'validating' && <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />}
              {phase === 'analyzing' && <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />}
              <span className="text-sm font-bold uppercase tracking-widest text-slate-500">{phase.toUpperCase()}</span>
           </div>
           <p className="text-xl font-bold text-slate-900 leading-tight">
             {phase === 'validating' ? 
               (validationProgress.lastProcessed ? `Checking: ${validationProgress.lastProcessed.substring(0, 40)}...` : message) 
               : message
             }
           </p>
        </div>

        {/* Logs / Progress Text */}
        <div className="w-full max-w-lg space-y-4">
            {phase === 'searching' && searchLogs.length > 0 && (
                <div className="flex flex-col gap-2 items-center">
                    {/* Just show the last log with a nice fade in */}
                    <div className="bg-slate-50 px-4 py-2 rounded-lg text-sm text-slate-600 border border-slate-100 animate-fade-in-up">
                       {searchLogs[searchLogs.length - 1]}
                    </div>
                </div>
            )}

            {phase === 'validating' && (
                <div className="space-y-2">
                     <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>Validation Progress</span>
                        <span>{Math.round((validationProgress.current / (validationProgress.total || 1)) * 100)}%</span>
                     </div>
                     <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-300 ease-out relative"
                            style={{ width: `${(validationProgress.current / (validationProgress.total || 1)) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                        </div>
                     </div>
                </div>
            )}
        </div>

      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(360deg); opacity: 0; }
        }
        .animate-fall {
            animation-name: fall;
            animation-timing-function: ease-in;
            animation-fill-mode: forwards;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};