
import React from 'react';
import { Sparkles } from 'lucide-react';

const BREAKTHROUGHS = [
    { title: "Optimizing Transformer Attention Heads for Sparse Code", category: "AI/ML", novelty: 94 },
    { title: "Perovskite Solar Cells: Stability at 85°C", category: "Materials", novelty: 89 },
    { title: "CRISPR-Cas9 Off-Target Detection via GNNs", category: "BioTech", novelty: 91 },
    { title: "Zero-Knowledge Proofs for Decentralized Identity", category: "Crypto", novelty: 88 },
    { title: "Micro-plastic Filtration using Graphene Oxide", category: "Env. Sci", novelty: 92 },
];

export const InfiniteScroll: React.FC = () => {
  return (
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
  );
};
