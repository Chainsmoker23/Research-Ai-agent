
import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, FileText, Cpu, Network, CheckCircle2, Terminal, Radar, ShieldAlert, FlaskConical, Binary, Play, LayoutTemplate, SearchCheck, BarChart3, TestTube2, Download, ExternalLink, Bot } from 'lucide-react';
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

const BREAKTHROUGHS = [
    { title: "Optimizing Transformer Attention Heads for Sparse Code", category: "AI/ML", novelty: 94 },
    { title: "Perovskite Solar Cells: Stability at 85°C", category: "Materials", novelty: 89 },
    { title: "CRISPR-Cas9 Off-Target Detection via GNNs", category: "BioTech", novelty: 91 },
    { title: "Zero-Knowledge Proofs for Decentralized Identity", category: "Crypto", novelty: 88 },
    { title: "Micro-plastic Filtration using Graphene Oxide", category: "Env. Sci", novelty: 92 },
];

const METHODOLOGIES = [
    {
        id: "dsr",
        title: "Design Science Research",
        icon: <LayoutTemplate className="w-6 h-6 text-indigo-600" />,
        desc: "Iterative artifact generation. The agent defines the problem, builds a theoretical artifact (algorithm/framework), and simulates evaluation metrics.",
        tags: ["Artifact Creation", "Heuristic Eval", "CS & Engineering"]
    },
    {
        id: "slr",
        title: "Systematic Literature Review",
        icon: <SearchCheck className="w-6 h-6 text-emerald-600" />,
        desc: "Strict PRISMA-compliant protocol. We aggregate 200+ sources, apply exclusion criteria, and synthesize themes via thematic analysis.",
        tags: ["PRISMA", "Meta-Analysis", "All Fields"]
    },
    {
        id: "emp",
        title: "Quantitative Empirical Study",
        icon: <BarChart3 className="w-6 h-6 text-amber-600" />,
        desc: "Statistical hypothesis testing. The agent generates synthetic datasets based on literature parameters and runs regression/ANOVA models.",
        tags: ["Statistical Modeling", "Hypothesis Testing", "Social Sci"]
    },
    {
        id: "sim",
        title: "Simulation & Modeling",
        icon: <TestTube2 className="w-6 h-6 text-rose-600" />,
        desc: "Mathematical modeling of physical systems. We use differential equations and Monte Carlo simulations to predict system behavior.",
        tags: ["Physics", "Economics", "Theoretical Bio"]
    }
];

