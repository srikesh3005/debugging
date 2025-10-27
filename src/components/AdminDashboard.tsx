import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';
import { BarChart3, Users, Clock, Trophy, LogOut, Loader, AlertTriangle } from 'lucide-react';

interface QuizResult {
  id: string;
  completed_at: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken: number;
  full_name: string;
  email: string;
  total_answers: number;
  user_id: string;
  quiz_type?: string;
}

export function AdminDashboard() {
  const { signOut } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warningsData, setWarningsData] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchResults();
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('anti_cheat_logs')
        .select('*');

      if (error) throw error;

      // Count warnings per attempt
      const warningCounts: Record<string, number> = {};
      data?.forEach((log) => {
        if (log.attempt_id) {
          warningCounts[log.attempt_id] = (warningCounts[log.attempt_id] || 0) + 1;
        }
      });
      
      setWarningsData(warningCounts);
    } catch (err: any) {
      
    }
  };

  const fetchResults = async () => {
    try {
      console.log('Fetching quiz results from quiz_results_view...');
      
      // First, try the view
      const { data, error } = await supabase
        .from('quiz_results_view')
        .select('*')
        .order('completed_at', { ascending: false });

      console.log('Quiz results data:', data);
      console.log('Quiz results error:', error);
      
      // If view fails or returns nothing, try direct table query
      if (error || !data || data.length === 0) {
        console.log('View failed or empty, trying direct table query...');
        
        const { data: directData, error: directError } = await supabase
          .from('quiz_attempts')
          .select(`
            id,
            user_id,
            score,
            total_questions,
            percentage,
            time_taken,
            completed_at,
            quiz_type,
            profiles!inner(full_name, email)
          `)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false });
        
        console.log('Direct query data:', directData);
        console.log('Direct query error:', directError);
        
        if (directError) throw directError;
        
        // Transform the data to match our QuizResult interface
        const transformedData = directData?.map(item => ({
          id: item.id,
          user_id: item.user_id,
          completed_at: item.completed_at,
          score: item.score,
          total_questions: item.total_questions,
          percentage: item.percentage,
          time_taken: item.time_taken,
          quiz_type: item.quiz_type,
          full_name: (item.profiles as any).full_name,
          email: (item.profiles as any).email,
          total_answers: 0 // Will need to count from quiz_answers if needed
        })) || [];
        
        console.log('Transformed data:', transformedData);
        setResults(transformedData);
        setLoading(false);
        return;
      }
      
      // Log each result to see what we're getting
      if (data && data.length > 0) {
        console.log('=== DETAILED QUIZ RESULTS ===');
        data.forEach((result, index) => {
          console.log(`Result ${index + 1}:`, {
            email: result.email,
            quiz_type: result.quiz_type,
            score: result.score,
            percentage: result.percentage,
            total_questions: result.total_questions,
            completed_at: result.completed_at,
            total_answers: result.total_answers
          });
        });
        console.log('=== END DETAILED RESULTS ===');
      }

      if (error) throw error;
      setResults(data || []);
    } catch (err: any) {
      console.error('Error fetching quiz results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-700 bg-green-50 border border-green-200';
    if (percentage >= 60) return 'text-yellow-700 bg-yellow-50 border border-yellow-200';
    return 'text-red-700 bg-red-50 border border-red-200';
  };

  const stats = {
    totalAttempts: results.length,
    averageScore: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0,
    averageTime: results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.time_taken, 0) / results.length) : 0,
    uniqueUsers: new Set(results.map(r => r.email)).size
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Logo className="w-28 h-14" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Quiz Results & Analytics</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all hover:scale-105"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Attempts</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats.totalAttempts}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Unique Users</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats.uniqueUsers}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min((stats.uniqueUsers / Math.max(stats.totalAttempts, 1)) * 100, 100)}%`}}></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500 w-14 h-14 rounded-2xl flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Average Score</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{stats.averageScore}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{width: `${stats.averageScore}%`}}></div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500 w-14 h-14 rounded-2xl flex items-center justify-center">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Average Time</p>
            <p className="text-4xl font-bold text-gray-900 mb-2">{formatTime(stats.averageTime)}</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{width: `${Math.min((stats.averageTime / 1800) * 100, 100)}%`}}></div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white shadow-lg rounded-3xl overflow-hidden border border-gray-200">
          <div className="px-8 py-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 w-10 h-10 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Quiz Results</h2>
            </div>
          </div>

          {error && (
            <div className="px-8 py-6 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {results.length === 0 && !loading ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No quiz results yet</h3>
              <p className="text-gray-500">Results will appear here once users start taking the quiz.</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <div 
                    key={result.id} 
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {result.full_name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{result.full_name}</h3>
                          <p className="text-gray-600 text-sm">{result.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{result.score}/{result.total_questions}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Score</p>
                        </div>
                        
                        <div className="text-center">
                          <div className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getScoreColor(result.percentage)}`}>
                            {result.percentage}%
                          </div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Accuracy</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{formatTime(result.time_taken)}</p>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
                        </div>

                        <div className="text-center">
                          {warningsData[result.id] ? (
                            <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-red-50 border border-red-200">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-bold text-red-700">{warningsData[result.id]}</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-green-50 border border-green-200">
                              <span className="text-sm font-bold text-green-700">0</span>
                            </div>
                          )}
                          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Warnings</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-900">{formatDate(result.completed_at).split(',')[0]}</p>
                          <p className="text-xs text-gray-500">{formatDate(result.completed_at).split(',')[1]}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar for score */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${result.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}