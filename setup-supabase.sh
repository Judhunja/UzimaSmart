#!/bin/bash

# UzimaSmart Supabase Setup Script
# This script sets up the development environment with Supabase integration

set -e

echo "🌍 UzimaSmart - Supabase Setup"
echo "==============================="

# Check if required tools are installed
echo "🔍 Checking dependencies..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from Supabase template..."
    cp .env.supabase.example .env
    echo ""
    echo "🔧 REQUIRED: Please edit .env file with your Supabase credentials:"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" 
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - DATABASE_URL (from Supabase project settings)"
    echo "   - NASA_EARTHDATA_USERNAME (optional)"
    echo "   - NASA_EARTHDATA_PASSWORD (optional)"
    echo "   - AFRICAS_TALKING_API_KEY"
    echo ""
    echo "⚠️  Also run the SQL migration in your Supabase dashboard:"
    echo "   Copy and paste contents of supabase-schema.sql into Supabase SQL Editor"
    echo ""
    read -p "Press Enter after updating .env file and running SQL migration..."
fi

# Create data directories for volumes
echo "📁 Creating data directories..."
mkdir -p data/redis
mkdir -p logs

# Build services
echo "🐳 Building Docker services..."
docker-compose -f docker-compose.supabase.yml build

# Start Redis (only service we run locally with Supabase)
echo "🚀 Starting Redis service..."
docker-compose -f docker-compose.supabase.yml up -d redis

# Test database connection
echo "🔗 Testing Supabase connection..."
if [ -f .env ]; then
    source .env
    if [ -n "$DATABASE_URL" ]; then
        echo "✅ Database URL configured"
    else
        echo "❌ DATABASE_URL not set in .env file"
        exit 1
    fi
fi

# Start all services
echo "🌟 Starting all services..."
docker-compose -f docker-compose.supabase.yml up -d

echo ""
echo "✅ Supabase setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "📊 Service Status:"
docker-compose -f docker-compose.supabase.yml ps
echo ""
echo "📋 Next steps:"
echo "1. Verify your Supabase credentials in .env file"
echo "2. Ensure SQL migration was run in Supabase"
echo "3. Visit http://localhost:3000 to access the application"
echo "4. Check logs with: docker-compose -f docker-compose.supabase.yml logs -f"
echo ""
echo "🛠️  Development commands:"
echo "   Stop services: docker-compose -f docker-compose.supabase.yml down"
echo "   View logs: docker-compose -f docker-compose.supabase.yml logs -f [service_name]"
echo "   Rebuild: docker-compose -f docker-compose.supabase.yml down && docker-compose -f docker-compose.supabase.yml build && docker-compose -f docker-compose.supabase.yml up -d"
echo ""
echo "📱 USSD Testing:"
echo "   Use Africa's Talking USSD simulator with code: *384*12345#"
echo ""
echo "🔄 Real-time Features:"
echo "   Climate data and community reports will update in real-time via Supabase"
echo ""
