/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Phase = "START" | "PROLOGUE" | "DAY" | "NIGHT" | "ENDING" | "GAMEOVER";

export interface HeroStats {
  level: number;
  health: number;
  stamina: number;
  mana: number;
  affection: number;
  suspicion: number;
}

export interface MaxStats {
  health: number;
  stamina: number;
  mana: number;
}

export interface DemonKingStats {
  resources: number;
  military: number;
  morale: number;
  climate: number;
}

export interface GameState {
  currentDay: number;
  phase: Phase;
  hero: HeroStats;
  maxStats: MaxStats;
  demonKing: DemonKingStats;
  inventory: string[];
  history: string[];
  flags: Record<string, boolean>;
  endingId?: string;
}

export interface Choice {
  text: string;
  resultText?: string | ((state: GameState) => string);
  failText?: string | ((state: GameState) => string);
  failChance?: number; // 0 to 1, e.g. 0.1 for 10%
  effect: (state: GameState) => Partial<GameState>;
  failEffect?: (state: GameState) => Partial<GameState>;
}

export interface DayEvent {
  id: string;
  region: string;
  minLevel: number;
  animation?: string;
  repeatable?: boolean;
  isRecovery?: boolean;
  text: string;
  choices: Choice[];
}

export interface NightProposal {
  id: string;
  speaker: string;
  text: string;
  swipeLeft: {
    text: string;
    effects: Partial<DemonKingStats>;
  };
  swipeRight: {
    text: string;
    effects: Partial<DemonKingStats>;
  };
}

export interface Ending {
  id: string;
  title: string;
  text: string;
  condition: (state: GameState) => boolean;
}
