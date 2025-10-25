import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuizGame } from './components/QuizGame';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { AdminDashboard } from './components/AdminDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [userRole, setUserRole] = useState<'user' | 'admin' | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Fetch user role
      const fetchUserRole = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          
          setUserRole(data?.role || 'user');
        } catch (error) {
          console.error('Error fetching user role:', error);
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

  if (loading || (user && roleLoading)) {
    return <LoadingScreen />;
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

  return <QuizGame />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
