import React from 'react';

/**
 * CyberAssetVisual renders ultra-stylized 3D Can & 6-Pack Box graphics
 * with photorealistic rim lights, condensation droplets, snow, glowing red panther eyes,
 * and holographic aurora accents.
 */
export default function CyberAssetVisual({ 
  product, 
  viewMode = 'box', // 'box' (MIT Verpackung) or 'cans_snow' (OHNE Verpackung / 2 Dosen im Schnee)
  className = "w-full h-full",
  interactive = false
}) {
  const isBox = product?.isBox;
  const accent = product?.accentColor || '#00e5ff';
  const secondary = product?.secondaryColor || '#ff003c';
  const name = product?.name || 'DJ CYBERPANTHER';
  const tag = product?.flavorTag || 'Winter Rave Edition';

  // If viewMode is 'box' and it's a Duo Mix box:
  if (viewMode === 'box' && isBox) {
    return (
      <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
        {/* Northern Lights / Aurora Ambient Glow */}
        <div 
          className="absolute inset-0 opacity-40 blur-3xl rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${accent} 0%, ${secondary} 40%, transparent 70%)`
          }}
        />

        <svg 
          viewBox="0 0 500 500" 
          className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Box Front Face Gradient */}
            <linearGradient id={`boxGrad_${product.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#15171e" />
              <stop offset="45%" stopColor="#0b0d12" />
              <stop offset="100%" stopColor="#040507" />
            </linearGradient>

            {/* Box Top Lip 3D Angle */}
            <linearGradient id={`boxTop_${product.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2c303c" />
              <stop offset="100%" stopColor="#12141a" />
            </linearGradient>

            {/* Neon Rim Cyan */}
            <linearGradient id={`neonRim_${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff003c" stopOpacity="0.9" />
            </linearGradient>

            {/* Ice Frost Filter */}
            <filter id={`frostGlow_${product.id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Snow Bed Under Box */}
          <ellipse cx="250" cy="460" rx="190" ry="26" fill="#080c10" opacity="0.9" />
          <path d="M 80 455 Q 250 485 420 455 Q 380 435 250 440 Q 120 435 80 455 Z" fill="#d9f3ff" opacity="0.85" />
          <path d="M 120 450 Q 250 470 380 450 Q 320 445 250 448 Q 180 445 120 450 Z" fill="#ffffff" />

          {/* 3D Box Body (6-Pack Packaging) */}
          <g transform="translate(10, 0)">
            {/* Box Top Flap / 3D Perspective */}
            <polygon points="120,110 360,110 400,150 160,150" fill={`url(#boxTop_${product.id})`} stroke="#00e5ff" strokeWidth="1.2" strokeOpacity="0.6" />
            
            {/* Box Front Face */}
            <rect x="120" y="150" width="280" height="290" rx="10" fill={`url(#boxGrad_${product.id})`} stroke="#1e2433" strokeWidth="2" />
            
            {/* Rim Lighting Borders */}
            <line x1="120" y1="150" x2="120" y2="440" stroke="#00e5ff" strokeWidth="3" opacity="0.8" />
            <line x1="400" y1="150" x2="400" y2="440" stroke="#ff003c" strokeWidth="3" opacity="0.8" />
            <line x1="120" y1="150" x2="400" y2="150" stroke="#00e5ff" strokeWidth="2" opacity="0.6" />

            {/* Carry Handle Cutout at top */}
            <rect x="210" y="170" width="100" height="22" rx="11" fill="#06070a" stroke="#252b38" strokeWidth="1.5" />
            <rect x="215" y="173" width="90" height="16" rx="8" fill="#000000" />

            {/* DJ CYBERPANTHER Black Panther Art on Box */}
            <g transform="translate(260, 260) scale(0.95)">
              {/* Panther Head Silhouette */}
              <polygon points="0,-65 -45,-30 -35,20 -50,45 -20,60 0,68 20,60 50,45 35,20 45,-30" fill="#0a0c12" stroke="#1c2230" strokeWidth="2" />
              {/* Panther Cybernetic Plate Lines */}
              <path d="M -30 -20 L 0 5 L 30 -20" stroke="#00e5ff" strokeWidth="1.5" opacity="0.7" fill="none" />
              <path d="M -35 20 L -15 35 L 0 38 L 15 35 L 35 20" stroke="#ff003c" strokeWidth="1.2" opacity="0.8" fill="none" />
              <line x1="0" y1="-60" x2="0" y2="10" stroke="#00e5ff" strokeWidth="1.5" opacity="0.6" />
              
              {/* Glowing Red Panther Eyes */}
              <ellipse cx="-18" cy="-8" rx="7" ry="3.5" fill="#ff003c" filter={`url(#frostGlow_${product.id})`} />
              <ellipse cx="18" cy="-8" rx="7" ry="3.5" fill="#ff003c" filter={`url(#frostGlow_${product.id})`} />
              <ellipse cx="-18" cy="-8" rx="3" ry="1.5" fill="#ffffff" />
              <ellipse cx="18" cy="-8" rx="3" ry="1.5" fill="#ffffff" />
            </g>

            {/* Typography on Box */}
            <text x="260" y="215" textAnchor="middle" fill="#00e5ff" fontFamily="Orbitron, sans-serif" fontWeight="900" fontSize="14" letterSpacing="2">
              DJ CYBERPANTHER
            </text>
            <text x="260" y="232" textAnchor="middle" fill="#ff003c" fontFamily="Orbitron, sans-serif" fontWeight="800" fontSize="10" letterSpacing="4">
              ENERGY
            </text>

            {/* DUO MIX Badges */}
            <rect x="140" y="340" width="240" height="42" rx="6" fill="#070a10" stroke="#1a202c" strokeWidth="1" />
            <text x="260" y="358" textAnchor="middle" fill="#ffffff" fontFamily="Orbitron, sans-serif" fontWeight="700" fontSize="12" letterSpacing="1">
              DUO MIX 6-PACK
            </text>
            <text x="260" y="373" textAnchor="middle" fill={accent} fontFamily="Rajdhani, sans-serif" fontWeight="600" fontSize="11" letterSpacing="0.5">
              {tag}
            </text>

            {/* Volume Badge 3.0L & 6x500ml */}
            <g transform="translate(135, 395)">
              <rect x="0" y="0" width="115" height="26" rx="4" fill="#0c111c" stroke="#00e5ff" strokeWidth="1" strokeOpacity="0.6" />
              <text x="57" y="17" textAnchor="middle" fill="#00e5ff" fontFamily="Rajdhani, sans-serif" fontWeight="700" fontSize="12">
                6x 500ml (3.0L)
              </text>
            </g>

            {/* Sugar Free & Swiss Engineered Badge */}
            <g transform="translate(265, 395)">
              <rect x="0" y="0" width="115" height="26" rx="4" fill="#0c111c" stroke="#ff003c" strokeWidth="1" strokeOpacity="0.6" />
              <text x="57" y="17" textAnchor="middle" fill="#ff003c" fontFamily="Rajdhani, sans-serif" fontWeight="700" fontSize="11">
                100% SUGAR FREE
              </text>
            </g>

            {/* Condensation / Frost Sprinkles */}
            <circle cx="150" cy="180" r="2" fill="#ffffff" opacity="0.6" />
            <circle cx="170" cy="220" r="1.5" fill="#ffffff" opacity="0.8" />
            <circle cx="370" cy="190" r="2.5" fill="#00e5ff" opacity="0.5" />
            <circle cx="380" cy="310" r="1.8" fill="#ffffff" opacity="0.7" />
            <circle cx="140" cy="300" r="2" fill="#ff003c" opacity="0.5" />
          </g>
        </svg>

        {/* View mode toggle hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#00e5ff]/40 text-[10px] font-mono text-[#00e5ff] tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
          6-PACK BOX (MIT VERPACKUNG)
        </div>
      </div>
    );
  }

  // Render "2 Dosen OHNE Verpackung im Schnee" (viewMode === 'cans_snow' or single can display)
  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
      {/* Dynamic Northern Lights Background Wave */}
      <div 
        className="absolute inset-0 opacity-35 blur-3xl rounded-full"
        style={{
          background: `radial-gradient(circle at 45% 40%, ${accent} 0%, ${secondary} 50%, transparent 75%)`
        }}
      />

      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Can 1 Metallic Gradient (Cylinder effect) */}
          <linearGradient id={`canGrad1_${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#12151b" />
            <stop offset="18%" stopColor="#2c3342" />
            <stop offset="40%" stopColor="#151820" />
            <stop offset="70%" stopColor="#090a0d" />
            <stop offset="90%" stopColor="#252b38" />
            <stop offset="100%" stopColor="#0a0c10" />
          </linearGradient>

          {/* Can 2 Metallic Gradient */}
          <linearGradient id={`canGrad2_${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a0a10" />
            <stop offset="20%" stopColor="#3d141e" />
            <stop offset="45%" stopColor="#1a0a10" />
            <stop offset="75%" stopColor="#0a0a0c" />
            <stop offset="95%" stopColor="#2e1218" />
            <stop offset="100%" stopColor="#0c0709" />
          </linearGradient>

          {/* Rim light left cyan */}
          <linearGradient id={`rimLeft_${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#00e5ff" stopOpacity="0" />
          </linearGradient>

          {/* Rim light right red */}
          <linearGradient id={`rimRight_${product.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff003c" stopOpacity="0" />
            <stop offset="100%" stopColor="#ff003c" stopOpacity="0.95" />
          </linearGradient>

          {/* Frost Condensation Drop Filter */}
          <filter id={`frostFilter_${product.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.25 0" />
            <feComposite in="SourceGraphic" in2="noise" operator="in" />
          </filter>
        </defs>

        {/* Snow Drift Base */}
        <ellipse cx="250" cy="460" rx="200" ry="28" fill="#05080c" opacity="0.95" />
        <path d="M 60 455 Q 160 435 250 440 Q 360 435 440 455 Q 380 480 250 485 Q 120 480 60 455 Z" fill="#bfeaff" opacity="0.7" />
        <path d="M 80 458 Q 180 442 250 446 Q 340 442 420 458 Q 360 475 250 480 Q 140 475 80 458 Z" fill="#ffffff" />
        
        {/* Snow flakes in foreground mound */}
        <ellipse cx="190" cy="452" rx="40" ry="12" fill="#ffffff" />
        <ellipse cx="310" cy="454" rx="45" ry="14" fill="#ffffff" />

        {/* CAN 1 (Left Can - Tilted slightly / Cyber Cyan rim) */}
        <g transform="translate(145, 100) rotate(-6)">
          {/* Can Top Rim & Pull Tab */}
          <ellipse cx="55" cy="20" rx="42" ry="12" fill="#a4b3c6" stroke="#485465" strokeWidth="1.5" />
          <ellipse cx="55" cy="18" rx="36" ry="9" fill="#1c222b" />
          {/* Can Tab */}
          <rect x="50" y="12" width="10" height="12" rx="3" fill="#718096" stroke="#2d3748" strokeWidth="1" />
          <circle cx="55" cy="19" r="2.5" fill="#1a202c" />

          {/* Can Cylinder Body */}
          <rect x="13" y="20" width="84" height="295" rx="6" fill={`url(#canGrad1_${product.id})`} stroke="#161b24" strokeWidth="1" />
          {/* Cyan Rim Light Strip on Left */}
          <rect x="13" y="20" width="8" height="295" fill={`url(#rimLeft_${product.id})`} />
          {/* Subtle Right Rim */}
          <rect x="89" y="20" width="8" height="295" fill={`url(#rimRight_${product.id})`} opacity="0.6" />

          {/* Can Label Graphic: Black Panther Silhouette */}
          <g transform="translate(55, 140) scale(0.65)">
            <polygon points="0,-45 -30,-20 -25,15 -35,32 -15,42 0,48 15,42 35,32 25,15 30,-20" fill="#090c12" stroke="#00e5ff" strokeWidth="1.5" />
            {/* Glowing Red Eyes */}
            <ellipse cx="-12" cy="-5" rx="4.5" ry="2.5" fill="#ff003c" />
            <ellipse cx="12" cy="-5" rx="4.5" ry="2.5" fill="#ff003c" />
            <circle cx="-12" cy="-5" r="1.2" fill="#ffffff" />
            <circle cx="12" cy="-5" r="1.2" fill="#ffffff" />
          </g>

          {/* Vertical Flavor Typography */}
          <text 
            x="-180" 
            y="60" 
            transform="rotate(-90)" 
            fill="#ffffff" 
            fontFamily="Orbitron, sans-serif" 
            fontWeight="900" 
            fontSize="15" 
            letterSpacing="2"
          >
            {isBox ? (product.flavor1?.split(' ')[0] || 'TANNENZAUBER') : (product.name?.split(' ')[0] || 'CYBER')}
          </text>

          <text 
            x="-280" 
            y="60" 
            transform="rotate(-90)" 
            fill="#00e5ff" 
            fontFamily="Rajdhani, sans-serif" 
            fontWeight="700" 
            fontSize="11" 
            letterSpacing="1"
          >
            500ML • SUGAR FREE
          </text>

          {/* Condensation Droplets */}
          <circle cx="30" cy="80" r="1.5" fill="#ffffff" opacity="0.8" />
          <circle cx="35" cy="120" r="2" fill="#ffffff" opacity="0.9" />
          <circle cx="45" cy="180" r="1.8" fill="#d9f3ff" opacity="0.75" />
          <circle cx="75" cy="95" r="2" fill="#ffffff" opacity="0.8" />
          <circle cx="80" cy="220" r="2.5" fill="#ffffff" opacity="0.9" />
          <circle cx="25" cy="240" r="1.5" fill="#ffffff" opacity="0.7" />
        </g>

        {/* CAN 2 (Right Can - Tilted opposite / Neon Red rim / Resting in snow) */}
        <g transform="translate(255, 110) rotate(5)">
          {/* Can Top Rim & Pull Tab */}
          <ellipse cx="55" cy="20" rx="42" ry="12" fill="#b0bccd" stroke="#536072" strokeWidth="1.5" />
          <ellipse cx="55" cy="18" rx="36" ry="9" fill="#201c22" />
          <rect x="50" y="12" width="10" height="12" rx="3" fill="#8892a0" stroke="#374151" strokeWidth="1" />
          <circle cx="55" cy="19" r="2.5" fill="#1a202c" />

          {/* Can Cylinder Body */}
          <rect x="13" y="20" width="84" height="295" rx="6" fill={`url(#canGrad2_${product.id})`} stroke="#22161b" strokeWidth="1" />
          {/* Left Rim */}
          <rect x="13" y="20" width="8" height="295" fill={`url(#rimLeft_${product.id})`} opacity="0.6" />
          {/* Right Red Rim Light Strip */}
          <rect x="89" y="20" width="8" height="295" fill={`url(#rimRight_${product.id})`} />

          {/* Can Label Graphic: Black Panther Silhouette */}
          <g transform="translate(55, 140) scale(0.65)">
            <polygon points="0,-45 -30,-20 -25,15 -35,32 -15,42 0,48 15,42 35,32 25,15 30,-20" fill="#0d080c" stroke="#ff003c" strokeWidth="1.5" />
            {/* Glowing Red Eyes */}
            <ellipse cx="-12" cy="-5" rx="4.5" ry="2.5" fill="#ff003c" />
            <ellipse cx="12" cy="-5" rx="4.5" ry="2.5" fill="#ff003c" />
            <circle cx="-12" cy="-5" r="1.2" fill="#ffffff" />
            <circle cx="12" cy="-5" r="1.2" fill="#ffffff" />
          </g>

          {/* Vertical Flavor Typography */}
          <text 
            x="-180" 
            y="60" 
            transform="rotate(-90)" 
            fill="#ffffff" 
            fontFamily="Orbitron, sans-serif" 
            fontWeight="900" 
            fontSize="15" 
            letterSpacing="2"
          >
            {isBox ? (product.flavor2?.split(' ')[0] || 'ZIMT COLA') : (product.name?.split(' ')[1] || 'SCHNEE')}
          </text>

          <text 
            x="-280" 
            y="60" 
            transform="rotate(-90)" 
            fill="#ff003c" 
            fontFamily="Rajdhani, sans-serif" 
            fontWeight="700" 
            fontSize="11" 
            letterSpacing="1"
          >
            500ML • ENERGY
          </text>

          {/* Frost Droplets */}
          <circle cx="28" cy="90" r="2.2" fill="#ffffff" opacity="0.8" />
          <circle cx="70" cy="140" r="1.8" fill="#ffffff" opacity="0.85" />
          <circle cx="35" cy="210" r="2.5" fill="#ffd9e0" opacity="0.9" />
          <circle cx="82" cy="250" r="1.6" fill="#ffffff" opacity="0.7" />
          <circle cx="50" cy="270" r="2" fill="#ffffff" opacity="0.8" />
        </g>

        {/* Snow Drift Covering Can Bases (Photorealistic embed in snow) */}
        <path d="M 120 425 Q 190 405 250 420 Q 330 405 390 430 Q 320 460 250 465 Q 180 460 120 425 Z" fill="#eaf6ff" opacity="0.9" />
        <path d="M 150 435 Q 250 420 350 435 Q 310 455 250 458 Q 190 455 150 435 Z" fill="#ffffff" />
      </svg>

      {/* View badge */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#ff003c]/40 text-[10px] font-mono text-[#ff003c] tracking-wider uppercase flex items-center gap-1.5 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff003c] animate-pulse" />
        {isBox ? '2 DOSEN IM SCHNEE (OHNE VERPACKUNG)' : '500ML FROST EDITION'}
      </div>
    </div>
  );
}
