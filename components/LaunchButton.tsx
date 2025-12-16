
import React from 'react';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';

interface LaunchButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const LaunchButton: React.FC<LaunchButtonProps> = ({ onClick, label = "Initialize Swarm", className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-8 font-bold text-white transition-all duration-300 hover:bg-indigo-600 hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] hover:scale-105 w-full sm:w-auto shadow-xl ring-4 ring-transparent hover:ring-indigo-100 ${className}`}
    >
      {/* Shimmer Effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-2">
        <div className="relative">
            <Zap className="h-5 w-5 text-indigo-300 transition-transform duration-300 group-hover:text-white group-hover:fill-current" />
            <Sparkles className="absolute -bottom-1 -left-1 w-2 h-2 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping" />
        </div>
        <span className="text-lg tracking-wide">{label}</span>
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </button>
  );
};
