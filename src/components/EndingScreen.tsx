import React from "react";
import { Ending, GameState } from "../types";
import { motion } from "framer-motion";
import { PixelButton } from "./UI";

interface EndingScreenProps {
  ending: Ending;
  state: GameState;
  onReset: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({ ending, state, onReset }) => {
  return (
    <div className="fixed inset-0 bg-black z-[300] flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16"
      >
        {/* Left: CG Display (3:2 Aspect) */}
        <div className="w-full md:w-1/2 aspect-[3/2] bg-slate-900 border-2 border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
          <img 
            src={`/upload/cg_ending_${ending.id}.png`} 
            alt={ending.title}
            className="w-full h-full object-cover transition-transform duration-[10000ms] group-hover:scale-110"
            onError={(e) => {
              // Placeholder if image doesn't exist yet
              e.currentTarget.src = "https://picsum.photos/seed/ending/600/400?grayscale";
            }}
          />
          {/* Subtle dust effect or scanline could be added here */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-20" />
        </div>

        {/* Right: Story Text */}
        <div className="w-full md:w-1/2 flex flex-col">
          <motion.h1 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-white font-mono text-2xl md:text-4xl font-bold mb-8 tracking-tighter border-l-4 border-red-600 pl-6 pixel-text-shadow"
          >
            {ending.title}
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-slate-300 font-serif italic text-base md:text-lg leading-relaxed space-y-6 max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar"
          >
            {/* Split by newlines for better formatting */}
            {ending.text.split('\n\n').map((para, i) => (
              <p key={i} className={i === 0 ? "first-letter:text-4xl first-letter:font-bold first-letter:text-white first-letter:mr-2 first-letter:float-left" : ""}>
                {para}
              </p>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-12 flex gap-4"
          >
            <PixelButton onClick={onReset} className="bg-white/10 hover:bg-white/20 border-white/20 text-white px-8 py-3">
              回归虚无 (重新开始)
            </PixelButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative scanlines or grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
    </div>
  );
};
