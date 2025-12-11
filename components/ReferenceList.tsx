import React, { useState, useEffect } from 'react';
import { Reference } from '../types';
import { BookOpen, ExternalLink, CheckCircle, AlertTriangle, Filter, ArrowRight as ArrowIcon, Sparkles, BarChart, FileText, ArrowLeft, CheckSquare } from 'lucide-react';

interface ReferenceListProps {
  references: Reference[];
  onConfirm: (selectedRefs: Reference[]) => void;
  onBack: () => void;
  isLoading: boolean;
  onTogglePreprints: (enabled: boolean) => void;
  includePreprints: boolean;
  onRefresh: () => void;
}

export const ReferenceList: React.FC<ReferenceListProps> = ({ 
  references, 
  onConfirm, 
  onBack,
  isLoading, 
  onTogglePreprints, 
  includePreprints,
  onRefresh
}) => {
  const verifiedCount = references.filter(r => r.isVerified).length;
  const preprintCount = references.filter(r => r.isPreprint).length;
  const [expandedAbstract, setExpandedAbstract] = useState<number | null>(null);
  
  // Selection State - Default to empty set (User must select)
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  // Reset selection when references change, but keep it empty initially
  useEffect(() => {
    setSelectedIndices(new Set());
  }, [references]);

  const toggleSelectAll = () => {
    if (selectedIndices.size === references.length) {
      setSelectedIndices(new Set());
    } else {
      setSelectedIndices(new Set(references.map((_, i) => i)));
    }
  };

  const toggleSelection = (index: number) => {
    const newSet = new Set(selectedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setSelectedIndices(newSet);
  };

  const handleConfirm = () => {
    const selectedRefs = references.filter((_, i) => selectedIndices.has(i));
    onConfirm(selectedRefs);
  };

  const getValidUrl = (ref: Reference) => {
    if (ref.url && ref.url.startsWith('http')) return ref.url;
    if (ref.doi) {
      const cleanDoi = ref.doi.replace(/^doi:/, '').trim();
      if (cleanDoi.startsWith('http')) return cleanDoi;
      return `https://doi.org/${cleanDoi}`;
    }
    return null;
  };

  const isAllSelected = references.length > 0 && selectedIndices.size === references.length;
  const selectedCount = selectedIndices.size;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-10">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            Validated Literature Review
          </h2>
          <p className="text-sm text-slate-500 mt-1 flex flex-wrap gap-x-3 gap-y-1">
             <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-green-600" />
                Validated: <span className="font-medium text-green-600">{verifiedCount}</span>
             </span>
             <span className="text-slate-300">•</span>
             <span>Preprints: <span className="font-medium text-amber-600">{preprintCount}</span></span>
             <span className="text-slate-300">•</span>
             <span>Total: <span className="font-medium text-slate-900">{references.length}</span></span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row w-full lg:w-auto items-start sm:items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-100 border border-slate-200 w-full sm:w-auto transition-colors">
            <input 
              type="checkbox" 
              checked={includePreprints}
              onChange={(e) => {
                onTogglePreprints(e.target.checked);
              }}
              className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Include Preprints</span>
          </label>
          
          <button 
             onClick={onRefresh}
             className="text-sm text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2.5 w-full sm:w-auto text-center border border-transparent hover:bg-indigo-50 rounded-lg transition-colors"
          >
            Regenerate List
          </button>
        </div>
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-y-auto max-h-[65vh] scrollbar-thin scrollbar-thumb-slate-300">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-semibold text-slate-500 uppercase tracking-wider shadow-sm">
              <tr>
                <th className="px-6 py-3 border-b border-slate-200 w-10 text-center">
                  <input 
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer"
                    title="Select All"
                  />
                </th>
                <th className="px-6 py-3 border-b border-slate-200 w-10">#</th>
                <th className="px-6 py-3 border-b border-slate-200 w-5/12">Paper Details</th>
                <th className="px-6 py-3 border-b border-slate-200 w-2/12">Venue</th>
                <th className="px-6 py-3 border-b border-slate-200 w-1/12 text-center">Impact</th>
                <th className="px-6 py-3 border-b border-slate-200 w-1/12">Year</th>
                <th className="px-6 py-3 border-b border-slate-200 w-2/12 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {references.map((ref, idx) => {
                const link = getValidUrl(ref);
                const hasAbstract = !!ref.abstract;
                const isSelected = selectedIndices.has(idx);
                
                return (
                  <React.Fragment key={idx}>
                    <tr 
                      className={`transition-colors group ${isSelected ? 'bg-indigo-50/40 hover:bg-indigo-50/60' : 'hover:bg-slate-50'}`}
                      onClick={(e) => {
                         // Allow clicking row to toggle, unless clicking a link or button
                         if (!(e.target as HTMLElement).closest('a, button, input')) {
                           toggleSelection(idx);
                         }
                      }}
                    >
                      <td className="px-6 py-4 align-top text-center">
                        <input 
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelection(idx)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer mt-1"
                        />
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400 font-mono align-top">[{idx + 1}]</td>
                      <td className="px-6 py-4 align-top">
                        {link ? (
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-slate-900 hover:text-indigo-600 flex items-start gap-1 leading-snug"
                          >
                            {ref.title}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-sm font-semibold text-slate-900 leading-snug block">
                            {ref.title}
                          </span>
                        )}
                        <div className="text-xs text-slate-500 mt-1.5 line-clamp-1" title={ref.authors.join(", ")}>
                          {ref.authors.join(", ")}
                        </div>
                        {hasAbstract && (
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedAbstract(expandedAbstract === idx ? null : idx);
                                }}
                                className="mt-2 text-[10px] font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                            >
                                <FileText className="w-3 h-3" />
                                {expandedAbstract === idx ? "Hide Abstract" : "Read Abstract"}
                            </button>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        <span className="text-xs text-slate-700 font-medium block truncate max-w-[150px]" title={ref.venue || ref.source}>
                          {ref.venue || ref.source}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-top text-center">
                        {ref.citationCount !== undefined ? (
                            <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                <BarChart className="w-3 h-3 text-indigo-500" />
                                {ref.citationCount}
                            </span>
                        ) : (
                            <span className="text-xs text-slate-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top text-sm text-slate-600 font-mono">{ref.year}</td>
                      <td className="px-6 py-4 align-top text-right">
                        <div className="flex flex-col items-end gap-1">
                          {ref.isVerified ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap border border-green-100">
                              <CheckCircle className="h-3 w-3" /> VALIDATED
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap" title="Citation generated but not confirmed by OpenAlex">
                              <AlertTriangle className="h-3 w-3" /> Unverified
                            </span>
                          )}
                          
                          {ref.isPreprint && (
                            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 whitespace-nowrap">
                              Preprint
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedAbstract === idx && (
                        <tr className="bg-indigo-50/30">
                            <td colSpan={7} className="px-6 py-4">
                                <div className="text-xs text-slate-600 leading-relaxed max-w-4xl ml-10">
                                    <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">Abstract</span>
                                    {ref.abstract}
                                </div>
                            </td>
                        </tr>
                    )}
                  </React.Fragment>
                );
              })}
              {references.length === 0 && (
                <tr>
                   <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No references found. Adjust filters or try again.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (Visible only on mobile) */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between px-2">
           <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input 
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              Select All
           </label>
           <span className="text-xs text-slate-500">{selectedCount} Selected</span>
        </div>
        {references.map((ref, idx) => {
          const link = getValidUrl(ref);
          const isSelected = selectedIndices.has(idx);
          return (
            <div 
                key={idx} 
                className={`p-4 rounded-xl border shadow-sm space-y-3 transition-colors ${isSelected ? 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200'}`}
                onClick={() => toggleSelection(idx)}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-3">
                   <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(idx)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 shrink-0"
                   />
                   <span className="text-xs font-mono text-slate-400">[{idx + 1}]</span>
                </div>
                <div className="flex flex-wrap justify-end gap-1">
                  {ref.isVerified && (
                     <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                       Validated
                     </span>
                  )}
                  {ref.citationCount !== undefined && (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {ref.citationCount} Cites
                      </span>
                  )}
                </div>
              </div>
              
              <div className="pl-7">
                {link ? (
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 leading-tight block mb-1"
                  >
                    {ref.title}
                    <ExternalLink className="h-3 w-3 inline ml-1 align-top text-slate-400" />
                  </a>
                ) : (
                  <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">{ref.title}</h3>
                )}
                <p className="text-sm text-slate-500 line-clamp-2">{ref.authors.join(", ")}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-50 pl-7">
                 <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700 max-w-[60%] truncate">
                    {ref.venue || ref.source}
                 </span>
                 <span className="text-sm font-mono text-slate-500">{ref.year}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Action */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 md:border-none">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-3 font-medium transition-colors hover:bg-slate-100 rounded-xl"
        >
           <ArrowLeft className="h-5 w-5" />
           Back
        </button>

        <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-slate-500">
                <span className="font-semibold text-slate-900">{selectedCount}</span> papers selected for reasoning
            </div>
            <button
            onClick={handleConfirm}
            disabled={isLoading || selectedCount === 0}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
            {isLoading ? "Reasoning Engine Active..." : `Synthesize Gaps (${selectedCount})`}
            {!isLoading && <Sparkles className="h-5 w-5 text-amber-300" />}
            </button>
        </div>
      </div>
    </div>
  );
};