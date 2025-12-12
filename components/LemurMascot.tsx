
import React from 'react';
import { MortMascot } from './MortMascot';

interface LemurMascotProps {
  className?: string;
  variant?: 'default' | 'telescope' | 'bucket' | 'pleading' | 'thinking' | 'duo';
}

export const LemurMascot: React.FC<LemurMascotProps> = ({ className = "w-64 h-64", variant = 'default' }) => {
  // Artistic Settings
  const outlineColor = "#000000";
  const outlineWidth = "2.5";
  
  // If variant is pleading, we just show Mort (backward compatibility for PricingSection)
  if (variant === 'pleading') {
      return <MortMascot className={className} variant="pleading" />;
  }

  return (
    <div className={`relative ${className}`}>
      {/* --- KING JULIEN SVG --- */}
      <svg viewBox="0 0 200 240" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="furGrey" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="50%" stopColor="#94a3b8" /> 
            <stop offset="100%" stopColor="#64748b" /> 
          </linearGradient>
          
          <radialGradient id="bellyWhite" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="60%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
          </radialGradient>

          <linearGradient id="crownLeaf" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
          </linearGradient>
          <linearGradient id="crownPineapple" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="1" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <style>
            {`
              @keyframes tail-wag {
                0%, 100% { transform: rotate(-4deg); }
                50% { transform: rotate(12deg); }
              }
              @keyframes crown-bounce {
                 0%, 100% { transform: translateY(0) rotate(0deg); }
                 50% { transform: translateY(-3px) rotate(2deg); }
              }
              @keyframes eye-dart {
                 0%, 90% { transform: translate(0,0); }
                 92% { transform: translate(1px, 0); }
                 94% { transform: translate(-1px, 0); }
                 96% { transform: translate(0,0); }
              }
              .mascot-tail { transform-origin: 100px 180px; animation: tail-wag 3s ease-in-out infinite; }
              .mascot-crown { transform-origin: 100px 70px; animation: crown-bounce 4s ease-in-out infinite; }
              .mascot-pupil { animation: eye-dart 4s infinite; }
            `}
          </style>
        </defs>

        {/* --- TAIL (Behind Body) --- */}
        <g className="mascot-tail">
          <path 
              d="M100 180 Q 160 180 170 120 Q 180 60 140 30 Q 120 20 100 40" 
              fill="none" 
              stroke={outlineColor} 
              strokeWidth="40" 
              strokeLinecap="round"
          />
          <path 
              d="M100 180 Q 160 180 170 120 Q 180 60 140 30 Q 120 20 100 40" 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="35" 
              strokeLinecap="round"
          />
          <path 
              d="M100 180 Q 160 180 170 120 Q 180 60 140 30 Q 120 20 100 40" 
              fill="none" 
              stroke="#000000" 
              strokeWidth="35" 
              strokeLinecap="butt"
              strokeDasharray="22 22"
              strokeDashoffset="5"
          />
        </g>

        {/* --- BODY --- */}
        <g transform="translate(0, 20)">
          <path 
              d="M80 120 Q 70 170 85 200 L 115 200 Q 130 170 120 120" 
              fill="url(#furGrey)" 
              stroke={outlineColor} 
              strokeWidth={outlineWidth}
              filter="url(#softShadow)"
          />
          <path 
              d="M90 120 Q 85 160 92 180 L 108 180 Q 115 160 110 120" 
              fill="url(#bellyWhite)" 
              opacity="0.9"
          />
        </g>

        {/* --- HEAD GROUP --- */}
        <g transform="translate(0, 10)">
          <path d="M45 65 Q 35 30 65 45 L 70 80 Z" fill="#64748b" stroke={outlineColor} strokeWidth={outlineWidth} />
          <path d="M48 62 Q 42 40 62 50" fill="#fbcfe8" />
          <path d="M155 65 Q 165 30 135 45 L 130 80 Z" fill="#64748b" stroke={outlineColor} strokeWidth={outlineWidth} />
          <path d="M152 62 Q 158 40 138 50" fill="#fbcfe8" />
          <path d="M60 100 L 40 110 L 62 120 Z" fill="#e2e8f0" stroke={outlineColor} strokeWidth="1" />
          <path d="M140 100 L 160 110 L 138 120 Z" fill="#e2e8f0" stroke={outlineColor} strokeWidth="1" />
          <path 
              d="M60 75 Q 100 50 140 75 Q 155 90 140 125 Q 100 155 60 125 Q 45 90 60 75" 
              fill="#e2e8f0" 
              stroke={outlineColor} 
              strokeWidth={outlineWidth}
              filter="url(#softShadow)"
          />
          <path d="M65 80 Q 55 95 70 110 Q 85 115 90 95 Q 90 75 65 80" fill="#1e293b" opacity="0.95" />
          <path d="M135 80 Q 145 95 130 110 Q 115 115 110 95 Q 110 75 135 80" fill="#1e293b" opacity="0.95" />
          <path d="M85 110 Q 100 105 115 110 Q 110 130 100 135 Q 90 130 85 110" fill="#ffffff" stroke={outlineColor} strokeWidth="1" />
          <path d="M92 118 Q 100 116 108 118 L 100 124 Z" fill="#000000" />

          {variant === 'thinking' ? (
              <path d="M96 128 L 104 128" stroke={outlineColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
          ) : (
              <g>
                <path d="M88 126 Q 100 138 112 126 Q 100 120 88 126 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="1" />
                <path d="M88 126 Q 100 130 112 126" fill="none" stroke={outlineColor} strokeWidth="0.5" opacity="0.5" />
              </g>
          )}

          <g className="mascot-eye-container">
              <circle cx="76" cy="94" r="11" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
              <circle cx="76" cy="94" r="9" fill="#fbbf24" />
              <g className="mascot-pupil">
                  <circle cx="76" cy="94" r="2.5" fill="#000" />
                  <circle cx="77" cy="93" r="0.8" fill="#fff" />
              </g>
              {variant === 'thinking' && <path d="M65 88 Q 76 96 87 88" fill="none" stroke="#1e293b" strokeWidth="2" />}
              <circle cx="124" cy="94" r="11" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
              <circle cx="124" cy="94" r="9" fill="#fbbf24" />
              {variant === 'telescope' ? (
                  <path d="M113 94 Q 124 100 135 94" stroke="#000" strokeWidth="2.5" fill="none" />
              ) : (
                  <g className="mascot-pupil">
                      <circle cx="124" cy="94" r="2.5" fill="#000" />
                      <circle cx="125" cy="93" r="0.8" fill="#fff" />
                  </g>
              )}
          </g>

          <g className="mascot-crown" transform="translate(0, -15)">
              <path 
                d="M75 75 L 70 20 Q 100 10 130 20 L 125 75 Q 100 85 75 75" 
                fill="url(#crownLeaf)" 
                stroke={outlineColor} 
                strokeWidth="1.5" 
              />
              <path d="M72 50 Q 100 55 128 50" fill="none" stroke="#14532d" strokeWidth="0.5" opacity="0.5" />
              <path d="M71 35 Q 100 40 129 35" fill="none" stroke="#14532d" strokeWidth="0.5" opacity="0.5" />
              <ellipse cx="100" cy="20" rx="15" ry="10" fill="url(#crownPineapple)" stroke={outlineColor} strokeWidth="1.5" />
              <path d="M90 15 L 110 25 M 90 25 L 110 15" stroke="#ca8a04" strokeWidth="1" />
              <path d="M100 15 Q 90 -10 70 -5" fill="none" stroke="#f87171" strokeWidth="4" strokeLinecap="round" />
              <path d="M100 15 Q 110 -15 130 -5" fill="none" stroke="#4ade80" strokeWidth="4" strokeLinecap="round" />
              <path d="M100 15 L 100 -20" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>

        <g transform="translate(0, 20)">
            {variant === 'telescope' && (
              <g>
                  <rect x="90" y="100" width="80" height="15" fill="#475569" transform="rotate(-15 90 100)" stroke={outlineColor} strokeWidth="1" />
                  <rect x="160" y="80" width="10" height="20" fill="#f59e0b" transform="rotate(-15 160 80)" stroke={outlineColor} strokeWidth="1" />
                  <circle cx="95" cy="115" r="6" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
                  <circle cx="130" cy="105" r="6" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
              </g>
            )}
            {variant === 'thinking' && (
              <g>
                  <path d="M80 130 Q 70 150 90 145" stroke={outlineColor} strokeWidth="8" fill="none" strokeLinecap="round" />
                  <path d="M80 130 Q 70 150 90 145" stroke="#94a3b8" strokeWidth="6" fill="none" strokeLinecap="round" />
                  <circle cx="92" cy="142" r="5" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
              </g>
            )}
            {(variant === 'default' || variant === 'duo') && (
              <g>
                  <path d="M75 130 Q 60 150 75 160" fill="none" stroke={outlineColor} strokeWidth="8" strokeLinecap="round" />
                  <path d="M75 130 Q 60 150 75 160" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="75" cy="160" r="5" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
                  <path d="M125 130 Q 140 150 125 160" fill="none" stroke={outlineColor} strokeWidth="8" strokeLinecap="round" />
                  <path d="M125 130 Q 140 150 125 160" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="125" cy="160" r="5" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
              </g>
            )}
            {variant === 'bucket' && (
              <g>
                  <rect x="80" y="140" width="40" height="30" fill="#3b82f6" stroke={outlineColor} strokeWidth="1.5" />
                  <path d="M80 140 L 90 170 L 110 170 L 120 140 Z" fill="#2563eb" opacity="0.5" />
                  <rect x="90" y="130" width="10" height="20" fill="#fff" stroke="#cbd5e1" transform="rotate(-10 90 140)" />
                  <rect x="100" y="130" width="10" height="20" fill="#fff" stroke="#cbd5e1" transform="rotate(10 100 140)" />
                  <circle cx="80" cy="145" r="5" fill="#1a1a1a" stroke={outlineColor} />
                  <circle cx="120" cy="145" r="5" fill="#1a1a1a" stroke={outlineColor} />
              </g>
            )}
        </g>

        <g transform="translate(0, 20)">
          <ellipse cx="85" cy="200" rx="9" ry="5" fill="#1a1a1a" />
          <ellipse cx="115" cy="200" rx="9" ry="5" fill="#1a1a1a" />
        </g>
      </svg>

      {/* --- MORT ENTERING SCENE (Duo Variant) --- */}
      {variant === 'duo' && (
        <div className="absolute bottom-0 right-[-30%] w-[50%] h-[50%] animate-mort-enter">
           <MortMascot variant="walking" className="w-full h-full" />
        </div>
      )}

      <style>{`
        @keyframes mort-walk-in {
           0% { transform: translateX(150px); opacity: 0; }
           20% { opacity: 1; }
           100% { transform: translateX(0); }
        }
        .animate-mort-enter {
           animation: mort-walk-in 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
