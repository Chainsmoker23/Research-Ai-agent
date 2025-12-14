
import React from 'react';
import { LayoutTemplate, SearchCheck, BarChart3, TestTube2 } from 'lucide-react';

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

export const MethodologyGrid: React.FC = () => {
  return (
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
  );
};
