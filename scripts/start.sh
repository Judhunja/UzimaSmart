#!/bin/bash

# Start UzimaSmart services
set -e

echo "🚀 Starting UzimaSmart services..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Run './scripts/setup.sh' first."
    exit 1
fi

# Start services in the correct order
echo "📦 Starting database and cache services..."
docker compose up -d db redis

echo "⏳ Waiting for database to be ready..."
sleep 10

echo "🔧 Starting backend service..."
docker compose up -d backend

echo "⏳ Waiting for backend to be ready..."
sleep 15

echo "🎨 Starting frontend service..."
docker compose up -d frontend

echo "✅ All services started successfully!"
echo ""
echo "Services are now running:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- Database: localhost:5432"
echo "- Redis: localhost:6379"
echo ""
echo "Run './scripts/status.sh' to check service status"
echo "Run './scripts/logs.sh [service]' to view logs"
