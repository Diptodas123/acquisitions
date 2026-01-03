#!/bin/bash

#Development startup script for Acquisitions app with Neon local Postgres
#This script starts the application in development mode with Neon local Postgres.

echo "🚀 Starting Acquisitions app in development mode"
echo "================================================================"

#Check if .env.development file exists

if [ ! -f .env.development ]; then
  echo "❌ Error: .env.development file not found!"
  echo "📝 Please create a .env.development file from the .env.example template and set the required environment variables."
  exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running."
    echo "🐳 Please start Docker and try again."
    exit 1
fi

#create .neon_local directory if it doesn't exist
if [ ! -d ".neon_local" ]; then
  mkdir .neon_local
fi

# Add .neon_local to .gitignore if not already present
if ! grep -q "^.neon_local$" .gitignore; then
  echo ".neon_local" >> .gitignore
  echo "✅ Added .neon_local to .gitignore"
fi

echo "🔨 Building and starting Docker containers..."
echo "   📦 Neon Local proxy will create an ephemeral database branch"
echo "   🔥 Application will run with hot roloading enabled"
echo ""

# Run migrations with Drizzle inside the app container
echo "🗃️  Applying latest schema migrations to the database with Drizzle..."
npm run db:migrate

# Wait for the databse to be ready
echo "⏳ Waiting for the database to be ready..."
docker compose neon-local psql -U neon -d neondb -c 'SELECT 1'

# Start development environment with docker-compose
docker compose -f docker-compose.dev.yml up --build

echo ""
echo "✨ Developmenrt environment is up and running!"
echo "   🌐 Application is accessible at http://localhost:${PORT:-3000}"
echo "   🗄️  Databse: postgres://neon:npg@localhost:5432/neondb"
echo ""
echo "🛑 To stop the development environment, press Ctrl+C or run docker compose -f docker-compose.dev.yml down"
