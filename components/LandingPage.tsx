import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, BookOpen, Sparkles, FileText, Cpu, Network, Lock, CheckCircle2, Activity, Globe, Search, Award, Zap, MousePointer2, Radar, Clock, Target, ShieldAlert } from 'lucide-react';
import { LemurMascot } from './LemurMascot';
import { PricingSection } from './PricingSection';

interface LandingPageProps {
  onStart: () => void;
}

const ROTATING_DOMAINS = [
  "Rigorous Science",
  "Deep Learning",
  "Astrophysics",
  "Genomics",
  "Cryptography",
  "Material Science"
];

const RECENT_ACTIVITIES = [
  "Verified 15 papers for a user in Zurich",
  "Drafting manuscript on Quantum Error Correction",
  "Analyzing citation gaps in Oncology",
  "Synthesizing new methodology for NLP",
  "Cross-referencing IEEE Xplore results"
];

const BREAKTHROUGHS = [
    { title: "Optimizing Transformer Attention Heads for Sparse Code", category: "AI/ML", novelty: 94 },
    { title: "Perovskite Solar Cells: Stability at 85°C", category: "Materials", novelty: 89 },
    { title: "CRISPR-Cas9 Off-Target Detection via GNNs", category: "BioTech", novelty: 91 },
    { title: "Zero-Knowledge Proofs for Decentralized Identity", category: "Crypto", novelty: 88 },
    { title: "Micro-plastic Filtration using Graphene Oxide", category: "Env. Sci", novelty: 92 },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  // Typing Effect State
  const [domainIndex, setDomainIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Live Ticker State
  const [activityIndex, setActivityIndex] = useState(0);

  // Stats Counter State
  const [papersAnalyzed, setPapersAnalyzed] = useState(1450230);
  
  // Parallax Mouse State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Typing Effect Logic
  useEffect(() => {
    const currentDomain = ROTATING_DOMAINS[domainIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && displayText === currentDomain) {
       setTimeout(() => setIsDeleting(true), 2000); // Pause at full word
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

  // Activity Ticker Logic
  useEffect(() => {
    const timer = setInterval(() => {
        setActivityIndex(prev => (prev + 1) % RECENT_ACTIVITIES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Fake Live Stats Counter
  useEffect(() => {
      const timer = setInterval(() => {
          setPapersAnalyzed(prev => prev + Math.floor(Math.random() * 3));
      }, 2000);
      return () => clearInterval(timer);
  }, []);

  // Parallax Logic
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculate percentage from center (-1 to 1)
      const x = (clientX / innerWidth) * 2 - 1;
      const y = (clientY / innerHeight) * 2 - 1;
      
      setMousePos({ x, y });
  };

  return (
    <div className="w-full animate-fade-in font-sans overflow-x-hidden">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
            animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
            animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
            animation: float-delayed 7s ease-in-out infinite 1s;
        }
        .animate-ping-slow {
            animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .perspective-1000 {
            perspective: 1000px;
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee {
            animation: marquee 40s linear infinite;
        }
        .tilt-card {
            transition: transform 0.1s ease-out;
        }
        .tilt-card:hover {
            transform: perspective(1000px) rotateX(var(--rotateX)) rotateY(var(--rotateY)) scale(1.02);
            z-index: 10;
        }
        @keyframes scan-beam {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
            animation: scan-beam 3s linear infinite;
        }
        @keyframes pulse-ring {
            0% { transform: scale(0.8); opacity: 0.5; }
            100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-pulse-ring {
            animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
      `}</style>
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 bg-slate-50 min-h-[90vh] flex items-center"
      >
        
        {/* Dynamic Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ 
                 backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`, 
                 backgroundSize: '32px 32px',
                 transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)`
             }}>
        </div>

        {/* Floating Abstract Symbols - Parallax Layer Back */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none transition-transform duration-100 ease-out"
             style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}>
            <div className="absolute top-[15%] left-[5%] text-slate-200 text-6xl font-serif animate-float-slow opacity-60">∫</div>
            <div className="absolute top-[40%] right-[10%] text-slate-200 text-4xl font-serif animate-float-delayed opacity-60">∑</div>
            <div className="absolute bottom-[20%] left-[15%] text-slate-200 text-5xl font-mono animate-float-slow opacity-40">π</div>
            <div className="absolute top-[10%] right-[30%] text-slate-200 text-2xl font-mono animate-ping-slow opacity-30">{`{}`}</div>
            <div className="absolute bottom-[30%] right-[5%] w-24 h-24 border-4 border-slate-100 rounded-full animate-float-delayed opacity-40"></div>
            <div className="absolute top-[60%] left-[2%] w-16 h-16 bg-indigo-50 rounded-lg rotate-12 animate-float-slow opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Hero Content */}
            <div className="text-left space-y-8 relative transition-transform duration-100 ease-out"
                 style={{ transform: `translate(${mousePos.x * 5}px, ${mousePos.y * 5}px)` }}>
              
              {/* Live Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm animate-fade-in-up mb-2 hover:scale-105 transition-transform cursor-default">
                 <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="truncate max-w-[200px] sm:max-w-none transition-all duration-500">
                    {RECENT_ACTIVITIES[activityIndex]}
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Your AI Co-Author for <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    {displayText}
                </span>
                <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} text-indigo-600 transition-opacity duration-100`}>|</span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                Meet <strong>Scholar Lemur</strong>. The autonomous agent that conducts rigorous systematic reviews, identifies verified research gaps, and drafts LaTeX manuscripts while you sleep.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <button 
                  onClick={onStart}
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-900 px-8 font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-1 w-full sm:w-auto"
                >
                  <span className="mr-2 text-lg">Start Research Project</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                <div className="flex flex-col justify-center px-4 py-1">
                   <span className="text-2xl font-bold text-slate-900 tabular-nums">
                     {papersAnalyzed.toLocaleString()}
                   </span>
                   <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Papers Analyzed</span>
                </div>
              </div>
            </div>

            {/* Hero Illustration / Mascot - Parallax Layer Front */}
            <div className="relative flex justify-center lg:justify-end perspective-1000 transition-transform duration-100 ease-out"
                 style={{ transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)` }}>
               
               {/* Decorative Blobs */}
               <div className="absolute top-0 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
               <div className="absolute bottom-0 left-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
               <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
               
               {/* Mascot Container */}
               <div className="relative z-10 transform hover:scale-105 transition-transform duration-500 cursor-pointer group">
                  <LemurMascot className="w-80 h-80 lg:w-[480px] lg:h-[480px] drop-shadow-2xl" />
                  
                  {/* Floating Badges with slight movement */}
                  <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float-delayed z-20"
                       style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}>
                     <div className="bg-indigo-100 p-2 rounded-xl">
                       <Globe className="h-5 w-5 text-indigo-600" />
                     </div>
                     <div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Sources</p>
                       <p className="text-xs font-bold text-slate-900">IEEE • Springer • Nature</p>
                     </div>
                  </div>

                  <div className="absolute bottom-10 -left-8 bg-white/90 backdrop-blur px-4 py-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float z-20"
                       style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}>
                     <div className="bg-green-100 p-2 rounded-xl">
                       <CheckCircle2 className="h-5 w-5 text-green-600" />
                     </div>
                     <div>
                       <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verification</p>
                       <p className="text-xs font-bold text-slate-900">100% Hallucination Free</p>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* Infinite Marquee Section */}
      <section className="bg-slate-900 border-y border-slate-800 py-4 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 z-10 pointer-events-none"></div>
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {[...BREAKTHROUGHS, ...BREAKTHROUGHS, ...BREAKTHROUGHS].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 mx-8 shrink-0 opacity-80 hover:opacity-100 transition-opacity">
                      <div className="bg-indigo-500/20 p-1.5 rounded-lg">
                          <Sparkles className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-slate-200 text-sm font-medium">{item.title}</span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-wider">
                             <span>{item.category}</span>
                             <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                             <span className="text-green-400">Novelty: {item.novelty}%</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* Feature Grid with 3D Tilt */}
      <section id="how-it-works" className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">The Workflow</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Autonomous Research Pipeline</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Most AI chats. This agent <span className="text-indigo-600 font-semibold">works</span>. See how we transform a simple prompt into a rigorous academic paper.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-8 perspective-1000">
            <FeatureCard 
               title="Multi-Agent Swarm" 
               desc="We don't just Google it. We deploy specialized sub-agents to crawl IEEE Xplore, Springer, and Elsevier concurrently, extracting only high-impact factor journals."
               icon={<Network className="h-8 w-8" />}
               colorClass="text-indigo-600"
               bgHover="hover:border-indigo-200 hover:shadow-indigo-100"
               hoverBg="bg-indigo-100/50"
            />
            <FeatureCard 
               title="Reasoning Engine" 
               desc="Using Gemini 1.5 Pro's extended context window, we read full abstracts to detect contradictions and calculate a unique 'Novelty Score' for every generated topic."
               icon={<Cpu className="h-8 w-8" />}
               colorClass="text-purple-600"
               bgHover="hover:border-purple-200 hover:shadow-purple-100"
               hoverBg="bg-purple-100/50"
            />
            <FeatureCard 
               title="LaTeX Compiler" 
               desc="Forget copy-pasting Markdown. We generate valid, compilable LaTeX code with BibTeX integration, formatted for ACM or IEEE conference proceedings."
               icon={<FileText className="h-8 w-8" />}
               colorClass="text-amber-600"
               bgHover="hover:border-amber-200 hover:shadow-amber-100"
               hoverBg="bg-amber-100/50"
            />
          </div>
        </div>
      </section>

      {/* Novelty Engine Showcase Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
                   <ShieldAlert className="w-4 h-4" /> Uniqueness Verification
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                   Stop Reinventing the Wheel. <br/>
                   <span className="text-indigo-600">Check Novelty Instantly.</span>
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                   73% of papers are rejected because the work has already been done. Our <strong>Novelty Engine</strong> scans millions of papers in real-time to calculate a uniqueness score before you write a single word.
                </p>
                
                <ul className="space-y-4">
                   {[
                      "Semantic collision detection with existing literature",
                      "Identification of 'saturated' research clusters",
                      "White-space mapping for high-impact gaps",
                      "Automated 'Novelty Score' Calculation (0-100)"
                   ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                         <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0"><CheckCircle2 className="w-3 h-3 text-green-600" /></div>
                         <span className="text-slate-700 font-medium">{item}</span>
                      </li>
                   ))}
                </ul>
                
                <div className="mt-8 flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-slate-900">200M+</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wide">Papers Indexed</span>
                    </div>
                    <div className="w-px bg-slate-200 h-12"></div>
                    <div className="flex flex-col">
                        <span className="text-3xl font-bold text-slate-900">0.4s</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wide">Scan Latency</span>
                    </div>
                </div>
             </div>
             
             {/* Visual Representation of Scanner */}
             <div className="relative h-[450px] bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 overflow-hidden group">
                
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-20" 
                     style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                </div>

                {/* Central "User Idea" Node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                    <div className="relative">
                        <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] z-20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        {/* Pulse Ring */}
                        <div className="absolute inset-0 rounded-full border border-indigo-500 animate-pulse-ring z-10"></div>
                    </div>
                    <div className="mt-4 bg-slate-800/80 backdrop-blur px-3 py-1 rounded text-xs text-indigo-300 font-mono border border-indigo-500/30">
                        Analyzing Topic...
                    </div>
                </div>

                {/* Scanning Beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent shadow-[0_0_20px_#22c55e] z-10 animate-scan"></div>

                {/* "Existing Papers" Nodes */}
                {[...Array(8)].map((_, i) => (
                    <div key={i} 
                         className="absolute w-3 h-3 rounded-full bg-slate-600 transition-colors duration-500 animate-pulse"
                         style={{
                             top: `${20 + Math.random() * 60}%`,
                             left: `${10 + Math.random() * 80}%`,
                             animationDelay: `${i * 0.5}s`
                         }}
                    >
                        <div className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] text-slate-400 bg-slate-800 px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity delay-[${i * 100}ms]`}>
                            Paper Ref #{2390 + i}
                        </div>
                    </div>
                ))}
                
                {/* HUD Elements */}
                <div className="absolute top-6 left-6 text-xs font-mono text-green-400">
                    STATUS: SCANNING DATABASE<br/>
                    MODE: NOVELTY CHECK<br/>
                    TARGET: CONTRADICTIONS
                </div>
                <div className="absolute bottom-6 right-6 text-right">
                    <div className="text-4xl font-bold text-green-500 font-mono">94%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Novelty Score</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* High Speed Peer Review Showcase */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-16">
                 <h2 className="text-4xl font-bold text-slate-900 mb-4">High-Velocity Peer Review</h2>
                 <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Why wait 6 months for feedback? Get ruthless, rigorous, high-speed critique in seconds.
                 </p>
             </div>

             <div className="grid md:grid-cols-2 gap-8 items-center bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
                 
                 {/* Left: Traditional Process */}
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-slate-500" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-700">Traditional Journal Review</h4>
                            <p className="text-sm text-slate-500">Average wait time: 4-8 months</p>
                            <div className="w-64 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                <div className="w-[10%] h-full bg-slate-400"></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shadow-lg shadow-indigo-100">
                            <Zap className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">ScholarAgent Instant Review</h4>
                            <p className="text-sm text-slate-500">Average wait time: <span className="text-indigo-600 font-bold">12 seconds</span></p>
                            <div className="w-64 h-2 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                <div className="w-[95%] h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Right: Feature List */}
                 <div className="relative z-10 grid gap-4">
                     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                             <Target className="w-5 h-5 text-rose-500" />
                             <h4 className="font-bold text-slate-900">Methodology Stress Test</h4>
                        </div>
                        <p className="text-sm text-slate-600">Agents aggressively attack your statistical methods to find weak points before Reviewer #2 does.</p>
                     </div>
                     <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-2">
                             <Radar className="w-5 h-5 text-indigo-500" />
                             <h4 className="font-bold text-slate-900">Reference Integrity Check</h4>
                        </div>
                        <p className="text-sm text-slate-600">Automatic validation of 100% of bibliography entries against valid DOIs.</p>
                     </div>
                 </div>
                 
                 {/* Decorative */}
                 <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none"></div>
             </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Trust/Social Proof Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-full mb-8 animate-pulse">
            <Award className="w-6 h-6 text-yellow-400 mr-2" />
            <span className="font-bold text-sm tracking-wide text-slate-200">#1 Rated Academic Tool 2024</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-12">Trusted by Labs at World-Class Institutions</h2>
          
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="text-2xl font-serif font-bold tracking-tighter flex items-center gap-2"><Globe className="w-6 h-6" /> MIT CSAIL</div>
             <div className="text-2xl font-sans font-bold tracking-tight flex items-center gap-2"><Activity className="w-6 h-6" /> STANFORD</div>
             <div className="text-2xl font-serif font-bold flex items-center gap-2"><Search className="w-6 h-6" /> OXFORD</div>
             <div className="text-2xl font-mono font-bold flex items-center gap-2"><Zap className="w-6 h-6" /> ETH ZÜRICH</div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Internal Component for Tilt Card to isolate logic
const FeatureCard: React.FC<{title: string, desc: string, icon: React.ReactNode, colorClass: string, bgHover: string, hoverBg: string}> = ({
    title, desc, icon, colorClass, bgHover, hoverBg
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate rotation (limit to +/- 5deg)
        const xPct = (x / rect.width) - 0.5;
        const yPct = (y / rect.height) - 0.5;
        
        cardRef.current.style.setProperty('--rotateX', `${yPct * -10}deg`);
        cardRef.current.style.setProperty('--rotateY', `${xPct * 10}deg`);
    };

    const handleMouseLeave = () => {
         if (!cardRef.current) return;
         cardRef.current.style.setProperty('--rotateX', `0deg`);
         cardRef.current.style.setProperty('--rotateY', `0deg`);
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`tilt-card bg-slate-50 rounded-[2rem] p-8 border border-slate-100 transition-all duration-300 group relative overflow-hidden shadow-sm hover:shadow-2xl ${bgHover}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div className={`absolute top-0 right-0 w-40 h-40 ${hoverBg} rounded-bl-[4rem] -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500`}></div>
            
            <div className={`w-16 h-16 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mb-8 ${colorClass} shadow-sm relative z-10 group-hover:-translate-y-2 transition-transform duration-300`}>
            {icon}
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4 transform translate-z-10">{title}</h3>
            <p className="text-slate-600 leading-relaxed mb-6 transform translate-z-10">
                {desc}
            </p>
            
            <div className={`flex items-center gap-2 text-xs font-bold ${colorClass} uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0`}>
                <span>Learn More</span> <ArrowRight className="w-4 h-4" />
            </div>
        </div>
    );
};