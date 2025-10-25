# Quick Start Guide - Anti-Cheat System

## 🚀 Quick Setup (5 minutes)

### Step 1: Database Migration ⚠️ REQUIRED
```sql
-- Copy this SQL and run in Supabase SQL Editor
-- Dashboard → Your Project → SQL Editor → New Query

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

ALTER TABLE public.anti_cheat_logs ENABLE ROW LEVEL SECURITY;

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

CREATE INDEX anti_cheat_logs_user_id_idx ON public.anti_cheat_logs(user_id);
CREATE INDEX anti_cheat_logs_attempt_id_idx ON public.anti_cheat_logs(attempt_id);
CREATE INDEX anti_cheat_logs_timestamp_idx ON public.anti_cheat_logs(timestamp);
```

### Step 2: Test It
1. Start the dev server: `npm run dev`
2. Login to the quiz
3. Try these actions:
   - Press ESC (exit fullscreen) → Warning #1
   - Switch to another tab → Warning #2  
   - Press Ctrl/Cmd+C (copy) → Warning #3
   - Quiz auto-submits! ✅

### Step 3: View Logs (Admin)
```sql
-- Run in SQL Editor to see all violations
SELECT 
    p.email,
    acl.event_type,
    acl.timestamp
FROM anti_cheat_logs acl
JOIN profiles p ON acl.user_id = p.id
ORDER BY acl.timestamp DESC
LIMIT 50;
```

## 📋 What You Get

### 🛡️ Protection Against:
- ✅ Tab switching
- ✅ Leaving fullscreen
- ✅ Copy/paste
- ✅ Right-click
- ✅ Developer tools (F12)
- ✅ Text selection
- ✅ Keyboard shortcuts

### ⚠️ Warning System:
- Strike 1: Yellow warning modal
- Strike 2: Orange warning modal  
- Strike 3: Red warning + auto-submit

### 📊 For Admins:
- View all violations in database
- See which users are cheating
- Link violations to quiz attempts
- Export data for analysis

## 🎯 How It Works

```
User starts quiz
    ↓
Prompted for fullscreen
    ↓
Quiz begins (monitoring active)
    ↓
Violation detected? 
    ↓
Warning shown (1/3, 2/3, 3/3)
    ↓
Event logged to database
    ↓
3 warnings reached?
    ↓
Auto-submit quiz with current score
```

## 🔧 Configuration

### Change max warnings:
`src/components/QuizGame.tsx` line ~30
```typescript
maxWarnings: 3  // Change to any number
```

### Customize warning messages:
`src/components/AntiCheatWarning.tsx` line ~10
```typescript
const warningMessages: Record<string, string> = {
  tab_switch: 'Your custom message here',
  // ...
}
```

## 📱 What Users See

1. **Before Quiz**: "Click to enter fullscreen"
2. **During Quiz**: Real-time alerts if violations occur
3. **Warning Modal**: Shows violation type + warnings left
4. **Auto-Submit**: After 3 warnings, quiz ends automatically

## 🔍 For Developers

### Key Files:
```
src/
├── hooks/
│   └── useAntiCheat.ts          ← Main detection logic
├── components/
│   ├── AntiCheatWarning.tsx     ← Warning modal UI
│   └── QuizGame.tsx             ← Integration point
```

### Hook Usage:
```typescript
const { 
  warnings,          // Current count (0-3)
  isFullscreen,      // Boolean
  hasLeftTab,        // Boolean
  requestFullscreen  // Function
} = useAntiCheat({
  userId: user.id,
  attemptId: attemptId,
  maxWarnings: 3,
  onMaxWarningsReached: () => { /* auto-submit */ },
  onWarning: (event) => { /* show modal */ }
});
```

## 📊 View Violations (SQL Queries)

### All violations today:
```sql
SELECT * FROM anti_cheat_logs 
WHERE timestamp > CURRENT_DATE
ORDER BY timestamp DESC;
```

### Top violators:
```sql
SELECT 
    p.email,
    COUNT(*) as violations
FROM anti_cheat_logs acl
JOIN profiles p ON p.id = acl.user_id
GROUP BY p.email
ORDER BY violations DESC;
```

### Violations by type:
```sql
SELECT 
    event_type,
    COUNT(*) as count
FROM anti_cheat_logs
GROUP BY event_type
ORDER BY count DESC;
```

## ❓ Troubleshooting

**Warning modals not showing?**
- Check browser console for errors
- Verify database table exists
- Ensure user is authenticated

**Fullscreen not working?**
- Try different browser (Chrome recommended)
- Check browser permissions
- Some browsers block fullscreen on localhost

**Too many false positives?**
- Increase `maxWarnings` to 5 or more
- Check what's triggering in logs
- Adjust detection sensitivity in hook

## 📚 Full Documentation

- `IMPLEMENTATION_SUMMARY.md` - Complete feature overview
- `ANTI_CHEAT_SETUP.md` - Detailed setup instructions
- `ADMIN_ACCESS.md` - Admin dashboard access

## ✅ Checklist

- [ ] Run database migration SQL
- [ ] Test fullscreen prompt
- [ ] Test tab switching detection
- [ ] Test copy/paste blocking
- [ ] Verify warnings appear
- [ ] Confirm auto-submit at 3 warnings
- [ ] Check logs in database
- [ ] Adjust maxWarnings if needed

## 🎉 You're Done!

The anti-cheat system is now active and protecting your quiz. Users will be monitored, violations will be logged, and fair play will be enforced automatically.

**Need help?** Check the detailed docs or review the code comments in `useAntiCheat.ts`.
