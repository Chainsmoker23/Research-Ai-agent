import React from 'react';

interface LemurMascotProps {
  className?: string;
  variant?: 'default' | 'telescope' | 'bucket' | 'pleading';
}

export const LemurMascot: React.FC<LemurMascotProps> = ({ className = "w-64 h-64", variant = 'default' }) => {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="telescopeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="50%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="lensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" opacity="0.8" />
            <stop offset="100%" stopColor="#93c5fd" opacity="0.4" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="4" result="offsetblur" />
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
            @keyframes sway {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(4deg); }
            }
            @keyframes bob {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-3px); }
            }
            @keyframes blink {
              0%, 96%, 98% { transform: scaleY(1); }
              97% { transform: scaleY(0.1); }
            }
            @keyframes tassel-swing {
              0%, 100% { transform: rotate(-3deg); }
              50% { transform: rotate(3deg); }
            }
            @keyframes telescope-scan {
               0% { transform: rotate(-8deg); }
               50% { transform: rotate(2deg); }
               100% { transform: rotate(-8deg); }
            }
            @keyframes bucket-heavy {
               0%, 100% { transform: translateY(0); }
               50% { transform: translateY(2px); }
            }
            @keyframes lens-glint {
                0%, 100% { opacity: 0; transform: scale(0.5); }
                50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
            }
            @keyframes plead-tremble {
                0%, 100% { transform: translateY(0); }
                25% { transform: translateY(1px); }
                75% { transform: translateY(-1px); }
            }
            .lemur-tail { transform-origin: 130px 140px; animation: sway 4s ease-in-out infinite; }
            .lemur-head { animation: bob 5s ease-in-out infinite; }
            .lemur-head-plead { animation: plead-tremble 3s ease-in-out infinite; }
            .lemur-eye { transform-origin: center; animation: blink 4s infinite; }
            .lemur-tassel { transform-origin: 138px 55px; animation: tassel-swing 3s ease-in-out infinite; }
            .lemur-telescope { transform-origin: 100px 95px; animation: telescope-scan 6s ease-in-out infinite; }
            .lemur-bucket { animation: bucket-heavy 2s ease-in-out infinite; }
            .glint-star { transform-origin: 175px 88px; animation: lens-glint 3s infinite; }
          `}
        </style>
      </defs>

      {/* Tail Group - Black & White Rings */}
      <g className="lemur-tail" filter="url(#shadow)">
        {/* Base White Tail */}
        <path 
          d="M130 140 C 170 140, 195 100, 160 70 C 150 60, 140 70, 135 80" 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="20" 
          strokeLinecap="round" 
        />
        {/* Black Rings */}
        <path 
          d="M130 140 C 170 140, 195 100, 160 70 C 150 60, 140 70, 135 80" 
          fill="none" 
          stroke="#1e293b" 
          strokeWidth="20" 
          strokeLinecap="butt"
          strokeDasharray="14 14"
        />
      </g>

      {/* Body */}
      <ellipse cx="100" cy="150" rx="42" ry="48" fill="url(#bodyGrad)" filter="url(#shadow)" />
      <ellipse cx="100" cy="150" rx="25" ry="35" fill="#ffffff" opacity="0.6" />

      {/* Head Group */}
      <g className={variant === 'pleading' ? "lemur-head-plead" : "lemur-head"} transform="translate(0, -10)">
        {/* Ears */}
        <path d="M65 65 L55 40 L85 55 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
        <path d="M135 65 L145 40 L115 55 Z" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Head Shape */}
        <circle cx="100" cy="90" r="38" fill="#f8fafc" filter="url(#shadow)" />
        
        {/* Black Eye Mask */}
        <path d="M82 82 Q 70 82 66 90 Q 66 102 82 102 Q 92 102 96 92 Z" fill="#1e293b" />
        <path d="M118 82 Q 130 82 134 90 Q 134 102 118 102 Q 108 102 104 92 Z" fill="#1e293b" />

        {/* Eyes Configuration */}
        {variant === 'telescope' ? (
           <g>
              {/* Left Eye (Open/Observing) */}
              <g className="lemur-eye">
                  <circle cx="82" cy="92" r="4.5" fill="#fbbf24" />
                  <circle cx="82" cy="92" r="2" fill="#000" />
              </g>
              {/* Right Eye (Squinted/Closed into telescope) */}
              <path d="M114 94 Q 118 90 122 94" fill="none" stroke="#fbbf24" strokeWidth="2" />
           </g>
        ) : variant === 'pleading' ? (
           <g>
              {/* Pleading Eyes: Big Black Circles with multiple highlights */}
               <g transform="translate(0, 2)">
                  {/* Left */}
                  <circle cx="82" cy="94" r="7" fill="#000" />
                  <circle cx="79" cy="91" r="2.5" fill="#fff" />
                  <circle cx="84" cy="96" r="1" fill="#fff" opacity="0.8" />
                  
                  {/* Right */}
                  <circle cx="118" cy="94" r="7" fill="#000" />
                  <circle cx="115" cy="91" r="2.5" fill="#fff" />
                  <circle cx="120" cy="96" r="1" fill="#fff" opacity="0.8" />
                  
                  {/* Tiny eyebrows making sad face */}
                  <path d="M75 80 Q 82 78 88 82" stroke="#cbd5e1" strokeWidth="2" fill="none" />
                  <path d="M112 82 Q 118 78 125 80" stroke="#cbd5e1" strokeWidth="2" fill="none" />
               </g>
           </g>
        ) : (
           <g>
              <g className="lemur-eye">
                <circle cx="82" cy="92" r="4.5" fill="#fbbf24" />
                <circle cx="82" cy="92" r="2" fill="#000" />
              </g>
              <g className="lemur-eye">
                <circle cx="118" cy="92" r="4.5" fill="#fbbf24" />
                <circle cx="118" cy="92" r="2" fill="#000" />
              </g>
           </g>
        )}

        {/* Nose */}
        <path d="M96 108 Q 100 111 104 108 L 100 113 Z" fill="#0f172a" />
        
        {/* Mouth */}
        {variant === 'pleading' && (
             <path d="M96 118 Q 100 116 104 118" stroke="#1e293b" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        )}

        {/* Graduation Cap */}
        <path d="M60 55 L100 35 L140 55 L100 75 Z" fill="#1e293b" stroke="#334155" strokeWidth="1" />
        <path d="M125 60 Q 130 75 100 75 Q 70 75 75 60" fill="none" stroke="#1e293b" strokeWidth="2" opacity="0.8" /> 
        <g>
           <circle cx="100" cy="55" r="2" fill="#fbbf24" />
           <line x1="100" y1="55" x2="138" y2="55" stroke="#fbbf24" strokeWidth="1" />
           <g className="lemur-tassel">
             <line x1="138" y1="55" x2="138" y2="90" stroke="#fbbf24" strokeWidth="3" />
             <circle cx="138" cy="90" r="3" fill="#fbbf24" />
           </g>
        </g>
      </g>

      {/* VARIANT: TELESCOPE */}
      {variant === 'telescope' && (
         <g className="lemur-telescope">
            {/* Left Arm (Back) - White fur connecting body to top of scope */}
            <path d="M85 145 Q 75 120 90 98" stroke="#cbd5e1" strokeWidth="12" fill="none" strokeLinecap="round" />
            
            {/* Left Hand (Back) - Black skin gripping top of telescope */}
            <g transform="rotate(-12 100 95)">
                 {/* Fingers curling over the top from the back side */}
                 <ellipse cx="98" cy="85" rx="3.5" ry="5.5" fill="#0f172a" transform="rotate(-10 98 85)" />
                 <ellipse cx="106" cy="84" rx="3.5" ry="5.5" fill="#0f172a" transform="rotate(0 106 84)" />
                 <ellipse cx="114" cy="85" rx="3.5" ry="5.5" fill="#0f172a" transform="rotate(10 114 85)" />
            </g>

            {/* Telescope Body */}
            <g transform="rotate(-12 100 95)">
                <rect x="95" y="85" width="85" height="22" fill="url(#telescopeGrad)" rx="2" />
                <rect x="90" y="88" width="8" height="16" fill="#1e293b" rx="1" />
                <rect x="175" y="83" width="6" height="26" fill="#fbbf24" rx="1" />
                <rect x="110" y="85" width="4" height="22" fill="#fbbf24" />
                {/* Lens Glass */}
                <ellipse cx="182" cy="96" rx="3" ry="11" fill="url(#lensGrad)" />
            </g>

            {/* Right Arm (Front) - White fur */}
            <path d="M115 150 Q 135 140 145 115" stroke="#cbd5e1" strokeWidth="12" fill="none" strokeLinecap="round" />
            
            {/* Right Hand (Front) - Detailed Paw Structure with Joints */}
            <g transform="rotate(-12 100 95)">
                {/* Furry Wrist connection */}
                <circle cx="145" cy="116" r="7.5" fill="#cbd5e1" />
                
                {/* Main Palm Base - Black Skin */}
                <path d="M138 112 Q 136 122 146 125 Q 156 126 160 115 L 155 108 Z" fill="#0f172a" />

                {/* THUMB - Gripping bottom */}
                {/* Thumb Base Joint */}
                <ellipse cx="140" cy="118" rx="4.5" ry="6" fill="#1e293b" transform="rotate(-40 140 118)" />
                {/* Thumb Tip (Curving under telescope) */}
                <path d="M138 122 Q 142 128 150 126" stroke="#0f172a" strokeWidth="5" fill="none" strokeLinecap="round" />
                {/* Thumb Nail */}
                <path d="M149 126 Q 151 126 152 124" stroke="#475569" strokeWidth="2" fill="none" opacity="0.8" />

                {/* FINGER 1 (Index) */}
                {/* Proximal Phalanx */}
                <path d="M148 110 L 150 102" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
                {/* Knuckle Definition */}
                <circle cx="150" cy="102" r="3" fill="#1e293b" />
                {/* Distal Phalanx (Wrapping over) */}
                <path d="M150 102 Q 152 96 146 95" fill="none" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
                {/* Nail */}
                <ellipse cx="146" cy="95" rx="1.5" ry="1" fill="#94a3b8" transform="rotate(-20 146 95)" />

                {/* FINGER 2 (Middle) */}
                {/* Proximal Phalanx */}
                <path d="M154 112 L 158 100" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
                {/* Knuckle */}
                <circle cx="158" cy="100" r="3" fill="#1e293b" />
                {/* Distal Phalanx */}
                <path d="M158 100 Q 162 92 154 90" fill="none" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
                {/* Nail */}
                <ellipse cx="154" cy="90" rx="1.5" ry="1" fill="#94a3b8" transform="rotate(-10 154 90)" />

                {/* FINGER 3 (Ring) */}
                {/* Proximal Phalanx */}
                <path d="M160 115 L 165 105" stroke="#0f172a" strokeWidth="5" strokeLinecap="round" />
                {/* Knuckle */}
                <circle cx="165" cy="105" r="3" fill="#1e293b" />
                {/* Distal Phalanx */}
                <path d="M165 105 Q 169 98 163 96" fill="none" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
                 {/* Nail */}
                <ellipse cx="163" cy="96" rx="1.5" ry="1" fill="#94a3b8" transform="rotate(0 163 96)" />
            </g>
            
            {/* Glinting Star */}
            <path className="glint-star" d="M182 85 L184 94 L193 96 L184 98 L182 107 L180 98 L171 96 L180 94 Z" fill="#ffffff" />
         </g>
      )}

      {/* VARIANT: BUCKET */}
      {variant === 'bucket' && (
          <g className="lemur-bucket">
              {/* Bucket Body */}
              <path d="M70 140 L 80 185 L 140 185 L 150 140 Z" fill="#3b82f6" stroke="#1e3a8a" strokeWidth="2" />
              <ellipse cx="110" cy="140" rx="40" ry="8" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="2" />
              <ellipse cx="110" cy="140" rx="35" ry="6" fill="#1e3a8a" opacity="0.3" />
              <path d="M70 140 Q 110 100 150 140" fill="none" stroke="#94a3b8" strokeWidth="4" />
              
              {/* Papers */}
              <rect x="90" y="125" width="20" height="25" fill="#fff" stroke="#cbd5e1" transform="rotate(-15 100 140)" />
              <rect x="110" y="120" width="20" height="25" fill="#fff" stroke="#cbd5e1" transform="rotate(10 110 140)" />
          </g>
      )}

      {/* DEFAULT ARMS / BOOK */}
      {variant === 'default' && (
        <>
            <rect x="65" y="155" width="70" height="45" rx="3" fill="#4338ca" transform="rotate(-6 100 180)" filter="url(#shadow)" />
            <path d="M70 160 L130 160" stroke="#818cf8" strokeWidth="2" transform="rotate(-6 100 180)" />
            <rect x="90" y="165" width="20" height="25" rx="1" fill="#e0e7ff" transform="rotate(-6 100 180)" />
            
            <path d="M75 145 Q 65 160 80 165" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
            <path d="M125 145 Q 135 160 120 165" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
        </>
      )}

       {/* PLEADING HANDS (Holding together) */}
       {variant === 'pleading' && (
        <>
           {/* Paws clasped together in front of chest */}
           <path d="M80 150 Q 100 160 100 140" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
           <path d="M120 150 Q 100 160 100 140" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
           {/* Hands/Paws */}
           <circle cx="100" cy="140" r="8" fill="#1e293b" />
        </>
       )}

      {/* Arms holding Bucket */}
      {variant === 'bucket' && (
        <>
           <path d="M75 145 Q 70 150 70 140" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
           <path d="M125 145 Q 150 150 150 140" fill="none" stroke="#cbd5e1" strokeWidth="10" strokeLinecap="round" />
        </>
      )}

    </svg>
  );
};