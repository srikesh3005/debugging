import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface OverallTimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
}

export function OverallTimer({ duration, onTimeUp, isActive }: OverallTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isActive, onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / duration) * 100;
  const isUrgent = percentage < 20; // Last 20% of time
  const isCritical = percentage < 10; // Last 10% of time

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
        isCritical 
          ? 'bg-red-500 text-white animate-pulse' 
          : isUrgent 
            ? 'bg-orange-500 text-white' 
            : 'bg-white text-gray-800 border border-gray-200'
      }`}>
        <Clock className={`w-5 h-5 ${isCritical ? 'animate-spin' : ''}`} />
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium opacity-75">Time Left</span>
          <span className="text-lg font-bold">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  );
}