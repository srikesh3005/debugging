import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuizGame } from './components/QuizGame';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AdminDashboard } from './components/AdminDashboard';
import { QuizSelection } from './components/QuizSelection';
import { supabase } from './lib/supabase';
import { isTestAccount } from './lib/testAccounts';

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [hasAlreadyTaken, setHasAlreadyTaken] = useState(false);
  const [checkingPreviousAttempt, setCheckingPreviousAttempt] = useState(true);

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

  useEffect(() => {
    const checkPreviousAttempt = async () => {
      if (!user) {
        setCheckingPreviousAttempt(false);
        setHasAlreadyTaken(false); // Reset when user logs out
        setSelectedQuizId(null); // Reset quiz selection
        return;
      }

      if (isTestAccount(user?.email)) {
        setCheckingPreviousAttempt(false);
        setHasAlreadyTaken(false); // Test accounts can always take quizzes
        setSelectedQuizId(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('quiz_attempts')
          .select('id, quiz_type')
          .eq('user_id', user.id)
          .limit(1);

        console.log('Previous attempt check:', { data, error });

        if (error) {
          console.error('Error checking previous attempt:', error);
          setHasAlreadyTaken(false); // On error, assume no previous attempt
          setSelectedQuizId(null);
        } else if (data && data.length > 0) {
          console.log('Found previous attempt:', data[0]);
          setHasAlreadyTaken(true);
          if (data[0].quiz_type) {
            console.log('Setting quiz_type to:', data[0].quiz_type);
            setSelectedQuizId(data[0].quiz_type);
          } else {
            console.warn('quiz_type is null, defaulting to healthcare');
            setSelectedQuizId('healthcare'); // Default to healthcare if null
          }
        } else {
          // No previous attempts found - new user can take quiz
          setHasAlreadyTaken(false);
          setSelectedQuizId(null);
        }
      } catch (error) {
        console.error('Exception checking previous attempt:', error);
        setHasAlreadyTaken(false);
        setSelectedQuizId(null);
      } finally {
        setCheckingPreviousAttempt(false);
      }
    };

    checkPreviousAttempt();
  }, [user]);

  console.log('=== AppContent Render ===');
  console.log('selectedQuizId:', selectedQuizId);
  console.log('hasAlreadyTaken:', hasAlreadyTaken);
  console.log('user:', user?.email);
  console.log('loading:', loading);
  console.log('roleLoading:', roleLoading);
  console.log('checkingPreviousAttempt:', checkingPreviousAttempt);

  if (loading || (user && roleLoading) || (user && checkingPreviousAttempt)) {
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

  if (hasAlreadyTaken && !isTestAccount(user?.email)) {
    console.log('Showing QuizGame with hasAlreadyTaken=true');
    return <QuizGame quizId={selectedQuizId || 'healthcare'} hasAlreadyTaken={true} />;
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
