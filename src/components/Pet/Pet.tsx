import React from 'react';
import type { PetState } from '../types';
import { getPetEmoji, getExperienceProgress } from '../../utils/petLeveling';

interface PetProps {
  pet: PetState;
  showLevelUp: boolean;
}

export const Pet: React.FC<PetProps> = ({ pet, showLevelUp }) => {
  const experienceProgress = getExperienceProgress(pet.experience);
  const petEmoji = getPetEmoji(pet.stage);

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      {/* Level Up Animation */}
      {showLevelUp && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="animate-bounce text-6xl font-bold text-yellow-500 bg-white dark:bg-gray-800 px-8 py-4 rounded-lg shadow-2xl">
            🎉 レベルアップ! 🎉
          </div>
        </div>
      )}

      {/* Pet Display */}
      <div className="relative">
        <div className="text-9xl animate-bounce-slow">
          {petEmoji}
        </div>

        {/* Mood indicator (hearts) */}
        <div className="absolute -top-2 -right-2 flex gap-1">
          {pet.mood > 75 && <span className="text-2xl animate-pulse-slow">💖</span>}
          {pet.mood > 50 && <span className="text-2xl animate-pulse-slow">❤️</span>}
          {pet.mood > 25 && <span className="text-2xl">💛</span>}
          {pet.mood <= 25 && <span className="text-2xl">💔</span>}
        </div>
      </div>

      {/* Pet Info */}
      <div className="w-full space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            レベル {pet.level}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {pet.stage === 'egg' && '卵'}
            {pet.stage === 'child' && '幼体'}
            {pet.stage === 'adult' && '成体'}
          </span>
        </div>

        {/* Experience Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>経験値</span>
            <span>{Math.floor(experienceProgress)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
              style={{ width: `${experienceProgress}%` }}
            />
          </div>
        </div>

        {/* Mood Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>気分</span>
            <span>{pet.mood}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                pet.mood > 75
                  ? 'bg-green-500'
                  : pet.mood > 50
                  ? 'bg-yellow-500'
                  : pet.mood > 25
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}
              style={{ width: `${pet.mood}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage Description */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 italic">
        {pet.stage === 'egg' && 'もうすぐ孵化するかも...'}
        {pet.stage === 'child' && 'すくすく成長中！'}
        {pet.stage === 'adult' && '立派に成長しました！'}
      </p>
    </div>
  );
};
