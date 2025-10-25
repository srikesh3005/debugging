import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  email: string
  full_name?: string
  role: 'user' | 'admin'
  created_at: string
}

export interface QuizAttempt {
  id: string
  user_id: string
  score: number
  total_questions: number
  percentage: number
  completed_at: string
  time_taken: number
}

export interface QuizAnswer {
  id: string
  attempt_id: string
  question_id: number
  selected_answer: 'A' | 'B' | 'C' | 'D'
  correct_answer: 'A' | 'B' | 'C' | 'D'
  is_correct: boolean
}