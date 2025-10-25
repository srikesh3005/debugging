import { useState, useEffect } from 'react';
import { quizQuestions } from '../data/quizData';
import { QuizCard } from './QuizCard';
import { ProgressBar } from './ProgressBar';
import { Timer } from './Timer';
import { OverallTimer } from './OverallTimer';
import { AntiCheatWarning } from './AntiCheatWarning';
import { Logo } from './Logo';
import { ChevronRight, Trophy, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useAntiCheat } from '../hooks/useAntiCheat';

export function QuizGame() {
  const { user, signOut } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [timerKey, setTimerKey] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [overallTimerActive, setOverallTimerActive] = useState(true);
  const [startTime] = useState(Date.now());
  const [hasAlreadyTaken, setHasAlreadyTaken] = useState(false);
  const [checkingPreviousAttempt, setCheckingPreviousAttempt] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [lastViolationType, setLastViolationType] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize anti-cheat system
  const {
    warnings,
    isFullscreen,
    hasLeftTab,
    requestFullscreen,
  } = useAntiCheat({
    userId: user?.id || '',
    attemptId: attemptId || undefined,
    maxWarnings: 4,
    onMaxWarningsReached: async () => {
      // Auto-submit quiz when max warnings reached
      await saveQuizResults();
      setIsCompleted(true);
    },
    onWarning: (event) => {
      setLastViolationType(event.type);
      setShowWarning(true);
    },
  });

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion?.id];
  const currentAnsweredCount = Object.keys(answers).length;

  // Check if user has already taken the quiz
  useEffect(() => {
    const checkPreviousAttempt = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('quiz_attempts')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (error) {
          console.error('Error checking previous attempts:', error);
        } else if (data && data.length > 0) {
          setHasAlreadyTaken(true);
        }
      } catch (error) {
        console.error('Error checking previous attempts:', error);
      } finally {
        setCheckingPreviousAttempt(false);
      }
    };

    checkPreviousAttempt();
  }, [user]);

  // Create quiz attempt at the start
  useEffect(() => {
    const createAttempt = async () => {
      if (!user || hasAlreadyTaken || checkingPreviousAttempt || attemptId) return;

      try {
        const { data, error } = await supabase
          .from('quiz_attempts')
          .insert({
            user_id: user.id,
            score: 0,
            total_questions: quizQuestions.length,
            percentage: 0,
            time_taken: 0
          })
          .select()
          .single();

        if (error) throw error;

        if (data?.id) {
          setAttemptId(data.id);
          console.log('Created attempt:', data.id);
        }
      } catch (error) {
        console.error('Error creating quiz attempt:', error);
      }
    };

    createAttempt();
  }, [user, hasAlreadyTaken, checkingPreviousAttempt, attemptId]);

  const handleAnswer = (questionId: number, answer: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = async () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimerKey((prev) => prev + 1);
    } else {
      // Save results to database before completing
      await saveQuizResults();
      setIsCompleted(true);
    }
  };

  const handleTimeUp = () => {
    // Automatically move to next question immediately
    handleNext();
  };

  const handleOverallTimeUp = async () => {
    // Force complete the quiz when overall time runs out
    setOverallTimerActive(false);
    await saveQuizResults();
    setIsCompleted(true);
  };

  const calculateScore = () => {
    return quizQuestions.reduce((score, question) => {
      if (answers[question.id] === question.correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const saveQuizResults = async () => {
    if (!user || isSaving || !attemptId) return; // Need attemptId to save
    
    setIsSaving(true);

    const score = calculateScore();
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000); // in seconds

    try {
      // Update quiz attempt with final results
      const { error: attemptError } = await supabase
        .from('quiz_attempts')
        .update({
          score,
          percentage,
          time_taken: timeTaken,
          completed_at: new Date().toISOString()
        })
        .eq('id', attemptId);

      if (attemptError) throw attemptError;

      // Save individual answers
      const answerPromises = quizQuestions.map((question) => {
        const selectedAnswer = answers[question.id];
        if (!selectedAnswer) return null;

        return supabase.from('quiz_answers').insert({
          attempt_id: attemptId,
          question_id: question.id,
          selected_answer: selectedAnswer,
          correct_answer: question.correctAnswer,
          is_correct: selectedAnswer === question.correctAnswer
        });
      });

      await Promise.all(answerPromises.filter(Boolean));
    } catch (error) {
      console.error('Error saving quiz results:', error);
    } finally {
      setIsSaving(false);
    }
  };



  // Show loading while checking for previous attempts
  if (checkingPreviousAttempt) {
    return null; // Fast loading, no animation
  }

  // Show message if user has already taken the quiz
  if (hasAlreadyTaken) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
          <div className="mb-6">
            <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Already Completed</h1>
          <div className="bg-blue-50 border border-blue-200 text-gray-800 rounded-2xl p-6 mb-6">
            <p className="text-lg mb-2">You have already taken this quiz.</p>
            <p className="text-sm opacity-90">Each user can only attempt the quiz once.</p>
          </div>
          <p className="text-gray-600 mb-8">
            Thank you for your participation! Your results have been recorded.
          </p>
          <button
            onClick={signOut}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center transform animate-bounce-in">
          <div className="mb-6">
            <Trophy className="w-24 h-24 mx-auto text-yellow-500" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Quiz Complete!</h1>
          <div className="bg-green-50 border border-green-200 text-gray-800 rounded-2xl p-8 mb-8">
            <p className="text-2xl mb-2">Thank you for completing the debugging quiz!</p>
            <p className="text-lg opacity-90">Your results have been submitted successfully.</p>
          </div>
          <div className="text-gray-600 mb-8">
            <p className="text-lg">Quiz completed successfully!</p>
            <p className="text-sm mt-2">You can only take this quiz once.</p>
          </div>
          <button
            onClick={signOut}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      {/* Logo in top left */}
      <div className="fixed top-4 left-4 z-40">
        <Logo className="w-24 h-12" />
      </div>

      <OverallTimer
        duration={30 * 60} // 30 minutes in seconds
        onTimeUp={handleOverallTimeUp}
        isActive={overallTimerActive && !isCompleted}
      />
      
      {/* Anti-cheat warning modal */}
      {showWarning && (
        <AntiCheatWarning
          warnings={warnings}
          maxWarnings={4}
          lastWarningType={lastViolationType}
          onDismiss={() => setShowWarning(false)}
          requestFullscreen={requestFullscreen}
        />
      )}

      {/* Fullscreen prompt */}
      {!isFullscreen && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100 border-2 border-yellow-500 text-gray-800 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
          <span className="text-sm font-semibold">⚠️ Please enter fullscreen mode for the quiz</span>
          <button
            onClick={requestFullscreen}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded font-semibold text-sm transition-colors"
          >
            Enter Fullscreen
          </button>
        </div>
      )}

      {/* Tab switch alert */}
      {hasLeftTab && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-100 border-2 border-red-500 text-gray-800 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
          <span className="text-sm font-semibold">⚠️ Warning: Tab switching detected! ({warnings}/3)</span>
        </div>
      )}
      
      <div className="w-full max-w-2xl mb-6 flex items-center justify-between">
        <ProgressBar current={currentAnsweredCount} total={quizQuestions.length} />
      </div>

      <div className="mb-6">
        <Timer
          key={timerKey}
          duration={15}
          onTimeUp={handleTimeUp}
          isActive={true}
        />
      </div>

      <div className="space-y-6 w-full max-w-2xl mb-6">
        {currentQuestion && (
          <div className="transition-all duration-500">
            <QuizCard
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={quizQuestions.length}
              onAnswer={handleAnswer}
              selectedAnswer={answers[currentQuestion.id]}
              isRevealed={false}
            />
          </div>
        )}
      </div>

      {isAnswered && (
        <button
          onClick={handleNext}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg flex items-center gap-2 animate-bounce-in"
        >
          {currentQuestionIndex < quizQuestions.length - 1 ? (
            <>
              Next Question
              <ChevronRight className="w-5 h-5" />
            </>
          ) : (
            <>
              View Results
              <Trophy className="w-5 h-5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
