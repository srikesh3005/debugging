import { useEffect, useState, useRef } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive: boolean;
  onReset?: () => void;
}

export function Timer({ duration, onTimeUp, isActive }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const onTimeUpRef = useRef(onTimeUp);

  // Keep onTimeUp ref updated
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Reset timer when duration changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Main timer logic
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, duration]); // Only depend on isActive and duration, NOT timeLeft

  const percentage = (timeLeft / duration) * 100;
  const isUrgent = percentage < 30;

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-3 shadow-lg">
      <Clock className={`w-5 h-5 ${isUrgent ? 'text-red-500 animate-pulse' : 'text-orange-500'}`} />
      <div className="flex items-center gap-2">
        <span className={`font-bold text-lg ${isUrgent ? 'text-red-500' : 'text-gray-800'}`}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}
