
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, BarChart3, SearchCheck, Terminal, Network, Binary } from 'lucide-react';
import { LemurMascot } from '../LemurMascot';

const ROTATING_DOMAINS = [
  "Rigorous Science",
  "Deep Learning",
  "Astrophysics",
  "Genomics",
  "Cryptography",
  "Material Science"
];

interface HeroSectionProps {
  onStart: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStart }) => {
  const [domainIndex, setDomainIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Typing Effect
  useEffect(() => {
    const currentDomain = ROTATING_DOMAINS[domainIndex];
    const typeSpeed = isDeleting ? 50 : 80;
    
    if (!isDeleting && displayText === currentDomain) {
       setTimeout(() => setIsDeleting(true), 2500);
       return;
    }
    
    if (isDeleting && displayText === "") {
       setIsDeleting(false);
       setDomainIndex((prev) => (prev + 1) % ROTATING_DOMAINS.length);
       return;
    }

    const timer = setTimeout(() => {
       const nextText = isDeleting 
          ? currentDomain.substring(0, displayText.length - 1)
          : currentDomain.substring(0, displayText.length + 1);
       setDisplayText(nextText);
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, domainIndex]);

  // Cursor Blink
  useEffect(() => {
    const timer = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(timer);
  }, []);

  // Parallax Logic
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      setMousePos({ 
          x: (clientX / innerWidth) * 2 - 1, 
          y: (clientY / innerHeight) * 2 - 1 
      });
  };

  return (
    <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative pt-24 pb-20 lg:pt-36 lg:pb-32 min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 grid-bg pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Typography */}
            <div className="space-y-8 relative" style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)` }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-xs font-medium text-slate-600 shadow-sm animate-fade-in-up">
                 <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Version 2.2: Streamlined Swarm Active</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-slate-900 leading-[1.05] text-balance">
                Research <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
                   Autonomous
                </span>
              </h1>
              
              <div className="text-2xl md:text-3xl font-light text-slate-500 h-16 sm:h-20 flex items-center">
                <span>Generating&nbsp;</span>
                <span className="text-slate-900 font-medium border-b-2 border-indigo-500/50 pb-1">{displayText}</span>
                <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} text-indigo-500`}>_</span>
              </div>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed text-balance">
                 The world's first agentic workflow for academic publishing. Powered by a swarm of <strong className="text-slate-900">16 specialized Gemini 3.0 agents</strong> that debate, verify, and write in consensus.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button 
                  onClick={onStart}
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-8 font-bold text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-2xl hover:scale-105 w-full sm:w-auto shadow-indigo-200 ring-4 ring-transparent hover:ring-indigo-100"
                >
                  <span className="mr-2 text-lg">Initialize Swarm</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
                
                <button className="flex items-center gap-3 px-8 py-4 rounded-full bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 transition-colors w-full sm:w-auto justify-center shadow-sm hover:shadow-md">
                   <Play className="w-5 h-5 fill-current" />
                   <span className="font-medium text-sm">Watch Demo</span>
                </button>
              </div>
            </div>

            {/* Visual: Holographic Lemur */}
            <div className="relative flex justify-center lg:justify-end perspective-1000" style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}>
               {/* Glowing Orb Backdrop */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-indigo-300/30 to-purple-300/30 rounded-full blur-[60px] sm:blur-[80px] animate-pulse"></div>
               
               <div className="relative z-10 animate-float-y">
                   {/* Main Mascot */}
                   <LemurMascot className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px] drop-shadow-2xl transition-transform hover:scale-105 duration-700" />
                   
                   {/* 1. Impact Factor (Top Right) */}
                   <div className="absolute top-0 right-0 sm:-top-4 sm:-right-8 glass-panel p-3 rounded-2xl animate-float-delayed flex items-center gap-3 shadow-lg border-indigo-100/50 backdrop-blur-md">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                         <BarChart3 className="w-5 h-5 text-white" />
                      </div>
                      <div className="hidden sm:block">
                         <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Impact Factor</div>
                         <div className="text-sm font-black text-slate-800">14.5 <span className="text-green-500 text-[10px]">▲</span></div>
                      </div>
                   </div>

                   {/* 2. Review Status (Bottom Left) */}
                   <div className="absolute bottom-10 left-0 sm:bottom-20 sm:-left-12 glass-panel p-3 rounded-2xl animate-float flex items-center gap-3 shadow-lg border-emerald-100/50 backdrop-blur-md" style={{ animationDelay: '1s' }}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                         <SearchCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                         <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Peer Review</div>
                         <div className="text-sm font-black text-slate-800">PASSED</div>
                      </div>
                   </div>

                   {/* 3. Code Quality (Top Left - Floating) */}
                   <div className="absolute top-20 -left-6 sm:top-10 sm:-left-20 glass-panel px-4 py-2 rounded-xl animate-float-y shadow-md border-slate-100 flex items-center gap-2 hidden sm:flex" style={{ animationDelay: '2s' }}>
                       <Terminal className="w-4 h-4 text-slate-400" />
                       <div className="flex flex-col">
                           <span className="text-[9px] font-mono text-slate-400">main.tex</span>
                           <span className="text-xs font-mono font-bold text-indigo-600">0 Errors</span>
                       </div>
                   </div>

                   {/* 4. Deep Search (Bottom Right - Floating) */}
                   <div className="absolute bottom-24 -right-4 sm:bottom-32 sm:-right-16 glass-panel p-2 rounded-xl animate-float shadow-md border-amber-100 flex items-center gap-2 hidden sm:flex" style={{ animationDelay: '3s' }}>
                       <div className="bg-amber-100 p-1.5 rounded-lg">
                           <Network className="w-4 h-4 text-amber-600" />
                       </div>
                       <div className="pr-2">
                           <div className="text-[9px] font-bold text-slate-400 uppercase">Refs</div>
                           <div className="text-xs font-black text-slate-800">240+</div>
                       </div>
                   </div>

                   {/* 5. Equation Bubble (Top Center - Organic) */}
                   <div className="absolute -top-10 left-1/3 glass-panel w-12 h-12 rounded-full flex items-center justify-center animate-blob animation-delay-2000 opacity-80 hidden md:flex">
                        <span className="font-serif italic font-bold text-slate-600 text-lg">Σ</span>
                   </div>

                   {/* 6. DNA/Helix (Right Center - Organic) */}
                   <div className="absolute top-1/2 -right-24 glass-panel px-3 py-1.5 rounded-full animate-float flex items-center gap-2 hidden lg:flex rotate-12" style={{ animationDelay: '4s' }}>
                        <Binary className="w-3 h-3 text-pink-500" />
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest">DATA</span>
                   </div>
               </div>
            </div>

          </div>
        </div>
      </section>
  );
};
