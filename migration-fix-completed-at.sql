-- Migration: Fix completed_at column to allow NULL and remove default value
-- This is critical for the quiz progress resume feature to work

-- Step 1: Make completed_at nullable and remove the default value
ALTER TABLE public.quiz_attempts 
ALTER COLUMN completed_at DROP DEFAULT,
ALTER COLUMN completed_at DROP NOT NULL;

-- Step 2: Update existing incomplete attempts to have NULL completed_at
-- (Any attempt with score = 0 and time_taken = 0 is likely incomplete)
UPDATE public.quiz_attempts
SET completed_at = NULL
WHERE score = 0 AND time_taken = 0;

-- Step 3: Add a comment for documentation
COMMENT ON COLUMN public.quiz_attempts.completed_at IS 'Timestamp when quiz was completed. NULL if quiz is incomplete/in-progress';

-- Verify the changes
SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'quiz_attempts' AND column_name = 'completed_at';
