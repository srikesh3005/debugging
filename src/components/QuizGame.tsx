import { useState, useEffect } from 'react';
import { quizCategories, Question } from '../data/quizData';
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
import { isTestAccount } from '../lib/testAccounts';

interface QuizGameProps {
  quizId: string;
  hasAlreadyTaken: boolean;
}

export function QuizGame({ quizId, hasAlreadyTaken: initialHasAlreadyTaken }: QuizGameProps) {
  const { user, signOut } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({});
  const [timerKey, setTimerKey] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [overallTimerActive, setOverallTimerActive] = useState(true);
  const [startTime] = useState(Date.now());
  const [hasAlreadyTaken] = useState(initialHasAlreadyTaken);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [lastViolationType, setLastViolationType] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const selectedQuiz = quizCategories.find(q => q.id === quizId);
  const quizQuestions: Question[] = selectedQuiz?.questions || [];
  const isTest = isTestAccount(user?.email);

  // Initialize anti-cheat system
  const {
    warnings,
    hasLeftTab,
    requestFullscreen,
  } = useAntiCheat({
    userId: user?.id || '',
    attemptId: attemptId || undefined,
    maxWarnings: 100, // Set high limit so it never auto-ends
    onMaxWarningsReached: () => {
      // Just track warnings, don't end quiz automatically
      console.log('Max warnings reached, but continuing quiz');
    },
    onWarning: (event) => {
      setLastViolationType(event.type);
      setShowWarning(true);
    },
  });

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion?.id];
  const currentAnsweredCount = Object.keys(answers).length;

  useEffect(() => {
    const createAttempt = async () => {
      if (!user || hasAlreadyTaken || attemptId) return;

      try {
        console.log('Creating quiz attempt with:', {
          user_id: user.id,
          quiz_type: quizId,
          is_test: isTest,
          total_questions: quizQuestions.length
        });

        const { data, error } = await supabase
          .from('quiz_attempts')
          .insert({
            user_id: user.id,
            score: 0,
            total_questions: quizQuestions.length,
            percentage: 0,
            time_taken: 0,
            quiz_type: quizId,
            is_test: isTest
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating quiz attempt:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          throw error;
        }

        console.log('Quiz attempt created successfully:', data);

        if (data?.id) {
          setAttemptId(data.id);
        }
      } catch (error) {
        console.error('Failed to create quiz attempt:', error);
      }
    };

    createAttempt();
  }, [user, hasAlreadyTaken, attemptId, quizQuestions.length, quizId, isTest]);

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
    console.log('=== CALCULATING SCORE ===');
    console.log('Total questions:', quizQuestions.length);
    console.log('Answers collected:', answers);
    console.log('Number of answers:', Object.keys(answers).length);
    
    const score = quizQuestions.reduce((total, question) => {
      const isCorrect = answers[question.id] === question.correctAnswer;
      console.log(`Q${question.id}: Selected=${answers[question.id]}, Correct=${question.correctAnswer}, IsCorrect=${isCorrect}`);
      if (isCorrect) {
        return total + 1;
      }
      return total;
    }, 0);
    
    console.log('Final calculated score:', {
      score,
      totalQuestions: quizQuestions.length,
      totalAnswered: Object.keys(answers).length,
      percentage: Math.round((score / quizQuestions.length) * 100)
    });
    console.log('=== END SCORE CALCULATION ===');
    
    return score;
  };

  const saveQuizResults = async () => {
    if (!user || isSaving || !attemptId) {
      console.log('Cannot save quiz results:', { user: !!user, isSaving, attemptId });
      return;
    }
    
    setIsSaving(true);

    const score = calculateScore();
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000); // in seconds

    console.log('Saving quiz results:', {
      attemptId,
      score,
      percentage,
      timeTaken,
      totalQuestions: quizQuestions.length,
      answersCount: Object.keys(answers).length
    });

    try {
      // Update quiz attempt with final results
      const { data, error: attemptError } = await supabase
        .from('quiz_attempts')
        .update({
          score,
          percentage,
          time_taken: timeTaken,
          completed_at: new Date().toISOString()
        })
        .eq('id', attemptId)
        .select();

      console.log('Quiz attempt update result:', { data, error: attemptError });

      if (attemptError) {
        console.error('Error updating quiz attempt:', attemptError);
        throw attemptError;
      }

      if (!data || data.length === 0) {
        console.error('No data returned from update - attempt might not exist:', attemptId);
      } else {
        console.log('Successfully updated quiz attempt with score:', data[0]);
      }

      // Save individual answers
      console.log('Saving individual answers for', quizQuestions.length, 'questions');
      const answerPromises = quizQuestions.map((question, index) => {
        const selectedAnswer = answers[question.id];
        if (!selectedAnswer) {
          console.warn(`No answer for question ${question.id} (index ${index})`);
          return null;
        }

        const answerData = {
          attempt_id: attemptId,
          question_id: question.id,
          selected_answer: selectedAnswer,
          correct_answer: question.correctAnswer,
          is_correct: selectedAnswer === question.correctAnswer
        };
        
        console.log(`Saving answer for Q${question.id}:`, answerData);

        return supabase.from('quiz_answers').insert(answerData);
      });

      const answerResults = await Promise.all(answerPromises.filter(Boolean));
      console.log('All answers saved. Results:', answerResults);
      
      // Check for any errors in answer saving
      const answerErrors = answerResults.filter(r => r && r.error);
      if (answerErrors.length > 0) {
        console.error('Errors saving some answers:', answerErrors);
      }
      
    } catch (error) {
      console.error('Error in saveQuizResults:', error);
    } finally {
      setIsSaving(false);
    }
  };



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
            <p className="text-2xl mb-2">Thank you for completing the {selectedQuiz?.title} quiz!</p>
            <p className="text-lg opacity-90">Your results have been submitted successfully.</p>
          </div>
          <div className="text-gray-600 mb-8">
            <p className="text-lg">Quiz completed successfully!</p>
            {!isTest && <p className="text-sm mt-2">You can only take this quiz once.</p>}
            {isTest && <p className="text-sm mt-2 text-green-600 font-semibold">🧪 Test Mode: You can take unlimited quizzes!</p>}
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
      <div className="fixed top-4 left-4 z-40">
        <Logo className="w-24 h-12" />
      </div>

      {isTest && (
        <div className="fixed top-4 right-4 z-40 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg animate-pulse">
          🧪 TEST MODE - Unlimited Attempts
        </div>
      )}

      {!isTest && (
        <OverallTimer
          duration={60}
          onTimeUp={handleOverallTimeUp}
          isActive={overallTimerActive && !isCompleted}
        />
      )}
      
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
          duration={60}
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
