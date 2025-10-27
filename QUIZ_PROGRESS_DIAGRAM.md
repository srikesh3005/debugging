# Quiz Progress Flow Diagram

## User Journey: Resume Quiz Feature

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER STARTS QUIZ                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │  Check for incomplete  │
         │  quiz attempts in DB   │
         └────────┬───────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
   [FOUND]             [NOT FOUND]
        │                   │
        │                   ▼
        │          ┌─────────────────┐
        │          │ Create new      │
        │          │ quiz attempt    │
        │          │ Start at Q1     │
        │          └─────────────────┘
        │
        ▼
┌────────────────────────┐
│ RESTORE PROGRESS       │
├────────────────────────┤
│ • Load question index  │
│ • Restore all answers  │
│ • Reset timer          │
│ • Show loading screen  │
└───────┬────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    QUIZ IN PROGRESS                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                            │
        ▼                            ▼
    [USER ANSWERS]              [USER CLICKS NEXT]
        │                            │
        ▼                            ▼
┌──────────────────┐         ┌──────────────────┐
│ Save to state    │         │ Move to next Q   │
├──────────────────┤         ├──────────────────┤
│ Immediately save │         │ Save progress    │
│ to database:     │         │ to database:     │
│ • All answers    │         │ • Current Q index│
│ • Current Q      │         │ • All answers    │
└──────────────────┘         └──────────────────┘
        │                            │
        └────────────┬───────────────┘
                     │
        ┌────────────┴─────────────┐
        │                          │
        ▼                          ▼
   [USER LEAVES]              [QUIZ COMPLETE]
        │                          │
        ▼                          ▼
┌──────────────────┐      ┌──────────────────┐
│ Progress saved   │      │ Mark as complete │
│ in database      │      │ Set completed_at │
│ completed_at:NULL│      │ Save final score │
└──────────────────┘      └──────────────────┘
        │
        │ (User returns)
        │
        ▼
   [LOOPS BACK TO TOP]
```

## Database State During Quiz

### New Quiz Attempt
```json
{
  "id": "uuid-123",
  "user_id": "user-uuid",
  "quiz_type": "healthcare",
  "current_question_index": 0,
  "saved_answers": {},
  "completed_at": null,
  "score": 0
}
```

### After Answering Questions 1-3
```json
{
  "id": "uuid-123",
  "user_id": "user-uuid",
  "quiz_type": "healthcare",
  "current_question_index": 3,
  "saved_answers": {
    "1": "A",
    "2": "C",
    "3": "B"
  },
  "completed_at": null,
  "score": 0
}
```

### After Completion
```json
{
  "id": "uuid-123",
  "user_id": "user-uuid",
  "quiz_type": "healthcare",
  "current_question_index": 10,
  "saved_answers": {
    "1": "A",
    "2": "C",
    "3": "B",
    "4": "D",
    "5": "A",
    "6": "B",
    "7": "C",
    "8": "A",
    "9": "D",
    "10": "B"
  },
  "completed_at": "2025-10-27T10:30:00Z",
  "score": 8,
  "percentage": 80
}
```

## Code Flow

### 1. Component Mount (useEffect)
```
Check DB for incomplete attempts
  ↓
Found → Restore state → Show quiz at saved question
  ↓
Not found → Create new attempt → Show quiz at Q1
```

### 2. User Answers Question
```
handleAnswer() called
  ↓
Update React state (answers)
  ↓
Call saveProgress()
  ↓
Update database (non-blocking)
```

### 3. User Clicks Next
```
handleNext() called
  ↓
Increment question index
  ↓
Call saveProgress()
  ↓
Update database
  ↓
Show next question
```

### 4. User Leaves
```
(No action needed - progress already saved)
  ↓
User returns later
  ↓
Loop back to Component Mount
```

## Key Features

✅ **Auto-save**: Every answer is saved immediately
✅ **Seamless**: No user action required
✅ **Reliable**: Database-backed persistence
✅ **Fast**: Non-blocking saves
✅ **Secure**: User can only access their own progress
