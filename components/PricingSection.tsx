import React, { useState, useEffect } from 'react';
import { Check, Star, Zap, Infinity } from 'lucide-react';
import { LemurMascot } from './LemurMascot';

const MASCOT_THOUGHTS = [
  "I like to move it, move it... into the checkout! 💃",
  "King Julien says: 'Subscribe or I bite!' 👑",
  "My wife needs a diamond mango. Help a lemur out? 🥭",
  "The zoo is expensive. I need premium funding! 🦁",
  "Mort is staring at me. Buy 'Ultimate' to save me! 👀",
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
    },
    {
      name: 'Starter',
      price: '$1',
      period: 'one-time',
      projects: 5,
      description: 'Perfect for a single assignment.',
      isSub: false,
    },
    {
      name: 'Student',
      price: '$2',
      period: 'one-time',
      projects: 10,
      description: 'Enough for a full semester.',
      isSub: false,
    },
    {
      name: 'Researcher',
      price: '$5',
      period: 'one-time',
      projects: 50,
      description: 'Ideal for thesis work.',
      isSub: false,
      highlight: true
    },
    {
      name: 'Lab',
      price: '$10',
      period: 'one-time',
      projects: 100,
      description: 'For collaborative teams.',
      isSub: false,
    },
    {
      name: 'Ultimate',
      price: '$50',
      period: '/ month',
      projects: 'Unlimited',
      description: 'Unconstrained discovery.',
      isSub: true,
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white text-slate-900 border-t border-slate-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">Fair Pricing for Every Scholar</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
             Start for free, then pay per project pack or subscribe for unlimited access.
          </p>
        </div>

        {/* Mobile Mascot (Smaller version centered ABOVE grid) */}
        <div className="lg:hidden mb-12 flex justify-center">
          <div className="relative w-32 h-32">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white border-2 border-slate-900 p-2.5 rounded-xl shadow-lg w-40 text-center z-10 transition-all duration-300">
                <p className="text-[10px] font-bold text-slate-900 italic leading-tight">
                   "{currentThought}"
                </p>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b-2 border-r-2 border-slate-900 transform rotate-45"></div>
             </div>
             <LemurMascot variant="pleading" className="w-full h-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {plans.map((plan) => (
            <div 
              key={plan.name} 
              className={`
                relative flex flex-col p-6 rounded-2xl border transition-all duration-300
                ${plan.highlight 
                   ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 scale-105 z-10' 
                   : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-lg'
                }
                ${plan.isSub ? 'border-amber-400 bg-amber-50/30' : ''}
              `}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                  Best Value
                </div>
              )}
              {plan.isSub && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" /> Ultimate
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

              <div className={`flex items-center gap-2 mb-8 p-3 rounded-lg border ${plan.highlight ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-slate-100'}`}>
                {plan.projects === 'Unlimited' ? (
                   <Infinity className="w-5 h-5 text-amber-500" />
                ) : (
                   <Zap className={`w-5 h-5 ${plan.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                )}
                <span className="font-semibold text-sm text-slate-700">
                  {plan.projects === 'Unlimited' ? 'Unlimited Projects' : `${plan.projects} Projects`}
                </span>
              </div>

              <div className="mt-auto">
                <button 
                  className={`
                    w-full py-2.5 rounded-lg text-sm font-semibold transition-all
                    ${plan.highlight || plan.isSub
                       ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200' 
                       : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }
                  `}
                >
                  {plan.price === '$0' ? 'Start Free' : 'Get Started'}
                </button>
              </div>
            </div>
          ))}

          {/* Floating Pleading Mascot (Desktop) */}
          <div className="hidden lg:block absolute -right-24 bottom-10 z-20 hover:scale-105 transition-transform duration-300">
              <div className="relative w-48 h-48">
                 {/* Speech Bubble - Tiny, lower, closer to head */}
                 <div className="absolute top-2 -left-6 bg-white border-2 border-slate-900 p-2 rounded-xl rounded-br-none shadow-xl w-32 animate-bounce-slow transition-all duration-500 z-30">
                    <p className="text-[9px] font-bold text-slate-900 italic leading-tight">
                       "{currentThought}"
                    </p>
                    {/* Tail */}
                    <div className="absolute -bottom-1.5 right-2 w-2.5 h-2.5 bg-white border-b-2 border-r-2 border-slate-900 transform rotate-45"></div>
                 </div>
                 
                 <LemurMascot variant="pleading" className="w-full h-full drop-shadow-xl" />
              </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
                All plans include access to Multi-Agent Search, Gap Analysis, and LaTeX Export. <br className="hidden md:inline"/>
                Secure payment processing via Stripe.
            </p>
        </div>
      </div>
    </section>
  );
};