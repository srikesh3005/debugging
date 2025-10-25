# OASYS Debugging Quiz

A full-featured quiz application with authentication, anti-cheat system, and admin dashboard.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/srikesh3005/debugging)

## Features

- 🔐 **Authentication** - Supabase-powered login/signup
- ⏱️ **Dual Timers** - 30-minute overall + 15-second per question
- 🛡️ **Anti-Cheat System** - Fullscreen & tab-switch detection
- 📊 **Admin Dashboard** - View all quiz results and analytics
- 🎨 **Modern UI** - Clean design with OASYS branding
- 🔒 **One-Time Quiz** - Users can only take the quiz once

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **Icons**: Lucide React

## Deployment to Vercel

### Option 1: Web UI (Easiest)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New" → "Project"
3. Import: `srikesh3005/debugging`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click "Deploy"

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

## Local Development

```bash
# Clone
git clone https://github.com/srikesh3005/debugging.git
cd debugging

# Install
npm install

# Add .env file
echo "VITE_SUPABASE_URL=your_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env

# Run
npm run dev
```

## Admin Access

Run in Supabase SQL Editor:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
```

## License

MIT
