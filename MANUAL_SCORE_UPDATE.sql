-- ====================================================
-- MANUAL SCORE UPDATE SCRIPT
-- ====================================================
-- This script recalculates scores from quiz_answers table
-- and updates the quiz_attempts table
-- 
-- Run this in Supabase SQL Editor whenever scores show 0
-- ====================================================

-- STEP 1: View current scores (BEFORE update)
SELECT 
    qa.id as attempt_id,
    p.email,
    qa.quiz_type,
    qa.score as current_score,
    qa.percentage as current_percentage,
    qa.total_questions,
    qa.time_taken,
    CONCAT(
        FLOOR(qa.time_taken / 60), ':',
        LPAD((qa.time_taken % 60)::text, 2, '0')
    ) as time_formatted,
    qa.completed_at,
    COUNT(qans.id) as total_answers_saved,
    COUNT(CASE WHEN qans.is_correct = true THEN 1 END) as correct_answers
FROM quiz_attempts qa
LEFT JOIN profiles p ON qa.user_id = p.id
LEFT JOIN quiz_answers qans ON qa.id = qans.attempt_id
WHERE qa.completed_at IS NOT NULL
GROUP BY qa.id, p.email, qa.quiz_type, qa.score, qa.percentage, qa.total_questions, qa.time_taken, qa.completed_at
ORDER BY qa.completed_at DESC;

-- ====================================================
-- STEP 2: UPDATE ALL SCORES
-- ====================================================
-- This updates the score and percentage for ALL completed quiz attempts

UPDATE quiz_attempts qa
SET 
    score = (
        SELECT COUNT(*)
        FROM quiz_answers qans
        WHERE qans.attempt_id = qa.id
          AND qans.is_correct = true
    ),
    percentage = (
        SELECT ROUND((COUNT(*) * 100.0) / NULLIF(qa.total_questions, 0))
        FROM quiz_answers qans
        WHERE qans.attempt_id = qa.id
          AND qans.is_correct = true
    )
WHERE qa.completed_at IS NOT NULL;

-- ====================================================
-- STEP 3: View updated scores (AFTER update)
-- ====================================================
SELECT 
    qa.id as attempt_id,
    p.email,
    qa.quiz_type,
    qa.score as updated_score,
    qa.percentage as updated_percentage,
    qa.total_questions,
    qa.time_taken,
    CONCAT(
        FLOOR(qa.time_taken / 60), ':',
        LPAD((qa.time_taken % 60)::text, 2, '0')
    ) as time_formatted,
    qa.completed_at,
    COUNT(qans.id) as total_answers_saved,
    COUNT(CASE WHEN qans.is_correct = true THEN 1 END) as correct_answers
FROM quiz_attempts qa
LEFT JOIN profiles p ON qa.user_id = p.id
LEFT JOIN quiz_answers qans ON qa.id = qans.attempt_id
WHERE qa.completed_at IS NOT NULL
GROUP BY qa.id, p.email, qa.quiz_type, qa.score, qa.percentage, qa.total_questions, qa.time_taken, qa.completed_at
ORDER BY qa.completed_at DESC;

-- ====================================================
-- OPTIONAL: Update ONLY specific quiz attempts by email
-- ====================================================
-- Uncomment and modify the email below to update specific user's scores

-- UPDATE quiz_attempts qa
-- SET 
--     score = (
--         SELECT COUNT(*)
--         FROM quiz_answers qans
--         WHERE qans.attempt_id = qa.id
--           AND qans.is_correct = true
--     ),
--     percentage = (
--         SELECT ROUND((COUNT(*) * 100.0) / NULLIF(qa.total_questions, 0))
--         FROM quiz_answers qans
--         WHERE qans.attempt_id = qa.id
--           AND qans.is_correct = true
--     )
-- WHERE qa.user_id = (
--     SELECT id FROM profiles WHERE email = 'user@example.com'
-- )
-- AND qa.completed_at IS NOT NULL;

-- ====================================================
-- OPTIONAL: Update ONLY a specific quiz attempt by ID
-- ====================================================
-- Uncomment and replace 'your-attempt-id-here' with actual attempt ID

-- UPDATE quiz_attempts qa
-- SET 
--     score = (
--         SELECT COUNT(*)
--         FROM quiz_answers qans
--         WHERE qans.attempt_id = qa.id
--           AND qans.is_correct = true
--     ),
--     percentage = (
--         SELECT ROUND((COUNT(*) * 100.0) / NULLIF(qa.total_questions, 0))
--         FROM quiz_answers qans
--         WHERE qans.attempt_id = qa.id
--           AND qans.is_correct = true
--     )
-- WHERE qa.id = 'your-attempt-id-here';

-- ====================================================
-- DIAGNOSTIC: Check if quiz_answers exist for attempts with score 0
-- ====================================================
-- This helps diagnose if the problem is missing answers or failed updates

SELECT 
    qa.id as attempt_id,
    p.email,
    qa.quiz_type,
    qa.score,
    qa.time_taken,
    CONCAT(
        FLOOR(qa.time_taken / 60), ':',
        LPAD((qa.time_taken % 60)::text, 2, '0')
    ) as time_formatted,
    qa.completed_at,
    COUNT(qans.id) as answer_count,
    CASE 
        WHEN COUNT(qans.id) = 0 THEN '❌ NO ANSWERS SAVED'
        WHEN qa.score = 0 AND COUNT(qans.id) > 0 THEN '⚠️ ANSWERS EXIST BUT SCORE IS 0'
        ELSE '✅ OK'
    END as status
FROM quiz_attempts qa
LEFT JOIN profiles p ON qa.user_id = p.id
LEFT JOIN quiz_answers qans ON qa.id = qans.attempt_id
WHERE qa.completed_at IS NOT NULL
GROUP BY qa.id, p.email, qa.quiz_type, qa.score, qa.time_taken, qa.completed_at
HAVING qa.score = 0
ORDER BY qa.completed_at DESC;

-- ====================================================
-- SUCCESS MESSAGE
-- ====================================================
-- If the update shows "UPDATE X" where X > 0, the scores were updated
-- Refresh your admin dashboard to see the new scores
-- ====================================================
