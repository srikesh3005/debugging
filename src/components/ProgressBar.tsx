interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-2xl mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">{current}</span>
            </div>
            <span className="text-gray-700 font-semibold">
              Progress: {current}/{total} questions
            </span>
          </div>
          <span className="text-gray-700 font-bold text-lg bg-gray-100 px-3 py-1 rounded-full">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
