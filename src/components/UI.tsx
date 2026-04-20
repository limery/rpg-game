import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProgressBarProps {
  value: number;
  max: number;
  color: string;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, color, label, showValue, className }) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1 font-mono text-white/70">
          <span>{label}</span>
          {showValue && <span>{Math.round(value)}/{max}</span>}
        </div>
      )}
      <div className="h-2 w-full bg-black/40 border border-white/10 overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", color)} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const PixelButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => {
  return (
    <button 
      className={cn(
        "px-4 py-2 bg-red-900/80 hover:bg-red-800 text-white border-2 border-red-700 active:translate-y-0.5 transition-all font-mono uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const PixelCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className, title }) => {
  return (
    <div className={cn("bg-black/80 border-4 border-red-900/80 p-3 rounded-none relative shadow-2xl", className)}>
      {title && (
        <div className="absolute -top-3 left-3 px-2 bg-red-900 text-white text-[9px] uppercase font-mono tracking-tighter">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};

export const PixelPortrait: React.FC<{ 
  type: "HERO" | "DEMON" | "BARD" | "BARRY"; 
  size?: "sm" | "md" | "lg";
  eyeClosed?: boolean;
  expression?: "STAREYE" | "CLOSED";
  className?: string;
}> = ({ type, size = "md", eyeClosed, expression, className }) => {
  const sizeMap = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-28 h-28"
  };
  
  const portraits = {
    HERO: expression === "STAREYE" ? "/upload/stareyes.png" : "/1.jpg",
    DEMON: "/2.jpg",
    BARD: "/3.jpg",
    BARRY: "/upload/barry.png"
  };

  const colors = {
    HERO: "bg-blue-900",
    DEMON: "bg-red-900",
    BARD: "bg-yellow-900",
    BARRY: "bg-slate-900"
  };

  const descriptions = {
    HERO: "勇者",
    DEMON: "魔王",
    BARD: "露比",
    BARRY: "巴力"
  };

  return (
    <div className={cn(
      sizeMap[size], 
      "border-4 border-[#4a3d35] overflow-hidden relative group shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex-shrink-0",
      colors[type],
      className
    )}>
      <img
        src={portraits[type]}
        alt={descriptions[type]} // portrait alt
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          // Fallback: try stripping leading slash if it fails
          if (target.src.startsWith(window.location.origin)) {
             const pathOnly = target.src.replace(window.location.origin, '');
             if (pathOnly.startsWith('/')) {
               target.src = pathOnly.substring(1);
             }
          }
          // If still failing, maybe it's just missing
          if (target.getAttribute('data-second-fail')) {
            target.style.display = 'none';
          } else {
            target.setAttribute('data-second-fail', 'true');
          }
        }}
        className={cn(
          "w-full h-full object-cover pixelated transition-all duration-700 relative z-10",
          (eyeClosed || expression === "CLOSED") && type !== "HERO" && "opacity-0" 
        )}
      />
      {type === "DEMON" && eyeClosed && (
        <img 
          src="/upload/eyeclosed.png" 
          className="absolute inset-0 w-full h-full object-cover z-20 pixelated" 
          alt="Demon Closed Eyes"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.startsWith(window.location.origin)) {
               const pathOnly = target.src.replace(window.location.origin, '');
               if (pathOnly.startsWith('/')) target.src = pathOnly;
               else target.src = '/' + pathOnly;
            }
          }}
        />
      )}
      {type === "BARD" && (eyeClosed || expression === "CLOSED") && (
        <img 
          src="/upload/eyeclosed2.png" 
          className="absolute inset-0 w-full h-full object-cover z-20 pixelated" 
          alt="Ruby Closed Eyes"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.startsWith(window.location.origin)) {
               const pathOnly = target.src.replace(window.location.origin, '');
               if (pathOnly.startsWith('/')) target.src = pathOnly;
               else target.src = '/' + pathOnly;
            }
          }}
        />
      )}
      {/* SVG Placeholder fallback behind the image */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 32 32" className="w-full h-full opacity-40">
           <rect x="8" y="8" width="16" height="16" fill="white" />
           <rect x="10" y="12" width="4" height="2" fill="black" />
           <rect x="18" y="12" width="4" height="2" fill="black" />
           <rect x="12" y="20" width="8" height="2" fill="black" />
        </svg>
      </div>
      
      <div className="absolute inset-0 border-2 border-black/10 pointer-events-none z-20" />
      <div className="absolute inset-x-0 bottom-0 bg-[#4a3d35]/90 text-[6px] text-[#f5e6d3] py-0.5 text-center opacity-0 group-hover:opacity-100 transition-opacity font-mono uppercase tracking-widest z-30">
        {type === 'BARD' ? 'DISGUISE' : type}
      </div>
    </div>
  );
};
