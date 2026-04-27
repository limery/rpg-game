import React, { useState } from "react";
import { HeroStats, DayEvent, GameState } from "../types";
import { ProgressBar, PixelButton, PixelPortrait, PixelCard, cn } from "./UI";
import { PixelScene } from "./PixelScene";
import { MapLocation } from "./MapLocation";
import { REGIONS, DAY_EVENTS } from "../constants";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Brain, Zap, Sword, Sparkles } from "lucide-react";

interface DayPhaseProps {
  state: GameState;
  onEventComplete: (effect: any, id: string) => void;
  onTriggerEnding: () => void;
}

export const DayPhase: React.FC<DayPhaseProps> = ({ state, onEventComplete, onTriggerEnding }) => {
  const { hero } = state;
  const [selectedEvent, setSelectedEvent] = useState<DayEvent | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<any | null>(null);
  const [showResult, setShowResult] = useState(false);

  const [isFailure, setIsFailure] = useState(false);

  const handleRegionClick = (regionId: string) => {
    // Special case: Demon Castle
    if (regionId === "demon_castle") {
      onTriggerEnding();
      return;
    }

    // Filter events based on region, level, and flags/chains
    const eligibleEvents = DAY_EVENTS.filter(e => {
      if (e.region !== regionId) return false;
      if (hero.level < e.minLevel) return false;
      
      // Chained logic - if not repeatable and already triggered, skip
      if (!e.repeatable && state.history.includes(e.id)) return false;

      // Special chained cases
      if (e.id === "v_cat_reward" && !state.flags.found_cat) return false;
      if (e.id === "g_cloak_usage" && !state.inventory.includes("invisible_cloak")) return false;
      if (e.id === "c_egg_hatched" && !state.flags.has_egg) return false;

      return true;
    });

    // Split into one-time and repeatable
    const limitedEvents = eligibleEvents.filter(e => !e.repeatable);
    const repeatableEvents = eligibleEvents.filter(e => e.repeatable);

    let eventToTrigger: DayEvent | null = null;

    if (eligibleEvents.length > 0) {
      eventToTrigger = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
    }

    if (eventToTrigger) {
      setSelectedEvent(eventToTrigger);
      setShowResult(false);
      setSelectedChoice(null);
      setIsFailure(false);
    } else {
      // Fallback event if none found
      setSelectedEvent({
        id: "fallback_rest",
        region: regionId,
        minLevel: 0,
        repeatable: true,
        text: "这里似乎暂时没有什么特别的事情发生。勇者决定原地休息一会儿。",
        choices: [
          {
            text: "“磨刀不误砍柴工”",
            resultText: "简单的休整让体力和精神都得到了一定程度的恢复。",
            effect: (state) => ({ hero: { ...state.hero, health: Math.min(100, state.hero.health + 10), stamina: Math.min(100, state.hero.stamina + 10) } })
          }
        ]
      });
      setShowResult(false);
      setSelectedChoice(null);
      setIsFailure(false);
    }
  };

  const handleChoiceSelect = (choice: any) => {
    const roll = Math.random();
    const failed = choice.failChance ? roll < choice.failChance : false;
    
    setIsFailure(failed);
    setSelectedChoice(choice);
    setShowResult(true);
  };

  const handleCloseEvent = () => {
    if (selectedEvent && selectedChoice) {
      const effectToUse = isFailure && selectedChoice.failEffect ? selectedChoice.failEffect : selectedChoice.effect;
      onEventComplete(effectToUse, selectedEvent.id);
    }
    setSelectedEvent(null);
    setSelectedChoice(null);
    setShowResult(false);
    setIsFailure(false);
  };

  const getSceneType = (regionId: string): "VILLAGE" | "FOREST" | "CANYON" | "SNOWFIELD" | "CITY" | "DESERT" | "VOLCANO" => {
    switch(regionId) {
      case "imperial_city": return "CITY";
      case "misty_forest": 
      case "country_forest": return "FOREST";
      case "dragon_bone_canyon": return "CANYON";
      case "ice_field": return "SNOWFIELD";
      case "desert": return "DESERT";
      case "volcano": return "VOLCANO";
      default: return "VILLAGE";
    }
  };

  const getSceneImage = (regionId: string): string => {
    switch(regionId) {
      case "starter_village": return "/upload/cg1.png";
      case "country_forest": return "/upload/cg2.png";
      case "misty_forest": return "/upload/cg3.png";
      case "imperial_city": return "/upload/cg4.png";
      case "ice_field": return "/upload/cg5.png";
      case "dragon_bone_canyon": return "/upload/cg6.png";
      case "desert": return "/upload/cg7.png";
      case "volcano": return "/upload/cg8.png";
      default: return "/upload/cg1.png";
    }
  };

  return (
    <div className="relative w-full h-full bg-[#1a2f1a] overflow-hidden flex flex-col">
      {/* Hero Header */}
      <div className="p-3 bg-black/60 backdrop-blur-md border-b-2 border-red-900/50 z-20 shrink-0">
        <div className="flex items-center gap-4">
          <PixelPortrait type="HERO" size="sm" />
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-baseline gap-2">
                <h2 className="text-white font-mono font-bold text-lg tracking-tighter pixel-text-shadow leading-none">废柴勇者</h2>
                <span className="text-green-500 font-mono text-[10px] uppercase font-bold">LV.{hero.level}</span>
              </div>
              <div className="flex gap-3 text-[10px] font-mono text-white/50 bg-black/40 px-2 py-0.5 border border-white/5">
                 <span className="flex items-center gap-1 text-white/70 font-bold uppercase tracking-widest">
                   Power: {hero.health + hero.stamina + hero.mana}
                 </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <ProgressBar value={hero.health} max={100} color="bg-red-600" label="HP" className="h-2" />
              <ProgressBar value={hero.stamina} max={100} color="bg-yellow-600" label="STA" className="h-2" />
              <ProgressBar value={hero.mana} max={100} color="bg-blue-600" label="MP" className="h-2" />
            </div>
          </div>
          <div className="flex flex-col gap-2 pl-4 border-l border-white/10">
             <div className="flex items-center gap-2 text-pink-400 text-sm font-mono font-bold">
                <Heart size={16} fill="currentColor" /> {hero.affection}
             </div>
             <div className="flex items-center gap-2 text-orange-400 text-sm font-mono font-bold">
                <Zap size={16} /> {hero.suspicion}
             </div>
          </div>
        </div>
      </div>

      {/* World Map */}
      <div className="relative flex-1 bg-black overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div 
             className="relative aspect-video w-full max-h-full bg-[url('/upload/map.png')] bg-contain bg-center bg-no-repeat shadow-2xl border-2 border-black/50 overflow-hidden"
             style={{ backgroundSize: 'contain' }}
          >
            <div className="absolute inset-0 bg-green-900/5 mix-blend-multiply pointer-events-none" />
            
            {/* Animated Mist */}
            <motion.div 
              animate={{ x: [-100, 100] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              className="absolute inset-0 bg-white/5 blur-3xl pointer-events-none"
            />
            
            {REGIONS.map(region => {
              const remainingTurns = 100 - state.currentDay;
              const isLevelLocked = hero.level < region.minLevel;
              const isTimeLocked = region.id === "imperial_city" && remainingTurns <= 10;
              
              // New Logic: At level 100, only the Imperial City and Demon Castle are accessible.
              const isPostLevel100 = hero.level >= 100;
              const isFinalRegion = region.id === "imperial_city" || region.id === "demon_castle";
              const isLocked = isLevelLocked || isTimeLocked || (isPostLevel100 && !isFinalRegion);
              
              return (
                <motion.button
                  key={region.id}
                  whileHover={!isLocked ? { scale: 1.1 } : {}}
                  onClick={() => !isLocked && handleRegionClick(region.id)}
                  className="absolute z-10"
                  style={{ left: `${region.x}%`, top: `${region.y}%` }}
                >
                  <div className={cn(
                    "relative flex flex-col items-center",
                    isLocked ? "opacity-50 grayscale" : "opacity-100"
                  )}>
                    <MapLocation id={region.id} isLocked={isLocked} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col"
            >
              <PixelCard title="冒险日常" className="bg-[#1a1010] flex flex-col max-h-full overflow-hidden border-2 md:border-4 shadow-2xl">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 md:p-6">
                  {/* 16:9 Event Background Fragment for better fit */}
                  <div className="w-full aspect-video bg-black/60 border-2 border-red-900/50 rounded-none mb-6 flex items-center justify-center relative overflow-hidden group shrink-0 shadow-inner">
                    <PixelScene type={getSceneType(selectedEvent.region)} className="absolute inset-0 opacity-40" />
                    <img src={getSceneImage(selectedEvent.region)} className="absolute inset-0 w-full h-full object-cover z-10 opacity-60 transition-transform duration-1000 group-hover:scale-105" alt="Event CG" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
  
                  <div className="mb-6">
                    <p className="text-white/95 font-serif italic text-base md:text-lg leading-relaxed border-l-4 border-red-900/50 pl-6 py-2 bg-white/5">
                      {!showResult ? selectedEvent.text : (() => {
                        const text = isFailure ? selectedChoice?.failText : selectedChoice?.resultText;
                        if (typeof text === 'function') {
                          return text(state);
                        }
                        return text || (isFailure ? "虽然想努力一把，但还是搞砸了……" : "冒险继续进行……");
                      })()}
                    </p>
                  </div>
  
                  <div className="grid grid-cols-1 gap-2 pb-2">
                    {!showResult ? (
                      selectedEvent.choices.map((choice, i) => (
                        <PixelButton 
                          key={i}
                          onClick={() => handleChoiceSelect(choice)}
                          className="text-left py-2 md:py-3 px-4 text-xs md:text-sm relative group overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                          <span className="relative z-10 flex justify-between items-center">
                            {choice.text}
                            <Sword size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </span>
                        </PixelButton>
                      ))
                    ) : (
                      <PixelButton 
                        onClick={handleCloseEvent}
                        className="py-2 md:py-3 px-4 text-xs md:text-sm relative group overflow-hidden bg-red-900/40"
                      >
                        <span className="relative z-10">继续探索</span>
                      </PixelButton>
                    )}
                  </div>
                </div>
              </PixelCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
