// Timer Types
export type TimerMode = 'work' | 'break' | 'longBreak';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  mode: TimerMode;
  status: TimerStatus;
  timeLeft: number; // in seconds
  sessionsCompleted: number;
  currentSession: number; // 1-4
}

// Pet Types
export type PetStage = 'egg' | 'child' | 'adult';

export interface PetState {
  level: number;
  experience: number;
  mood: number; // 0-100
  stage: PetStage;
}

// Stats Types
export interface Stats {
  totalPomodoros: number;
  totalWorkMinutes: number;
  lastPlayDate: string;
}

// Settings Types
export interface Settings {
  soundEnabled: boolean;
  notificationEnabled: boolean;
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number; // default 4
}

// App Data Structure
export interface PomodoroData {
  pet: PetState;
  stats: Stats;
  settings: Settings;
}

// Action Types for Reducers
export type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'SWITCH_MODE' };

export type PetAction =
  | { type: 'ADD_EXPERIENCE'; payload: number }
  | { type: 'LEVEL_UP' }
  | { type: 'UPDATE_MOOD'; payload: number };
