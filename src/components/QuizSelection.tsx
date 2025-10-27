import { quizCategories, QuizCategory } from '../data/quizData';
import { Logo } from './Logo';
import { LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface QuizSelectionProps {
  onSelectQuiz: (quizId: string) => void;
}

export function QuizSelection({ onSelectQuiz }: QuizSelectionProps) {
  const { signOut } = useAuth();

  const handleQuizSelect = async (quizId: string) => {
    console.log('QuizSelection - handleQuizSelect called with:', quizId);
    
    // Request fullscreen before starting quiz
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        await (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      }
    } catch (error) {
      console.log('Fullscreen request failed:', error);
    }
    
    // Start the quiz
    onSelectQuiz(quizId);
  };

  console.log('QuizSelection rendering, quizCategories:', quizCategories);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="fixed top-4 left-4 z-40">
        <Logo className="w-24 h-12" />
      </div>

      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={signOut}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <div className="max-w-6xl mx-auto pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Choose Your Quiz</h1>
          <p className="text-xl text-gray-600">
            Select a quiz category to test your knowledge
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizCategories.map((category: QuizCategory) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
              onClick={() => handleQuizSelect(category.id)}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  {category.title}
                </h2>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <p className="text-blue-800 font-semibold">
                    {category.questions.length} Questions
                  </p>
                  <p className="text-blue-600 text-sm">60 minutes total • 120 seconds per question</p>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-full font-bold text-lg transition-all">
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
