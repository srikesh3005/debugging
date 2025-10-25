import { Logo } from './Logo';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Logo className="w-64 h-64 mx-auto" animated={true} />
        <div className="mt-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="mt-4 text-gray-600 font-semibold text-lg">Loading Quiz...</p>
        </div>
      </div>
    </div>
  );
}
