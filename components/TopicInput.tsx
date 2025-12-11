import React, { useState } from 'react';
import { Search, ArrowRight, Globe } from 'lucide-react';

interface TopicInputProps {
  onSearch: (topic: string) => void;
  isLoading: boolean;
}

export const TopicInput: React.FC<TopicInputProps> = ({ onSearch, isLoading }) => {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onSearch(domain);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto text-center space-y-8 animate-fade-in">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          ScholarAgent <span className="text-indigo-600">Pro</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Autonomous discovery of novel research gaps. Enter a broad domain, and the agent will identify unexplored topics and conduct a massive systematic review (50+ sources).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Globe className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="Enter Research Domain (e.g., Deep Reinforcement Learning, Materials Science...)"
          className="block w-full pl-12 pr-12 py-5 bg-white border border-slate-200 rounded-xl text-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!domain.trim() || isLoading}
          className="absolute inset-y-2 right-2 px-6 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowRight className="h-5 w-5" />
          )}
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500">
        <span>Trending Domains:</span>
        <button onClick={() => setDomain("Generative AI in Healthcare")} className="hover:text-indigo-600 underline decoration-dotted">GenAI Healthcare</button>
        <span className="text-slate-300">•</span>
        <button onClick={() => setDomain("Solid State Batteries")} className="hover:text-indigo-600 underline decoration-dotted">Solid State Batteries</button>
        <span className="text-slate-300">•</span>
        <button onClick={() => setDomain("Post-Quantum Cryptography")} className="hover:text-indigo-600 underline decoration-dotted">Post-Quantum Crypto</button>
      </div>
    </div>
  );
};