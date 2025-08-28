#!/bin/bash

# Stop UzimaSmart services
set -e

echo "🛑 Stopping UzimaSmart services..."

# Stop all services
docker compose down

echo "✅ All services stopped successfully!"
echo ""
echo "To remove all data (including database), run:"
echo "docker compose down -v"