const SHOWCASE_PAPERS = [
    {
        id: 1,
        title: "Attention is Not All You Need: Sparse Activations in Vision Transformers",
        author: "ScholarAgent v2.1",
        journal: "Submitted to CVPR 2025",
        field: "Computer Vision",
        abstract: "While Vision Transformers (ViTs) have achieved state-of-the-art results, their quadratic complexity limits scalability. This paper proposes 'SparseViT', a novel architecture introducing a dynamic token pruning mechanism based on attention scores. We demonstrate a 40% reduction in FLOPs with negligible accuracy loss on ImageNet-1K. Our theoretical analysis proves that high-frequency components in early layers are redundant.",
        citations: 0,
        latexClass: "IEEEtran",
        color: "indigo"
    },
    {
        id: 2,
        title: "Thermodynamic Stability of Lead-Free Perovskites: A DFT Study",
        author: "ScholarAgent v2.1",
        journal: "Journal of Materials Chemistry A",
        field: "Materials Science",
        abstract: "Toxicity remains a barrier for commercializing perovskite solar cells. We conduct a systematic Density Functional Theory (DFT) investigation into Sn-based perovskites doped with Ge. Our simulation results indicate that Ge-doping increases the activation energy for degradation by 0.4 eV, suggesting significantly enhanced thermal stability. We propose a new lattice structure that minimizes strain.",
        citations: 0,
        latexClass: "revtex4-2",
        color: "emerald"
    },
    {
        id: 3,
        title: "Algorithmic Bias in Large Language Model Hiring Pipelines",
        author: "ScholarAgent v2.1",
        journal: "ACM CHI 2025",
        field: "Social Computing",
        abstract: "Automated hiring systems are increasingly powered by LLMs. Through a mixed-methods audit of three open-source hiring agents, we reveal a statistically significant preference for candidates with Western-sounding names (p < 0.001) despite identical qualifications. We frame this within Value Sensitive Design (VSD) and propose a 'Blind-Token' intervention framework.",
        citations: 0,
        latexClass: "acmart",
        color: "amber"
    }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  // Typing Effect State
  const [domainIndex, setDomainIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Showcase State
  const [activePaperIndex, setActivePaperIndex] = useState(0);

  // Parallax Mouse State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  // Typing Effect Logic
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
    <div className="w-full font-sans overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 15s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes scan-radar {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-scan-radar { animation: scan-radar 3s linear infinite; }
        
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-y { animation: float-y 6s ease-in-out infinite; }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }

        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .grid-bg {
            background-image: linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
        }

        .text-glow {
            text-shadow: 0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(255, 255, 255, 0.2);
        }
        
        .text-balance {
            text-wrap: balance;
        }
      `}</style>
      
      {/* GLOBAL ATMOSPHERE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Pastel Gradients */}
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px] animate-blob" />
         <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px] animate-blob animation-delay-2000" />
         <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      {/* HERO SECTION */}
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
                   
                   {/* -- NEW CREATIVE ELEMENTS AROUND MASCOT -- */}
                   
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

      {/* INFINITE SCROLL */}
      <section className="border-y border-slate-200 bg-white py-4 overflow-hidden relative z-10 shadow-sm">
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {[...BREAKTHROUGHS, ...BREAKTHROUGHS, ...BREAKTHROUGHS].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 mx-12 shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-default group">
                      <div className="bg-indigo-50 p-1.5 rounded-lg group-hover:bg-indigo-100 transition-colors">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-slate-800 text-sm font-bold">{item.title}</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{item.category} • NOVELTY: <span className="text-emerald-600">{item.novelty}%</span></span>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* INTELLIGENCE GRID */}
      <section className="py-24 sm:py-32 relative z-10 bg-slate-50/50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 sm:mb-20">
               <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-4 block">Proprietary Architecture</span>
               <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6 text-balance">Built Different.</h2>
               <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto text-balance">
                  We don't just wrap a chatbot. We orchestrate a swarm of specialized agents—Reviewers, Statisticians, and Drafters—working in consensus.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
               <FeatureCard 
                  icon={<Network className="w-8 h-8 text-indigo-600" />}
                  color="bg-indigo-50 border-indigo-100"
                  title="Chain-of-Verification"
                  desc="Every claim is cross-referenced against 200M+ papers in OpenAlex and Semantic Scholar before text generation begins."
               />
               <FeatureCard 
                  icon={<ShieldAlert className="w-8 h-8 text-purple-600" />}
                  color="bg-purple-50 border-purple-100"
                  title="Multi-Agent Consensus"
                  desc="A 'Devil's Advocate' agent challenges the methodology of the 'Drafter' agent to simulate rigorous peer review."
               />
               <FeatureCard 
                  icon={<Cpu className="w-8 h-8 text-blue-600" />}
                  color="bg-blue-50 border-blue-100"
                  title="Gemini 3.0 Long Context"
                  desc="We load hundreds of full-text PDF citations into the context window to synthesize deep, non-obvious connections."
               />
            </div>
         </div>
      </section>

      {/* NEW: METHODOLOGY FRAMEWORKS */}
      <section className="py-24 bg-white border-y border-slate-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
               <span className="text-emerald-600 font-bold text-sm tracking-widest uppercase mb-4 block">Methodology Engine</span>
               <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 text-balance">Select Your Research Approach</h2>
               <p className="text-slate-500 max-w-2xl mx-auto text-balance">
                  ScholarAgent adheres to strict scientific protocols. Choose the methodology that fits your domain.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {METHODOLOGIES.map((m) => (
                    <div key={m.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-default">
                        <div className="mb-4 bg-white w-12 h-12 rounded-lg border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm group-hover:bg-indigo-50 group-hover:border-indigo-100">
                            {m.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{m.title}</h3>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed h-16">{m.desc}</p>
                        <div className="flex flex-wrap gap-2">
                            {m.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-medium group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* NEW: PAPER SHOWCASE */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                   <span className="text-amber-600 font-bold text-sm tracking-widest uppercase mb-2 block">Output Showcase</span>
                   <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Research We've Generated</h2>
                </div>
                <div className="flex gap-2">
                   <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Computer Science</span>
                   <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Materials</span>
                   <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">Social Sci</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* List Column */}
                <div className="lg:w-1/3 space-y-4">
                    {SHOWCASE_PAPERS.map((paper, idx) => (
                        <button 
                            key={paper.id}
                            onClick={() => setActivePaperIndex(idx)}
                            className={`w-full text-left p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group
                                ${activePaperIndex === idx 
                                    ? 'bg-white border-indigo-600 shadow-lg scale-[1.02] z-10' 
                                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 opacity-80 hover:opacity-100'}
                            `}
                        >
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${activePaperIndex === idx ? `bg-${paper.color}-500` : 'bg-transparent'}`}></div>
                            <div className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">{paper.field}</div>
                            <h3 className={`font-bold text-sm sm:text-base mb-2 ${activePaperIndex === idx ? 'text-slate-900' : 'text-slate-700'}`}>
                                {paper.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <FileText className="w-3 h-3" />
                                {paper.latexClass}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Preview Column */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden h-full flex flex-col min-h-[500px]">
                        {/* Fake Browser Header */}
                        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400/80 border border-red-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400/80 border border-amber-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400/80 border border-green-500/20"></div>
                            </div>
                            <div className="flex-1 bg-white h-8 rounded border border-slate-200 flex items-center px-3 text-xs text-slate-500 shadow-inner">
                                <ExternalLink className="w-3 h-3 mr-2 opacity-50" />
                                <span className="opacity-70">scholaragent.ai/preview/{SHOWCASE_PAPERS[activePaperIndex].id}/pdf</span>
                            </div>
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Download className="w-4 h-4" /></button>
                        </div>

                        {/* PDF Preview Area */}
                        <div className="flex-1 p-8 sm:p-12 bg-white relative">
                             <div className="max-w-2xl mx-auto animate-fade-in key={activePaperIndex}">
                                 {/* Paper Header */}
                                 <div className="text-center mb-8 border-b border-slate-100 pb-8">
                                     <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight text-balance">
                                         {SHOWCASE_PAPERS[activePaperIndex].title}
                                     </h1>
                                     <div className="text-sm text-slate-600 font-serif italic mb-2">
                                         {SHOWCASE_PAPERS[activePaperIndex].author}, Department of Automated Science
                                     </div>
                                     <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                         {SHOWCASE_PAPERS[activePaperIndex].journal}
                                     </div>
                                 </div>

                                 {/* Abstract */}
                                 <div className="mb-8">
                                     <div className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2 text-center">Abstract</div>
                                     <p className="text-sm sm:text-base font-serif text-slate-700 leading-relaxed text-justify">
                                         <span className="font-bold text-slate-900 mr-1">{SHOWCASE_PAPERS[activePaperIndex].abstract.split(' ')[0]}</span>
                                         {SHOWCASE_PAPERS[activePaperIndex].abstract.substring(SHOWCASE_PAPERS[activePaperIndex].abstract.indexOf(' ') + 1)}
                                     </p>
                                 </div>

                                 {/* Fake Columns */}
                                 <div className="grid grid-cols-2 gap-6 opacity-30 select-none pointer-events-none">
                                     <div className="space-y-4">
                                         <div className="h-4 bg-slate-800 w-3/4 mb-2"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-5/6"></div>
                                         <div className="h-24 bg-slate-200 w-full mt-4 rounded"></div>
                                     </div>
                                      <div className="space-y-4">
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                         <div className="h-2 bg-slate-400 w-4/6"></div>
                                          <div className="h-4 bg-slate-800 w-1/2 mt-6 mb-2"></div>
                                         <div className="h-2 bg-slate-400 w-full"></div>
                                     </div>
                                 </div>
                                 
                                 {/* Watermark */}
                                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                     <div className="text-slate-100 font-bold text-6xl -rotate-45 uppercase border-4 border-slate-100 p-8 rounded-xl opacity-50 select-none">
                                         Scholar Agent
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* FEATURE: REVIEWER AGENT HUD (Removed Reviewer #2 mention here as well) */}
      <section className="py-24 sm:py-32 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold mb-8">
                <ShieldAlert className="w-4 h-4" /> ADVERSARIAL_REVIEW
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Rigorous Peer Review</h2>
            <p className="text-slate-600 text-base sm:text-lg mb-12 text-balance max-w-2xl mx-auto">
                We simulate a full review board including methodology experts and citation police to find flaws before real reviewers do.
            </p>
            
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-1 shadow-2xl overflow-hidden relative group text-left mx-auto">
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20 border-[2px] border-rose-500/20 rounded-2xl"></div>
                <div className="absolute top-4 left-4 text-[10px] font-mono text-rose-400 animate-pulse z-20 font-bold tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                    SCANNING FOR ERRORS...
                </div>
                
                <div className="bg-[#0f172a] p-4 sm:p-8 font-mono text-xs sm:text-sm relative z-10 overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <LemurMascot className="w-24 h-24 sm:w-32 sm:h-32 opacity-20 grayscale" />
                    </div>
                    
                    <div className="space-y-6 mt-8 sm:mt-0 max-w-2xl mx-auto">
                        {/* Chat bubbles: Responsive Layout */}
                        <div className="flex flex-col gap-2 opacity-60">
                            <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold tracking-wider">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                Input Methodology
                            </div>
                            <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-lg text-slate-300 font-mono text-xs leading-relaxed">
                                &gt; We compare our GNN against a standard ResNet-50 baseline on the ImageNet validation set...
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-rose-400 text-xs uppercase font-bold tracking-wider">
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></div>
                                AI Critique
                            </div>
                            <div className="bg-rose-950/30 border border-rose-900/50 p-5 rounded-lg text-rose-200 shadow-lg backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                                <div className="text-rose-400 font-bold block text-xs mb-3 tracking-widest border-b border-rose-900/50 pb-2">
                                    [CRITICAL FLAW DETECTED]
                                </div>
                                <p className="mb-4 leading-relaxed">
                                    Your baseline comparison is fundamentally unfair. You cannot compare a GNN to ResNet-50 without normalizing parameter counts.
                                </p>
                                <div className="flex items-center gap-2 text-white bg-rose-600/20 border border-rose-600/30 px-3 py-1.5 rounded text-[10px] w-fit">
                                    <ShieldAlert className="w-3 h-3" />
                                    <span>SUGGESTION: Retest with ViT-L matching params</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* RESEARCH SCOPE */}
      <section className="py-24 bg-slate-50">
         <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white rounded-3xl p-8 sm:p-16 flex flex-col md:flex-row gap-8 sm:gap-12 items-center relative overflow-hidden shadow-xl border border-slate-100">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[60px]"></div>
               
               <div className="flex-1 relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Scientific Integrity Protocol</h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                     ScholarAgent is restricted to <span className="text-indigo-600 font-bold">Theoretical</span> and <span className="text-indigo-600 font-bold">Simulation-based</span> research. We do not fabricate wet-lab data.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 font-bold">
                     <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><CheckCircle2 className="w-4 h-4 text-green-500" /> Math</span>
                     <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><CheckCircle2 className="w-4 h-4 text-green-500" /> CS</span>
                     <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded"><CheckCircle2 className="w-4 h-4 text-green-500" /> Social Sci</span>
                  </div>
               </div>
               
               <div className="flex-1 w-full relative z-10">
                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                       <div className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-200">
                           <FlaskConical className="w-5 h-5 text-slate-400" />
                           <span className="text-slate-500 text-sm font-medium">Physical Experiments</span>
                           <span className="ml-auto text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded font-bold">UNSUPPORTED</span>
                       </div>
                       <div className="flex items-center gap-3">
                           <Binary className="w-5 h-5 text-indigo-600" />
                           <span className="text-slate-900 text-sm font-bold">Computational / Review</span>
                           <span className="ml-auto text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200 font-bold">OPTIMIZED</span>
                       </div>
                   </div>
               </div>
            </div>
         </div>
      </section>

      <PricingSection />
    </div>
  );
};

// UI Components
const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, color: string }> = ({ icon, title, desc, color }) => (
    <div className={`p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}>
        <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${color} group-hover:scale-110 shadow-sm`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed text-balance">
            {desc}
        </p>
    </div>
);
