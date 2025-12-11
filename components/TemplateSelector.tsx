import React from 'react';
import { LatexTemplate } from '../types';
import { FileCode, Check } from 'lucide-react';

interface TemplateSelectorProps {
  templates: LatexTemplate[];
  onSelect: (template: LatexTemplate) => void;
  isLoading: boolean;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ templates, onSelect, isLoading }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Choose Manuscript Template</h2>
        <p className="text-slate-600">
          Select the academic format for the generated manuscript.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            disabled={isLoading}
            className="relative flex flex-col items-center text-center bg-white p-8 rounded-xl border-2 border-slate-200 hover:border-indigo-600 hover:shadow-md transition-all group"
          >
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
              <FileCode className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
            <p className="text-sm text-slate-500 mt-2">{template.description}</p>
            <div className="mt-4 text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
              {template.classFile}
            </div>
          </button>
        ))}
      </div>
      
       {isLoading && (
        <div className="flex justify-center mt-8">
           <div className="flex flex-col items-center gap-2">
             <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             <span className="text-slate-600 font-medium">Research Agent is drafting manuscript...</span>
             <span className="text-xs text-slate-400">This may take up to 2 minutes</span>
           </div>
        </div>
      )}
    </div>
  );
};
