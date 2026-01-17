import { useEffect, useState } from 'react';
import { Timer } from './components/Timer/Timer';
import { Pet } from './components/Pet/Pet';
import { StatsPanel } from './components/Stats/StatsPanel';
import { Settings } from './components/Settings/Settings';
import { useTimer } from './hooks/useTimer';
import { usePet } from './hooks/usePet';
import { loadData, saveData } from './utils/storage';
import { requestNotificationPermission, showNotification, playSound } from './utils/notification';
import type { PomodoroData, Settings as SettingsType } from './types';

function App() {
  const [data, setData] = useState<PomodoroData>(loadData());
  const [showSettings, setShowSettings] = useState(false);

  const { pet, rewardPet, showLevelUp } = usePet(data.pet);

  const timer = useTimer(data.settings, () => {
    // On session complete
    rewardPet();

    // Update stats
    setData((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalPomodoros: prev.stats.totalPomodoros + 1,
        totalWorkMinutes: prev.stats.totalWorkMinutes + prev.settings.workDuration,
        lastPlayDate: new Date().toISOString(),
      },
    }));

    // Show notification and play sound
    if (data.settings.notificationEnabled) {
      showNotification(
        'ポモドーロ完了！',
        '素晴らしい！休憩時間です。ペットが成長しました！'
      );
    }
    if (data.settings.soundEnabled) {
      playSound(true);
    }
  });

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Save data whenever pet or stats change
  useEffect(() => {
    const updatedData: PomodoroData = {
      ...data,
      pet,
      stats: data.stats,
    };
    saveData(updatedData);
  }, [pet, data.stats]);

  const handleSaveSettings = (newSettings: SettingsType) => {
    setData((prev) => ({
      ...prev,
      settings: newSettings,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 relative">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ポモドーロペット
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            集中して作業し、ペットを育てよう！
          </p>
          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="absolute top-0 right-0 p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title="設定"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer Section */}
          <div className="flex flex-col items-center justify-center">
            <Timer
              mode={timer.mode}
              status={timer.status}
              timeLeft={timer.timeLeft}
              currentSession={timer.currentSession}
              settings={data.settings}
              onStart={timer.start}
              onPause={timer.pause}
              onReset={timer.reset}
            />
          </div>

          {/* Pet Section */}
          <div className="flex flex-col items-center justify-center">
            <Pet pet={pet} showLevelUp={showLevelUp} />
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex justify-center">
          <StatsPanel
            stats={data.stats}
            sessionsCompleted={timer.sessionsCompleted}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>🍅 ポモドーロテクニック: {data.settings.workDuration}分集中 + {data.settings.breakDuration}分休憩</p>
          <p>💡 ヒント: 作業を続けるとペットが成長します</p>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <Settings
          settings={data.settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
