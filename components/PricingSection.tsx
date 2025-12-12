import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Infinity, BrainCircuit, Sliders } from 'lucide-react';
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
      isSub: false,
      features: []
    },
    {
      name: 'Starter',
      price: '$1',
      period: 'one-time',
      projects: 10,
      description: 'Perfect for specific assignments.',
      isSub: false,
      features: []
    },
    {
      name: 'Power User',
      price: '$2',
      period: 'one-time',
      projects: 20,
      description: 'Deep dive capacity for serious work.',
      isSub: false,
      features: []
    },
    {
      name: 'Pro',
      price: '$10',
      period: '/ month',
      projects: 'Unlimited',
      description: 'The complete autonomous research suite.',
      isSub: true,
      highlight: true,
      features: [
          'High Quality Reasoning Engine',
          'All Model Selection (Gemini 3.0)',
          'Priority Processing'
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50 text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Fair Pricing for Every Scholar</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
             Start for free, grab a project pack, or subscribe for unlimited power.
          </p>
        </div>

        {/* Mobile Mascot */}
        <div className="lg:hidden mb-12 flex justify-center">
          <div className="relative w-32 h-32">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border border-slate-200 p-2.5 rounded-xl shadow-lg w-40 text-center z-10 transition-all duration-300">
                <p className="text-[10px] font-bold text-slate-700 italic leading-tight">
                   "{currentThought}"
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
             </div>
             <LemurMascot variant="pleading" className="w-full h-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative items-start">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`
                relative flex flex-col p-6 rounded-2xl border transition-all duration-300 h-full
                ${plan.highlight 
                   ? 'bg-white border-indigo-200 shadow-xl scale-105 z-10 ring-4 ring-indigo-50' 
                   : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg'
                }
                ${plan.isSub ? 'border-amber-200 bg-amber-50/30' : ''}
              `}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-md whitespace-nowrap">
                  Most Popular
                </div>
              )}
              {plan.isSub && !plan.highlight && (
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-md">
                   <Star className="w-3 h-3 fill-current" /> Subscription
                 </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                <span className="text-xs text-slate-500 uppercase font-medium">{plan.period}</span>
              </div>

              <div className={`flex items-center gap-2 mb-6 p-3 rounded-lg border ${plan.highlight ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                {plan.projects === 'Unlimited' ? (
                   <Infinity className="w-5 h-5 text-amber-500" />
                ) : (
                   <Zap className={`w-5 h-5 ${plan.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                )}
                <span className="font-semibold text-sm text-slate-700">
                  {plan.projects === 'Unlimited' ? 'Unlimited Projects' : `${plan.projects} Projects`}
                </span>
              </div>

              {/* Extra Features for Pro */}
              {plan.features.length > 0 && (
                  <div className="mb-6 space-y-3">
                      {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                              <Check className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                              <span className="font-medium">{feature}</span>
                          </div>
                      ))}
                  </div>
              )}

              <div className="mt-auto">
                <button 
                  className={`
                    w-full py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm
                    ${plan.highlight || plan.isSub
                       ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' 
                       : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                    }
                  `}
                >
                  {plan.price === '$0' ? 'Start Free' : plan.isSub ? 'Subscribe Now' : 'Buy Pack'}
                </button>
              </div>
            </div>
          ))}

          {/* Floating Pleading Mascot (Desktop) */}
          <div className="hidden lg:block absolute -right-24 bottom-10 z-20 hover:scale-105 transition-transform duration-300">
              <div className="relative w-48 h-48">
                 <div className="absolute top-2 -left-6 bg-white border border-slate-200 p-2 rounded-xl rounded-br-none shadow-xl w-32 animate-bounce-slow transition-all duration-500 z-30">
                    <p className="text-[9px] font-bold text-slate-700 italic leading-tight">
                       "{currentThought}"
                    </p>
                    <div className="absolute -bottom-1.5 right-2 w-2.5 h-2.5 bg-white border-b border-r border-slate-200 transform rotate-45"></div>
                 </div>
                 
                 <LemurMascot variant="pleading" className="w-full h-full drop-shadow-2xl" />
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};