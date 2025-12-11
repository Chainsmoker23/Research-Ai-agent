import React, { useState } from 'react';
import { Reference } from '../types';
import { BookOpen, ExternalLink, CheckCircle, AlertTriangle, Filter, ArrowRight as ArrowIcon, Sparkles } from 'lucide-react';

interface ReferenceListProps {
  references: Reference[];
  onConfirm: () => void;
  isLoading: boolean;
  onTogglePreprints: (enabled: boolean) => void;
  includePreprints: boolean;
  onRefresh: () => void;
}

export const ReferenceList: React.FC<ReferenceListProps> = ({ 
  references, 
  onConfirm, 
  isLoading, 
  onTogglePreprints, 
  includePreprints,
  onRefresh
}) => {
  const verifiedCount = references.filter(r => r.isVerified).length;
  const preprintCount = references.filter(r => r.isPreprint).length;

  const getValidUrl = (ref: Reference) => {
    if (ref.url && ref.url.startsWith('http')) return ref.url;
    if (ref.doi) {
      const cleanDoi = ref.doi.replace(/^doi:/, '').trim();
      if (cleanDoi.startsWith('http')) return cleanDoi;
      return `https://doi.org/${cleanDoi}`;
    }
    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            Systematic Literature Review
          </h2>
          <p className="text-sm text-slate-500 mt-1">
             Verified: <span className="font-medium text-green-600">{verifiedCount}</span> • 
             Preprints: <span className="font-medium text-amber-600">{preprintCount}</span> • 
             Total: <span className="font-medium text-slate-900">{references.length}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 border border-slate-200">
            <input 
              type="checkbox" 
              checked={includePreprints}
              onChange={(e) => {
                onTogglePreprints(e.target.checked);
              }}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            Include Preprints (arXiv)
          </label>
          
          <button 
             onClick={onRefresh}
             className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-3 py-2"
          >
            Regenerate List
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-slate-300">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200">Ref</th>
                <th className="px-6 py-3 border-b border-slate-200 w-1/3">Title & Authors</th>
                <th className="px-6 py-3 border-b border-slate-200">Source</th>
                <th className="px-6 py-3 border-b border-slate-200">Year</th>
                <th className="px-6 py-3 border-b border-slate-200 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {references.map((ref, idx) => {
                const link = getValidUrl(ref);
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">[{idx + 1}]</td>
                    <td className="px-6 py-4">
                      {link ? (
                        <a 
                          href={link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-semibold text-slate-900 hover:text-indigo-600 flex items-start gap-1"
                        >
                          {ref.title}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </a>
                      ) : (
                        <span className="text-sm font-semibold text-slate-900">
                          {ref.title}
                        </span>
                      )}
                      <div className="text-xs text-slate-500 mt-1 truncate max-w-xs" title={ref.authors.join(", ")}>
                        {ref.authors.join(", ")}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {ref.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{ref.year}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         {ref.isVerified ? (
                           <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                             <CheckCircle className="h-3 w-3" /> Verified
                           </span>
                         ) : (
                           <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full" title="Citation generated but not linked to live source">
                             <AlertTriangle className="h-3 w-3" /> Unverified
                           </span>
                         )}
                         
                         {ref.isPreprint && (
                           <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                             Preprint
                           </span>
                         )}
                       </div>
                    </td>
                  </tr>
                );
              })}
              {references.length === 0 && (
                <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No references found. Adjust filters or try again.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onConfirm}
          disabled={isLoading || references.length === 0}
          className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-50 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          {isLoading ? "Analyzing..." : "Identify Research Gaps"}
          {!isLoading && <Sparkles className="h-5 w-5 text-amber-300" />}
        </button>
      </div>
    </div>
  );
};