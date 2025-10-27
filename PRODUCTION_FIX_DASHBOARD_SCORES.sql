-- ====================================================
-- PRODUCTION FIX: Run this in your Supabase SQL Editor
-- ====================================================
-- This fixes the dashboard showing score = 0
-- 
-- Instructions:
-- 1. Go to your Supabase Dashboard (the one connected to Vercel)
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste this ENTIRE file
-- 5. Click "Run" (or press Cmd+Enter)
-- ====================================================

-- STEP 1: Ensure quiz_attempts table has all required columns
-- Add missing columns if they don't exist
ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS quiz_type text;

ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS is_test boolean DEFAULT false;

ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS score integer DEFAULT 0;

ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS percentage integer DEFAULT 0;

ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS time_taken integer DEFAULT 0;

ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- STEP 2: Ensure profiles table has phone_number column
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text;

-- STEP 3: Update the handle_new_user function to include phone_number
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'phone_number', 
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 4: Drop old unique constraint and create new one for test accounts
DROP INDEX IF EXISTS quiz_attempts_user_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS quiz_attempts_user_id_quiz_type_key 
ON public.quiz_attempts(user_id, quiz_type) 
WHERE is_test = false;

-- STEP 5: Drop and recreate the quiz_results_view
DROP VIEW IF EXISTS public.quiz_results_view;

CREATE VIEW public.quiz_results_view AS
SELECT 
    qa.id,
    qa.user_id,
    qa.completed_at,
    qa.score,
    qa.total_questions,
    qa.percentage,
    qa.time_taken,
    qa.quiz_type,
    qa.is_test,
    p.full_name,
    p.email,
    COUNT(qans.id) as total_answers
FROM public.quiz_attempts qa
JOIN public.profiles p ON qa.user_id = p.id
LEFT JOIN public.quiz_answers qans ON qa.id = qans.attempt_id
WHERE qa.completed_at IS NOT NULL  -- Only show completed attempts
GROUP BY qa.id, qa.user_id, qa.completed_at, qa.score, qa.total_questions, 
         qa.percentage, qa.time_taken, qa.quiz_type, qa.is_test, p.full_name, p.email
ORDER BY qa.completed_at DESC;

-- STEP 6: Grant permissions
GRANT SELECT ON public.quiz_results_view TO authenticated;

-- STEP 7: Fix any existing quiz attempts that might have NULL values
UPDATE public.quiz_attempts
SET quiz_type = 'healthcare'
WHERE quiz_type IS NULL AND completed_at IS NOT NULL;

-- STEP 8: Recalculate scores for any completed attempts that have score = 0
-- This will count correct answers from quiz_answers table
UPDATE public.quiz_attempts qa
SET score = (
  SELECT COUNT(*)
  FROM public.quiz_answers qans
  WHERE qans.attempt_id = qa.id
    AND qans.is_correct = true
),
percentage = ROUND((
  SELECT COUNT(*) * 100.0 / qa.total_questions
  FROM public.quiz_answers qans
  WHERE qans.attempt_id = qa.id
    AND qans.is_correct = true
))
WHERE qa.completed_at IS NOT NULL
  AND qa.score = 0
  AND EXISTS (
    SELECT 1 FROM public.quiz_answers qans 
    WHERE qans.attempt_id = qa.id
  );

-- ====================================================
-- VERIFICATION: Check if everything is working
-- ====================================================

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts' 
  AND column_name IN ('score', 'percentage', 'quiz_type', 'is_test', 'completed_at')
ORDER BY ordinal_position;

-- Check if view exists and has data
SELECT COUNT(*) as total_completed_quizzes
FROM public.quiz_results_view;

-- Show recent quiz results with scores
SELECT 
  email,
  quiz_type,
  score,
  percentage,
  total_questions,
  completed_at
FROM public.quiz_results_view
ORDER BY completed_at DESC
LIMIT 10;

-- ====================================================
-- SUCCESS MESSAGE
-- ====================================================
-- If you see results above without errors, the migration is complete!
-- Your dashboard should now show correct scores.
-- 
-- If you see any errors:
-- 1. Check if the quiz_answers table exists
-- 2. Ensure RLS policies are set correctly
-- 3. Check the Supabase logs for more details
-- ====================================================
