import { useState, useEffect } from 'react';
import { Question } from '../data/quizData';

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => void;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  isRevealed: boolean;
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  selectedAnswer,
  isRevealed
}: QuizCardProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, [question.id]);

  const getOptionColor = (option: 'A' | 'B' | 'C' | 'D') => {
    if (!isRevealed) {
      if (selectedAnswer === option) {
        return 'bg-blue-50 border-blue-500 text-gray-800 scale-105 shadow-md border-2';
      }
      return 'bg-gray-50 hover:bg-gray-100 border-gray-300 hover:border-gray-400 hover:shadow-sm border-2';
    }

    if (option === question.correctAnswer) {
      return 'bg-green-50 border-green-500 text-gray-800 shadow-md border-2';
    }

    if (selectedAnswer === option && option !== question.correctAnswer) {
      return 'bg-red-50 border-red-500 text-gray-800 shadow-md border-2';
    }

    return 'bg-gray-50 border-gray-300 text-gray-500 border-2';
  };

  const optionLabels: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

  return (
    <div
      className={`bg-white rounded-3xl shadow-lg p-8 w-full max-w-2xl transition-all duration-500 transform hover:scale-102 border border-gray-200 ${
        animate ? 'animate-bounce-in' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">{questionNumber}</span>
          </div>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
          {question.question}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {optionLabels.map((label) => (
          <button
            key={label}
            onClick={() => !isRevealed && onAnswer(question.id, label)}
            disabled={isRevealed}
            className={`
              p-6 rounded-2xl font-semibold text-left
              transition-all duration-300 transform
              ${getOptionColor(label)}
              ${!isRevealed && 'hover:scale-105 active:scale-95 cursor-pointer'}
              ${isRevealed && 'cursor-not-allowed'}
              disabled:cursor-not-allowed
            `}
          >
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-white text-lg">
                {label}
              </span>
              <span className="flex-1 text-base leading-relaxed">
                {question.options[label]}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
