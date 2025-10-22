
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = 'h-10 w-auto' }) => {
  return (
    <svg
      viewBox="0 0 200 50"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Gujarati Marketplace Germany Logo"
    >
      <defs>
        <pattern id="bandhani" patternUnits="userSpaceOnUse" width="10" height="10">
          <circle cx="2" cy="2" r="1.5" fill="white" />
          <circle cx="7" cy="7" r="1.5" fill="white" />
        </pattern>
        <linearGradient id="gateGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#16A34A" />
        </linearGradient>
      </defs>
      
      {/* Brandenburg Gate with Bandhani Pattern */}
      <g>
        <rect x="0" y="10" width="80" height="40" fill="url(#gateGradient)" />
        <rect x="0" y="10" width="80" height="40" fill="url(#bandhani)" fillOpacity="0.2" />
        {/* Arches */}
        <rect x="10" y="30" width="10" height="20" fill="#F3F4F6"/>
        <rect x="35" y="30" width="10" height="20" fill="#F3F4F6"/>
        <rect x="60" y="30" width="10" height="20" fill="#F3F4F6"/>
        <rect x="0" y="0" width="80" height="10" fill="url(#gateGradient)" />
      </g>
      
      {/* Text */}
      <text x="90" y="28" fontFamily="sans-serif" fontSize="18" fontWeight="bold" fill="currentColor">
        Gujarati
      </text>
      <text x="90" y="48" fontFamily="sans-serif" fontSize="14" fill="currentColor" opacity="0.8">
        Marketplace DE
      </text>
    </svg>
  );
};

export default Logo;
