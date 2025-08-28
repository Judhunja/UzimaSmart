# Deployment Guide - Kenya Climate PWA

This guide covers deployment options for the UzimaSmart climate monitoring platform, from development to production environments.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   CDN (Static)  │    │   Monitoring    │
│   (nginx/HAProxy│    │   (CloudFlare)  │    │   (Grafana)     │
└─────────┬───────┘    └─────────────────┘    └─────────────────┘
          │
┌─────────▼───────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Worker Jobs   │
│   (Next.js)     │    │   (FastAPI)     │    │   (Celery)      │
└─────────────────┘    └─────────┬───────┘    └─────────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
┌─────────▼───────┐    ┌─────────▼───────┐    ┌─────────▼───────┐
│   PostgreSQL    │    │     Redis       │    │   File Storage  │
│   + PostGIS     │    │   (Cache/Queue) │    │   (Object Store)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Deploy with Docker

### 1. Production Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    environment:
      NODE_ENV: production
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - GEE_SERVICE_ACCOUNT_KEY=${GEE_SERVICE_ACCOUNT_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: climate_db
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 2. Deploy Command

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Scale backend instances
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```

## ☁️ Cloud Platform Deployments

### AWS Deployment

#### ECS with Fargate

```yaml
# ecs-task-definition.json
{
  "family": "uzima-smart",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "uzima-smart/frontend:latest",
      "portMappings": [{"containerPort": 3000}],
      "essential": true
    },
    {
      "name": "backend", 
      "image": "uzima-smart/backend:latest",
      "portMappings": [{"containerPort": 8000}],
      "essential": true,
      "environment": [
        {"name": "DATABASE_URL", "value": "${DATABASE_URL}"}
      ]
    }
  ]
}
```

#### Terraform Configuration

```hcl
# main.tf
provider "aws" {
  region = "us-east-1"
}

# VPC and networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

# ECS Cluster
resource "aws_ecs_cluster" "uzima_cluster" {
  name = "uzima-smart"
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier           = "uzima-postgres"
  engine              = "postgres"
  engine_version      = "15.4"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_encrypted   = true
  
  db_name  = "climate_db"
  username = "postgres"
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  skip_final_snapshot = true
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "uzima-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  security_group_ids   = [aws_security_group.redis.id]
  subnet_group_name    = aws_elasticache_subnet_group.main.name
}
```

### Google Cloud Platform

#### Cloud Run Deployment

```yaml
# cloudrun-frontend.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: uzima-frontend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containers:
      - image: gcr.io/PROJECT_ID/uzima-frontend
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          limits:
            memory: "512Mi"
            cpu: "1000m"
```

```bash
# Deploy to Cloud Run
gcloud run deploy uzima-frontend \
  --image gcr.io/PROJECT_ID/uzima-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy uzima-backend \
  --image gcr.io/PROJECT_ID/uzima-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL=$DATABASE_URL
```

### Azure Container Instances

```yaml
# azure-container-group.yaml
apiVersion: 2019-12-01
location: eastus
name: uzima-smart
properties:
  containers:
  - name: frontend
    properties:
      image: uzima-smart/frontend:latest
      ports:
      - port: 3000
      resources:
        requests:
          cpu: 1
          memoryInGb: 1
  - name: backend
    properties:
      image: uzima-smart/backend:latest
      ports:
      - port: 8000
      environmentVariables:
      - name: DATABASE_URL
        secureValue: ${DATABASE_URL}
      resources:
        requests:
          cpu: 1
          memoryInGb: 1
  osType: Linux
  ipAddress:
    type: Public
    ports:
    - protocol: tcp
      port: 80
    - protocol: tcp
      port: 8000
type: Microsoft.ContainerInstance/containerGroups
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@db-host:5432/climate_db
REDIS_URL=redis://redis-host:6379/0

# Google Earth Engine
GOOGLE_EARTH_ENGINE_SERVICE_ACCOUNT='{"type": "service_account", ...}'

# Africa's Talking
AFRICAS_TALKING_API_KEY=live_api_key
AFRICAS_TALKING_USERNAME=production_username

# Security
SECRET_KEY=super_secure_secret_key_here
ALLOWED_HOSTS=uzima-smart.com,api.uzima-smart.com

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=INFO

