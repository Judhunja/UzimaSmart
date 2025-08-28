# Kenya Climate PWA - Testing Guide

This document outlines the testing strategy and procedures for the UzimaSmart climate monitoring platform.

## Testing Overview

### Test Categories

1. **Unit Tests** - Individual component testing
2. **Integration Tests** - Service interaction testing  
3. **API Tests** - Endpoint functionality testing
4. **E2E Tests** - Full user journey testing
5. **Performance Tests** - Load and stress testing

## Backend Testing

### API Testing with Pytest

```bash
# Run all backend tests
cd backend
python -m pytest tests/ -v

# Run specific test categories
python -m pytest tests/test_api/ -v           # API tests
python -m pytest tests/test_services/ -v     # Service tests
python -m pytest tests/test_models/ -v       # Database model tests
```

### Manual API Testing

```bash
# Health check
curl http://localhost:8000/health

# Get counties
curl http://localhost:8000/api/v1/counties

# Get climate data for a county
curl "http://localhost:8000/api/v1/climate/data?county_id=1&days=7"

# Submit community report
curl -X POST http://localhost:8000/api/v1/community/reports \
  -H "Content-Type: application/json" \
  -d '{
    "county_id": 1,
    "latitude": -1.2921,
    "longitude": 36.8219,
    "location_name": "Test Location",
    "event_type": "flood",
    "severity": "medium",
    "description": "Test flood report",
    "reporter_phone": "+254700000001"
  }'
```

## Frontend Testing

### Component Testing with Jest

```bash
# Run frontend tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### E2E Testing with Playwright

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests in headless mode
npm run test:e2e:headless
```

## Integration Testing

### Docker Compose Testing

```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
make test

# Cleanup test environment
docker-compose -f docker-compose.test.yml down
```

### Database Testing

```bash
# Connect to test database
docker-compose exec postgres psql -U postgres -d climate_db_test

# Run database migrations
docker-compose exec backend alembic upgrade head

# Seed test data
docker-compose exec backend python scripts/seed_test_data.py
```

## SMS/USSD Testing

### Africa's Talking Simulator

1. Use the Africa's Talking sandbox for testing
2. Test USSD flows with simulator
3. Verify SMS delivery and responses

### Test Phone Numbers

```
Test Numbers (Sandbox):
- +254711XXXYYY
- +254733XXXYYY
```

### USSD Test Flow

```
Dial: *384*12345#
1. Select County
2. Get Climate Info
3. Report Event
4. Subscribe to Alerts
```

## Google Earth Engine Testing

### Mock GEE Data

```python
# Use mock data for testing
MOCK_GEE_DATA = {
    "ndvi": 0.45,
    "temperature": 24.5,
    "rainfall": 15.2
}
```

### GEE Service Testing

```bash
# Test with actual GEE (requires auth)
python -c "
from backend.app.services.gee_service import GEEService
service = GEEService()
data = service.get_county_climate_data(1)
print(data)
"
```

## Performance Testing

### Load Testing with Artillery

```bash
# Install Artillery
npm install -g artillery

# Run load tests
artillery run tests/load/api-load-test.yml
```

### Database Performance

```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Monitor connection count
SELECT count(*) FROM pg_stat_activity;
```

## Test Data Management

### Sample Test Data

```bash
# Load sample data
make db-init

# Reset test database
docker-compose exec postgres psql -U postgres -c "DROP DATABASE IF EXISTS climate_db_test;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE climate_db_test;"
```

### Test Counties

```
Test Counties:
1. Nairobi (ID: 1)
2. Mombasa (ID: 2) 
3. Kisumu (ID: 3)
4. Nakuru (ID: 4)
5. Machakos (ID: 5)
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          docker-compose -f docker-compose.test.yml up -d
          make test
          docker-compose -f docker-compose.test.yml down
```

## Test Environment Variables

```bash
# Test configuration
export NODE_ENV=test
export DATABASE_URL=postgresql://postgres:password@localhost:5432/climate_db_test
export REDIS_URL=redis://localhost:6379/1
export AFRICAS_TALKING_API_KEY=test_key
export GEE_SERVICE_ACCOUNT_KEY=test_key
```

## Debugging Tests

### Backend Debugging

```bash
# Run with debugger
python -m pytest tests/test_api.py::test_get_counties -v -s --pdb

# Check logs
docker-compose logs backend
```

### Frontend Debugging

```bash
# Debug component tests
npm test -- --debug

# Check browser console
npm run dev
# Open http://localhost:3000 and check console
```

## Test Coverage

### Backend Coverage

```bash
# Generate coverage report
cd backend
python -m pytest --cov=app tests/ --cov-report=html
```

### Frontend Coverage

```bash
# Generate coverage report
cd frontend
npm run test:coverage
```

## Security Testing

### API Security

```bash
# Test authentication
curl -H "Authorization: Bearer invalid_token" http://localhost:8000/api/v1/protected

# Test input validation
curl -X POST http://localhost:8000/api/v1/community/reports \
  -H "Content-Type: application/json" \
  -d '{"invalid": "data"}'
```

### Dependencies Security

```bash
# Check backend dependencies
cd backend
pip-audit

# Check frontend dependencies
cd frontend
npm audit
```

## Monitoring & Alerts

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Database health
docker-compose exec postgres pg_isready

# Redis health
docker-compose exec redis redis-cli ping
```

### Log Monitoring

```bash
# Monitor application logs
docker-compose logs -f backend frontend

# Monitor error logs
docker-compose logs backend | grep ERROR
```

This testing guide ensures comprehensive coverage of all system components and provides clear procedures for validating the climate monitoring platform functionality.
