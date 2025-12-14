
import React from 'react';
import { PricingSection } from './PricingSection';
import { HeroSection } from './landing/HeroSection';
import { InfiniteScroll } from './landing/InfiniteScroll';
import { IntelligenceGrid } from './landing/IntelligenceGrid';
import { MethodologyGrid } from './landing/MethodologyGrid';
import { PaperShowcase } from './landing/PaperShowcase';
import { LatexAutomation } from './landing/LatexAutomation';
import { NoveltyRadar } from './landing/NoveltyRadar';
import { ReviewerHud } from './landing/ReviewerHud';
import { ResearchScope } from './landing/ResearchScope';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="w-full font-sans overflow-x-hidden bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 15s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        
        @keyframes scan-radar {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .animate-scan-radar { animation: scan-radar 3s linear infinite; }
        
        @keyframes float-y {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-y { animation: float-y 6s ease-in-out infinite; }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 1s; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }

        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }

        .glass-panel {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.5);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        
        .grid-bg {
            background-image: linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
            background-size: 40px 40px;
        }

        .text-glow {
            text-shadow: 0 0 20px rgba(99, 102, 241, 0.5), 0 0 40px rgba(255, 255, 255, 0.2);
        }
        
        .text-balance {
            text-wrap: balance;
        }
      `}</style>
      
      {/* 1. Hero Section */}
      <HeroSection onStart={onStart} />

      {/* 2. Infinite Scroll Ticker */}
      <InfiniteScroll />

      {/* 3. Intelligence Grid (Features) */}
      <IntelligenceGrid />

      {/* 4. Methodology Frameworks */}
      <MethodologyGrid />

      {/* 5. Paper Showcase (Interactive) */}
      <PaperShowcase />

      {/* 6. Latex Automation (Visual) */}
      <LatexAutomation />

      {/* 7. Novelty Radar (Crystal) */}
      <NoveltyRadar />

      {/* 8. Reviewer HUD */}
      <ReviewerHud />

      {/* 9. Research Scope */}
      <ResearchScope />

      {/* 10. Pricing */}
      <PricingSection />
    </div>
  );
};
