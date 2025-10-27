-- Migration: Fix Phone Number Storage
-- Run this in Supabase SQL Editor

-- Step 1: Update the trigger function to include phone_number for new signups
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

-- Step 2: Copy phone numbers from auth.users metadata to profiles table for existing users
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

-- Step 3: Verify the update
SELECT 
  p.email,
  p.full_name,
  p.phone_number as profiles_phone,
  u.raw_user_meta_data->>'phone_number' as auth_phone,
  CASE 
    WHEN p.phone_number = u.raw_user_meta_data->>'phone_number' THEN 'MATCH'
    WHEN p.phone_number IS NULL AND u.raw_user_meta_data->>'phone_number' IS NULL THEN 'BOTH NULL'
    WHEN p.phone_number IS NULL THEN 'MISSING IN PROFILES'
    WHEN u.raw_user_meta_data->>'phone_number' IS NULL THEN 'MISSING IN AUTH'
    ELSE 'MISMATCH'
  END as status
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC;
