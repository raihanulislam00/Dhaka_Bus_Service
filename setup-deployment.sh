#!/bin/bash

echo "🚀 Setting up Dhaka Bus Service for Vercel deployment..."

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Set up your PostgreSQL database (Neon, Supabase, or Railway)"
echo "2. Run 'vercel' to deploy"
echo "3. Set environment variables using 'vercel env add'"
echo "4. Redeploy with 'vercel --prod'"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"