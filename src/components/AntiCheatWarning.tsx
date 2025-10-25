import { AlertTriangle, X } from 'lucide-react';

interface AntiCheatWarningProps {
  warnings: number;
  maxWarnings: number;
  lastWarningType?: string;
  onDismiss: () => void;
  requestFullscreen?: () => void;
}

export function AntiCheatWarning({ warnings, maxWarnings, lastWarningType, onDismiss, requestFullscreen }: AntiCheatWarningProps) {
  const handleDismiss = () => {
    onDismiss();
    // Automatically re-enter fullscreen after dismissing warning
    if (requestFullscreen) {
      setTimeout(() => {
        requestFullscreen();
      }, 100);
    }
  };
  const warningMessages: Record<string, string> = {
    tab_switch: 'Switching tabs or windows is not allowed during the quiz',
    fullscreen_exit: 'You must stay in fullscreen mode during the quiz',
  };

  const getRemainingWarnings = () => maxWarnings - warnings;
  const isLastWarning = warnings >= maxWarnings - 1;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-bounce-in">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className={`${isLastWarning ? 'bg-red-100' : 'bg-yellow-100'} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <AlertTriangle className={`w-10 h-10 ${isLastWarning ? 'text-red-600' : 'text-yellow-600'}`} />
          </div>

          <h2 className={`text-2xl font-bold mb-3 ${isLastWarning ? 'text-red-600' : 'text-yellow-600'}`}>
            {isLastWarning ? 'Final Warning!' : 'Warning!'}
          </h2>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4">
            <p className="text-gray-800 font-semibold mb-2">
              {lastWarningType && warningMessages[lastWarningType]}
            </p>
            <p className="text-gray-600 text-sm">
              This action has been logged and flagged.
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Warnings</span>
              <span className={`text-sm font-bold ${isLastWarning ? 'text-red-600' : 'text-yellow-600'}`}>
                {warnings} / {maxWarnings}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLastWarning ? 'bg-red-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${(warnings / maxWarnings) * 100}%` }}
              />
            </div>
          </div>

          {isLastWarning ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-800 font-bold text-sm">
                ⚠️ This is your final warning!
              </p>
              <p className="text-red-700 text-sm mt-1">
                One more violation will result in automatic quiz submission.
              </p>
            </div>
          ) : (
            <p className="text-gray-600 text-sm mb-4">
              You have <span className="font-bold text-gray-800">{getRemainingWarnings()}</span> warning{getRemainingWarnings() !== 1 ? 's' : ''} remaining.
            </p>
          )}

          <button
            onClick={handleDismiss}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-full font-bold text-lg transition-all hover:scale-105"
          >
            I Understand
          </button>

          <p className="text-xs text-gray-500 mt-4">
            All suspicious activities are being monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
}