import type { PomodoroData } from '../types';

const STORAGE_KEY = 'pomodoro-pet-data';

export const defaultData: PomodoroData = {
  pet: {
    level: 1,
    experience: 0,
    mood: 50,
    stage: 'egg',
  },
  stats: {
    totalPomodoros: 0,
    totalWorkMinutes: 0,
    lastPlayDate: new Date().toISOString(),
  },
  settings: {
    soundEnabled: true,
    notificationEnabled: true,
    workDuration: 30,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  },
};

export const loadData = (): PomodoroData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with default settings for backward compatibility
      return {
        ...defaultData,
        ...parsed,
        settings: {
          ...defaultData.settings,
          ...parsed.settings,
        },
      };
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
  return defaultData;
};

export const saveData = (data: PomodoroData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
  }
};

export const resetData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting data:', error);
  }
};
