#!/bin/bash

# InstaFollow Comparator Build Script
# Usage: ./scripts/build.sh [--dev|--prod|--docker]

set -e

echo "🚀 InstaFollow Comparator Build Script"
echo "======================================"

# Default to production build
BUILD_TYPE="prod"

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --dev)
      BUILD_TYPE="dev"
      shift
      ;;
    --prod)
      BUILD_TYPE="prod"
      shift
      ;;
    --docker)
      BUILD_TYPE="docker"
      shift
      ;;
    *)
      echo "Unknown option $1"
      echo "Usage: $0 [--dev|--prod|--docker]"
      exit 1
      ;;
  esac
done

case $BUILD_TYPE in
  dev)
    echo "🔧 Development build..."
    npm install
    npm run dev
    ;;
  prod)
    echo "🏗️  Production build..."
    npm install
    npm run lint
    npm run type-check
    npm run build
    echo "✅ Build completed successfully!"
    echo "Run 'npm start' to start the production server"
    ;;
  docker)
    echo "🐳 Docker build..."
    if ! command -v docker &> /dev/null; then
      echo "❌ Docker is not installed or not running"
      exit 1
    fi
    
    echo "Building Docker image..."
    docker build -t instafollowcomparator .
    
    echo "✅ Docker image built successfully!"
    echo "Run 'docker run -p 3000:3000 instafollowcomparator' to start"
    ;;
esac