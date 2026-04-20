import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useMotionValueEvent } from "framer-motion";
import { DemonKingStats, NightProposal } from "../types";
import { ProgressBar, cn, PixelPortrait, PixelCard } from "./UI";
import { PixelScene } from "./PixelScene";
import { PixelSpeaker } from "./PixelSpeaker";
import { Shield, Coins, Users, Wind, ChevronLeft, ChevronRight } from "lucide-react";

interface NightPhaseProps {
  stats: DemonKingStats;
  proposal: NightProposal;
  onDecision: (effects: Partial<DemonKingStats>) => void;
}

export const NightPhase: React.FC<NightPhaseProps> = ({ stats, proposal, onDecision }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const leftOpacity = useTransform(x, [-150, -50], [1, 0]);
  const rightOpacity = useTransform(x, [50, 150], [0, 1]);

  const [activeSide, setActiveSide] = useState<"none" | "left" | "right">("none");

  useMotionValueEvent(x, "change", (latest) => {
    if (latest > 50) {
      if (activeSide !== "right") setActiveSide("right");
    } else if (latest < -50) {
      if (activeSide !== "left") setActiveSide("left");
    } else {
      if (activeSide !== "none") setActiveSide("none");
    }
  });

  const handleDragEnd = (_: any, info: any) => {
    setActiveSide("none");
    if (info.offset.x > 100) {
      onDecision(proposal.swipeRight.effects);
    } else if (info.offset.x < -100) {
      onDecision(proposal.swipeLeft.effects);
    }
  };

  const currentEffects = activeSide === "right" 
    ? proposal.swipeRight.effects 
    : activeSide === "left" 
      ? proposal.swipeLeft.effects 
      : {};

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#050000] overflow-hidden">
      {/* 16:9 Background Image Wrapped in Containment */}
      <div className="absolute inset-0 flex items-center justify-center p-0">
         <div className="w-full h-full aspect-video bg-[url('/upload/demon%20city.jpg')] bg-contain bg-center bg-no-repeat opacity-50 shadow-[inset_0_0_50px_rgba(0,0,0,1)]" />
      </div>

      {/* Background Atmosphere */}
      <div className="absolute inset-0 opacity-40 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-900/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Content wrapper to ensure z-indexing above background */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {/* Stats Header */}
      <div className="w-full max-w-lg grid grid-cols-4 gap-3 mb-4 z-10">
        <StatItem icon={<Coins size={14} />} label="物资" value={stats.resources} color="bg-yellow-600" effects={currentEffects} statKey="resources" />
        <StatItem icon={<Shield size={14} />} label="兵力" value={stats.military} color="bg-red-600" effects={currentEffects} statKey="military" />
        <StatItem icon={<Users size={14} />} label="人心" value={stats.morale} color="bg-blue-600" effects={currentEffects} statKey="morale" />
        <StatItem icon={<Wind size={14} />} label="风气" value={stats.climate} color="bg-purple-600" effects={currentEffects} statKey="climate" />
      </div>

      {/* Throne Room Visual */}
      <div className="relative w-full max-w-xl aspect-[21/6] mb-4 flex items-end justify-center overflow-hidden border-b-4 border-red-900/30">
        <PixelScene type="THRONE" className="absolute inset-0 opacity-40 shadow-inner" />
        {/* Demon King removed as requested */}
      </div>

      {/* Card Container */}
      <div className="relative w-64 h-[320px] z-20">
        <AnimatePresence>
          <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <PixelCard className="h-full p-4 flex flex-col items-center text-center bg-[#1a1a1a] shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
              <div className="mb-4 relative">
                <div className="w-20 h-20 bg-red-950/50 border-4 border-red-900/50 rounded-none flex items-center justify-center overflow-hidden">
                   <PixelSpeaker name={proposal.speaker} />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-900/95 text-white text-[12px] px-3 py-1 font-pixel whitespace-nowrap border-2 border-red-600 shadow-xl min-w-[80px] flex items-center justify-center">
                  <span className="inline-block py-0.5">{proposal.speaker}</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="text-red-500 font-mono font-bold text-[8px] uppercase tracking-[0.2em] mb-1">Proposal</h3>
                <p className="text-white/90 text-sm leading-relaxed font-serif italic border-y border-white/5 py-3">
                  "{proposal.text}"
                </p>
              </div>

              {/* Swipe Indicators */}
              <motion.div style={{ opacity: leftOpacity }} className="absolute left-[-80px] top-1/2 -translate-y-1/2 bg-red-900/90 p-3 border-2 border-red-700">
                <div className="flex items-center gap-1.5 text-white font-mono font-bold text-xs uppercase">
                  <ChevronLeft size={16} /> {proposal.swipeLeft.text}
                </div>
              </motion.div>
              <motion.div style={{ opacity: rightOpacity }} className="absolute right-[-80px] top-1/2 -translate-y-1/2 bg-green-900/90 p-3 border-2 border-green-700">
                <div className="flex items-center gap-1.5 text-white font-mono font-bold text-xs uppercase">
                  {proposal.swipeRight.text} <ChevronRight size={16} />
                </div>
              </motion.div>
            </PixelCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-6 text-white/20 font-mono text-[8px] uppercase tracking-[0.3em]">
        <span className="flex items-center gap-2"><ChevronLeft size={12} /> Swipe Left to Reject</span>
        <div className="w-1 h-1 bg-white/10 rounded-full" />
        <span className="flex items-center gap-2">Swipe Right to Accept <ChevronRight size={12} /></span>
      </div>
    </div>
  </div>
);
};

const StatItem = ({ icon, label, value, color, effects, statKey }: { icon: React.ReactNode, label: string, value: number, color: string, effects: Partial<DemonKingStats>, statKey: keyof DemonKingStats }) => {
  const effect = effects[statKey];
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-white/40">{icon}</span>
          <span className="text-[10px] text-white/60 font-mono uppercase tracking-tighter">{label}</span>
        </div>
        {effect && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={cn(
              "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
              effect > 0 ? "text-green-500 bg-green-500" : "text-red-500 bg-red-500"
            )} 
          />
        )}
      </div>
      <ProgressBar value={value} max={100} color={color} className="h-1.5" />
    </div>
  );
};

