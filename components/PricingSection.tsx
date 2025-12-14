
import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Infinity, Sparkles, Gem, ShieldCheck, Crown } from 'lucide-react';
import { LemurMascot } from './LemurMascot';

const MASCOT_THOUGHTS = [
  "I like to move it, move it... into the checkout! 💃",
  "King Julien says: 'Subscribe or I bite!' 👑",
  "My wife needs a diamond mango. Help a lemur out? 🥭",
  "The zoo is expensive. I need premium funding! 🦁",
  "Mort is staring at me. Buy 'Pro' to save me! 👀",
  "I trade physics papers for vanilla beans! 🍦",
  "No penguins were harmed in this pricing. 🐧"
];

export const PricingSection: React.FC = () => {
  const [thoughtIndex, setThoughtIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThoughtIndex((prev) => (prev + 1) % MASCOT_THOUGHTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentThought = MASCOT_THOUGHTS[thoughtIndex];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      projects: 3,
      description: 'Experience the power of ScholarAgent.',
      icon: <ShieldCheck className="w-6 h-6 text-slate-400" />,
      isSub: false,
      features: []
    },
    {
      name: 'Starter',
      price: '$1',
      period: 'one-time',
      projects: 10,
      description: 'Perfect for specific assignments.',
      icon: <Zap className="w-6 h-6 text-emerald-500" />,
      isSub: false,
      features: []
    },
    {
      name: 'Power User',
      price: '$2',
      period: 'one-time',
      projects: 20,
      description: 'Deep dive capacity for serious work.',
      icon: <Gem className="w-6 h-6 text-purple-500" />,
      isSub: false,
      features: []
    },
    {
      name: 'Pro',
      price: '$10',
      period: '/ month',
      projects: 'Unlimited',
      description: 'The complete autonomous research suite.',
      icon: <Crown className="w-6 h-6 text-amber-500" />,
      isSub: true,
      highlight: true,
      features: [
          'High Quality Reasoning Engine',
          'All Model Selection (Gemini 3.0)',
          'Priority Processing',
          'Export to Overleaf'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-32 relative overflow-hidden bg-slate-50">
      
      {/* Ambient Crystal Background */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/20 rounded-full blur-[120px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-200/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-emerald-100/30 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
          
          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/60 shadow-sm text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
             <Sparkles className="w-3 h-3" /> Transparent Pricing
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
             Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Breakthrough</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
             From undergraduate essays to post-doc dissertations, we have a crystal-clear plan for you.
          </p>
        </div>

        {/* Mobile Mascot (Visible only on small screens) */}
        <div className="md:hidden mb-12 flex justify-center">
          <div className="relative w-32 h-32">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-slate-200 p-2.5 rounded-xl shadow-lg w-44 text-center z-10">
                <p className="text-[10px] font-bold text-slate-700 italic leading-tight">
                   "{currentThought}"
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/90 border-b border-r border-slate-200 transform rotate-45"></div>
             </div>
             <LemurMascot variant="pleading" className="w-full h-full" />
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative items-end">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`
                relative flex flex-col p-8 rounded-3xl transition-all duration-500 group
                ${plan.highlight 
                   ? 'h-[520px] z-20 shadow-[0_20px_50px_-12px_rgba(79,70,229,0.3)] bg-gradient-to-b from-white/90 to-indigo-50/50 backdrop-blur-2xl border border-white/60 ring-1 ring-white/50' 
                   : 'h-[460px] bg-white/40 backdrop-blur-xl border border-white/50 hover:bg-white/60 hover:shadow-xl hover:-translate-y-2'
                }
              `}
            >
              {/* Pro Plan: Holographic Top Highlight */}
              {plan.highlight && (
                 <>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg whitespace-nowrap z-20 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> Most Popular
                    </div>
                    {/* Internal Shine Effect */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute top-0 -left-[100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] animate-[shimmer_3s_infinite]"></div>
                    </div>
                 </>
              )}
              
              <div className="mb-6 relative">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm border ${plan.highlight ? 'bg-indigo-600 border-indigo-500' : 'bg-white border-white/50'}`}>
                    {React.cloneElement(plan.icon as React.ReactElement, { className: `w-6 h-6 ${plan.highlight ? 'text-white' : ''}` })}
                 </div>
                 <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                 <p className="text-sm text-slate-500 mt-1 font-medium">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className={`text-4xl font-black ${plan.highlight ? 'text-indigo-600' : 'text-slate-900'}`}>{plan.price}</span>
                <span className="text-sm text-slate-400 font-bold uppercase tracking-wide">{plan.period}</span>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${plan.highlight ? 'bg-indigo-50/50 border-indigo-100/50' : 'bg-white/40 border-white/60'}`}>
                     {plan.projects === 'Unlimited' ? (
                        <Infinity className={`w-5 h-5 ${plan.highlight ? 'text-indigo-600' : 'text-slate-600'}`} />
                     ) : (
                        <Zap className={`w-5 h-5 ${plan.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                     )}
                     <span className={`font-bold text-sm ${plan.highlight ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {plan.projects === 'Unlimited' ? 'Unlimited Projects' : `${plan.projects} Projects`}
                     </span>
                  </div>

                  {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-slate-600">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                             <Check className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="font-medium leading-tight">{feature}</span>
                      </div>
                  ))}
              </div>

              <div className="relative z-20">
                <button 
                  className={`
                    w-full py-4 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm hover:scale-[1.02]
                    ${plan.highlight 
                       ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200 hover:shadow-indigo-300' 
                       : 'bg-white border-2 border-slate-100 text-slate-700 hover:border-indigo-200 hover:text-indigo-600'
                    }
                  `}
                >
                  {plan.price === '$0' ? 'Get Started' : plan.isSub ? 'Unlock Pro Access' : 'Purchase Pack'}
                </button>
              </div>

              {/* Anchored Mascot for Pro Plan (Desktop Only) */}
              {plan.highlight && (
                <div className="hidden md:block absolute -right-20 -bottom-8 w-48 h-48 z-30 pointer-events-none hover:scale-110 transition-transform duration-500 origin-bottom-left">
                   <div className="relative w-full h-full">
                        <LemurMascot variant="pleading" className="w-full h-full drop-shadow-2xl" />
                        {/* Desktop Speech Bubble - Glassmorphism style */}
                        <div className="absolute -top-10 -right-4 bg-white/90 backdrop-blur-md border border-white p-3 rounded-2xl rounded-bl-none shadow-xl w-40 animate-bounce-slow">
                            <p className="text-[10px] font-bold text-slate-800 italic leading-tight text-center">
                                "{currentThought}"
                            </p>
                            <div className="absolute -bottom-1.5 left-2 w-3 h-3 bg-white/90 border-b border-r border-white transform rotate-45"></div>
                        </div>
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
