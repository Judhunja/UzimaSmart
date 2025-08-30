#!/bin/bash

# Apply SMS Subscriptions Database Schema
echo "🗄️  Applying SMS Subscriptions Database Schema..."
echo ""

if [ -f "sms_subscriptions_table.sql" ]; then
    echo "📋 SMS Subscriptions Table SQL Schema:"
    echo "======================================"
    cat sms_subscriptions_table.sql
    echo ""
    echo "======================================"
    echo ""
    echo "📝 Instructions:"
    echo "1. Copy the SQL above"
    echo "2. Go to your Supabase Dashboard → SQL Editor"
    echo "3. Paste and run the SQL"
    echo "4. This will create the sms_subscriptions table with all necessary indexes and policies"
    echo ""
    echo "✅ After applying the schema, your SMS subscription system will be fully functional!"
else
    echo "❌ Error: sms_subscriptions_table.sql file not found"
    echo "Make sure you're in the correct directory"
fi
