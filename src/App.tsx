/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useGameState } from "./hooks/useGameState";
import { DayPhase } from "./components/DayPhase";
import { NightPhase } from "./components/NightPhase";
import { Prologue } from "./components/Prologue";
import { NIGHT_PROPOSALS, ENDINGS } from "./constants";
import { PixelButton, PixelCard, PixelPortrait, cn } from "./components/UI";
import { RefreshCcw, Trophy, Skull, X, Coins, Shield, Users, Wind, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { EndingScreen } from "./components/EndingScreen";

export default function App() {
  const { state, updateHeroStats, updateDemonKingStats, applyChoice, nextPhase, startGame, resetGame, gameOverReason, triggerEnding } = useGameState();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Derive common shared text for endings
  const currentEnding = useMemo(() => {
    return ENDINGS.find(e => e.id === state.endingId) || ENDINGS[ENDINGS.length - 1];
  }, [state.endingId]);

  const currentProposal = useMemo(() => {
    return NIGHT_PROPOSALS[Math.floor(Math.random() * NIGHT_PROPOSALS.length)];
  }, [state.currentDay]);

  const handleDayEvent = (effect: (s: any) => any, eventId: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    applyChoice(effect, eventId);
    
    // Always wait for the effect to settle, and check if game is still running
    setTimeout(() => {
      setIsTransitioning(false);
      nextPhase();
    }, 1200);
  };

  const handleNightDecision = (effects: any, proposalId: string) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    applyChoice(() => ({ demonKing: effects }), proposalId);
    
    setTimeout(() => {
      setIsTransitioning(false);
      nextPhase();
    }, 1200);
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden select-none relative p-4">
      <div className="crt-overlay pointer-events-none" />
      
      {/* 3:2 Game Container */}
      <div className="relative aspect-[3/2] w-full max-w-[1400px] max-h-full bg-[#0a0502] shadow-2xl overflow-hidden flex flex-col border-4 border-red-950/50">
        
        {/* Game Header */}
        {state.phase !== "START" && (
          <div className="h-14 bg-red-950 border-b-2 border-red-900 flex items-center justify-between px-6 z-50 shadow-lg shrink-0">
            <div className="flex items-center gap-6">
              <h1 className="text-red-500 font-pixel text-xl uppercase tracking-widest pixel-text-shadow">魔王退休计划</h1>
              <div className="h-6 w-px bg-red-900/50" />
              <div className="flex flex-col">
                <span className="text-white/50 font-mono text-[7px] uppercase tracking-[0.2em]">Progress</span>
                <span className="text-white font-mono text-xs font-bold">DAY {state.currentDay} / 100</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsProfileOpen(true)}
                className="flex items-center gap-3 px-3 py-1 bg-black/40 border border-white/10 hover:bg-white/5 transition-colors"
              >
                <div className="w-6 h-6 rounded-none overflow-hidden border border-red-500">
                   <img 
                     src="/2.jpg" 
                     className="w-full h-full object-cover pixelated" 
                     referrerPolicy="no-referrer" 
                     onError={(e) => {
                       // Fallback in case of path issues on some hosting
                       const target = e.target as HTMLImageElement;
                       if (target.src.startsWith(window.location.origin)) {
                         target.src = target.src.replace(window.location.origin, '');
                       }
                     }}
                   />
                </div>
                <span className="text-white/70 font-mono text-[10px] uppercase font-bold">Profile</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {state.phase === "START" && (
              <motion.div 
                key="start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center"
              >
                {/* 16:9 Cover Background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-full h-full aspect-video bg-contain bg-center bg-no-repeat shadow-2xl" 
                    style={{ backgroundImage: "url('/upload/cover.png')" }}
                  />
                </div>

                <div className="relative z-10 translate-y-28">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(185, 28, 28, 1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startGame}
                    className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white rounded-full bg-red-800 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_2px_10px_rgba(255,255,255,0.2)] border-2 border-red-500/20 transition-all tracking-[0.2em] overflow-hidden group font-sans"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Play size={20} fill="currentColor" className="drop-shadow-md" /> 
                    <span className="drop-shadow-md">开始游戏</span>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {state.phase === "PROLOGUE" && (
              <motion.div 
                key="prologue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <Prologue 
                  onComplete={nextPhase} 
                  updateStats={(stats) => updateDemonKingStats(stats)} 
                />
              </motion.div>
            )}

            {state.phase === "DAY" && (
              <motion.div 
                key="day"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <DayPhase state={state} onEventComplete={handleDayEvent} onTriggerEnding={triggerEnding} />
              </motion.div>
            )}

            {state.phase === "NIGHT" && (
              <motion.div 
                key="night"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <NightPhase 
                  stats={state.demonKing} 
                  proposal={currentProposal} 
                  onDecision={(effects) => handleNightDecision(effects, currentProposal.id)} 
                />
              </motion.div>
            )}

            {state.phase === "GAMEOVER" && (
              <motion.div 
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-8 text-center"
              >
                <Skull size={60} className="text-red-700 mb-6 animate-bounce" />
                <h2 className="text-red-700 font-pixel text-4xl font-bold mb-4 uppercase tracking-tighter pixel-text-shadow">GAME OVER</h2>
                <p className="text-white/80 font-serif italic max-w-lg mb-10 leading-relaxed text-lg border-y border-red-900/30 py-6">
                  {gameOverReason}
                </p>
                <PixelButton onClick={resetGame} className="flex items-center gap-3 px-10 py-3 text-base">
                  <RefreshCcw size={18} /> 重新开始
                </PixelButton>
              </motion.div>
            )}

            {state.phase === "ENDING" && (
              <EndingScreen 
                ending={currentEnding} 
                state={state} 
                onReset={resetGame} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Character Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-3xl"
            >
              <PixelCard title="魔王档案" className="p-10 bg-[#0a0502]">
                <button onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={24} /></button>
                
                <div className="flex gap-12">
                  <div className="flex flex-col items-center gap-6">
                    <PixelPortrait type="DEMON" size="lg" />
                    <div className="text-center">
                      <h3 className="text-red-500 font-pixel text-2xl mb-1 leading-tight py-1">莉莉丝</h3>
                      <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">渴望退休的魔王</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-8">
                    <div>
                      <h4 className="text-white/50 font-mono text-[10px] uppercase tracking-[0.2em] mb-4">当前状态评估</h4>
                      <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                        <div className="bg-black/40 p-3 border border-white/5">
                          <span className="block text-white/30 text-[8px] uppercase mb-1">Affection / 好感度</span>
                          <span className="text-pink-500 font-mono text-xl font-bold">{state.hero.affection}</span>
                        </div>
                        <div className="bg-black/40 p-3 border border-white/5">
                          <span className="block text-white/30 text-[8px] uppercase mb-1">Suspicion / 怀疑度</span>
                          <span className="text-orange-500 font-mono text-xl font-bold">{state.hero.suspicion}</span>
                        </div>
                        <div className="bg-black/40 p-3 border border-white/5">
                          <span className="block text-white/30 text-[8px] uppercase mb-1">Combat Power / 战斗力</span>
                          <span className="text-white font-mono text-xl font-bold">{state.hero.health + state.hero.stamina + state.hero.mana}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

