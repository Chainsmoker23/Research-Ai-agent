
import React, { useEffect, useState, useRef } from 'react';

interface MortMascotProps {
  className?: string;
  variant?: 'standing' | 'walking' | 'pleading';
  style?: React.CSSProperties;
}

export const MortMascot: React.FC<MortMascotProps> = ({ className = "w-32 h-32", variant = 'standing', style }) => {
  const outlineColor = "#3f2c22"; 
  const outlineWidth = "1.5";
  
  // Mouse tracking state for pupils
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        
        // Calculate mouse position relative to SVG center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        
        // Limit movement range (max 4px for responsiveness)
        const maxMove = 4;
        const distance = Math.sqrt(dx*dx + dy*dy);
        const factor = Math.min(distance, 600) / 600; 
        
        const angle = Math.atan2(dy, dx);
        const moveX = Math.cos(angle) * maxMove * factor;
        const moveY = Math.sin(angle) * maxMove * factor;

        setPupilPos({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <svg 
        ref={svgRef}
        viewBox="0 0 200 240" 
        className={className} 
        style={style} 
        xmlns="http://www.w3.org/2000/svg" 
        preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Fur Gradient: Deep Ginger/Amber */}
        <radialGradient id="mortFur" cx="50%" cy="40%" r="70%">
          <stop offset="40%" stopColor="#cd6702" /> {/* Rich Ginger */}
          <stop offset="90%" stopColor="#8a3005" /> {/* Darker edge */}
        </radialGradient>
        
        {/* Cream Face Mask Gradient */}
        <radialGradient id="mortCream" cx="50%" cy="60%" r="60%">
            <stop offset="20%" stopColor="#ffffff" /> {/* Bright center */}
            <stop offset="100%" stopColor="#fcd3a4" /> {/* Blends into fur */}
        </radialGradient>

        {/* Deep Galaxy Eyes */}
        <radialGradient id="mortEyeDeep" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2e1005" /> 
            <stop offset="70%" stopColor="#1a0500" /> 
            <stop offset="100%" stopColor="#000000" />
        </radialGradient>

        {/* Inner Ear Gradient */}
        <linearGradient id="mortEar" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fca5a5" />
            <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>

        {/* Texture Filter for Fluffy Edges */}
        <filter id="fluff" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" />
        </filter>

        {/* Soft Drop Shadow for Head Depth */}
        <filter id="headShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
          <feOffset dx="0" dy="5" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.4" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <style>
          {`
            @keyframes mort-blink {
               0%, 96% { transform: scaleY(1); }
               98% { transform: scaleY(0.1); }
               100% { transform: scaleY(1); }
            }
            @keyframes mort-tear-drop {
               0% { transform: translateY(0) scale(0); opacity: 0; }
               20% { transform: translateY(0) scale(1); opacity: 0.8; }
               80% { transform: translateY(60px) scale(1.2); opacity: 0.6; }
               100% { transform: translateY(70px) scale(0); opacity: 0; }
            }
            @keyframes mort-quiver {
               0%, 100% { transform: translateX(0); }
               25% { transform: translateX(0.5px) translateY(0.5px); }
               75% { transform: translateX(-0.5px) translateY(-0.5px); }
            }
            @keyframes mort-tail-swish {
               0%, 100% { transform: rotate(0deg); }
               50% { transform: rotate(4deg); }
            }
            @keyframes mort-breathe {
               0%, 100% { transform: scale(1); }
               50% { transform: scale(1.02); }
            }
            @keyframes mort-walk-bob {
               0%, 100% { transform: translateY(0); }
               50% { transform: translateY(-5px); }
            }
            @keyframes mort-ear-twitch {
                0%, 90% { transform: rotate(0deg); }
                95% { transform: rotate(5deg); }
                100% { transform: rotate(0deg); }
            }
            @keyframes mort-ear-droop-sad {
                0%, 100% { transform: rotate(15deg) translateY(5px); }
                50% { transform: rotate(20deg) translateY(8px); }
            }
            @keyframes wet-shine {
                0%, 100% { opacity: 0.6; transform: scale(1); }
                50% { opacity: 0.95; transform: scale(1.15); }
            }
            @keyframes hand-wring {
                0%, 100% { transform: translateX(0); }
                50% { transform: translateX(1.5px); }
            }
            @keyframes shiver {
                0%, 100% { transform: translate(0,0); }
                25% { transform: translate(0.5px, 0.5px); }
                75% { transform: translate(-0.5px, -0.5px); }
            }
            @keyframes tuft-bounce {
                0%, 100% { transform: rotate(0deg); }
                50% { transform: rotate(-5deg); }
            }

            .mort-eyes { transform-origin: 100px 110px; animation: mort-blink 5s infinite; }
            .mort-tear-1 { animation: mort-tear-drop 3s infinite 1s; }
            .mort-tear-2 { animation: mort-tear-drop 4s infinite 0s; }
            .mort-mouth { animation: mort-quiver 2.5s infinite; }
            /* Dynamic Ears based on mood */
            .mort-ear-l { transform-origin: 60px 90px; animation: ${variant === 'pleading' ? 'mort-ear-droop-sad 4s ease-in-out infinite' : 'mort-ear-twitch 6s infinite'}; }
            .mort-ear-r { transform-origin: 140px 90px; animation: ${variant === 'pleading' ? 'mort-ear-droop-sad 4s ease-in-out infinite reverse' : 'mort-ear-twitch 7s infinite reverse'}; }
            
            .mort-body-static { transform-origin: center bottom; animation: mort-breathe 4s ease-in-out infinite; }
            .mort-body-plead { transform-origin: center bottom; animation: mort-breathe 3s ease-in-out infinite, shiver 0.4s linear infinite; }
            .mort-body-walk { animation: mort-walk-bob 0.4s infinite; }
            .mort-tail-anim { transform-origin: 100px 200px; animation: mort-tail-swish 5s ease-in-out infinite; }
            .mort-shine { animation: wet-shine 3s infinite; }
            .mort-hands { animation: hand-wring 1.5s ease-in-out infinite; }
            .mort-tuft { transform-origin: 100px 70px; animation: tuft-bounce 3s ease-in-out infinite; }
          `}
        </style>
      </defs>

      <g className={variant === 'walking' ? 'mort-body-walk' : (variant === 'pleading' ? 'mort-body-plead' : 'mort-body-static')}>
           
           {/* TAIL: Big, bushy, wrapped around */}
           <g className="mort-tail-anim">
             {/* Tail Base Shadow */}
             <path 
                d="M135 180 Q 185 180 195 130 Q 195 90 155 70 Q 125 55 105 85" 
                fill="none" 
                stroke="#602005" 
                strokeWidth="42" 
                strokeLinecap="round"
                opacity="0.3"
             />
             {/* Tail Main Fur */}
             <path 
                d="M135 180 Q 185 180 195 130 Q 195 90 155 70 Q 125 55 105 85" 
                fill="none" 
                stroke="url(#mortFur)" 
                strokeWidth="38" 
                strokeLinecap="round"
                filter="url(#fluff)"
             />
             {/* Tail Texture Stripes */}
             <path 
                d="M135 180 Q 185 180 195 130 Q 195 90 155 70 Q 125 55 105 85" 
                fill="none" 
                stroke="#000" 
                strokeWidth="38" 
                strokeLinecap="round"
                strokeDasharray="10 30"
                opacity="0.1"
             />
           </g>

           {/* FEET */}
           <ellipse cx="80" cy="215" rx="14" ry="8" fill="#cd6702" stroke={outlineColor} strokeWidth={outlineWidth} />
           <ellipse cx="120" cy="215" rx="14" ry="8" fill="#cd6702" stroke={outlineColor} strokeWidth={outlineWidth} />

           {/* BODY BASE */}
           {/* Extended higher to meet the head properly */}
           <path 
              d="M70 150 Q 55 200 100 215 Q 145 200 130 150"
              fill="url(#mortFur)" 
              stroke={outlineColor} 
              strokeWidth={outlineWidth}
           />
           
           {/* Cream Belly Patch */}
           <ellipse cx="100" cy="185" rx="24" ry="30" fill="url(#mortCream)" opacity="0.9" filter="url(#fluff)" />

           {/* NECK FLUFF / RUFF - Crucial for head attachment */}
           {/* Sits on top of body, behind chin */}
           <path 
              d="M65 145 Q 100 165 135 145 Q 120 160 100 160 Q 80 160 65 145" 
              fill="#d97706" 
              stroke="none"
              filter="url(#fluff)"
           />

           {/* ARMS */}
           {variant === 'pleading' ? (
             <g className="mort-hands">
                <path d="M75 165 Q 90 185 96 182" stroke="#cd6702" strokeWidth="9" strokeLinecap="round" />
                <path d="M125 165 Q 110 185 104 182" stroke="#cd6702" strokeWidth="9" strokeLinecap="round" />
                {/* Clasping Hands */}
                <circle cx="97" cy="182" r="5" fill="#fdb35d" stroke={outlineColor} strokeWidth="1" />
                <circle cx="103" cy="182" r="5" fill="#fdb35d" stroke={outlineColor} strokeWidth="1" />
             </g>
           ) : (
             <g>
               <circle cx="65" cy="175" r="6" fill="#fdb35d" stroke={outlineColor} strokeWidth="1" />
               <circle cx="135" cy="175" r="6" fill="#fdb35d" stroke={outlineColor} strokeWidth="1" />
             </g>
           )}

           {/* --- HEAD GROUP --- */}
           {/* Lowered slightly to sit IN the neck fluff, not ON it */}
           <g transform="translate(0, 5)" filter="url(#headShadow)">
               
               {/* Ears - Large and distinct */}
               <g className="mort-ear-l">
                   <path d="M45 100 Q 10 70 30 55 Q 50 45 60 85 Z" fill="#602005" stroke={outlineColor} strokeWidth={outlineWidth} /> 
                   <path d="M42 95 Q 18 72 32 60 Q 48 52 55 80 Z" fill="url(#mortEar)" />
               </g>
               <g className="mort-ear-r">
                   <path d="M155 100 Q 190 70 170 55 Q 150 45 140 85 Z" fill="#602005" stroke={outlineColor} strokeWidth={outlineWidth} /> 
                   <path d="M158 95 Q 182 72 168 60 Q 152 52 145 80 Z" fill="url(#mortEar)" />
               </g>

               {/* MAIN HEAD SHAPE (Base Orange) */}
               {/* Wider cheeks, flatter top */}
               <path 
                  d="M40 100 Q 35 140 60 150 Q 100 160 140 150 Q 165 140 160 100 Q 155 50 100 50 Q 45 50 40 100"
                  fill="url(#mortFur)"
                  stroke={outlineColor}
                  strokeWidth={outlineWidth}
               />

               {/* FACE MARKINGS: The Distinct Muzzle & Forehead Stripe */}
               {/* This path defines the connected white pattern from mouth to forehead */}
               <path 
                  d="
                    M 48 135           /* Left Cheek Start */
                    Q 42 120 65 115    /* Cheek curve upwards */
                    Q 85 125 94 110    /* Narrowing towards nose bridge (under left eye) */
                    L 94 70            /* Vertical Stripe Up */
                    Q 100 60 106 70    /* Forehead Flare/Peak */
                    L 106 110          /* Vertical Stripe Down */
                    Q 115 125 135 115  /* Out towards cheek (under right eye) */
                    Q 158 120 152 135  /* Right Cheek curve */
                    Q 150 150 100 155  /* Chin Bottom */
                    Q 50 150 48 135    /* Close Loop */
                  "
                  fill="url(#mortCream)"
                  opacity="0.95"
                  stroke="none"
               />
               
               {/* Extra Forehead Fur Tuft (Orange point dipping into white) */}
               {/* This creates the widow's peak effect visually by overlaying orange */}
               <path d="M90 52 Q 100 65 110 52" fill="#cd6702" stroke="none" /> 

               {/* Little White Hair Tuft on Top */}
               <g className="mort-tuft">
                   <path d="M98 50 Q 95 35 92 45" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                   <path d="M100 50 Q 100 30 102 45" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
                   <path d="M102 50 Q 105 35 108 45" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
               </g>

               {/* EYES */}
               <g className="mort-eyes">
                  {/* Socket/Eyelids - Darker fur surrounding eyes */}
                  <circle cx="72" cy="110" r="22" fill="#292524" opacity="0.2" />
                  <circle cx="128" cy="110" r="22" fill="#292524" opacity="0.2" />
                  
                  {/* Eyeballs - Massive */}
                  <g style={{ transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)` }}>
                      <circle cx="72" cy="110" r="20" fill="url(#mortEyeDeep)" />
                      <circle cx="128" cy="110" r="20" fill="url(#mortEyeDeep)" />
                      
                      {/* Pupils */}
                      <circle cx="72" cy="110" r="14" fill="#000" />
                      <circle cx="128" cy="110" r="14" fill="#000" />
                  </g>
                  
                  {/* Wet Shine Highlights */}
                  <g className="mort-shine">
                      {/* Main Reflection */}
                      <circle cx="64" cy="101" r="7" fill="#fff" opacity="0.9" />
                      <circle cx="120" cy="101" r="7" fill="#fff" opacity="0.9" />
                      
                      {/* Secondary Reflection */}
                      <circle cx="76" cy="115" r="3" fill="#fff" opacity="0.6" />
                      <circle cx="132" cy="115" r="3" fill="#fff" opacity="0.6" />
                  </g>

                  {/* Lower Waterline/Eyelid for sadness */}
                  {variant === 'pleading' && (
                      <g>
                        <path d="M54 115 Q 72 130 90 115" stroke="#fca5a5" strokeWidth="2" fill="none" opacity="0.5" />
                        <path d="M110 115 Q 128 130 146 115" stroke="#fca5a5" strokeWidth="2" fill="none" opacity="0.5" />
                      </g>
                  )}
               </g>

               {/* TEARS */}
               {variant === 'pleading' && (
                 <g transform="translate(0, 10)">
                      {/* Puddled Tears */}
                      <path d="M58 120 Q 72 133 86 120" fill="#bfdbfe" opacity="0.4" />
                      <path d="M114 120 Q 128 133 142 120" fill="#bfdbfe" opacity="0.4" />

                      {/* Drops */}
                      <g className="mort-tear-1">
                          <path d="M68 125 Q 72 130 68 135 Q 64 130 68 125" fill="#60a5fa" />
                      </g>
                      <g className="mort-tear-2">
                          <path d="M132 125 Q 136 130 132 135 Q 128 130 132 125" fill="#60a5fa" />
                      </g>
                 </g>
               )}

               {/* NOSE & MOUTH */}
               <g className="mort-mouth" transform="translate(0,-2)">
                   <ellipse cx="100" cy="142" rx="6" ry="4" fill="#fda4af" /> {/* Pink Nose */}
                   {variant === 'pleading' ? (
                      // Sad quiver
                      <path d="M96 149 Q 100 147 104 149" stroke="#3f2c22" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                   ) : (
                      // Tiny smile
                      <path d="M94 149 Q 100 152 106 149" stroke="#3f2c22" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                   )}
               </g>
           </g>

      </g>
    </svg>
  );
};
