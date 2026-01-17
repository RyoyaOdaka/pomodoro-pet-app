import React from 'react';
import type { Stats } from '../../types';

interface StatsPanelProps {
  stats: Stats;
  sessionsCompleted: number;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, sessionsCompleted }) => {
  const totalHours = Math.floor(stats.totalWorkMinutes / 60);
  const totalMinutes = stats.totalWorkMinutes % 60;

  return (
    <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        統計情報
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Today's Sessions */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 rounded-lg">
          <div className="text-sm text-blue-700 dark:text-blue-300 font-semibold mb-1">
            今日のセッション
          </div>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
            {sessionsCompleted}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            ポモドーロ
          </div>
        </div>

        {/* Total Pomodoros */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-lg">
          <div className="text-sm text-purple-700 dark:text-purple-300 font-semibold mb-1">
            累計セッション
          </div>
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {stats.totalPomodoros}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            ポモドーロ
          </div>
        </div>

        {/* Total Time */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-lg">
          <div className="text-sm text-green-700 dark:text-green-300 font-semibold mb-1">
            累計作業時間
          </div>
          <div className="text-3xl font-bold text-green-900 dark:text-green-100">
            {totalHours > 0 ? `${totalHours}h` : `${totalMinutes}m`}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            {totalHours > 0 && totalMinutes > 0 && `${totalMinutes}分`}
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-pink-50 dark:from-yellow-900 dark:to-pink-900 rounded-lg">
        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          {sessionsCompleted === 0 && '🎯 さあ、最初のポモドーロを始めましょう！'}
          {sessionsCompleted === 1 && '🌟 素晴らしい！最初の一歩を踏み出しました！'}
          {sessionsCompleted >= 2 && sessionsCompleted < 4 && '🔥 調子がいいですね！この調子で頑張りましょう！'}
          {sessionsCompleted >= 4 && sessionsCompleted < 8 && '💪 素晴らしい集中力です！'}
          {sessionsCompleted >= 8 && '🏆 驚異的な集中力！あなたは生産性マスターです！'}
        </p>
      </div>
    </div>
  );
};
