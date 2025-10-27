-- Migration: Fix Old Quiz Attempts with Missing Data
-- This updates old quiz attempts that have null quiz_type or zero scores

-- Step 1: Update quiz_type to 'healthcare' for all null values
-- (Since these are old attempts, we'll default them to healthcare)
UPDATE public.quiz_attempts
SET quiz_type = 'healthcare'
WHERE quiz_type IS NULL;

-- Step 2: Check for quiz attempts with score = 0 but have answers
-- This will help identify attempts that should have been scored
SELECT 
    qa.id,
    qa.user_id,
    qa.score,
    qa.total_questions,
    qa.quiz_type,
    COUNT(qans.id) as answer_count,
    SUM(CASE WHEN qans.is_correct THEN 1 ELSE 0 END) as correct_answers
FROM public.quiz_attempts qa
LEFT JOIN public.quiz_answers qans ON qa.id = qans.attempt_id
WHERE qa.score = 0 AND qa.total_questions > 0
GROUP BY qa.id, qa.user_id, qa.score, qa.total_questions, qa.quiz_type
HAVING COUNT(qans.id) > 0;

-- Step 3: Update scores for attempts that have answers but score is 0
-- This calculates the actual score from the quiz_answers table
UPDATE public.quiz_attempts qa
SET 
    score = (
        SELECT COUNT(*) 
        FROM public.quiz_answers qans 
        WHERE qans.attempt_id = qa.id AND qans.is_correct = true
    ),
    percentage = (
        SELECT ROUND((COUNT(*) * 100.0) / NULLIF(qa.total_questions, 0))
        FROM public.quiz_answers qans 
        WHERE qans.attempt_id = qa.id AND qans.is_correct = true
    )
WHERE qa.score = 0 
  AND qa.total_questions > 0
  AND EXISTS (
      SELECT 1 
      FROM public.quiz_answers qans 
      WHERE qans.attempt_id = qa.id
  );

-- Step 4: Verify the updates
SELECT 
    qa.id,
    qa.score,
    qa.total_questions,
    qa.percentage,
    qa.quiz_type,
    p.email,
    COUNT(qans.id) as total_answers,
    SUM(CASE WHEN qans.is_correct THEN 1 ELSE 0 END) as correct_answers
FROM public.quiz_attempts qa
JOIN public.profiles p ON qa.user_id = p.id
LEFT JOIN public.quiz_answers qans ON qa.id = qans.attempt_id
GROUP BY qa.id, qa.score, qa.total_questions, qa.percentage, qa.quiz_type, p.email
ORDER BY qa.completed_at DESC
LIMIT 20;
