# Deployment Guide for Dhaka Bus Service

## Prerequisites

1. **Database Setup**: You need a PostgreSQL database. Recommended options:
   - [Neon](https://neon.tech/) - Free PostgreSQL database
   - [Supabase](https://supabase.com/) - Free PostgreSQL with additional features
   - [Railway](https://railway.app/) - Easy deployment platform
   - [Vercel Postgres](https://vercel.com/storage/postgres) - Vercel's managed PostgreSQL

2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com/)

## Step 1: Set Up Database

### Option A: Using Neon (Recommended)
1. Go to [neon.tech](https://neon.tech/) and create an account
2. Create a new database project
3. Copy the connection string (it looks like: `postgresql://username:password@host/database?sslmode=require`)

### Option B: Using Supabase
1. Go to [supabase.com](https://supabase.com/) and create an account  
2. Create a new project
3. Go to Settings → Database and copy the connection string

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   cd /path/to/Dhaka_Bus_Service
   vercel
   ```

4. **Set Environment Variables**:
   ```bash
   # Set database connection
   vercel env add DATABASE_URL production
   # Paste your database URL when prompted
   
   # Set JWT secret
   vercel env add JWT_SECRET production
   # Enter a strong random string
   
   # Set frontend URL (replace with your actual Vercel URL)
   vercel env add FRONTEND_URL production
   # Enter: https://your-app.vercel.app
   
   # Set API URL for frontend
   vercel env add NEXT_PUBLIC_API_URL production
   # Enter: https://your-app.vercel.app/api
   ```

5. **Redeploy with environment variables**:
   ```bash
   vercel --prod
   ```

### Method 2: Using Vercel Dashboard

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import on Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**:
   In the Vercel dashboard, go to your project → Settings → Environment Variables and add:
   
   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `DATABASE_URL` | Your PostgreSQL connection string | Production |
   | `JWT_SECRET` | Strong random string for JWT signing | Production |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | Production |
   | `NEXT_PUBLIC_API_URL` | `https://your-app.vercel.app/api` | Production |
   | `NODE_ENV` | `production` | Production |

4. **Redeploy**: Click "Redeploy" in the Vercel dashboard

## Step 3: Verify Deployment

1. Visit your Vercel URL
2. Test user registration and login
3. Check that API endpoints are working: `https://your-app.vercel.app/api`

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Ensure your DATABASE_URL is correct
   - Check that the database allows external connections
   - Verify SSL settings

2. **CORS Issues**:
   - Make sure FRONTEND_URL environment variable matches your Vercel domain
   - Check that the backend CORS configuration includes your Vercel domain

3. **Build Failures**:
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify TypeScript types are correct

4. **API Routes Not Working**:
   - Verify the vercel.json routing configuration
   - Check that the backend entry point is correct

### Database Migration:

If you need to migrate data from your local database:

1. **Export local data**:
   ```bash
   pg_dump -h localhost -p 5433 -U postgres -d passenger > backup.sql
   ```

2. **Import to production database**:
   ```bash
   psql "your-production-database-url" < backup.sql
   ```

## Security Considerations

1. **Change JWT Secret**: Use a strong, unique JWT secret for production
2. **Environment Variables**: Never commit .env files to version control
3. **Database Access**: Ensure your database is properly secured
4. **HTTPS**: Vercel provides HTTPS by default

## Monitoring

- Monitor your application in Vercel dashboard
- Check function logs for errors
- Monitor database usage in your database provider dashboard

## Local Development

To run locally after deployment setup:

1. Copy environment variables:
   ```bash
   cp .env.example .env
   cp frontend/.env.local.example frontend/.env.local
   ```

2. Fill in your environment variables in both files

3. Start development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run start:dev
   
   # Terminal 2 - Frontend  
   cd frontend
   npm run dev
   ```

Your application will be available at:
- Frontend: http://localhost:8000
- Backend API: http://localhost:3000/api