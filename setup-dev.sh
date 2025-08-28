#!/bin/bash

# Kenya Climate PWA Development Setup Script
# This script sets up the development environment for the UzimaSmart climate monitoring platform

set -e

echo "🌍 Kenya Climate PWA - Development Setup"
echo "========================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ Please edit .env file with your actual API keys and database credentials"
    echo "⚠️  Required: DATABASE_URL, REDIS_URL, AFRICAS_TALKING_API_KEY, GEE_SERVICE_ACCOUNT_KEY"
    echo ""
fi

# Create data directories for volumes
echo "📁 Creating data directories..."
mkdir -p data/postgres
mkdir -p data/redis
mkdir -p logs

# Build and start services
echo "🐳 Building and starting Docker services..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Initialize database
echo "🗄️  Initializing database..."
docker-compose exec postgres psql -U postgres -d climate_db -f /docker-entrypoint-initdb.d/init-db.sql

# Start all services
echo "🌟 Starting all services..."
docker-compose up -d

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 Service Status:"
docker-compose ps
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Visit http://localhost:3000 to access the application"
echo "3. Check logs with: docker-compose logs -f"
echo ""
echo "🛠️  Development commands:"
echo "   Stop services: docker-compose down"
echo "   View logs: docker-compose logs -f [service_name]"
echo "   Rebuild: docker-compose down && docker-compose build && docker-compose up -d"
echo ""
