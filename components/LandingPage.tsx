import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, FileText, Cpu, Network, CheckCircle2, Activity, Globe, Search, Award, Zap, Radar, Clock, Target, ShieldAlert, XCircle, FlaskConical, Binary, Sigma, BrainCircuit, Terminal, FileCode, Eraser, Scale, ChevronRight, Play, LayoutTemplate, SearchCheck, BarChart3, TestTube2, Download, ExternalLink } from 'lucide-react';
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
        .animate-scan-radar { animation: scan-radar 4s linear infinite; }
        
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-y { animation: float-y 6s ease-in-out infinite; }

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
            background-image: linear-gradient(rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
            background-size: 40px 40px;
        }

        .text-glow {
            text-shadow: 0 0 40px rgba(255, 255, 255, 0.8);
        }
      `}</style>
      
      {/* GLOBAL ATMOSPHERE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Pastel Gradients */}
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] animate-blob" />
         <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-[120px] animate-blob animation-delay-2000" />
         <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-200/40 rounded-full blur-[120px] animate-blob animation-delay-4000" />
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-600 shadow-sm animate-fade-in-up">
                 <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>Version 2.0 Now Live: Reasoning Engine Active</span>
              </div>
              
              <h1 className="text-5xl lg:text-8xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Research <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x">
                   Autonomous
                </span>
              </h1>
              
              <div className="text-2xl md:text-3xl font-light text-slate-500 h-20">
                <span>Generating </span>
                <span className="text-slate-900 font-medium border-b-2 border-indigo-500 pb-1">{displayText}</span>
                <span className={`${cursorVisible ? 'opacity-100' : 'opacity-0'} text-indigo-500`}>_</span>
              </div>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                 The world's first agentic workflow for academic publishing. From systematic review to LaTeX manuscript in minutes, powered by <strong className="text-slate-900">Gemini 3.0 Pro</strong> reasoning chains.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button 
                  onClick={onStart}
                  className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-8 font-bold text-white transition-all duration-300 hover:bg-slate-800 hover:shadow-2xl hover:scale-105 w-full sm:w-auto shadow-indigo-200"
                >
                  <span className="mr-2 text-lg">Initialize Agent</span>
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
                   <LemurMascot className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px] drop-shadow-2xl" />
                   
                   {/* Orbiting Elements */}
                   <div className="absolute -top-4 -right-4 sm:-top-10 sm:-right-10 glass-panel p-3 sm:p-4 rounded-2xl animate-float-delayed">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                            <BrainCircuit className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                         </div>
                         <div>
                            <div className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest">Reasoning</div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900">Gemini 3.0 Pro</div>
                         </div>
                      </div>
                   </div>

                   <div className="absolute bottom-10 -left-6 sm:bottom-20 sm:-left-10 glass-panel p-3 sm:p-4 rounded-2xl animate-float">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                         </div>
                         <div>
                            <div className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest">Validation</div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900">Hallucination Free</div>
                         </div>
                      </div>
                   </div>
               </div>
            </div>

          </div>
        </div>
      </section>

      {/* INFINITE SCROLL */}
      <section className="border-y border-slate-200 bg-white py-4 overflow-hidden relative z-10">
          <div className="flex animate-marquee hover:[animation-play-state:paused]">
              {[...BREAKTHROUGHS, ...BREAKTHROUGHS, ...BREAKTHROUGHS].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 mx-12 shrink-0 opacity-70 hover:opacity-100 transition-opacity cursor-default">
                      <div className="bg-indigo-50 p-1 rounded-md">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex flex-col">
                          <span className="text-slate-800 text-sm font-semibold">{item.title}</span>
                          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{item.category} • NOVELTY: {item.novelty}%</span>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* INTELLIGENCE GRID */}
      <section className="py-24 sm:py-32 relative z-10 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16 sm:mb-20">
               <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-4 block">Proprietary Architecture</span>
               <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-6">Built Different.</h2>
               <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto">
                  We don't just wrap a chatbot. We orchestrate a swarm of specialized agents—Reviewers, Statisticians, and Drafters—working in consensus.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
               <FeatureCard 
                  icon={<BrainCircuit className="w-8 h-8 text-indigo-600" />}
                  color="bg-indigo-50 border-indigo-100"
                  title="Chain-of-Verification"
                  desc="Every claim is cross-referenced against 200M+ papers in OpenAlex and Semantic Scholar before text generation begins."
               />
               <FeatureCard 
                  icon={<Network className="w-8 h-8 text-purple-600" />}
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
               <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Select Your Research Approach</h2>
               <p className="text-slate-500 max-w-2xl mx-auto">
                  ScholarAgent adheres to strict scientific protocols. Choose the methodology that fits your domain.
               </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {METHODOLOGIES.map((m) => (
                    <div key={m.id} className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-lg transition-all duration-300 group cursor-default">
                        <div className="mb-4 bg-white w-12 h-12 rounded-lg border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                            {m.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{m.title}</h3>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed h-16">{m.desc}</p>
                        <div className="flex flex-wrap gap-2">
                            {m.tags.map(tag => (
                                <span key={tag} className="text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-medium">
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
                                    ? 'bg-white border-indigo-600 shadow-lg scale-105 z-10' 
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
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="flex-1 bg-white h-8 rounded border border-slate-200 flex items-center px-3 text-xs text-slate-500">
                                <ExternalLink className="w-3 h-3 mr-2" />
                                https://scholaragent.ai/preview/{SHOWCASE_PAPERS[activePaperIndex].id}/pdf
                            </div>
                            <button className="text-slate-400 hover:text-indigo-600"><Download className="w-4 h-4" /></button>
                        </div>

                        {/* PDF Preview Area */}
                        <div className="flex-1 p-8 sm:p-12 bg-white relative">
                             <div className="max-w-2xl mx-auto animate-fade-in key={activePaperIndex}">
                                 {/* Paper Header */}
                                 <div className="text-center mb-8 border-b border-slate-100 pb-8">
                                     <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-4 leading-tight">
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
                                     <div className="text-slate-100 font-bold text-6xl -rotate-45 uppercase border-4 border-slate-100 p-8 rounded-xl opacity-50">
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

      {/* SPLIT SECTION: LATEX AUTOMATION */}
      <section className="py-24 sm:py-32 bg-white border-y border-slate-100 relative overflow-hidden">
         <div className="absolute inset-0 grid-bg opacity-30"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
               
               {/* Left Content */}
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-8">
                     <Terminal className="w-4 h-4" /> LATEX_COMPILER_V2
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                     Zero Syntax Errors. <br/>
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Guaranteed.</span>
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
                     Forget missing brackets and broken BibTeX. Our engine generates perfectly valid LaTeX code, compiles it in the cloud, and delivers a pristine PDF.
                  </p>
                  
                  <div className="space-y-4">
                     {['Automatic Package Management', 'BibTeX Formatting & Citation Keys', 'Float Placement Optimization'].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 group">
                           <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100 group-hover:border-green-300 transition-colors">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                           </div>
                           <span className="text-slate-700 font-medium">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right Visual: Code vs PDF */}
               <div className="relative group perspective-1000 hidden sm:block">
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden h-[400px] flex">
                     
                     {/* Code Side (Dark Mode for Code) */}
                     <div className="w-1/2 p-6 border-r border-slate-700 font-mono text-[10px] text-slate-400 leading-relaxed overflow-hidden bg-[#0d1117]">
                        <div className="text-indigo-400 mb-2 font-bold">// Source Code</div>
                        <p><span className="text-purple-400">\documentclass</span><span className="text-yellow-200">&#123;article&#125;</span></p>
                        <p><span className="text-purple-400">\usepackage</span><span className="text-yellow-200">&#123;amsmath&#125;</span></p>
                        <p className="opacity-50">...</p>
                        <p><span className="text-purple-400">\begin</span><span className="text-yellow-200">&#123;document&#125;</span></p>
                        <p><span className="text-purple-400">\section</span><span className="text-yellow-200">&#123;Introduction&#125;</span></p>
                        <p>Recent advances in large language models...</p>
                        <p className="mt-4 text-red-400">Error: Missing $ inserted</p>
                     </div>

                     {/* PDF Side (Light Mode for PDF) */}
                     <div className="w-1/2 bg-white p-6 relative">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] px-2 py-1 font-bold">PDF</div>
                        <div className="space-y-4 opacity-80 scale-90 origin-top">
                           <div className="h-4 w-3/4 bg-slate-800 rounded mx-auto mb-6"></div>
                           <div className="h-2 w-full bg-slate-200 rounded"></div>
                           <div className="h-2 w-full bg-slate-200 rounded"></div>
                           <div className="h-2 w-5/6 bg-slate-200 rounded"></div>
                           <div className="grid grid-cols-2 gap-4 mt-6">
                              <div className="h-20 bg-slate-100 rounded border border-slate-200"></div>
                              <div className="space-y-2">
                                 <div className="h-2 w-full bg-slate-200 rounded"></div>
                                 <div className="h-2 w-full bg-slate-200 rounded"></div>
                              </div>
                           </div>
                        </div>
                        
                        {/* "Processing" Overlay */}
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold">
                              <CheckCircle2 className="w-4 h-4 text-green-400" /> Compiled (0.4s)
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
                
               {/* Mobile fallback for Code vs PDF */}
               <div className="block sm:hidden relative bg-slate-900 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                        <span className="text-indigo-400 text-xs font-mono">// Source</span>
                        <ArrowRight className="text-slate-500 w-4 h-4" />
                        <span className="text-white text-xs font-bold">PDF</span>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 w-3/4 bg-slate-700 rounded"></div>
                        <div className="h-2 w-full bg-slate-700 rounded"></div>
                        <div className="h-20 bg-white/10 rounded border border-slate-700 mt-2 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                    </div>
               </div>

            </div>
         </div>
      </section>

      {/* FEATURE: NOVELTY RADAR */}
      <section className="py-24 sm:py-32 relative overflow-hidden bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
               
               {/* Radar Visual */}
               <div className="order-2 lg:order-1 relative flex justify-center py-8 lg:py-0">
                  {/* Container: Responsive Size */}
                  <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] border border-slate-200 rounded-full flex items-center justify-center bg-white shadow-2xl shrink-0">
                     {/* Rotating Sweep */}
                     <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-indigo-100 to-transparent animate-scan-radar z-0 opacity-50"></div>
                     <div className="absolute top-0 left-1/2 w-px h-1/2 bg-indigo-500 origin-bottom animate-scan-radar z-10 shadow-[0_0_10px_#6366f1]"></div>
                     
                     {/* Rings: Responsive Insets (percentages) */}
                     <div className="absolute inset-[12.5%] border border-slate-100 rounded-full"></div>
                     <div className="absolute inset-[25%] border border-slate-100 rounded-full"></div>
                     <div className="absolute inset-[37.5%] border border-slate-100 rounded-full"></div>
                     
                     {/* Center Mascot: Responsive Size */}
                     <div className="relative z-20 bg-white p-2 rounded-full border border-indigo-100 shadow-xl">
                        <LemurMascot className="w-16 h-16 sm:w-24 sm:h-24" variant="telescope" />
                     </div>

                     {/* Blips: Percentage Positioning */}
                     <div className="absolute top-[20%] right-[20%] w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-ping"></div>
                     <div className="absolute bottom-[25%] left-[15%] w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-ping animation-delay-2000"></div>

                     {/* HUD Text: Responsive Size & Position */}
                     <div className="absolute bottom-[10%] right-[10%] text-right">
                        <div className="text-2xl sm:text-4xl font-mono font-bold text-slate-900">94%</div>
                        <div className="text-[8px] sm:text-[10px] text-indigo-600 uppercase tracking-widest font-bold">Novelty Score</div>
                     </div>
                  </div>
               </div>

               {/* Right Content */}
               <div className="order-1 lg:order-2">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-6 sm:mb-8">
                     <Radar className="w-4 h-4" /> GAP_ANALYSIS_ENGINE
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                     Novelty Verification. <br/>
                     <span className="text-slate-400">Stop Reinventing.</span>
                  </h2>
                  <p className="text-slate-600 text-base sm:text-lg mb-8 leading-relaxed">
                     73% of papers are rejected for lack of novelty. Our engine scans 200M+ papers in real-time to ensure your research gap is genuine before you write a single word.
                  </p>
                  <ul className="space-y-4">
                     {["Semantic Collision Detection", "Saturation Heatmaps", "White-Space Identification"].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-sm">
                           <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-sm"></div>
                           {item}
                        </li>
                     ))}
                  </ul>
               </div>

            </div>
         </div>
      </section>

      {/* FEATURE: REVIEWER AGENT HUD */}
      <section className="py-24 sm:py-32 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold mb-8">
                <ShieldAlert className="w-4 h-4" /> ADVERSARIAL_REVIEW
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Meet "Reviewer #2"</h2>
            <p className="text-slate-600 text-base sm:text-lg mb-12">
                We built an AI specifically designed to reject your paper. It finds logical fallacies and weak baselines so the real reviewers don't.
            </p>
            
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-1 shadow-2xl overflow-hidden relative group text-left mx-auto">
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20 border-[2px] border-rose-500/20 rounded-2xl"></div>
                <div className="absolute top-4 left-4 text-[10px] font-mono text-rose-400 animate-pulse z-20 font-bold">SCANNING FOR ERRORS...</div>
                
                <div className="bg-[#0f172a] p-4 sm:p-8 font-mono text-xs sm:text-sm relative z-10 overflow-hidden min-h-[300px]">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <LemurMascot className="w-24 h-24 sm:w-32 sm:h-32 opacity-20 grayscale" />
                    </div>
                    
                    <div className="space-y-4 mt-6 sm:mt-0">
                        {/* Chat bubbles: Responsive Layout */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 opacity-60">
                            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center shrink-0 text-slate-300 self-start">User</div>
                            <div className="bg-slate-800 p-3 rounded-lg text-slate-300 w-full sm:w-3/4">
                                Here is my methodology section proposing a new GNN architecture...
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row-reverse gap-2 sm:gap-4">
                            <div className="w-8 h-8 rounded bg-rose-900/40 border border-rose-500/50 flex items-center justify-center shrink-0 text-rose-500 font-bold self-start">AI</div>
                            <div className="bg-rose-950/20 border border-rose-900/50 p-4 rounded-lg text-rose-200 w-full sm:w-3/4 shadow-lg">
                                <span className="text-rose-400 font-bold block text-xs mb-2">[CRITICAL FLAW DETECTED]</span>
                                Your baseline comparison is unfair. You used ResNet-50 for the control but ViT-L for your method. <br/><br/>
                                <span className="text-white bg-rose-600 px-1 rounded-sm text-[10px]">Suggestion:</span> Retest control group with matching parameter count.
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
                     <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Math</span>
                     <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> CS</span>
                     <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Social Sci</span>
                  </div>
               </div>
               
               <div className="flex-1 w-full relative z-10">
                   <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
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
        <div className={`mb-6 w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${color} group-hover:scale-110`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">
            {desc}
        </p>
    </div>
);