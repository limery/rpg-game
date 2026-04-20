import React from "react";
import { cn } from "./UI";

interface MapLocationProps {
  id: string;
  isLocked: boolean;
  className?: string;
}

export const MapLocation: React.FC<MapLocationProps> = ({ id, isLocked, className }) => {
  let color = isLocked ? "#666666" : "#E53935";
  let borderColor = isLocked ? "#333333" : "#8E1F1C";
  
  if (id === "demon_castle") {
    color = isLocked ? "#311b92" : "#512da8"; 
    borderColor = "#1a0b35";
  }

  return (
    <div className={cn("relative w-8 h-10 flex items-center justify-center transform -translate-y-full", className)}>
      <svg viewBox="0 0 24 30" className="w-full h-full drop-shadow-md">
        {/* Pixel Pin Shape */}
        {/* Top Circle-ish part */}
        <rect x="4" y="0" width="16" height="4" fill={borderColor} />
        <rect x="2" y="2" width="20" height="12" fill={borderColor} />
        <rect x="0" y="4" width="24" height="8" fill={borderColor} />
        
        <rect x="6" y="2" width="12" height="10" fill={color} />
        <rect x="4" y="4" width="16" height="8" fill={color} />
        <rect x="2" y="6" width="20" height="4" fill={color} />
        
        {/* Shine */}
        <rect x="6" y="4" width="4" height="4" fill="white" opacity="0.4" />
        
        {/* Middle part tapering down */}
        <rect x="4" y="14" width="16" height="2" fill={borderColor} />
        <rect x="6" y="16" width="12" height="2" fill={borderColor} />
        <rect x="8" y="18" width="8" height="2" fill={borderColor} />
        <rect x="10" y="20" width="4" height="10" fill={borderColor} />

        <rect x="6" y="14" width="12" height="2" fill={color} />
        <rect x="8" y="16" width="8" height="2" fill={color} />
        <rect x="10" y="18" width="4" height="8" fill={color} />
        
        {/* Shadow/Center Hole */}
        <rect x="10" y="6" width="4" height="4" fill="rgba(0,0,0,0.3)" />
      </svg>
      {!isLocked && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-black/40 blur-sm rounded-full transform translate-y-1 mx-2 -z-10" />
      )}
    </div>
  );
};
