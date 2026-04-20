import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { PROLOGUE_DIALOGUE } from "../constants";
import { PixelCard, PixelPortrait, PixelButton, cn } from "./UI";
import { PixelSpeaker } from "./PixelSpeaker";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

interface PrologueProps {
  onComplete: () => void;
  updateStats: (effects: any) => void;
}

export const Prologue: React.FC<PrologueProps> = ({ onComplete, updateStats }) => {
  const [index, setIndex] = useState(0);
  const current = PROLOGUE_DIALOGUE[index];

  // For swipe card interaction in CHOICE mode
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const cardOpacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const leftOpacity = useTransform(x, [-150, -50], [1, 0]);
  const rightOpacity = useTransform(x, [50, 150], [0, 1]);

  const handleNext = () => {
    if (index < PROLOGUE_DIALOGUE.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    if (current.type !== "CHOICE") return;
    
    if (info.offset.x > 100) {
      if (current.swipeRight) {
        updateStats(current.swipeRight.effects);
        handleNext();
      }
    } else if (info.offset.x < -100) {
      if (current.swipeLeft) {
        updateStats(current.swipeLeft.effects);
        handleNext();
      }
    }
    x.set(0); // Reset position
  };

  return (
    <div className="fixed inset-0 bg-[#050000] flex flex-col items-center justify-between p-8 z-[200]">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-red-950/20 to-transparent" />
        <AnimatePresence mode="wait">
           {current.type === "CG" ? (
             <motion.div 
               key="cg-overlay"
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-white"
             />
           ) : (
             <motion.div 
               key={current.background || "default-bg"}
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.3 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: `url("${current.background || "/upload/demon_city.jpg"}")` }}
             />
           )}
        </AnimatePresence>
      </div>

      {/* Top Section (Visuals) */}
      <div className="w-full flex-1 flex items-center justify-center relative z-10 overflow-hidden py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
            {current.type === "CG" ? (
              <div className="relative w-full max-w-sm aspect-[4/3] max-h-full border-4 border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 bg-black/40 backdrop-blur-sm">
                <motion.img 
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={current.src} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
              </div>
            ) : current.type === "CHOICE" ? (
              <div className="relative w-full max-w-xs h-[50vh] md:h-72 shrink-0">
                <motion.div
                  style={{ x, rotate, opacity: cardOpacity }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing z-20"
                >
                  <PixelCard title="命运抉择" className="h-full bg-[#1a0f0f] flex flex-col items-center justify-center p-4 md:p-6 text-center shadow-2xl border-red-700">
                    <p className="text-white/80 font-serif italic text-sm md:text-base leading-relaxed mb-4">
                      {current.text}
                    </p>
                    <div className="mt-auto text-[8px] md:text-[10px] text-white/30 font-mono uppercase tracking-widest">
                      Swipe to Decide
                    </div>

                    {/* Left Indicator */}
                    <motion.div style={{ opacity: leftOpacity }} className="absolute -left-28 top-1/2 -translate-y-1/2 bg-red-950/90 px-4 py-3 border-2 border-red-700 shadow-lg z-30">
                      <div className="flex items-center gap-2 text-white font-pixel text-xs">
                        <ChevronLeft /> {current.swipeLeft?.text || "拒绝"}
                      </div>
                    </motion.div>
                    {/* Right Indicator */}
                    <motion.div style={{ opacity: rightOpacity }} className="absolute -right-28 top-1/2 -translate-y-1/2 bg-green-950/90 px-4 py-3 border-2 border-green-700 shadow-lg z-30">
                      <div className="flex items-center gap-2 text-white font-pixel text-xs">
                        {current.swipeRight?.text || "同意"} <ChevronRight />
                      </div>
                    </motion.div>
                  </PixelCard>
                </motion.div>
              </div>
            ) : current.type === "TUTORIAL" ? (
               <div className="w-full max-w-xl">
                  <PixelCard title="系统介入" className="p-8 border-blue-500/50 bg-blue-950/30 backdrop-blur-md">
                    <div className="flex items-start gap-6">
                      <div className="bg-blue-600 p-3 shadow-lg">
                        <Info className="text-white" size={32} />
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-50 text-xl leading-relaxed font-pixel mb-8">
                          {current.text}
                        </p>
                        <PixelButton onClick={handleNext} className="bg-blue-600 border-blue-400 px-8 py-3">
                          确认了解并继续
                        </PixelButton>
                      </div>
                    </div>
                  </PixelCard>
               </div>
            ) : current.speaker || current.type === "DIALOGUE" ? (
              <div className="relative">
                 <motion.div
                   initial={{ y: 20 }}
                   animate={{ y: 0 }}
                 >
                   <PixelPortrait 
                      type={
                        current.useBardPortrait || current.speaker === "露比" ? "BARD" : 
                        current.speaker === "勇者" ? "HERO" : 
                        current.speaker === "巴力" ? "BARRY" : "DEMON"
                      } 
                      size="lg" 
                      eyeClosed={current.eyeClosed}
                      expression={current.expression}
                      className={
                        current.speaker === "魔王" || current.speaker === "露比" ? "border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.2)]" : 
                        current.speaker === "勇者" ? "border-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.2)]" : 
                        "border-slate-500"
                      }
                   />
                 </motion.div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section (Dialogue) */}
      <div className="w-full max-w-3xl relative z-20 pb-4">
        <AnimatePresence mode="wait">
          {current.type !== "TUTORIAL" && current.type !== "CHOICE" && (
            <motion.div
              key={`dialogue-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={handleNext}
              className="cursor-pointer"
            >
              <PixelCard className="w-full p-3 bg-black/90 backdrop-blur-md border-white/5 shadow-2xl relative group min-h-[120px]">
                {/* Name Tag */}
                {current.speaker && (
                  <div className="absolute top-0 left-6 -translate-y-1/2 z-30">
                     <div className="bg-red-900 px-5 py-2 border-2 border-red-600 shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center min-w-[100px]">
                        <span className="text-white font-pixel text-[14px] tracking-widest font-bold whitespace-nowrap drop-shadow-sm inline-block py-0.5">
                          {current.speaker}
                        </span>
                     </div>
                  </div>
                )}
                
                <div className="pt-4 px-3">
                  <p className="text-white/95 text-[1rem] md:text-[1.1rem] font-serif italic leading-relaxed">
                    {current.text}
                  </p>
                </div>

                <div className="flex justify-end mt-2 px-2">
                   <div className="flex items-center gap-2 text-white/10 text-[9px] font-mono animate-pulse">
                      <span>Click to Continue</span>
                      <ChevronRight size={14} />
                   </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-white/10" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-white/10" />
              </PixelCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
