import React from 'react';
import { ResearchTopic } from '../types';
import { Sparkles, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

interface TopicGeneratorProps {
  topics: ResearchTopic[];
  onSelectTopic: (topic: ResearchTopic) => void;
  isLoading: boolean;
}

export const TopicGenerator: React.FC<TopicGeneratorProps> = ({ topics, onSelectTopic, isLoading }) => {
  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-amber-500" />
          Novel Research Opportunities
        </h2>
        <p className="text-slate-600">
          The agent has identified the following unexplored gaps with high publication potential.
        </p>
      </div>

      <div className="grid gap-6">
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all p-6 flex flex-col md:flex-row gap-6"
          >
            <div className="flex-grow space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-slate-900 leading-tight">
                  {topic.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                  ${topic.feasibility === 'High' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                `}>
                  {topic.feasibility} Feasibility
                </span>
              </div>
              
              <p className="text-slate-600">
                {topic.description}
              </p>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Identified Research Gap</span>
                <p className="text-sm text-slate-800 font-medium">{topic.gap}</p>
              </div>
            </div>

            <div className="md:w-48 flex flex-col justify-between shrink-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
               <div className="space-y-1">
                 <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Novelty Score</span>
                    <span className="font-bold text-indigo-600">{topic.noveltyScore}/100</span>
                 </div>
                 <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full" 
                      style={{ width: `${topic.noveltyScore}%` }}
                    ></div>
                 </div>
               </div>

               <button
                 onClick={() => onSelectTopic(topic)}
                 disabled={isLoading}
                 className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors font-medium text-sm"
               >
                 Select Topic <ArrowRight className="h-4 w-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
      
      {isLoading && (
         <div className="flex justify-center p-8">
            <span className="animate-pulse text-slate-400">Loading next step...</span>
         </div>
      )}
    </div>
  );
};