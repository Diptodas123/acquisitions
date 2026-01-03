#!/bin/bash

#Production deployment script for Kubernetes Demo API 
# This script starts the application in production mode with Neon Cloud Database(Postgres).

echo "🚀 Starting Kubernetes Demo API in production mode"
echo "================================================================"

#Check if .env.production file exists

if [ ! -f .env.production ]; then
  echo "❌ Error: .env.production file not found!"
  echo "📝 Please create a .env.production file from the .env.example template and set the required environment variables."
  exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running."
    echo "🐳 Please start Docker and try again."
    exit 1
fi

echo "🔨 Building and starting Docker containers..."
echo "   📦 Using Neon Cloud Database"
echo "   🔥 Running in optimized production mode"
echo ""

# Start production environment with docker-compose
docker compose -f docker-compose.prod.yml up --build -d

#Wait for the databse to be ready(basic health check)
echo "⏳ Waiting for the database to be ready..."
sleep 5

# Run migrations with Drizzle
echo "🗃️  Applying latest schema migrations to the database with Drizzle..."
npm run db:migrate

echo ""
echo "✨ Production environment is up and running!"
echo "   🌐 Application is accessible at http://localhost:${PORT:-3000}"
echo "      Logs can be viewed with: docker logs kubernetes-demo-api-app-prod"
echo ""
echo "Useful commands:"
echo "   🛑 To stop the production environment, run: docker compose -f docker-compose.prod.yml down"
echo "   📦 To view logs: docker logs -f kubernetes-demo-api-app-prod"