# External Services
OPENWEATHER_API_KEY=production_weather_api_key
```

### CI/CD Pipeline with GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Test Backend
      run: |
        cd backend
        pip install -r requirements.txt
        python -m pytest tests/
    
    - name: Test Frontend
      run: |
        cd frontend
        npm ci
        npm test

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Build Backend Image
      run: |
        docker build -t uzima-backend ./backend
        docker tag uzima-backend ${{ secrets.REGISTRY }}/uzima-backend:${{ github.sha }}
    
    - name: Build Frontend Image
      run: |
        docker build -t uzima-frontend ./frontend
        docker tag uzima-frontend ${{ secrets.REGISTRY }}/uzima-frontend:${{ github.sha }}
    
    - name: Push Images
      run: |
        echo ${{ secrets.REGISTRY_PASSWORD }} | docker login ${{ secrets.REGISTRY }} -u ${{ secrets.REGISTRY_USERNAME }} --password-stdin
        docker push ${{ secrets.REGISTRY }}/uzima-backend:${{ github.sha }}
        docker push ${{ secrets.REGISTRY }}/uzima-frontend:${{ github.sha }}
    
    - name: Deploy to Production
      run: |
        # Deploy command depends on your platform
        # AWS: aws ecs update-service
        # GCP: gcloud run deploy
        # Azure: az container create
```

## 🔒 Security Configuration

### SSL/TLS Setup with Let's Encrypt

```nginx
# nginx.conf
server {
    listen 80;
    server_name uzima-smart.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name uzima-smart.com;
    
    ssl_certificate /etc/letsencrypt/live/uzima-smart.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/uzima-smart.com/privkey.pem;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Frontend
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Database Security

```sql
-- Create production database user
CREATE USER uzima_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE climate_db TO uzima_app;
GRANT USAGE ON SCHEMA public TO uzima_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO uzima_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO uzima_app;

-- Enable row level security
ALTER TABLE community_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY reports_policy ON community_reports 
  FOR ALL USING (true); -- Customize based on your needs
```

## 📊 Monitoring & Logging

### Prometheus + Grafana

```yaml
# monitoring.yml
version: '3.8'
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

### Application Monitoring

```python
# Add to FastAPI app
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()
Instrumentator().instrument(app).expose(app)

# Custom metrics
from prometheus_client import Counter, Histogram

API_REQUESTS = Counter('api_requests_total', 'Total API requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('api_request_duration_seconds', 'Request duration')
```

## 🔄 Backup & Recovery

### Database Backup

```bash
#!/bin/bash
# backup-db.sh

DB_NAME="climate_db"
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump $DATABASE_URL > $BACKUP_DIR/climate_db_$DATE.sql

# Upload to cloud storage (AWS S3)
aws s3 cp $BACKUP_DIR/climate_db_$DATE.sql s3://uzima-backups/

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

### Disaster Recovery Plan

1. **Database Recovery**
   ```bash
   # Restore from backup
   psql $DATABASE_URL < backup_file.sql
   ```

2. **Application Recovery**
   ```bash
   # Pull latest images and restart
   docker-compose -f docker-compose.prod.yml pull
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Monitoring Recovery**
   - Set up alerts for service downtime
   - Monitor key metrics: response time, error rate, throughput
   - Check data integrity after recovery

## 📱 Mobile App Deployment

### PWA Distribution

```json
// manifest.json
{
  "name": "UzimaSmart Climate",
  "short_name": "UzimaSmart",
  "description": "Kenya Climate Monitoring Platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#059669",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### App Store Considerations

- **PWA to App Store**: Use PWABuilder or similar tools
- **Performance**: Optimize for mobile networks in Kenya
- **Offline functionality**: Ensure core features work offline
- **Data usage**: Minimize bandwidth requirements

## 🌍 Kenya-Specific Deployment

### Local Hosting Considerations

- **Data residency**: Consider local hosting for compliance
- **Connectivity**: Optimize for varying internet speeds
- **Power**: Plan for unreliable power infrastructure
- **Cost**: Balance features with operational costs

### Partnerships

- **Safaricom**: Integration with M-Pesa and SMS services
- **Kenya Met Department**: Official weather data sources
- **Universities**: Research partnerships for validation
- **NGOs**: Community outreach and adoption

This deployment guide provides multiple paths from development to production, ensuring the climate monitoring platform can be reliably deployed across various infrastructure scenarios suitable for Kenya's technological landscape.
