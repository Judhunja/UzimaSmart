#!/bin/bash

# View logs for UzimaSmart services
SERVICE=${1:-all}

if [ "$SERVICE" = "all" ]; then
    echo "📋 Showing logs for all services..."
    docker compose logs -f
elif [ "$SERVICE" = "frontend" ] || [ "$SERVICE" = "backend" ] || [ "$SERVICE" = "db" ] || [ "$SERVICE" = "redis" ]; then
    echo "📋 Showing logs for $SERVICE..."
    docker compose logs -f $SERVICE
else
    echo "❌ Invalid service name. Available services: frontend, backend, db, redis, all"
    echo "Usage: ./scripts/logs.sh [service]"
    echo "Example: ./scripts/logs.sh frontend"
fi
