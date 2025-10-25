-- Create Admin User Script
-- Run this in Supabase SQL Editor after the user signs up

-- Method 1: If user already signed up, just update role
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'srikesh@admin.com';

-- Method 2: Check if user exists first
DO $$
BEGIN
    -- Check if the profile exists
    IF EXISTS (SELECT 1 FROM profiles WHERE email = 'srikesh@admin.com') THEN
        -- Update existing user to admin
        UPDATE profiles 
        SET role = 'admin' 
        WHERE email = 'srikesh@admin.com';
        
        RAISE NOTICE 'User srikesh@admin.com has been made admin';
    ELSE
        RAISE NOTICE 'User srikesh@admin.com not found. Please sign up first at the application.';
    END IF;
END $$;

-- Method 3: View all users and their roles
SELECT email, role, created_at 
FROM profiles 
ORDER BY created_at DESC;