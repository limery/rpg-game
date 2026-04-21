import React from "react";
import { cn } from "./UI";

interface PixelSpeakerProps {
  name: string;
  className?: string;
}

export const PixelSpeaker: React.FC<PixelSpeakerProps> = ({ name, className }) => {
  // Simple heuristic for choosing a color based on the speaker's name
  const isSuccubus = name.includes("魅魔");
  const isSkeleton = name.includes("骷髅") || name.includes("死亡");
  const isBeast = name.includes("兽") || name.includes("狼") || name.includes("巨人") || name.includes("犬");
  const isRoyal = name.includes("将") || name.includes("王") || name.includes("公爵") || name.includes("领主") || name.includes("军") || name.includes("大人");
  const isCerberus = name.includes("三头犬");
  const isChef = name.includes("厨师");
  const isBarry = name.includes("巴力");
  const isStudent = name.includes("学");
  const isPoor = name.includes("丐") || name.includes("贼") || name.includes("民") || name.includes("怪");
  const isMagic = name.includes("师") || name.includes("巫") || name.includes("术士") || name.includes("研究");

  let skinColor = "#8d6e63"; // Generic base
  if (isSuccubus) skinColor = "#f06292";
  if (isSkeleton) skinColor = "#eceff1";
  if (isBeast) skinColor = "#5d4037";
  if (isRoyal) skinColor = "#ffd700"; // Golden skin or armor
  if (isCerberus) skinColor = "#444";
  if (isBarry) skinColor = "#37474f";
  if (isPoor) skinColor = "#795548"; // Scruffy brown
  if (isChef) skinColor = "#ffe0b2";

  return (
    <div className={cn("w-full h-full bg-[#1a0f0a] flex items-center justify-center border-4 border-red-900/40 shadow-inner overflow-hidden relative", className)}>
      {isBarry && (
        <img src="/upload/barry.png" className="absolute inset-0 w-full h-full object-cover z-10" referrerPolicy="no-referrer" alt="Barry" />
      )}
      
      <svg viewBox="0 0 64 64" className="w-16 h-16 relative z-0">
        {/* Shadow */}
        <ellipse cx="32" cy="58" rx="20" ry="4" fill="black" opacity="0.3" />

        {isCerberus ? (
          <g>
            {/* Cerberus logic simplified but distinct */}
            <rect x="10" y="24" width="12" height="12" fill={skinColor} stroke="black" strokeWidth="1" />
            <rect x="42" y="24" width="12" height="12" fill={skinColor} stroke="black" strokeWidth="1" />
            <rect x="22" y="15" width="20" height="20" fill={skinColor} stroke="black" strokeWidth="1" />
            <path d="M10 40 L54 40 L44 64 L20 64 Z" fill="#263238" />
          </g>
        ) : (
          <g>
            {/* Standard Head with Poor variant */}
            <rect x="22" y="15" width="20" height="20" fill={skinColor} />
            {isPoor && (
              <g>
                <rect x="22" y="15" width="4" height="2" fill="black" opacity="0.2" />
                <rect x="38" y="30" width="4" height="2" fill="black" opacity="0.2" />
              </g>
            )}

            {/* Neck */}
            <rect x="28" y="35" width="8" height="5" fill={skinColor} stroke="black" strokeWidth="0.5" />
            
            {/* Body */}
            <rect x="15" y="40" width="34" height="24" fill={isRoyal ? "#1a237e" : isStudent ? "#2d3436" : isPoor ? "#5d4037" : "#37474f"} />
            
            {/* Clothing Details */}
            {isStudent && (
              <g>
                <rect x="28" y="40" width="8" height="8" fill="white" />
                <path d="M28 40 L32 46 L36 40 Z" fill="#d63031" /> {/* Tie */}
              </g>
            )}

            {isRoyal && (
              <g>
                <rect x="15" y="40" width="34" height="4" fill="#ffd700" />
                <rect x="24" y="44" width="2" height="10" fill="#ffd700" />
                <rect x="38" y="44" width="2" height="10" fill="#ffd700" />
                {/* Crown */}
                <path d="M20 15 L20 10 L25 13 L32 8 L39 13 L44 10 L44 15 Z" fill="#ffd700" />
              </g>
            )}

            {isPoor && (
              <g>
                <rect x="18" y="45" width="6" height="4" fill="black" opacity="0.3" />
                <rect x="40" y="52" width="6" height="4" fill="black" opacity="0.3" />
              </g>
            )}

            {isChef && (
               <g>
                 <rect x="20" y="5" width="24" height="12" fill="white" stroke="black" strokeWidth="1" />
                 <rect x="15" y="40" width="34" height="24" fill="white" />
               </g>
            )}

            {/* Eyes */}
            {isMagic ? (
              <g>
                <rect x="25" y="22" width="6" height="3" fill="#00d2ff" className="animate-pulse" />
                <rect x="33" y="22" width="6" height="3" fill="#00d2ff" className="animate-pulse" />
              </g>
            ) : (
              <g>
                <rect x="26" y="22" width="4" height="2" fill="white" />
                <rect x="34" y="22" width="4" height="2" fill="white" />
              </g>
            )}
          </g>
        )}
        
        {/* Succubus Horns & Purple Theme */}
        {!isCerberus && isSuccubus && (
          <g>
            <path d="M22 15 L15 5 L28 12 Z" fill="#880e4f" />
            <path d="M42 15 L49 5 L36 12 Z" fill="#880e4f" />
            <rect x="27" y="23" width="2" height="1" fill="#ff4081" />
            <rect x="35" y="23" width="2" height="1" fill="#ff4081" />
          </g>
        )}

        {isSkeleton && (
          <g>
             <rect x="26" y="22" width="4" height="4" fill="black" />
             <rect x="34" y="22" width="4" height="4" fill="black" />
             <rect x="28" y="30" width="8" height="2" fill="black" />
          </g>
        )}

        {isBeast && (
          <g>
            <path d="M20 18 L25 8 L30 18 Z" fill="#3e2723" />
            <path d="M44 18 L39 8 L34 18 Z" fill="#3e2723" />
            <rect x="24" y="28" width="16" height="6" fill="#3e2723" />
          </g>
        )}
      </svg>
    </div>
  );
};
