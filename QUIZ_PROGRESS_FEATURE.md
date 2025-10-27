# Quiz Progress Saving Feature

## Overview
This feature allows users to resume their quiz from where they left off if they accidentally navigate away, close the browser, or lose connection during the quiz.

## How It Works

### 1. Database Changes
The `quiz_attempts` table has been extended with two new columns:
- `current_question_index`: Stores the index of the current question (0-based)
- `saved_answers`: A JSONB column storing all answers in format `{question_id: answer}`

### 2. Progress Saving
Progress is automatically saved in two scenarios:
- **When answering a question**: Immediately after selecting an answer
- **When moving to next question**: Before transitioning to the next question

### 3. Progress Restoration
When a user starts/resumes a quiz:
1. The app checks for incomplete quiz attempts for that specific quiz type
2. If found, it restores:
   - Current question index (jumps to the question they were on)
   - All previously selected answers
   - Timer resets for the current question
3. If not found, starts a fresh quiz attempt

## Implementation Details

### Files Modified
1. **migration-add-quiz-progress.sql**: Database migration script
2. **QuizGame.tsx**: Main quiz component with save/restore logic
3. **LoadingScreen.tsx**: Updated to show custom loading messages

### Key Functions

#### `saveProgress()`
```typescript
const saveProgress = async (questionIndex: number, currentAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>) => {
  await supabase
    .from('quiz_attempts')
    .update({
      current_question_index: questionIndex,
      saved_answers: currentAnswers
    })
    .eq('id', attemptId);
}
```

#### `handleAnswer()`
- Saves progress immediately after user selects an answer
- Ensures no data loss even if user leaves right after answering

#### `createAttempt()` useEffect
- Checks for existing incomplete attempts on mount
- Restores progress if found
- Creates new attempt if none exists

## Migration Instructions

### Step 1: Run the Migration
Execute the SQL migration file in your Supabase SQL Editor:
```bash
# File: migration-add-quiz-progress.sql
```

### Step 2: Verify Changes
Check that the new columns exist:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quiz_attempts' 
  AND column_name IN ('current_question_index', 'saved_answers');
```

### Step 3: Test the Feature
1. Start a quiz and answer a few questions
2. Close the browser tab or navigate away
3. Log back in and select the same quiz
4. Verify you resume from where you left off

## User Experience

### Before This Feature
- Leaving quiz = losing all progress
- Had to start from question 1 again
- Frustrating for users with connection issues

### After This Feature
- Seamless resume experience
- No progress loss
- Automatic restoration with loading indicator
- Users can safely navigate away and return

## Testing Scenarios

1. **Mid-quiz exit and resume**
   - Answer questions 1-3
   - Close browser
   - Reopen and log in
   - Should resume at question 4

2. **Multiple partial attempts** (for test accounts)
   - Start quiz, answer 2 questions, leave
   - Log in again, should resume latest attempt
   - Complete quiz, should be able to start fresh

3. **No answers saved**
   - Start quiz but don't answer anything
   - Leave and return
   - Should resume at question 1

4. **Complete quiz**
   - Complete entire quiz
   - Try to take again
   - Should prevent (for non-test accounts) or allow fresh start (for test accounts)

## Technical Notes

### Performance
- Progress saves are non-blocking (fire-and-forget)
- Minimal overhead on user interaction
- JSONB format efficient for storage and retrieval

### Security
- Row-level security ensures users can only:
  - View their own attempts
  - Update their own progress
  - Insert their own answers

### Edge Cases Handled
- Duplicate attempt prevention
- Concurrent attempt detection
- Missing/null progress data
- Type conversion for restored answers

## Future Enhancements
- Show "Resume Quiz" vs "Start New Quiz" option
- Display progress percentage on quiz selection
- Add time-based expiration for incomplete attempts
- Analytics on quiz abandonment rates

## Troubleshooting

### Progress Not Saving
1. Check browser console for errors
2. Verify `attemptId` is set
3. Check Supabase RLS policies
4. Ensure migration was applied

### Progress Not Restoring
1. Verify incomplete attempt exists in database
2. Check `completed_at` is NULL
3. Ensure `quiz_type` matches
4. Check console for restoration logs

### Database Queries for Debugging
```sql
-- Check incomplete attempts for a user
SELECT id, quiz_type, current_question_index, saved_answers, created_at
FROM quiz_attempts
WHERE user_id = 'user-uuid-here'
  AND completed_at IS NULL;

-- View saved progress
SELECT 
  id, 
  current_question_index, 
  jsonb_object_keys(saved_answers) as answered_questions,
  jsonb_array_length(jsonb_object_keys(saved_answers)) as num_answers
FROM quiz_attempts
WHERE completed_at IS NULL;
```

## Summary
This feature significantly improves user experience by eliminating frustration from accidental exits and connection issues. Users can now confidently take quizzes knowing their progress is automatically saved.
