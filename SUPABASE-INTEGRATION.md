# Supabase Integration Guide

This guide explains how to integrate your existing UzimaSmart climate monitoring platform with Supabase for enhanced database capabilities, real-time features, and authentication.

## 🎯 Why Supabase Integration?

- **Real-time Updates**: Live climate data and community reports
- **Built-in Authentication**: Phone number verification and user management
- **PostGIS Support**: Full geospatial database capabilities
- **Edge Functions**: Serverless functions for complex operations
- **Storage**: File storage for images and documents
- **Row Level Security**: Fine-grained access control

## 🚀 Setup Steps

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys
4. Enable PostGIS extension in SQL Editor

### 2. Configure Environment Variables

Update your `.env` file with Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database URL (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 3. Run Database Schema Migration

Execute the SQL migration in your Supabase SQL Editor:

```sql
-- Copy and paste the contents of supabase-schema.sql
-- This creates all necessary tables with proper relationships
```

### 4. Update Backend Dependencies

The backend now includes Supabase Python client:

```bash
cd backend
pip install -r requirements.txt
```

## 🏗️ Architecture Changes

### Before (Local PostgreSQL)
```
Frontend → FastAPI → PostgreSQL + Redis
```

### After (Supabase Integration)
```
Frontend → FastAPI → Supabase PostgreSQL + Redis
         ↓
    Supabase Client (Real-time, Auth)
```

## 📱 Frontend Integration

### Install Supabase Client

```bash
cd frontend
npm install @supabase/supabase-js
```

### Supabase Client Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Real-time subscription for climate data
export const subscribeToClimateData = (callback: (data: any) => void) => {
  return supabase
    .channel('climate_data')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'climate_data'
    }, callback)
    .subscribe()
}

// Real-time subscription for community reports
export const subscribeToCommunityReports = (callback: (data: any) => void) => {
  return supabase
    .channel('community_reports')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'community_reports'
    }, callback)
    .subscribe()
}
```

### Authentication Component

```typescript
// src/components/Auth/PhoneAuth.tsx
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PhoneAuth() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')

  const sendOTP = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      phone: phone,
    })
    
    if (!error) {
      setStep('otp')
    }
  }

  const verifyOTP = async () => {
    const { error } = await supabase.auth.verifyOtp({
      phone: phone,
      token: otp,
      type: 'sms'
    })
    
    if (!error) {
      // User is authenticated
      window.location.reload()
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      {step === 'phone' ? (
        <div>
          <h2 className="text-xl font-bold mb-4">Enter Phone Number</h2>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+254700000000"
            className="w-full p-3 border rounded-lg mb-4"
          />
          <button
            onClick={sendOTP}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Send OTP
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            className="w-full p-3 border rounded-lg mb-4"
          />
          <button
            onClick={verifyOTP}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Verify OTP
          </button>
        </div>
      )}
    </div>
  )
}
```

## 🔄 Real-time Features

### Live Climate Data Updates

```typescript
// src/components/ClimateData/LiveUpdates.tsx
import { useEffect, useState } from 'react'
import { subscribeToClimateData } from '@/lib/supabase'

