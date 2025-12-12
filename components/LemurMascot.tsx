
import React from 'react';

interface LemurMascotProps {
  className?: string;
  variant?: 'default' | 'telescope' | 'bucket' | 'pleading' | 'thinking';
}

export const LemurMascot: React.FC<LemurMascotProps> = ({ className = "w-64 h-64", variant = 'default' }) => {
  // Artistic Settings
  const outlineColor = "#000000";
  const outlineWidth = "2.5"; 

  return (
    <svg viewBox="0 0 200 240" className={className} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        {/* Fur Gradients */}
        <linearGradient id="furGrey" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#cbd5e1" /> {/* Lighter Slate for that silver lemur look */}
          <stop offset="50%" stopColor="#94a3b8" /> 
          <stop offset="100%" stopColor="#64748b" /> 
        </linearGradient>
        
        <radialGradient id="bellyWhite" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="60%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
        </radialGradient>

        <radialGradient id="eyeGold" cx="50%" cy="50%" r="50%">
            <stop offset="30%" stopColor="#f59e0b" /> {/* Bright Orange/Amber */}
            <stop offset="90%" stopColor="#b45309" /> {/* Darker Orange edge */}
        </radialGradient>

        {/* Crown Gradients */}
        <linearGradient id="crownLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id="crownFeather" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>

        {/* Filters */}
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
            @keyframes royal-wave {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(5deg); }
            }
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
            @keyframes plead-pulse {
               0%, 100% { transform: scale(1); }
               50% { transform: scale(1.05); }
            }
            @keyframes blink-random {
               0%, 98% { transform: scaleY(1); }
               99% { transform: scaleY(0.1); }
               100% { transform: scaleY(1); }
            }
            .mascot-tail { transform-origin: 100px 180px; animation: tail-wag 3s ease-in-out infinite; }
            .mascot-crown { transform-origin: 100px 70px; animation: crown-bounce 4s ease-in-out infinite; }
            .mascot-pupil { animation: eye-dart 4s infinite; }
            .mascot-eye-container { transform-origin: center; animation: blink-random 5s infinite; }
            .mascot-plead { animation: plead-pulse 2s infinite; }
          `}
        </style>
      </defs>

      {/* --- TAIL (Behind Body) --- */}
      <g className="mascot-tail">
         {/* Tail Outline & Base */}
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
         {/* Sharp Black Rings (Pure Black for King Julien Look) */}
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
         {/* Main Torso - Slender */}
         <path 
            d="M80 120 Q 70 170 85 200 L 115 200 Q 130 170 120 120" 
            fill="url(#furGrey)" 
            stroke={outlineColor} 
            strokeWidth={outlineWidth}
            filter="url(#softShadow)"
         />
         {/* White Chest/Belly */}
         <path 
            d="M90 120 Q 85 160 92 180 L 108 180 Q 115 160 110 120" 
            fill="url(#bellyWhite)" 
            opacity="0.9"
         />
      </g>

      {/* --- HEAD GROUP --- */}
      <g transform="translate(0, 10)">
         
         {/* Ears - Large and Triangular */}
         <path d="M45 65 Q 35 30 65 45 L 70 80 Z" fill="#64748b" stroke={outlineColor} strokeWidth={outlineWidth} />
         <path d="M48 62 Q 42 40 62 50" fill="#fbcfe8" /> {/* Inner Ear Pink */}
         
         <path d="M155 65 Q 165 30 135 45 L 130 80 Z" fill="#64748b" stroke={outlineColor} strokeWidth={outlineWidth} />
         <path d="M152 62 Q 158 40 138 50" fill="#fbcfe8" />

         {/* Cheek Fluff (Royal Beard/Sideburns) */}
         <path d="M60 100 L 40 110 L 62 120 Z" fill="#e2e8f0" stroke={outlineColor} strokeWidth="1" />
         <path d="M140 100 L 160 110 L 138 120 Z" fill="#e2e8f0" stroke={outlineColor} strokeWidth="1" />

         {/* Main Head Shape (Wide top, narrow chin) */}
         <path 
            d="M60 75 Q 100 50 140 75 Q 155 90 140 125 Q 100 155 60 125 Q 45 90 60 75" 
            fill="#e2e8f0" 
            stroke={outlineColor} 
            strokeWidth={outlineWidth}
            filter="url(#softShadow)"
         />

         {/* The "Mask" - Dark Grey/Black around eyes */}
         <path d="M65 80 Q 55 95 70 110 Q 85 115 90 95 Q 90 75 65 80" fill="#1e293b" opacity="0.95" />
         <path d="M135 80 Q 145 95 130 110 Q 115 115 110 95 Q 110 75 135 80" fill="#1e293b" opacity="0.95" />

         {/* Snout/Muzzle - Pointier */}
         <path d="M85 110 Q 100 105 115 110 Q 110 130 100 135 Q 90 130 85 110" fill="#ffffff" stroke={outlineColor} strokeWidth="1" />
         
         {/* Nose */}
         <path d="M92 118 Q 100 116 108 118 L 100 124 Z" fill="#000000" />

         {/* Mouth & Expressions */}
         {variant === 'pleading' ? (
             <path d="M94 128 Q 100 125 106 128" stroke={outlineColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
         ) : variant === 'thinking' ? (
             <path d="M96 128 L 104 128" stroke={outlineColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
         ) : (
             // KING JULIEN GRIN (Toothy and cheeky)
             <g>
               <path d="M88 126 Q 100 138 112 126 Q 100 120 88 126 Z" fill="#ffffff" stroke={outlineColor} strokeWidth="1" />
               <path d="M88 126 Q 100 130 112 126" fill="none" stroke={outlineColor} strokeWidth="0.5" opacity="0.5" />
             </g>
         )}

         {/* --- EYES --- */}
         {variant === 'pleading' ? (
             // PLEADING EYES (Huge, Wet, "Mort" Style)
             <g className="mascot-plead">
                 {/* Left */}
                 <circle cx="76" cy="95" r="13" fill="#000" />
                 <circle cx="76" cy="95" r="12" fill="url(#eyeGold)" />
                 <circle cx="76" cy="95" r="9" fill="#000" />
                 <circle cx="72" cy="89" r="4" fill="#fff" />
                 <circle cx="80" cy="97" r="2" fill="#fff" opacity="0.7" />
                 
                 {/* Right */}
                 <circle cx="124" cy="95" r="13" fill="#000" />
                 <circle cx="124" cy="95" r="12" fill="url(#eyeGold)" />
                 <circle cx="124" cy="95" r="9" fill="#000" />
                 <circle cx="120" cy="89" r="4" fill="#fff" />
                 <circle cx="128" cy="97" r="2" fill="#fff" opacity="0.7" />
             </g>
         ) : (
             // KING JULIEN EYES (Crazy, Intense, Small Pupil)
             <g className="mascot-eye-container">
                 {/* Left */}
                 <circle cx="76" cy="94" r="11" fill="#f59e0b" stroke="#000" strokeWidth="1.5" /> {/* Orange/Gold */}
                 <circle cx="76" cy="94" r="9" fill="#fbbf24" /> {/* Inner bright yellow */}
                 <g className="mascot-pupil">
                    <circle cx="76" cy="94" r="2.5" fill="#000" />
                    <circle cx="77" cy="93" r="0.8" fill="#fff" />
                 </g>
                 
                 {/* Eyelid for expression */}
                 {variant === 'thinking' && <path d="M65 88 Q 76 96 87 88" fill="none" stroke="#1e293b" strokeWidth="2" />}

                 {/* Right */}
                 <circle cx="124" cy="94" r="11" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
                 <circle cx="124" cy="94" r="9" fill="#fbbf24" />
                 {variant === 'telescope' ? (
                    // Squinting right eye
                    <path d="M113 94 Q 124 100 135 94" stroke="#000" strokeWidth="2.5" fill="none" />
                 ) : (
                    <g className="mascot-pupil">
                        <circle cx="124" cy="94" r="2.5" fill="#000" />
                        <circle cx="125" cy="93" r="0.8" fill="#fff" />
                    </g>
                 )}
             </g>
         )}

         {/* --- THE CROWN (The King Element - Taller and Grander) --- */}
         <g className="mascot-crown" transform="translate(0, -10)">
             {/* Base Leaves - Wider */}
             <path d="M60 65 L 65 35 L 85 62 Z" fill="url(#crownLeaf)" stroke={outlineColor} strokeWidth="1" />
             <path d="M140 65 L 135 35 L 115 62 Z" fill="url(#crownLeaf)" stroke={outlineColor} strokeWidth="1" />
             <path d="M80 62 L 100 20 L 120 62 Z" fill="url(#crownLeaf)" stroke={outlineColor} strokeWidth="1" />
             
             {/* Tall Central Feather/Structure - The iconic King Julien height */}
             <path d="M100 60 L 105 5 L 95 5 Z" fill="#facc15" stroke={outlineColor} strokeWidth="1" /> {/* Stick */}
             <path d="M100 60 Q 125 30 100 0 Q 75 30 100 60" fill="url(#crownFeather)" stroke={outlineColor} strokeWidth="1" opacity="0.9" />
             
             {/* Gem */}
             <circle cx="100" cy="62" r="6" fill="#f59e0b" stroke={outlineColor} strokeWidth="1.5" />
             <circle cx="102" cy="60" r="2" fill="#fff" opacity="0.6" />
         </g>

      </g>

      {/* --- ARMS & ACCESSORIES --- */}
      <g transform="translate(0, 20)">
          
          {/* TELESCOPE MODE */}
          {variant === 'telescope' && (
             <g>
                {/* Telescope Object */}
                <rect x="90" y="100" width="80" height="15" fill="#475569" transform="rotate(-15 90 100)" stroke={outlineColor} strokeWidth="1" />
                <rect x="160" y="80" width="10" height="20" fill="#f59e0b" transform="rotate(-15 160 80)" stroke={outlineColor} strokeWidth="1" />
                
                {/* Hands holding it - BLACK HANDS */}
                <circle cx="95" cy="115" r="6" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
                <circle cx="130" cy="105" r="6" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
             </g>
          )}

          {/* THINKING MODE */}
          {variant === 'thinking' && (
             <g>
                <path d="M80 130 Q 70 150 90 145" stroke={outlineColor} strokeWidth="8" fill="none" strokeLinecap="round" />
                <path d="M80 130 Q 70 150 90 145" stroke="#94a3b8" strokeWidth="6" fill="none" strokeLinecap="round" />
                {/* Black Hand */}
                <circle cx="92" cy="142" r="5" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
             </g>
          )}

          {/* DEFAULT / PLEADING (Hands on hips/chest) */}
          {(variant === 'default' || variant === 'pleading') && (
             <g>
                {/* Left Arm */}
                <path d="M75 130 Q 60 150 75 160" fill="none" stroke={outlineColor} strokeWidth="8" strokeLinecap="round" />
                <path d="M75 130 Q 60 150 75 160" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                <circle cx="75" cy="160" r="5" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />

                {/* Right Arm */}
                <path d="M125 130 Q 140 150 125 160" fill="none" stroke={outlineColor} strokeWidth="8" strokeLinecap="round" />
                <path d="M125 130 Q 140 150 125 160" fill="none" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />
                <circle cx="125" cy="160" r="5" fill="#1a1a1a" stroke={outlineColor} strokeWidth="1" />
             </g>
          )}

          {/* BUCKET MODE (Holding papers) */}
          {variant === 'bucket' && (
             <g>
                 <rect x="80" y="140" width="40" height="30" fill="#3b82f6" stroke={outlineColor} strokeWidth="1.5" />
                 <path d="M80 140 L 90 170 L 110 170 L 120 140 Z" fill="#2563eb" opacity="0.5" />
                 <rect x="90" y="130" width="10" height="20" fill="#fff" stroke="#cbd5e1" transform="rotate(-10 90 140)" />
                 <rect x="100" y="130" width="10" height="20" fill="#fff" stroke="#cbd5e1" transform="rotate(10 100 140)" />
                 
                 {/* Hands holding bucket - BLACK HANDS */}
                 <circle cx="80" cy="145" r="5" fill="#1a1a1a" stroke={outlineColor} />
                 <circle cx="120" cy="145" r="5" fill="#1a1a1a" stroke={outlineColor} />
             </g>
          )}
      </g>

      {/* Feet - BLACK FEET */}
      <g transform="translate(0, 20)">
         <ellipse cx="85" cy="200" rx="9" ry="5" fill="#1a1a1a" />
         <ellipse cx="115" cy="200" rx="9" ry="5" fill="#1a1a1a" />
      </g>

    </svg>
  );
};
