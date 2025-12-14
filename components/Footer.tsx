
import React from 'react';
import { Twitter, Github, Linkedin, Mail, Heart, MapPin, Phone, Key, Bot, Sparkles, Send } from 'lucide-react';
import { LemurMascot } from './LemurMascot';
import { AppStep } from '../types';
import { getKeyCount } from '../services/geminiClient';

interface FooterProps {
  onNavigate?: (step: AppStep) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent, step: AppStep) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(step);
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const keyCount = getKeyCount();

  return (
    <footer className="relative pt-24 pb-12 border-t border-white/60 overflow-hidden">
      
      {/* 1. Crystal Background Layer */}
      <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-xl z-0"></div>
      
      {/* 2. Ambient Light Refractions (Gradients) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-indigo-200/30 rounded-full blur-[120px]"></div>
          <div className="absolute -top-[50%] -right-[10%] w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[100px]"></div>
          <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[80px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="bg-white/80 p-2 rounded-xl border border-white shadow-sm group-hover:scale-110 transition-transform duration-300">
                 <LemurMascot className="w-10 h-10" />
              </div>
              <div className="flex flex-col">
                  <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">ScholarAgent</span>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Autonomous Research</span>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-xs font-medium">
              Bridging the gap between raw data and rigorous academic publishing. Powered by Gemini 3.0 Pro.
            </p>
            
            <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <span>123 Innovation Drive, Tech Valley</span>
                </div>
                 <div className="flex items-center gap-3 text-sm text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                         <Mail className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <a href="mailto:contact@scholaragent.ai">contact@scholaragent.ai</a>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/60 border border-white hover:border-indigo-200 hover:bg-white hover:text-indigo-600 text-slate-400 flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-1">
                      <Icon className="w-4 h-4" />
                  </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Products
            </h3>
            <ul className="space-y-3">
              {[
                  { label: "Discovery Agent", action: AppStep.TOPIC_INPUT },
                  { label: "Peer Reviewer", action: AppStep.PEER_REVIEW },
                  { label: "Evaluation Agent", action: AppStep.NOVELTY_CHECK },
              ].map((item, i) => (
                  <li key={i}>
                    <button 
                        onClick={(e) => handleNav(e, item.action)} 
                        className="text-sm text-slate-600 hover:text-indigo-600 transition-colors text-left hover:translate-x-1 duration-200 inline-block font-medium"
                    >
                    {item.label}
                    </button>
                </li>
              ))}
              <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors hover:translate-x-1 duration-200 inline-block font-medium">Drafting Agent</a></li>
              <li><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors hover:translate-x-1 duration-200 inline-block font-medium">Enterprise API</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-3">
              {['Research Blog', 'Documentation', 'Citation Guide', 'Ethics Policy', 'Community'].map((item, i) => (
                 <li key={i}><a href="#" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors hover:translate-x-1 duration-200 inline-block font-medium">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Glass Newsletter */}
          <div className="relative">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Stay Updated</h3>
            
            <div className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 blur-xl rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                
                <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">
                    Join 12,000+ researchers using AI to accelerate discovery.
                </p>
                <form className="relative">
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        className="w-full bg-white/70 border border-white/50 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-200 transition-all shadow-inner"
                    />
                    <button className="absolute right-1.5 top-1.5 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg">
                        <Send className="w-3.5 h-3.5" />
                    </button>
                </form>
                <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                {String.fromCharCode(64+i)}
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold">+2k this week</span>
                </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
             <p className="text-sm text-slate-500 font-medium">
                © {new Date().getFullYear()} ScholarAgent AI Inc.
             </p>
             <div className="flex gap-4 mt-2 justify-center md:justify-start">
                <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-semibold">Privacy</a>
                <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-semibold">Terms</a>
                <a href="#" className="text-xs text-slate-400 hover:text-indigo-600 transition-colors font-semibold">Cookies</a>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white shadow-sm backdrop-blur-sm">
               <div className="relative">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 border border-white rounded-full"></span>
               </div>
               <span className="text-xs font-bold text-slate-700">16 Agents Active</span>
            </div>
            
            {keyCount > 1 && (
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/50 border border-emerald-100 shadow-sm backdrop-blur-sm">
                  <Key className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">{keyCount} Keys</span>
               </div>
            )}

            <div className="h-4 w-px bg-slate-300 mx-2"></div>

            <div className="flex items-center gap-1 text-sm text-slate-500 font-medium">
                <span>Made with</span>
                <Heart className="h-3.5 w-3.5 text-rose-500 fill-current animate-pulse" />
                <span>by Gemini</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
