-- Migration: Fix Admin Dashboard Score Display
-- This ensures the quiz_results_view exists and has proper permissions

-- Step 1: Drop and recreate the view to ensure it's up to date
DROP VIEW IF EXISTS public.quiz_results_view;

-- Step 2: Create the view with all necessary columns
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
GROUP BY qa.id, qa.user_id, qa.completed_at, qa.score, qa.total_questions, qa.percentage, qa.time_taken, qa.quiz_type, qa.is_test, p.full_name, p.email
ORDER BY qa.completed_at DESC;

-- Step 3: Grant select permission to authenticated users (admins will use this)
GRANT SELECT ON public.quiz_results_view TO authenticated;

-- Step 4: Verify the view is working
-- SELECT * FROM public.quiz_results_view LIMIT 5;
