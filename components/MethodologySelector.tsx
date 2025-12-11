import React from 'react';
import { MethodologyOption } from '../types';
import { Microscope, Activity, FileText } from 'lucide-react';

interface MethodologySelectorProps {
  options: MethodologyOption[];
  onSelect: (option: MethodologyOption) => void;
  isLoading: boolean;
}

export const MethodologySelector: React.FC<MethodologySelectorProps> = ({ options, onSelect, isLoading }) => {
  
  // Helper to give varied icons
  const getIcon = (idx: number) => {
    if (idx % 3 === 0) return <Microscope className="h-8 w-8 text-indigo-600" />;
    if (idx % 3 === 1) return <Activity className="h-8 w-8 text-emerald-600" />;
    return <FileText className="h-8 w-8 text-amber-600" />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Select Research Methodology</h2>
        <p className="text-slate-600">
          Based on the literature, the following approaches are most suitable for your topic.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {options.map((option, idx) => (
          <button
            key={option.id}
            onClick={() => onSelect(option)}
            disabled={isLoading}
            className="flex flex-col text-left h-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-indigo-300 hover:-translate-y-1 transition-all group"
          >
            <div className="mb-4 p-3 bg-slate-50 rounded-lg w-fit group-hover:bg-white group-hover:shadow-sm transition-colors">
              {getIcon(idx)}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
              {option.name}
            </h3>
            <p className="text-slate-600 text-sm mb-4 flex-grow">
              {option.description}
            </p>
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div>
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Justification</span>
                <p className="text-xs text-slate-500 mt-1">{option.justification}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Implications</span>
                <p className="text-xs text-slate-500 mt-1">{option.implications}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {isLoading && (
        <div className="flex justify-center mt-8">
           <span className="text-slate-500 animate-pulse">Initializing template selection...</span>
        </div>
      )}
    </div>
  );
};
