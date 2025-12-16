
import React from 'react';
import { WritingStyle } from '../types';
import { PenTool, Feather, BookOpen, ChevronDown } from 'lucide-react';

interface WritingStyleSelectorProps {
  selectedStyle: WritingStyle;
  onChange: (style: WritingStyle) => void;
  disabled?: boolean;
}

export const WritingStyleSelector: React.FC<WritingStyleSelectorProps> = ({ selectedStyle, onChange, disabled }) => {
  
  const getStyleInfo = (style: WritingStyle) => {
    switch (style) {
      case 'Dense_Technical':
        return { label: 'Dense & Technical', icon: <BookOpen className="w-3 h-3" />, desc: 'Passive voice, high equation density (IEEE)' };
      case 'Narrative_Impact':
        return { label: 'Narrative & Impact', icon: <Feather className="w-3 h-3" />, desc: 'Active voice, storytelling flow (Nature)' };
      case 'Standard':
      default:
        return { label: 'Standard Academic', icon: <PenTool className="w-3 h-3" />, desc: 'Balanced structure and tone' };
    }
  };

  const currentInfo = getStyleInfo(selectedStyle);

  return (
    <div className="relative group">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide hidden sm:block">Voice:</span>
        <button 
          disabled={disabled}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-indigo-700 hover:border-indigo-300 transition-colors shadow-sm min-w-[180px] justify-between"
        >
          <div className="flex items-center gap-2">
             {currentInfo.icon}
             <span className="font-medium">{currentInfo.label}</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {!disabled && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
           {(['Standard', 'Dense_Technical', 'Narrative_Impact'] as WritingStyle[]).map((style) => {
              const info = getStyleInfo(style);
              return (
                <button
                  key={style}
                  onClick={() => onChange(style)}
                  className={`w-full text-left px-3 py-3 rounded-lg flex items-start gap-3 transition-colors ${selectedStyle === style ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                >
                   <div className={`mt-1 ${selectedStyle === style ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {info.icon}
                   </div>
                   <div>
                      <div className={`text-sm font-bold ${selectedStyle === style ? 'text-indigo-700' : 'text-slate-700'}`}>
                        {info.label}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        {info.desc}
                      </div>
                   </div>
                </button>
              );
           })}
        </div>
      )}
    </div>
  );
};
