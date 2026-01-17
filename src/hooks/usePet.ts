import { useState, useCallback } from 'react';
import type { PetState } from '../types';
import { addExperience, EXPERIENCE_PER_POMODORO } from '../utils/petLeveling';

export function usePet(initialPet: PetState) {
  const [pet, setPet] = useState<PetState>(initialPet);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const rewardPet = useCallback(() => {
    setPet((currentPet) => {
      const previousLevel = currentPet.level;
      const updatedPet = addExperience(currentPet, EXPERIENCE_PER_POMODORO);

      // Show level up animation if level increased
      if (updatedPet.level > previousLevel) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }

      return updatedPet;
    });
  }, []);

  const updatePetMood = useCallback((delta: number) => {
    setPet((currentPet) => ({
      ...currentPet,
      mood: Math.max(0, Math.min(100, currentPet.mood + delta)),
    }));
  }, []);

  return {
    pet,
    setPet,
    rewardPet,
    updatePetMood,
    showLevelUp,
  };
}
