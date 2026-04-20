import { useState, useCallback, useEffect } from "react";
import { GameState, HeroStats, DemonKingStats, Phase } from "../types";
import { INITIAL_STATE, ENDINGS } from "../constants";

export function useGameState() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);

  const checkGameOver = useCallback((currentState: GameState) => {
    // Hero Death
    if (currentState.hero.health <= 0) {
      setGameOverReason("废柴勇者终究还是没能挺过残酷的冒险。看着她倒在血泊中，你这个假导师、真魔王感到了前所未有的心碎。预言被打破了，你也永远失去了她。");
      setState(s => ({ ...s, phase: "GAMEOVER" }));
      return true;
    }

    // Demon King stats no longer trigger game over per user request to only have 5 core stats.

    // 100 Days Ending
    if (currentState.currentDay >= 100) {
      const ending = ENDINGS.find(e => e.condition(currentState));
      setState(s => ({ ...s, phase: "ENDING", endingId: ending?.id }));
      return true;
    }

    return false;
  }, []);

  const updateHeroStats = useCallback((updates: Partial<HeroStats>) => {
    setState(prev => {
      let newHero = { ...prev.hero, ...updates };
      let newMax = { ...prev.maxStats };

      // Ensure stats don't exceed 100 or drop below 0
      (Object.keys(newHero) as Array<keyof HeroStats>).forEach(key => {
        if (typeof newHero[key] === 'number') {
           // stats like Level might go outside 100, but health/stamina/mana are usually 100 max
           const maxVal = (key === 'health' || key === 'stamina' || key === 'mana') ? 100 : Infinity;
           newHero[key] = Math.max(0, Math.min(maxVal, newHero[key] as number)) as any;
        }
      });

      // Track max achieved values
      if (newHero.health > newMax.health) newMax.health = newHero.health;
      if (newHero.stamina > newMax.stamina) newMax.stamina = newHero.stamina;
      if (newHero.mana > newMax.mana) newMax.mana = newHero.mana;

      const newState = { ...prev, hero: newHero, maxStats: newMax };
      checkGameOver(newState);
      return newState;
    });
  }, [checkGameOver]);

  const updateDemonKingStats = useCallback((updates: Partial<DemonKingStats>) => {
    // Keeping for compatibility but effectively no-op if UI doesn't use it
    setState(prev => {
      const newDK = { ...prev.demonKing };
      (Object.keys(updates) as Array<keyof DemonKingStats>).forEach(key => {
        newDK[key] = Math.max(0, Math.min(100, (newDK[key] || 0) + (updates[key] || 0)));
      });
      return { ...prev, demonKing: newDK };
    });
  }, []);

  const applyChoice = useCallback((effect: (state: GameState) => Partial<GameState>, eventId: string) => {
    setState(prev => {
      const updates = effect(prev);
      let newState = { ...prev, ...updates };

      if (updates.hero) {
        let newHero = { ...prev.hero, ...updates.hero };
        let newMax = { ...prev.maxStats };

        // Normalize and track max
        (Object.keys(newHero) as Array<keyof HeroStats>).forEach(key => {
          if (typeof newHero[key] === 'number') {
             const maxVal = (key === 'health' || key === 'stamina' || key === 'mana') ? 100 : Infinity;
             newHero[key] = Math.max(0, Math.min(maxVal, newHero[key] as number)) as any;
          }
        });

        if (newHero.health > newMax.health) newMax.health = newHero.health;
        if (newHero.stamina > newMax.stamina) newMax.stamina = newHero.stamina;
        if (newHero.mana > newMax.mana) newMax.mana = newHero.mana;

        newState.hero = newHero;
        newState.maxStats = newMax;
      }

      if (updates.demonKing) {
        const newDK = { ...prev.demonKing };
        (Object.keys(updates.demonKing) as Array<keyof DemonKingStats>).forEach(key => {
          newDK[key] = Math.max(0, Math.min(100, (newDK[key] || 0) + (updates.demonKing![key] || 0)));
        });
        newState.demonKing = newDK;
      }
      
      newState.history = [...prev.history, eventId];
      checkGameOver(newState);
      return newState;
    });
  }, [checkGameOver]);

  const nextPhase = useCallback(() => {
    setState(prev => {
      // Guard: Don't change phase if already in GAMEOVER or ENDING
      if (prev.phase === "GAMEOVER" || prev.phase === "ENDING") {
        return prev;
      }

      if (prev.phase === "PROLOGUE") {
        return { ...prev, phase: "DAY" };
      }

      if (prev.phase === "DAY") {
        return { ...prev, phase: "NIGHT" };
      } else {
        const nextDay = prev.currentDay + 1;
        const nextLevel = prev.hero.level + 1; // +1 level per event/day
        const newState = { 
          ...prev, 
          currentDay: nextDay, 
          phase: "DAY" as Phase,
          hero: { ...prev.hero, level: nextLevel }
        };
        // We don't need to call checkGameOver here usually, but doesn't hurt
        return newState;
      }
    });
  }, []);

  const startGame = () => {
    setState(prev => ({ ...prev, phase: "PROLOGUE" }));
  };

  const triggerEnding = useCallback(() => {
    setState(prev => {
      const ending = ENDINGS.find(e => e.condition(prev));
      return { ...prev, phase: "ENDING", endingId: ending?.id };
    });
  }, []);

  const resetGame = () => {
    setState(INITIAL_STATE);
    setGameOverReason(null);
  };

  return {
    state,
    updateHeroStats,
    updateDemonKingStats,
    applyChoice,
    nextPhase,
    triggerEnding,
    startGame,
    resetGame,
    gameOverReason
  };
}
