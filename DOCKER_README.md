# UzimaSmart Docker Deployment Guide

This guide explains how to deploy the complete UzimaSmart climate monitoring application using Docker.

## 🚀 Quick Start

### Prerequisites
- Docker (v20.10+)
- Docker Compose (v2.0+)
- 4GB+ available RAM
- 10GB+ available disk space

### 1. Setup Environment
```bash
# Run the setup script
./scripts/setup.sh

# Edit environment variables
nano .env
```

### 2. Start All Services
```bash
# Start in development mode
./scripts/start.sh

# Or start in production mode with Nginx
./scripts/start-production.sh
```

### 3. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Production (with Nginx)**: http://localhost

## 📦 Services Overview

### Core Services
| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | Next.js PWA with climate dashboard |
| Backend | 8000 | FastAPI with climate data processing |
| Database | 5432 | PostgreSQL with PostGIS |
| Redis | 6379 | Caching and session storage |
| Nginx | 80/443 | Reverse proxy (production only) |

### Service Dependencies
```
Frontend → Backend → Database
                 ↘ Redis
```

## 🔧 Management Scripts

### Start Services
```bash
./scripts/start.sh              # Development mode
./scripts/start-production.sh   # Production with Nginx
```

### Monitor Services
```bash
./scripts/status.sh             # Check service health
./scripts/logs.sh               # View all logs
./scripts/logs.sh frontend      # View specific service logs
```

### Stop Services
```bash
./scripts/stop.sh               # Stop all services
docker-compose down -v          # Stop and remove data
```

## ⚙️ Configuration

### Environment Variables
Key variables in `.env`:

```bash
# Database
POSTGRES_DB=climate_kenya
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password_change_me

# API Keys (Optional)
OPENWEATHER_API_KEY=your_key
NASA_API_KEY=your_key
AFRICASTALKING_API_KEY=your_key

# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Volume Mounts
- `postgres_data`: Database storage
- `redis_data`: Cache storage
- `./uploads`: File uploads
- `./ssl`: SSL certificates (production)

## 🏗️ Architecture

### Development Mode
```
Client → Frontend:3000 → Backend:8000 → Database:5432
                     ↘ Redis:6379
```

### Production Mode
```
Client → Nginx:80 → Frontend:3000 → Backend:8000 → Database:5432
                 ↘                              ↘ Redis:6379
```

## 🔒 Security Features

### Network Security
- Isolated Docker network (`climate-network`)
- No direct database/Redis access from outside
- Rate limiting in Nginx

### Application Security
- Non-root containers
- Security headers in Nginx
- Health checks for all services
- Proper file permissions

## 📊 Monitoring & Health Checks

### Health Endpoints
- Frontend: `/api/health`
- Backend: `/health`
- Database: Built-in PostgreSQL checks
- Redis: Built-in Redis ping

### Monitoring Commands
```bash
# Check all service health
./scripts/status.sh

# Monitor resource usage
docker stats

# View service logs
./scripts/logs.sh [service_name]
```

## 🚀 Production Deployment

### 1. SSL Setup (Optional)
```bash
# Place SSL certificates in ssl/ directory
mkdir -p ssl
cp your-cert.pem ssl/
cp your-key.pem ssl/
```

### 2. Environment Configuration
```bash
# Set production values in .env
NODE_ENV=production
DEBUG=false
SECRET_KEY=your-strong-secret-key
```

### 3. Start Production Services
```bash
./scripts/start-production.sh
```

## 🔧 Troubleshooting

### Common Issues

#### Services Won't Start
```bash
# Check Docker daemon
sudo systemctl status docker

# Check logs
./scripts/logs.sh

# Restart services
./scripts/stop.sh && ./scripts/start.sh
```

#### Database Connection Issues
```bash
# Check database status
docker-compose exec db pg_isready -U postgres

# Reset database
docker-compose down -v && ./scripts/start.sh
```

#### Frontend Build Failures
```bash
# Clear build cache
docker-compose build --no-cache frontend

# Check frontend logs
./scripts/logs.sh frontend
```

#### Port Conflicts
```bash
# Check what's using ports
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :8000

# Stop conflicting services or change ports in docker-compose.yml
```

### Performance Optimization

#### For Development
- Use volume mounts for hot reloading
- Enable debug mode
- Single worker processes

#### For Production
- Multi-stage builds
- Optimized images
- Multiple workers
- Nginx caching
- Health checks

## 📝 Maintenance

### Regular Tasks
```bash
# Update images
docker-compose pull && docker-compose up -d

# Backup database
docker-compose exec db pg_dump -U postgres climate_kenya > backup.sql

# Clean unused resources
docker system prune -f
```

### Logs Management
```bash
# Rotate logs
docker-compose logs --tail=1000 > logs/app.log

# Clear old logs
docker system prune -f
```

## 🆘 Support

### Getting Help
1. Check service logs: `./scripts/logs.sh`
2. Verify health: `./scripts/status.sh`
3. Review configuration: `cat .env`
4. Check Docker resources: `docker system df`

### Useful Commands
```bash
# Enter container shell
docker-compose exec frontend sh
docker-compose exec backend bash

# Restart specific service
docker-compose restart frontend

# View container processes
docker-compose top
```

## 📈 Scaling

### Horizontal Scaling
```yaml
# In docker-compose.yml
backend:
  deploy:
    replicas: 3
```

### Load Balancing
- Configure Nginx upstream servers
- Use Docker Swarm or Kubernetes for production
- Add external load balancer

---

**Happy Deploying! 🚀**

For issues or questions, check the logs first, then consult the troubleshooting section.
