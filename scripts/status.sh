#!/bin/bash

# Check status of UzimaSmart services
echo "🔍 Checking UzimaSmart service status..."
echo ""

# Check if Docker Compose is running
if ! docker compose ps | grep -q "Up"; then
    echo "❌ No services are currently running."
    echo "Run './scripts/start.sh' to start all services."
    exit 1
fi

# Show service status
echo "📊 Service Status:"
docker compose ps

echo ""
echo "🏥 Health Checks:"

# Check database
if docker compose exec -T db pg_isready -U postgres &>/dev/null; then
    echo "✅ Database: Healthy"
else
    echo "❌ Database: Unhealthy"
fi

# Check Redis
if docker compose exec -T redis redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis: Healthy"
else
    echo "❌ Redis: Unhealthy"
fi

# Check backend
if curl -f http://localhost:8000/health &>/dev/null; then
    echo "✅ Backend API: Healthy"
else
    echo "❌ Backend API: Unhealthy"
fi

# Check frontend
if curl -f http://localhost:3000/api/health &>/dev/null; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Unhealthy"
fi

echo ""
echo "🌐 Access Points:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- API Documentation: http://localhost:8000/docs"
