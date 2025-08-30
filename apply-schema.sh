#!/bin/bash

# Apply Supabase Schema Script
# This script applies the supabase-schema.sql to the database

echo "🚀 Applying Supabase Schema..."
echo "Database URL: $DATABASE_URL"
echo "Supabase URL: $NEXT_PUBLIC_SUPABASE_URL"

# Check if we have the required environment variables
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL environment variable is not set"
    echo "Please check your .env file"
    exit 1
fi

echo "📝 Applying schema from supabase-schema.sql..."

# Apply the schema using psql
if command -v psql &> /dev/null; then
    echo "✅ Using psql to apply schema..."
    psql "$DATABASE_URL" -f supabase-schema.sql
    if [ $? -eq 0 ]; then
        echo "🎉 Schema applied successfully!"
    else
        echo "❌ Error applying schema with psql"
        exit 1
    fi
elif command -v docker &> /dev/null; then
    echo "✅ Using Docker to apply schema..."
    docker run --rm -v "$(pwd)":/workspace -w /workspace postgres:15 psql "$DATABASE_URL" -f supabase-schema.sql
    if [ $? -eq 0 ]; then
        echo "🎉 Schema applied successfully!"
    else
        echo "❌ Error applying schema with Docker"
        exit 1
    fi
else
    echo "❌ Neither psql nor Docker found. Please install PostgreSQL client or Docker."
    echo ""
    echo "Alternative: Copy the contents of supabase-schema.sql and run it manually in:"
    echo "  1. Supabase Dashboard > SQL Editor"
    echo "  2. Or any PostgreSQL client connected to your database"
    exit 1
fi

echo ""
echo "🔍 Verifying tables were created..."
echo "You can check in your Supabase Dashboard > Table Editor to confirm:"
echo "  - counties"
echo "  - climate_data"
echo "  - community_reports"
echo "  - user_reports"
echo "  - report_interactions"
echo "  - report_analytics"
