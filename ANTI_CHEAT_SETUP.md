# Anti-Cheat System Setup Instructions

## Overview
The quiz app now includes a comprehensive anti-cheat system that detects and prevents cheating behaviors during the quiz.

## Features Implemented

### 1. Detection Capabilities
- **Tab Switching**: Detects when user switches to another tab or window
- **Fullscreen Exit**: Detects when user exits fullscreen mode
- **Copy/Paste**: Blocks copy, cut, and paste operations
- **Right-Click**: Prevents right-click context menu
- **Text Selection**: Blocks text selection on quiz content
- **Keyboard Shortcuts**: Blocks common shortcuts like:
  - Ctrl/Cmd+C (copy)
  - Ctrl/Cmd+V (paste)
  - Ctrl/Cmd+X (cut)
  - Ctrl/Cmd+S (save)
  - Ctrl/Cmd+P (print)
  - F12 (developer tools)
  - Ctrl/Cmd+Shift+I/J/C (developer tools)
  - And more...

### 2. Warning System
- Users get **3 warnings** maximum
- Visual warnings displayed in a modal
- Warning counter shows progress (e.g., "Warning 1/3")
- Different messages for different violation types
- Color-coded severity (yellow → red for final warning)

### 3. Enforcement
- **Fullscreen Requirement**: Users are prompted to enter fullscreen
- **Auto-Submit**: Quiz is automatically submitted after 3 warnings
- **Event Logging**: All violations are logged to the database
- **Real-time Alerts**: Visual indicators for tab switches and fullscreen exits

## Database Migration Required

### Step 1: Run the SQL Script
You need to add the `anti_cheat_logs` table to your Supabase database.

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to your project: `jtxjzsbsqnbdwrlcvhsj`
3. Click on **SQL Editor** in the left sidebar
4. Create a **New Query**
5. Copy and paste the following SQL:

```sql
-- Create anti-cheat logs table
CREATE TABLE IF NOT EXISTS public.anti_cheat_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    attempt_id uuid REFERENCES public.quiz_attempts(id) ON DELETE CASCADE,
    event_type text NOT NULL CHECK (event_type IN ('tab_switch', 'fullscreen_exit', 'copy_attempt', 'paste_attempt', 'right_click', 'suspicious_key', 'text_selection')),
    event_details text,
    timestamp timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.anti_cheat_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert their own anti-cheat logs"
    ON public.anti_cheat_logs FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all anti-cheat logs"
    ON public.anti_cheat_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS anti_cheat_logs_user_id_idx ON public.anti_cheat_logs(user_id);
CREATE INDEX IF NOT EXISTS anti_cheat_logs_attempt_id_idx ON public.anti_cheat_logs(attempt_id);
CREATE INDEX IF NOT EXISTS anti_cheat_logs_timestamp_idx ON public.anti_cheat_logs(timestamp);
```

6. Click **Run** to execute the SQL
7. Verify the table was created in the **Table Editor**

## How It Works

### User Experience Flow

1. **Quiz Start**: User is prompted to enter fullscreen mode
2. **Monitoring Active**: System monitors all anti-cheat events
3. **Violation Detected**: 
   - Warning modal appears
   - Warning counter increments
   - Event is logged to database
4. **Warning Threshold**:
   - After 3 warnings, quiz is auto-submitted
   - User cannot continue the quiz
   - Results are saved with current score

### Admin Monitoring

Admins can view anti-cheat logs in the database:

```sql
-- View all anti-cheat events
SELECT 
    acl.*,
    p.email,
    p.full_name
FROM anti_cheat_logs acl
JOIN profiles p ON acl.user_id = p.id
ORDER BY acl.timestamp DESC;

-- View violations by user
SELECT 
    p.email,
    COUNT(*) as violation_count,
    array_agg(DISTINCT acl.event_type) as violation_types
FROM anti_cheat_logs acl
JOIN profiles p ON acl.user_id = p.id
GROUP BY p.email
ORDER BY violation_count DESC;

-- View violations for a specific quiz attempt
SELECT * FROM anti_cheat_logs
WHERE attempt_id = 'YOUR_ATTEMPT_ID'
ORDER BY timestamp;
```

## Testing the Anti-Cheat System

### Test Cases to Verify

1. **Fullscreen Detection**:
   - Start quiz
   - Try pressing ESC to exit fullscreen
   - Should show warning

2. **Tab Switching**:
   - Switch to another browser tab
   - Switch back
   - Should show warning

3. **Copy/Paste**:
   - Try to copy question text (Ctrl/Cmd+C)
   - Try to paste into answer (Ctrl/Cmd+V)
   - Should show warning

4. **Right-Click**:
   - Right-click on quiz content
   - Should be blocked

5. **Developer Tools**:
   - Press F12 or Ctrl/Cmd+Shift+I
   - Should show warning

6. **Max Warnings**:
   - Trigger 3 violations
   - Quiz should auto-submit

## Configuration

You can adjust the warning threshold in `QuizGame.tsx`:

```tsx
const { warnings, isFullscreen, hasLeftTab, requestFullscreen } = useAntiCheat({
  userId: user?.id || '',
  attemptId: attemptId || undefined,
  maxWarnings: 3, // Change this number to adjust threshold
  onMaxWarningsReached: async () => {
    await saveQuizResults();
    setIsCompleted(true);
  },
  onWarning: (event) => {
    setLastViolationType(event.type);
    setShowWarning(true);
  },
});
```

## Files Modified/Created

### New Files:
- `/src/hooks/useAntiCheat.ts` - Main anti-cheat detection hook
- `/src/components/AntiCheatWarning.tsx` - Warning modal component
- `ANTI_CHEAT_SETUP.md` - This documentation

### Modified Files:
- `/src/components/QuizGame.tsx` - Integrated anti-cheat system
- `/database-schema.sql` - Added anti_cheat_logs table

## Security Notes

- All events are logged with timestamps
- RLS policies prevent users from seeing others' violations
- Only admins can view anti-cheat logs
- Attempt ID links violations to specific quiz attempts
- Event details can store additional context (e.g., which key was pressed)

## Troubleshooting

### Issue: Warnings not appearing
- Check browser console for errors
- Verify Supabase connection is working
- Ensure anti_cheat_logs table exists

### Issue: Fullscreen not working
- Some browsers require user gesture to enter fullscreen
- Check browser permissions
- Try on different browsers (Chrome, Firefox, Safari)

### Issue: False positives
- Tab visibility API may trigger on some system dialogs
- Consider adjusting sensitivity in `useAntiCheat.ts`
- Review event logs to identify patterns

## Next Steps

1. Run the database migration SQL
2. Test all anti-cheat features
3. Monitor anti_cheat_logs table for violations
4. Adjust maxWarnings threshold if needed
5. Consider adding admin dashboard view for anti-cheat logs

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Supabase database schema
3. Review RLS policies are correctly set
4. Check that user is authenticated before starting quiz
