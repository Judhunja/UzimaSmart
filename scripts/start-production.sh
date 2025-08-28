#!/bin/bash

# Production deployment with Nginx
echo "🚀 Starting UzimaSmart in production mode with Nginx..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Run './scripts/setup.sh' first."
    exit 1
fi

# Start with production profile
docker compose --profile production up -d

echo "✅ Production deployment started!"
echo ""
echo "Services are now running behind Nginx:"
echo "- Application: http://localhost"
echo "- Direct Frontend: http://localhost:3000"
echo "- Direct Backend: http://localhost:8000"
echo ""
echo "For HTTPS, configure SSL certificates in the ssl/ directory"
