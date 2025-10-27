-- ====================================================
-- IMPORTANT: RUN THIS IN SUPABASE SQL EDITOR NOW!
-- ====================================================
-- This migration adds the missing columns to fix the 400 error
-- Go to: Supabase Dashboard → SQL Editor → New Query
-- Copy and paste this entire file, then click "Run"
-- ====================================================

-- Step 1: Add quiz_type column (for storing which quiz: healthcare, dataanalysis, social, smartapp)
ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS quiz_type text;

-- Step 2: Add is_test column (for test accounts with unlimited attempts)
ALTER TABLE public.quiz_attempts 
ADD COLUMN IF NOT EXISTS is_test boolean DEFAULT false;

-- Step 3: Drop old unique constraint if it exists
DROP INDEX IF EXISTS quiz_attempts_user_id_key;

-- Step 4: Create new conditional unique index
-- This allows: ONE quiz per user for normal users, UNLIMITED for test accounts
CREATE UNIQUE INDEX IF NOT EXISTS quiz_attempts_user_id_key 
ON public.quiz_attempts(user_id) 
WHERE is_test = false;

-- Step 5: Update the handle_new_user function to include phone_number
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

-- Step 6: Copy phone numbers from auth.users to profiles for existing users
UPDATE public.profiles p
SET phone_number = (
  SELECT u.raw_user_meta_data->>'phone_number' 
  FROM auth.users u 
  WHERE u.id = p.id
)
WHERE phone_number IS NULL 
  AND EXISTS (
    SELECT 1 
    FROM auth.users u 
    WHERE u.id = p.id 
      AND u.raw_user_meta_data->>'phone_number' IS NOT NULL
  );

-- ====================================================
-- VERIFICATION QUERIES (optional - uncomment to run)
-- ====================================================

-- Verify quiz_attempts structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'quiz_attempts' 
-- ORDER BY ordinal_position;

-- Verify phone numbers are synced
-- SELECT 
--   p.email,
--   p.full_name,
--   p.phone_number as profiles_phone,
--   u.raw_user_meta_data->>'phone_number' as auth_phone
-- FROM public.profiles p
-- JOIN auth.users u ON p.id = u.id
-- ORDER BY p.created_at DESC
-- LIMIT 10;
