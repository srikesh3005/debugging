# Maintenance Mode Setup

## ✅ Current Status: MAINTENANCE MODE ACTIVE

All routes are now redirecting to the maintenance page (`maintain.html`).

## 📋 What's Configured:

1. **vercel.json** - Routes all traffic to `/maintain.html`
2. **maintain.html** - Located in `/public` folder (gets copied to dist during build)
3. **Build output** - `maintain.html` is included in the `dist` folder

## 🚀 To Deploy Maintenance Mode:

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Enable maintenance mode"
   git push origin main
   ```

2. **Vercel will auto-deploy** - The maintenance page will go live

## 🔄 To Restore Normal Operation:

When you're ready to open the site again, replace the `vercel.json` content with:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

Then commit and push:
```bash
git add vercel.json
git commit -m "Disable maintenance mode - site is live"
git push origin main
```

## 📝 Files Modified:

- ✅ `vercel.json` - Updated to route all traffic to maintain.html
- ✅ `public/maintain.html` - Moved to public folder for proper deployment
- ✅ Build tested - Maintenance page included in dist

## 🎨 Customize Maintenance Page:

Edit `/public/maintain.html` to change:
- Message text
- Contact information
- Design/styling
- Schedule information

After editing, rebuild and deploy:
```bash
npm run build
git add .
git commit -m "Update maintenance page"
git push origin main
```
