-- Migration: Add quiz progress saving functionality
-- This allows users to resume quizzes from where they left off if they accidentally leave

-- Add columns to quiz_attempts table to store progress
ALTER TABLE public.quiz_attempts
ADD COLUMN IF NOT EXISTS current_question_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS saved_answers jsonb DEFAULT '{}'::jsonb;

-- Update existing attempts to have default values
UPDATE public.quiz_attempts
SET current_question_index = 0,
    saved_answers = '{}'::jsonb
WHERE current_question_index IS NULL;

-- Add index for faster queries on incomplete attempts
CREATE INDEX IF NOT EXISTS quiz_attempts_incomplete_idx 
ON public.quiz_attempts(user_id, quiz_type) 
WHERE completed_at IS NULL;

-- Add policy to allow users to update their own quiz progress
-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Users can update their own quiz progress." ON public.quiz_attempts;
CREATE POLICY "Users can update their own quiz progress." 
ON public.quiz_attempts
FOR UPDATE USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON COLUMN public.quiz_attempts.current_question_index IS 'Tracks the current question index (0-based) for resume functionality';
COMMENT ON COLUMN public.quiz_attempts.saved_answers IS 'JSON object storing question_id to answer mapping for progress restoration';
