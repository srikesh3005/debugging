# Quiz Application - Admin Access Guide

## 🔐 How to Access Admin Dashboard

### Method 1: Database Direct Update (Recommended)

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com](https://supabase.com)
   - Open your project: `jtxjzsbsqnbdwrlcvhsj`

2. **Open SQL Editor**
   - Navigate to "SQL Editor" in the left sidebar
   - Create a new query

3. **Update User Role**
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-admin-email@example.com';
   ```
   
   Replace `your-admin-email@example.com` with the email address of the user you want to make admin.

4. **Sign In**
   - Go to your quiz application
   - Sign in with the email you just made admin
   - You'll automatically be redirected to the admin dashboard

### Method 2: Through Database Browser

1. **Open Supabase Dashboard**
2. **Go to Table Editor**
3. **Select `profiles` table**
4. **Find the user** you want to make admin
5. **Edit the `role` column** from `user` to `admin`
6. **Save changes**

## 🎯 Admin Dashboard Features

Once you access the admin dashboard, you'll see:

### 📊 Analytics Cards
- **Total Quiz Attempts** - Number of completed quizzes
- **Unique Users** - Number of different users who took the quiz
- **Average Score** - Overall performance percentage
- **Average Time** - Time taken to complete quizzes

### 📋 Detailed Results
- **User Information** - Name and email of each participant
- **Scores** - Individual scores and percentages
- **Completion Times** - How long each user took
- **Timestamps** - When each quiz was completed

## 🚀 Quiz Application Features

### For Regular Users:
- ✅ **One-time quiz** - Each user can only take the quiz once
- ✅ **30-minute timer** - Overall time limit displayed in top-right
- ✅ **15-second per question** - Individual question timers
- ✅ **Auto-progression** - Moves to next question when timer ends
- ✅ **No score display** - Results are hidden from users
- ✅ **Sign out option** - Available after quiz completion

### For Admins:
- ✅ **Full dashboard** - Complete analytics and user management
- ✅ **Real-time data** - Live updates of quiz results
- ✅ **Export-ready data** - All information organized and accessible
- ✅ **Modern UI** - Beautiful, responsive interface

## 🔧 Technical Details

### Database Tables:
- `profiles` - User information and roles
- `quiz_attempts` - Quiz completion records
- `quiz_answers` - Individual question responses

### Role System:
- `user` - Regular users who take the quiz
- `admin` - Administrators who can view the dashboard

### Security:
- Row Level Security (RLS) enabled
- Users can only see their own data
- Admins can see all data
- Automatic profile creation on signup

## 🌐 Application URLs

- **Quiz Application**: `http://localhost:5175/`
- **Login/Signup**: Automatic redirect if not authenticated
- **Admin Dashboard**: Automatic redirect for admin users
- **User Quiz**: Automatic redirect for regular users

## 🎨 Modern UI Features

### Gradient Design:
- Beautiful blue → purple → pink gradients
- Glassmorphism effects with backdrop blur
- Smooth animations and hover effects
- Card-based layouts throughout

### Responsive Design:
- Works on all screen sizes
- Mobile-friendly interface
- Touch-optimized interactions
- Progressive enhancement

## 🔒 Security Best Practices

1. **Change admin role immediately** after testing
2. **Use strong passwords** for admin accounts
3. **Limit admin access** to necessary personnel only
4. **Regular backup** of quiz data
5. **Monitor user activity** through the dashboard

---

**Need Help?** 
- Check Supabase logs for any errors
- Verify environment variables are set correctly
- Ensure database schema is properly installed
- Contact support if issues persist