import type { PetState, PetStage } from '../types';

// Experience required for each level (cumulative)
export const EXPERIENCE_PER_LEVEL = 100;

// Experience gained per completed pomodoro
export const EXPERIENCE_PER_POMODORO = 50;

export const calculateLevel = (experience: number): number => {
  return Math.floor(experience / EXPERIENCE_PER_LEVEL) + 1;
};

export const calculateExperienceForNextLevel = (experience: number): number => {
  const currentLevel = calculateLevel(experience);
  return currentLevel * EXPERIENCE_PER_LEVEL;
};

export const getExperienceProgress = (experience: number): number => {
  const experienceInCurrentLevel = experience % EXPERIENCE_PER_LEVEL;
  return (experienceInCurrentLevel / EXPERIENCE_PER_LEVEL) * 100;
};

export const getPetStage = (level: number): PetStage => {
  if (level >= 8) return 'adult';
  if (level >= 4) return 'child';
  return 'egg';
};

export const getPetEmoji = (stage: PetStage): string => {
  switch (stage) {
    case 'egg':
      return '🥚';
    case 'child':
      return '🐣';
    case 'adult':
      return '🐶';
  }
};

export const addExperience = (currentPet: PetState, amount: number): PetState => {
  const newExperience = currentPet.experience + amount;
  const newLevel = calculateLevel(newExperience);
  const newStage = getPetStage(newLevel);

  // Increase mood when gaining experience
  const moodIncrease = amount / 10;
  const newMood = Math.min(100, currentPet.mood + moodIncrease);

  return {
    ...currentPet,
    experience: newExperience,
    level: newLevel,
    stage: newStage,
    mood: newMood,
  };
};

export const updateMood = (currentMood: number, delta: number): number => {
  return Math.max(0, Math.min(100, currentMood + delta));
};
