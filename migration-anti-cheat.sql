-- ============================================
-- ANTI-CHEAT SYSTEM - DATABASE MIGRATION
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard → Your Project → SQL Editor → New Query
-- ============================================

-- Create anti-cheat logs table
CREATE TABLE IF NOT EXISTS public.anti_cheat_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    attempt_id uuid REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    event_type text NOT NULL CHECK (event_type IN (
        'tab_switch', 
        'fullscreen_exit', 
        'copy_attempt', 
        'paste_attempt', 
        'right_click', 
        'suspicious_key', 
        'text_selection'
    )),
    event_details text,
    timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.anti_cheat_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can insert their own logs
CREATE POLICY "Users can insert their own anti-cheat logs"
    ON public.anti_cheat_logs FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Policy: Admins can view all logs
CREATE POLICY "Admins can view all anti-cheat logs"
    ON public.anti_cheat_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS anti_cheat_logs_user_id_idx ON public.anti_cheat_logs(user_id);
CREATE INDEX IF NOT EXISTS anti_cheat_logs_attempt_id_idx ON public.anti_cheat_logs(attempt_id);
CREATE INDEX IF NOT EXISTS anti_cheat_logs_timestamp_idx ON public.anti_cheat_logs(timestamp);

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these after the migration to verify:

-- Check table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'anti_cheat_logs';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'anti_cheat_logs';

-- Check policies exist
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'anti_cheat_logs';

-- Check indexes exist
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'anti_cheat_logs';

-- ============================================
-- EXAMPLE QUERIES FOR ADMINS
-- ============================================

-- View all violations (most recent first)
-- SELECT 
--     acl.id,
--     p.email,
--     p.full_name,
--     acl.event_type,
--     acl.event_details,
--     acl.timestamp
-- FROM anti_cheat_logs acl
-- JOIN profiles p ON acl.user_id = p.id
-- ORDER BY acl.timestamp DESC
-- LIMIT 100;

-- Count violations by user
-- SELECT 
--     p.email,
--     COUNT(*) as violation_count,
--     array_agg(DISTINCT acl.event_type) as violation_types
-- FROM anti_cheat_logs acl
-- JOIN profiles p ON acl.user_id = p.id
-- GROUP BY p.email
-- ORDER BY violation_count DESC;

-- Violations for a specific quiz attempt
-- SELECT * FROM anti_cheat_logs
-- WHERE attempt_id = 'YOUR_ATTEMPT_ID_HERE'
-- ORDER BY timestamp;

-- Violations by type (summary)
-- SELECT 
--     event_type,
--     COUNT(*) as count,
--     COUNT(DISTINCT user_id) as unique_users
-- FROM anti_cheat_logs
-- GROUP BY event_type
-- ORDER BY count DESC;

-- Recent violations (last 24 hours)
-- SELECT 
--     p.email,
--     acl.event_type,
--     acl.timestamp
-- FROM anti_cheat_logs acl
-- JOIN profiles p ON acl.user_id = p.id
-- WHERE acl.timestamp > NOW() - INTERVAL '24 hours'
-- ORDER BY acl.timestamp DESC;

-- ============================================
-- MIGRATION COMPLETE!
-- ============================================
-- Next steps:
-- 1. Verify all verification queries return expected results
-- 2. Test the anti-cheat system in your app
-- 3. Monitor the logs as users take the quiz
-- ============================================
