#!/bin/bash

# UzimaSmart Deployment Script
# This script helps deploy the PWA to various platforms

set -e

echo "🌱 UzimaSmart Deployment Script"
echo "==============================="

# Check if required environment variables are set
check_env() {
    echo "Checking environment variables..."
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
        echo "❌ NEXT_PUBLIC_SUPABASE_URL is not set"
        exit 1
    fi
    
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set"
        exit 1
    fi
    
    echo "✅ Environment variables check passed"
}

# Install dependencies
install_deps() {
    echo "Installing dependencies..."
    npm ci --legacy-peer-deps
    echo "✅ Dependencies installed"
}

# Build the application
build_app() {
    echo "Building application..."
    npm run build
    echo "✅ Application built successfully"
}

# Deploy to Vercel
deploy_vercel() {
    echo "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    vercel --prod
    echo "✅ Deployed to Vercel"
}

# Deploy to Railway
deploy_railway() {
    echo "Deploying to Railway..."
    
    if ! command -v railway &> /dev/null; then
        echo "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    railway login
    railway deploy
    echo "✅ Deployed to Railway"
}

# Deploy to Netlify
deploy_netlify() {
    echo "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        echo "Installing Netlify CLI..."
        npm install -g netlify-cli
    fi
    
    netlify deploy --prod --dir=.next
    echo "✅ Deployed to Netlify"
}

# Main deployment function
deploy() {
    local platform=$1
    
    check_env
    install_deps
    build_app
    
    case $platform in
        vercel)
            deploy_vercel
            ;;
        railway)
            deploy_railway
            ;;
        netlify)
            deploy_netlify
            ;;
        *)
            echo "❌ Unknown platform: $platform"
            echo "Available platforms: vercel, railway, netlify"
            exit 1
            ;;
    esac
}

# Help function
show_help() {
    cat << EOF
UzimaSmart Deployment Script

Usage: $0 [platform]

Platforms:
  vercel    Deploy to Vercel (recommended)
  railway   Deploy to Railway
  netlify   Deploy to Netlify

Examples:
  $0 vercel
  $0 railway
  $0 netlify

Before deploying, make sure you have set up your environment variables:
- Copy .env.example to .env.local
- Fill in all required API keys and credentials
- Set up your database (Supabase)

EOF
}

# Main script logic
if [ $# -eq 0 ]; then
    show_help
    exit 1
fi

case $1 in
    -h|--help)
        show_help
        ;;
    *)
        deploy $1
        ;;
esac