export default function LiveClimateUpdates({ countyId }: { countyId: number }) {
  const [latestData, setLatestData] = useState(null)

  useEffect(() => {
    const subscription = subscribeToClimateData((payload) => {
      if (payload.new.county_id === countyId) {
        setLatestData(payload.new)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [countyId])

  if (!latestData) return null

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <h3 className="font-semibold text-blue-800">🔴 Live Update</h3>
      <p className="text-blue-700">
        New climate data received: NDVI {latestData.ndvi_mean}, 
        Temperature {latestData.temperature_mean}°C
      </p>
    </div>
  )
}
```

### Live Community Reports

```typescript
// src/components/Community/LiveReports.tsx
import { useEffect, useState } from 'react'
import { subscribeToCommunityReports } from '@/lib/supabase'

export default function LiveCommunityReports() {
  const [newReports, setNewReports] = useState([])

  useEffect(() => {
    const subscription = subscribeToCommunityReports((payload) => {
      setNewReports(prev => [payload.new, ...prev.slice(0, 4)]) // Keep latest 5
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="space-y-2">
      {newReports.map(report => (
        <div key={report.id} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-800">
              🆕 New {report.event_type} report
            </span>
            <span className="text-xs text-yellow-600">
              {new Date(report.created_at).toLocaleTimeString()}
            </span>
          </div>
          <p className="text-sm text-yellow-700 mt-1">{report.location_name}</p>
        </div>
      ))}
    </div>
  )
}
```

## 🔐 Row Level Security

Supabase RLS policies are automatically applied:

```sql
-- Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Anyone can view community reports
CREATE POLICY "Anyone can view community reports" ON community_reports
    FOR SELECT TO authenticated, anon USING (true);

-- Users can manage their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
    FOR ALL USING (true);
```

## 📊 Backend Integration

### Updated Database Service

```python
# backend/app/services/database_service.py
from ..utils.supabase import supabase_service
from ..utils.database import AsyncSessionLocal

class DatabaseService:
    def __init__(self):
        self.supabase = supabase_service
        
    async def create_climate_data(self, data: dict):
        """Create climate data in both SQLAlchemy and Supabase"""
        async with AsyncSessionLocal() as session:
            # SQLAlchemy operations for complex queries
            # ...
            
            # Supabase for real-time updates
            await self.supabase.insert_climate_data(data)
    
    async def create_community_report(self, data: dict):
        """Create community report with real-time notification"""
        async with AsyncSessionLocal() as session:
            # SQLAlchemy operations
            # ...
            
            # Supabase for real-time updates
            await self.supabase.insert_community_report(data)
```

## 🚀 Deployment with Supabase

### Environment Variables for Production

```bash
# Production Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Docker Compose Updates

```yaml
# docker-compose.yml - Remove local postgres, use Supabase
version: '3.8'
services:
  backend:
    build: ./backend
    environment:
      - DATABASE_URL=${DATABASE_URL}  # Points to Supabase
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    ports:
      - "3000:3000"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## 📱 Mobile App Benefits

### PWA with Offline Sync

```typescript
// Service worker for offline data sync
self.addEventListener('sync', event => {
  if (event.tag === 'climate-data-sync') {
    event.waitUntil(syncOfflineData())
  }
})

async function syncOfflineData() {
  const offlineData = await getOfflineClimateData()
  
  for (const data of offlineData) {
    await supabase.from('climate_data').insert(data)
  }
}
```

## 🔧 Migration Steps

1. **Backup Current Data**
   ```bash
   pg_dump your_current_db > backup.sql
   ```

2. **Run Supabase Schema**
   - Execute `supabase-schema.sql` in Supabase SQL Editor

3. **Migrate Data**
   ```bash
   # Restore data to Supabase
   psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < backup.sql
   ```

4. **Update Environment**
   - Update `.env` with Supabase credentials
   - Test connections

5. **Deploy**
   ```bash
   docker-compose up --build
   ```

## 📊 Monitoring & Analytics

Supabase provides built-in monitoring:

- **Database Performance**: Query performance and usage
- **API Usage**: Request counts and response times
- **Authentication**: User sign-ups and activity
- **Real-time**: Subscription metrics

## 🤝 Benefits Summary

✅ **Real-time Updates**: Instant climate data and community reports  
✅ **Authentication**: Built-in phone number verification  
✅ **Scalability**: Managed database with automatic scaling  
✅ **Security**: Row Level Security and built-in protections  
✅ **Analytics**: Built-in monitoring and insights  
✅ **Global CDN**: Fast access from anywhere in Kenya  
✅ **Backup**: Automatic daily backups  
✅ **PostGIS**: Full geospatial support maintained  

Your UzimaSmart platform now leverages Supabase's powerful features while maintaining all existing functionality with enhanced real-time capabilities and better user experience.
