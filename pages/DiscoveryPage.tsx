
import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Globe, Sparkles, Zap, Atom, ShieldCheck, ArrowLeft } from 'lucide-react';

interface DiscoveryPageProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ onSearch, isLoading, onBack }) => {
  const [domain, setDomain] = useState('');
  const [nodes, setNodes] = useState<{x: number, y: number, r: number, vx: number, vy: number}[]>([]);

  // Neural Mesh Animation Logic
  useEffect(() => {
     const newNodes = Array.from({ length: 20 }).map(() => ({
         x: Math.random() * 100,
         y: Math.random() * 100,
         r: Math.random() * 2 + 1,
         vx: (Math.random() - 0.5) * 0.2,
         vy: (Math.random() - 0.5) * 0.2
     }));
     setNodes(newNodes);

     const interval = setInterval(() => {
         setNodes(prev => prev.map(node => {
             let nx = node.x + node.vx;
             let ny = node.y + node.vy;
             if (nx < 0 || nx > 100) node.vx *= -1;
             if (ny < 0 || ny > 100) node.vy *= -1;
             return { ...node, x: nx, y: ny };
         }));
     }, 50);

     return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onSearch(domain);
    }
  };

  return (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center relative overflow-hidden animate-fade-in px-4">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium text-sm">Back</span>
      </button>

      {/* Neural Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
          <svg className="w-full h-full">
             {nodes.map((n, i) => (
                 <React.Fragment key={i}>
                     <circle cx={`${n.x}%`} cy={`${n.y}%`} r={n.r} fill="#6366f1" opacity="0.3" />
                     {nodes.map((n2, j) => {
                         // Simple distance check in % (rough approx)
                         const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
                         if (i < j && dist < 15) {
                             return <line key={`${i}-${j}`} x1={`${n.x}%`} y1={`${n.y}%`} x2={`${n2.x}%`} y2={`${n2.y}%`} stroke="#6366f1" strokeWidth="0.5" opacity={(15 - dist) / 15 * 0.2} />
                         }
                         return null;
                     })}
                 </React.Fragment>
             ))}
          </svg>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
           <div className="flex justify-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-bounce-slow border border-indigo-100">
                    <Sparkles className="w-3 h-3" /> System Ready
                </div>
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider animate-fade-in border border-green-100">
                    <ShieldCheck className="w-3 h-3" /> Novelty Check Active
                </div>
           </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Discovery <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Engine</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Autonomous discovery of novel research gaps. Initialize the agent to conduct a massive systematic review and high-speed peer review.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative group max-w-2xl mx-auto transform transition-all duration-300 hover:scale-[1.02]">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Globe className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors animate-pulse" />
             </div>
            <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="Enter Research Domain (e.g., Deep Reinforcement Learning...)"
                className="block w-full pl-12 pr-14 md:pr-12 py-5 bg-white text-slate-900 border border-slate-200 rounded-xl text-base md:text-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={isLoading}
                autoFocus
            />
            <button
                type="submit"
                disabled={!domain.trim() || isLoading}
                className="absolute inset-y-2 right-2 px-6 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[3rem] shadow-lg group-hover:shadow-indigo-500/30"
            >
                {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                <ArrowRight className="h-5 w-5" />
                )}
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 pt-8">
            <span className="w-full text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Trending Investigations</span>
            
            <SuggestionPill 
               label="GenAI Healthcare" 
               icon={<Atom className="w-3 h-3" />} 
               onClick={() => setDomain("Generative AI in Healthcare")} 
            />
             <SuggestionPill 
               label="Solid State Batteries" 
               icon={<Zap className="w-3 h-3" />} 
               onClick={() => setDomain("Solid State Batteries")} 
            />
             <SuggestionPill 
               label="Post-Quantum Crypto" 
               icon={<LockIcon />} 
               onClick={() => setDomain("Post-Quantum Cryptography")} 
            />
        </div>
      </div>
    </div>
  );
};

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
)

const SuggestionPill: React.FC<{label: string, icon: React.ReactNode, onClick: () => void}> = ({ label, icon, onClick }) => (
    <button 
        onClick={onClick}
        className="flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-full text-xs font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
    >
        <span className="text-indigo-400">{icon}</span>
        {label}
    </button>
);
