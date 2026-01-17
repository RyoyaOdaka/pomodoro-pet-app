import React from 'react';
import type { TimerMode, TimerStatus, Settings } from '../../types';

interface TimerProps {
  mode: TimerMode;
  status: TimerStatus;
  timeLeft: number;
  currentSession: number;
  settings: Settings;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const Timer: React.FC<TimerProps> = ({
  mode,
  status,
  timeLeft,
  currentSession,
  settings,
  onStart,
  onPause,
  onReset,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate progress based on current mode
  const totalTime = mode === 'work'
    ? settings.workDuration * 60
    : mode === 'break'
    ? settings.breakDuration * 60
    : settings.longBreakDuration * 60;

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  // Mode-specific styling
  const getModeInfo = () => {
    switch (mode) {
      case 'work':
        return {
          label: '作業時間',
          color: 'text-work dark:text-work-light',
          circleColor: 'text-work',
          buttonColor: 'bg-work hover:bg-work-dark',
        };
      case 'break':
        return {
          label: '短い休憩',
          color: 'text-break dark:text-break-light',
          circleColor: 'text-break',
          buttonColor: 'bg-break hover:bg-break-dark',
        };
      case 'longBreak':
        return {
          label: '長い休憩',
          color: 'text-purple-600 dark:text-purple-400',
          circleColor: 'text-purple-600',
          buttonColor: 'bg-purple-600 hover:bg-purple-700',
        };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className="flex flex-col items-center space-y-8">
      {/* Mode Indicator & Session Counter */}
      <div className="flex flex-col items-center space-y-2">
        <div className={`text-2xl font-bold ${modeInfo.color} uppercase tracking-wider`}>
          {modeInfo.label}
        </div>
        {mode === 'work' && (
          <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
            セッション {currentSession}/{settings.sessionsUntilLongBreak}
          </div>
        )}
      </div>

      {/* Circular Timer */}
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className={`${modeInfo.circleColor} transition-all duration-1000`}
            strokeLinecap="round"
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl md:text-7xl font-bold text-gray-800 dark:text-gray-100 font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {status === 'running' ? (
          <button
            onClick={onPause}
            className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg shadow-lg transition-colors"
          >
            一時停止
          </button>
        ) : (
          <button
            onClick={onStart}
            className={`px-8 py-3 ${modeInfo.buttonColor} text-white font-bold rounded-lg shadow-lg transition-colors`}
          >
            {status === 'idle' ? '開始' : '再開'}
          </button>
        )}

        <button
          onClick={onReset}
          className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transition-colors"
        >
          リセット
        </button>
      </div>
    </div>
  );
};
