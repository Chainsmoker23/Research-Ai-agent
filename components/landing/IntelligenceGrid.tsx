
import React from 'react';
import { Network, ShieldAlert, Cpu } from 'lucide-react';

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

export const IntelligenceGrid: React.FC = () => {
  return (
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
  );
};
