# Dashboard Score Showing 0 - FIX INSTRUCTIONS

## Problem
The dashboard on Vercel is showing score = 0 for all quiz attempts, even though users are completing quizzes.

## Root Cause
The database on your production Supabase instance is missing:
1. Required columns in the `quiz_attempts` table
2. The `quiz_results_view` that the dashboard uses to fetch data
3. Proper indexes for handling test accounts vs regular users

## Solution

### Step 1: Run the Database Migration

**IMPORTANT**: You must run this on your **PRODUCTION** Supabase database (the one connected to Vercel)

1. Open your Supabase Dashboard at https://supabase.com/dashboard
2. Select your project (the one used by Vercel)
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Open the file `PRODUCTION_FIX_DASHBOARD_SCORES.sql` from this project
6. Copy the ENTIRE contents of that file
7. Paste it into the SQL Editor
8. Click **"Run"** (or press Cmd+Enter on Mac / Ctrl+Enter on Windows)

### Step 2: Verify the Fix

After running the migration, check the results at the bottom of the SQL editor:

1. You should see a table showing columns: `score`, `percentage`, `quiz_type`, `is_test`, `completed_at`
2. You should see a count of completed quizzes
3. You should see recent quiz results with actual scores

If you see any errors, check the Supabase logs.

### Step 3: Test on Vercel

1. Go to your Vercel deployment
2. Log in as admin
3. Check the dashboard - scores should now display correctly

### Step 4: Test a New Quiz

1. Take a new quiz on Vercel
2. Complete it
3. Check the admin dashboard - the new attempt should show the correct score

## What the Migration Does

1. **Adds missing columns** to `quiz_attempts` table:
   - `quiz_type` (healthcare, dataanalysis, social, smartapp)
   - `is_test` (for test accounts)
   - `score`, `percentage`, `time_taken`, `completed_at`

2. **Creates the `quiz_results_view`** that joins:
   - quiz_attempts
   - profiles
   - quiz_answers

3. **Fixes old data**:
   - Assigns default quiz_type to old attempts
   - Recalculates scores from the `quiz_answers` table
   - Updates percentages

4. **Sets up proper indexes**:
   - Allows one quiz per user per quiz type (regular users)
   - Allows unlimited quizzes for test accounts

## Debugging Tips

If scores still show 0 after migration:

1. Open browser console (F12) while taking a quiz
2. Look for these logs:
   - "Creating quiz attempt with: ..." - Should show the attempt being created
   - "Q1: Selected=A, Correct=B, IsCorrect=false" - Shows each answer
   - "Final calculated score: ..." - Shows the calculated score
   - "Saving quiz results: ..." - Shows what's being saved
   - "Quiz attempt update result: ..." - Shows if save was successful

3. Check the Supabase dashboard:
   - Go to "Table Editor"
   - Open "quiz_attempts" table
   - Look for your latest attempt
   - Check if `score`, `percentage`, and `completed_at` are populated

4. Check the quiz_answers table:
   - Should have 30 rows for each quiz attempt
   - Each row should have `is_correct` set to true/false

## Common Issues

### Error: "column quiz_type does not exist"
- The migration wasn't run on production
- Make sure you're running it on the correct Supabase project

### Error: "relation quiz_results_view does not exist"
- The view creation failed
- Check Supabase logs for errors
- Verify all tables exist (quiz_attempts, profiles, quiz_answers)

### Scores still showing 0 after migration
- Check browser console for errors during quiz submission
- Verify the `saveQuizResults` function is being called
- Check if answers are being saved to `quiz_answers` table
- Verify RLS policies allow updates to `quiz_attempts`

## Need More Help?

If the issue persists:
1. Share the browser console logs when completing a quiz
2. Share the Supabase SQL editor results after running the migration
3. Check the Supabase logs for any errors
