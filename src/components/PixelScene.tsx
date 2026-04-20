import React from "react";
import { cn } from "./UI";

interface PixelSceneProps {
  type: "THRONE" | "VILLAGE" | "FOREST" | "CANYON" | "SNOWFIELD" | "CITY" | "DESERT" | "VOLCANO";
  className?: string;
}

export const PixelScene: React.FC<PixelSceneProps> = ({ type, className }) => {
  return (
    <div className={cn("relative overflow-hidden bg-transparent", className)}>
      {type === "THRONE" && <ThroneRoom />}
      {type === "VILLAGE" && <VillageScene />}
      {type === "FOREST" && <ForestScene />}
      {type === "CANYON" && <CanyonScene />}
      {type === "SNOWFIELD" && <SnowfieldScene />}
      {type === "CITY" && <CityScene />}
      {type === "DESERT" && <DesertScene />}
      {type === "VOLCANO" && <VolcanoScene />}
    </div>
  );
};

const ThroneRoom = () => (
  <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
    {/* Floor */}
    <rect x="0" y="40" width="200" height="20" fill="#2d1a12" />
    <rect x="0" y="40" width="200" height="1" fill="#4d2a1a" />
    
    {/* Walls */}
    <rect x="0" y="0" width="200" height="40" fill="#1a0f0a" />
    
    {/* Columns */}
    <rect x="20" y="0" width="10" height="40" fill="#2a1a15" />
    <rect x="170" y="0" width="10" height="40" fill="#2a1a15" />
    
    {/* Red Carpet */}
    <rect x="80" y="40" width="40" height="20" fill="#800000" />
    
    {/* Throne Back */}
    <rect x="90" y="25" width="20" height="15" fill="#4a0000" />
    <rect x="92" y="27" width="16" height="13" fill="#600000" />
    
    {/* Candles */}
    <rect x="40" y="30" width="2" height="10" fill="#ccc" />
    <rect x="40" y="28" width="2" height="2" fill="#ff0" className="animate-pulse" />
    <rect x="158" y="30" width="2" height="10" fill="#ccc" />
    <rect x="158" y="28" width="2" height="2" fill="#ff0" className="animate-pulse" />
  </svg>
);

const VillageScene = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
    <rect width="200" height="100" fill="#87CEEB" /> {/* Sky */}
    <rect y="70" width="200" height="30" fill="#90EE90" /> {/* Ground */}
    {/* Houses */}
    <rect x="20" y="50" width="30" height="20" fill="#deb887" />
    <polygon points="15,50 55,50 35,30" fill="#8b4513" />
    <rect x="120" y="40" width="40" height="30" fill="#deb887" />
    <polygon points="115,40 165,40 140,20" fill="#8b4513" />
    {/* Path */}
    <rect x="80" y="70" width="40" height="30" fill="#d2b48c" />
  </svg>
);

const ForestScene = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
    <rect width="200" height="100" fill="#062d06" /> {/* Deep Forest */}
    <rect y="80" width="200" height="20" fill="#0a3d0a" />
    {/* Trees */}
    {[10, 40, 70, 100, 130, 160, 190].map((x, i) => (
      <g key={i}>
        <rect x={x} y="40" width="10" height="40" fill="#3e2723" />
        <circle cx={x+5} cy="40" r="20" fill="#1b5e20" opacity="0.8" />
      </g>
    ))}
    {/* Mist */}
    <rect width="200" height="100" fill="white" opacity="0.1" className="animate-pulse" />
  </svg>
);

const CanyonScene = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
    <rect width="200" height="100" fill="#4a1a05" /> {/* Rock walls */}
    <rect x="50" width="100" height="100" fill="#2a0a00" /> {/* Canyon floor shadow */}
    {/* Rocks */}
    {[20, 160].map((x, i) => (
      <rect key={i} x={x} y="0" width="20" height="100" fill="#3a1a0a" />
    ))}
    {/* Bones */}
    <rect x="80" y="80" width="10" height="2" fill="#eee" transform="rotate(20 80 80)" />
    <rect x="110" y="75" width="8" height="2" fill="#eee" transform="rotate(-15 110 75)" />
  </svg>
);

const SnowfieldScene = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
    <rect width="200" height="100" fill="#e0f7fa" />
    <rect y="60" width="200" height="40" fill="#ffffff" />
    {/* Ice blocks */}
    <rect x="40" y="70" width="30" height="10" fill="#b2ebf2" />
    <rect x="130" y="65" width="20" height="15" fill="#b2ebf2" />
    {/* Snowing */}
    {[...Array(20)].map((_, i) => (
      <circle 
        key={i} 
        cx={Math.random() * 200} 
        cy={Math.random() * 100} 
        r="1" 
        fill="white" 
        className="animate-bounce"
        style={{ animationDelay: `${Math.random() * 2}s`, animationDuration: `${2 + Math.random() * 3}s` }}
      />
    ))}
  </svg>
);

const CityScene = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
    <rect width="200" height="100" fill="#4682B4" /> {/* Sky */}
    <rect y="70" width="200" height="30" fill="#708090" /> {/* Pavement */}
    {/* Towers */}
    <rect x="20" y="20" width="40" height="50" fill="#696969" />
    <rect x="25" y="25" width="30" height="10" fill="#f0e68c" opacity="0.5" />
    <rect x="140" y="10" width="30" height="60" fill="#696969" />
    <rect x="145" y="15" width="20" height="10" fill="#f0e68c" opacity="0.5" />
    <rect x="0" y="40" width="50" height="30" fill="#808080" />
    {/* Banners */}
    <rect x="90" y="10" width="20" height="40" fill="#b22222" />
    <rect x="95" y="15" width="10" height="20" fill="#ffd700" />
  </svg>
);

const DesertScene = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
    <rect width="200" height="100" fill="#f4a460" /> {/* Sky/Sand Haze */}
    <path d="M0 100 Q 50 20 100 100 Q 150 20 200 100 Z" fill="#edc9af" /> {/* Dunes */}
    <circle cx="160" cy="30" r="10" fill="#ff4500" opacity="0.6" className="animate-pulse" /> {/* Harsh Sun */}
    {/* Cactus */}
    <rect x="30" y="60" width="5" height="20" fill="#228b22" />
    <rect x="25" y="65" width="15" height="4" fill="#228b22" />
  </svg>
);

const VolcanoScene = () => (
  <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
    <rect width="200" height="100" fill="#1a0000" /> {/* Dark ash sky */}
    <polygon points="0,100 60,30 120,100" fill="#2a0000" /> {/* Volcano Peak */}
    <path d="M50 35 Q 60 10 70 35" fill="#ff4500" className="animate-bounce" /> {/* Smoke/Eruption */}
    <rect y="80" width="200" height="20" fill="#4b0000" /> {/* Lava ground */}
    {/* Lava flow */}
    <rect x="0" y="85" width="200" height="5" fill="#ff4500" className="animate-pulse" />
  </svg>
);
