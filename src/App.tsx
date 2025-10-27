import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuizGame } from './components/QuizGame';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AdminDashboard } from './components/AdminDashboard';
import { QuizSelection } from './components/QuizSelection';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [checkingIncompleteAttempt, setCheckingIncompleteAttempt] = useState(true);

  const handleQuizSelection = (quizId: string) => {
    console.log('=== handleQuizSelection called ===');
    console.log('Quiz ID received:', quizId);
    setSelectedQuizId(quizId);
    console.log('setSelectedQuizId called with:', quizId);
  };

  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setUserRole(data?.role || 'user');
        } catch (error) {
          setUserRole('user');
        } finally {
          setRoleLoading(false);
        }
      };

      fetchUserRole();
    } else {
      setRoleLoading(false);
    }
  }, [user]);

  // Check for incomplete quiz attempts on login
  useEffect(() => {
    const checkIncompleteAttempt = async () => {
      if (!user) {
        setCheckingIncompleteAttempt(false);
        setSelectedQuizId(null);
        return;
      }

      if (!userRole || userRole === 'admin') {
        setCheckingIncompleteAttempt(false);
        return;
      }

      try {
        console.log('Checking for incomplete attempts for user:', user.id);
        
        // First, let's see ALL attempts for debugging
        const { data: allAttempts } = await supabase
          .from('quiz_attempts')
          .select('*')
          .eq('user_id', user.id);
        
        console.log('All quiz attempts for user:', allAttempts);
        
        // Check if there's an incomplete quiz attempt
        const { data: incompleteAttempt, error } = await supabase
          .from('quiz_attempts')
          .select('quiz_type, id, completed_at')
          .eq('user_id', user.id)
          .is('completed_at', null) // Only incomplete attempts
          .limit(1)
          .maybeSingle();

        console.log('Incomplete attempt query result:', { data: incompleteAttempt, error });

        if (error) {
          console.error('Error checking incomplete attempt:', error);
        }

        if (incompleteAttempt && incompleteAttempt.quiz_type) {
          console.log('✅ Found incomplete attempt! Resuming quiz:', {
            quiz_type: incompleteAttempt.quiz_type,
            attempt_id: incompleteAttempt.id
          });
          setSelectedQuizId(incompleteAttempt.quiz_type);
        } else {
          console.log('No incomplete attempts found - showing quiz selection');
          setSelectedQuizId(null);
        }
      } catch (error) {
        console.error('Exception checking incomplete attempt:', error);
        setSelectedQuizId(null);
      } finally {
        setCheckingIncompleteAttempt(false);
      }
    };

    checkIncompleteAttempt();
  }, [user, userRole]);

  console.log('=== AppContent Render ===');
  console.log('selectedQuizId:', selectedQuizId);
  console.log('user:', user?.email);
  console.log('loading:', loading);
  console.log('roleLoading:', roleLoading);
  console.log('checkingIncompleteAttempt:', checkingIncompleteAttempt);

  if (loading || (user && roleLoading) || (user && checkingIncompleteAttempt)) {
    console.log('Showing loading screen');
    return null;
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginPage onSwitchToSignup={() => setAuthMode('signup')} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthMode('login')} />
    );
  }

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  if (!selectedQuizId) {
    console.log('Showing QuizSelection');
    return <QuizSelection onSelectQuiz={handleQuizSelection} />;
  }

  console.log('Showing QuizGame with selected quiz:', selectedQuizId);
  return <QuizGame quizId={selectedQuizId} hasAlreadyTaken={false} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
