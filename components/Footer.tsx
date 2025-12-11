import React from 'react';
import { Twitter, Github, Linkedin, Mail, Heart, MapPin, Phone } from 'lucide-react';
import { LemurMascot } from './LemurMascot';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900">
      <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-1.5 rounded-lg">
                 <LemurMascot className="w-8 h-8" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">ScholarAgent</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Autonomous research assistant powered by Gemini 1.5 Pro. Bridging the gap between raw data and rigorous academic publishing.
            </p>
            <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span>123 Innovation Drive, Tech Valley, CA</span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <a href="mailto:contact@scholaragent.ai" className="hover:text-white transition-colors">contact@scholaragent.ai</a>
                </div>
                 <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Phone className="w-4 h-4 text-indigo-500" />
                    <span>+1 (555) 123-4567</span>
                </div>
            </div>
            <div className="flex space-x-4 pt-4">
              <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"><Twitter className="h-5 w-5" /></a>
              <a href="#" aria-label="GitHub" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"><Github className="h-5 w-5" /></a>
              <a href="#" aria-label="LinkedIn" className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Literature Review</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Gap Analysis</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">LaTeX Drafting</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Enterprise</a></li>
            </ul>
          </div>

          {/* Resources Links - Cleaned up */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Research Blog</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Citation Guide</a></li>
              <li><a href="#" className="text-sm hover:text-indigo-400 transition-colors">Ethics Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stay Updated</h3>
            <p className="text-xs text-slate-500 mb-4">Get the latest research trends and tool updates.</p>
            <form className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-600 transition-colors"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
             <p className="text-sm text-slate-500">
                © {new Date().getFullYear()} ScholarAgent AI Inc. All rights reserved.
             </p>
             <div className="flex gap-4 mt-2 justify-center md:justify-start">
                <a href="#" className="text-xs text-slate-600 hover:text-slate-400">Privacy Policy</a>
                <a href="#" className="text-xs text-slate-600 hover:text-slate-400">Terms of Service</a>
                <a href="#" className="text-xs text-slate-600 hover:text-slate-400">Cookie Settings</a>
             </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-slate-500">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>using Google Gemini</span>
          </div>
        </div>
      </div>
    </footer>
  );
};