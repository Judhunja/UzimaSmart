# Makefile for Kenya Climate PWA with Supabase
# Development and deployment commands for UzimaSmart

.PHONY: help setup dev build start stop clean logs test install supabase-setup

# Default target
help:
	@echo "🌍 Kenya Climate PWA - Available Commands (Supabase Edition)"
	@echo "============================================================"
	@echo ""
	@echo "📋 Setup & Development:"
	@echo "  make supabase-setup - Setup with Supabase integration"
	@echo "  make setup         - Original setup (local PostgreSQL)"
	@echo "  make dev           - Start development environment"
	@echo "  make install       - Install dependencies"
	@echo ""
	@echo "🐳 Docker Commands:"
	@echo "  make build         - Build Docker images"
	@echo "  make start         - Start all services"
	@echo "  make stop          - Stop all services"
	@echo "  make restart       - Restart all services"
	@echo ""
	@echo "🔍 Monitoring:"
	@echo "  make logs          - View logs from all services"
	@echo "  make status        - Check service status"
	@echo ""
	@echo "🧹 Maintenance:"
	@echo "  make clean         - Clean up containers and volumes"
	@echo "  make reset         - Complete reset (careful!)"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  make test          - Run all tests"
	@echo "  make test-api      - Test API endpoints"
	@echo ""

# Setup with Supabase integration
supabase-setup:
	@echo "🚀 Setting up Kenya Climate PWA with Supabase..."
	./setup-supabase.sh

# Setup development environment (original)
setup:
	@echo "🚀 Setting up Kenya Climate PWA (local)..."
	./setup-dev.sh

# Start development environment with Supabase
dev:
	@echo "🔄 Starting development environment with Supabase..."
	docker-compose -f docker-compose.supabase.yml up --build

# Start development environment (original)
dev-local:
	@echo "🔄 Starting development environment (local PostgreSQL)..."
	docker-compose up --build

# Build Docker images (Supabase)
build:
	@echo "🏗️  Building Docker images for Supabase..."
	docker-compose -f docker-compose.supabase.yml build

# Build Docker images (local)
build-local:
	@echo "🏗️  Building Docker images for local..."
	docker-compose build

# Start services in background (Supabase)
start:
	@echo "▶️  Starting Supabase services..."
	docker-compose -f docker-compose.supabase.yml up -d

# Start services in background (local)
start-local:
	@echo "▶️  Starting local services..."
	docker-compose up -d

# Stop services (Supabase)
stop:
	@echo "⏹️  Stopping Supabase services..."
	docker-compose -f docker-compose.supabase.yml down

# Stop services (local)
stop-local:
	@echo "⏹️  Stopping local services..."
	docker-compose down

# Restart services
restart: stop start

# View logs (Supabase)
logs:
	@echo "📊 Viewing Supabase logs..."
	docker-compose -f docker-compose.supabase.yml logs -f

# View logs (local)
logs-local:
	@echo "📊 Viewing local logs..."
	docker-compose logs -f

# Check service status (Supabase)
status:
	@echo "📈 Supabase Service Status:"
	docker-compose -f docker-compose.supabase.yml ps

# Check service status (local)
status-local:
	@echo "📈 Local Service Status:"
	docker-compose ps

# Clean up containers and volumes
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	docker system prune -f

# Complete reset (removes all data)
reset:
	@echo "⚠️  Complete reset - this will remove all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker-compose down -v; \
		docker system prune -a -f; \
		rm -rf data/; \
		echo "✅ Reset complete"; \
	else \
		echo "❌ Reset cancelled"; \
	fi

# Run tests
test:
	@echo "🧪 Running tests..."
	docker-compose exec backend python -m pytest tests/ -v
	docker-compose exec frontend npm test

# Test API endpoints
test-api:
	@echo "🔍 Testing API endpoints..."
	curl -f http://localhost:8000/health || echo "❌ Backend health check failed"
	curl -f http://localhost:8000/api/v1/counties || echo "❌ Counties API failed"
	curl -f http://localhost:3000 || echo "❌ Frontend not accessible"

# Database operations
db-init:
	@echo "🗄️  Initializing database..."
	docker-compose exec postgres psql -U postgres -d climate_db -f /docker-entrypoint-initdb.d/init-db.sql

db-shell:
	@echo "💻 Opening database shell..."
	docker-compose exec postgres psql -U postgres -d climate_db

# View specific service logs
logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f postgres

logs-redis:
	docker-compose logs -f redis
