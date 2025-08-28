#!/bin/bash

# UzimaSmart Docker Setup Script
set -e

echo "🚀 Setting up UzimaSmart with Docker..."

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.docker .env
    echo "✅ Environment file created. Please edit .env with your actual values."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p ssl
mkdir -p database/init

# Set proper permissions
echo "🔐 Setting up permissions..."
chmod +x scripts/*.sh 2>/dev/null || true

# Pull required images
echo "📦 Pulling Docker images..."
docker compose pull

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys and configuration"
echo "2. Run './scripts/start.sh' to start all services"
echo "3. Run './scripts/stop.sh' to stop all services"
echo "4. Run './scripts/logs.sh' to view logs"
echo ""
echo "The application will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- Database: localhost:5432"
echo "- Redis: localhost:6379"
