#!/bin/bash

# UzimaSmart Manual Development Setup
echo "🌍 Starting UzimaSmart Climate Monitoring System"
echo "================================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found! Creating from template..."
    cp .env.example .env
    echo "✅ Please edit .env file with your settings"
    echo "📝 Note: You can leave API keys empty for development"
fi

echo ""
echo "📋 Starting services manually..."
echo ""

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Start PostgreSQL if not running
echo "🗄️  Checking PostgreSQL..."
if ! systemctl is-active --quiet postgresql; then
    echo "📦 Starting PostgreSQL..."
    sudo systemctl start postgresql || echo "⚠️  Could not start PostgreSQL. You may need to install it."
fi

# Start Redis if not running
echo "📦 Checking Redis..."
if ! systemctl is-active --quiet redis; then
    echo "📦 Starting Redis..."
    sudo systemctl start redis || echo "⚠️  Could not start Redis. You may need to install it."
fi

echo ""
echo "🚀 Ready to start application services!"
echo ""
echo "To start the backend:"
echo "  cd backend"
echo "  python3 -m venv venv && source venv/bin/activate"
echo "  pip install -r requirements.txt"
echo "  uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo ""
echo "To start the frontend (in a new terminal):"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "📖 Access the application:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
