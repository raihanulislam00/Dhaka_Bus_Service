# Fix for Dhaka Bus Service Registration Error

## Problem
The registration is failing because:
1. ❌ **Vercel Deployment Protection** is blocking API access
2. ❌ **Serverless function timeout** for complex NestJS app
3. ❌ **Database connection issues** in serverless environment

## Solution Options

### Option A: Disable Vercel Deployment Protection (Quick Fix)
1. Go to https://vercel.com/dashboard
2. Select your project: `dhaka-bus-service`
3. Go to **Settings** → **Deployment Protection**
4. **Turn OFF "Vercel Authentication"**
5. Click **Save**
6. Redeploy: `vercel --prod`

### Option B: Deploy Backend to Railway (Recommended)

#### Step 1: Sign up to Railway
1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project → **Deploy from GitHub repo**
4. Select your repository
5. Choose **backend** folder

#### Step 2: Set Environment Variables in Railway
Add these to your Railway project:
```
DATABASE_URL=postgresql://neondb_owner:****************@ep-damp-union-ad42cdv4-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=dhaka-bus-service-secret-key-production
NODE_ENV=production
PORT=3000
```

#### Step 3: Update Frontend API URL
```bash
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-railway-app.railway.app
```

#### Step 4: Redeploy Frontend
```bash
vercel --prod
```

## Quick Test
After fixing deployment protection or deploying to Railway:
```bash
curl -X POST https://your-api-url/api/passenger \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456","phone":"123456789"}'
```

Should return success instead of authentication page.