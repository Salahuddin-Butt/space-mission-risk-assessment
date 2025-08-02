#!/bin/bash

# Netlify Build Script - This is what Netlify will run
set -e

echo "🚀 Netlify Build Started"
echo "================================"

# Environment info
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Build directory: $PWD"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm ci
cd ..

# Install Netlify function dependencies
echo "📦 Installing Netlify function dependencies..."
cd netlify/functions
npm ci
cd ../..

# Build the React app
echo "🔨 Building React application..."
cd client
npm run build
cd ..

# Copy space background to build
echo "📁 Copying assets..."
if [ -f "client/public/space-background.png" ]; then
    cp client/public/space-background.png client/build/
    echo "✅ Space background copied"
fi

# Create build info
echo "📝 Creating build info..."
cat > client/build/build-info.json << EOF
{
  "buildTime": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "nodeVersion": "$(node -v)",
  "environment": "production",
  "netlifyBuild": "${NETLIFY_BUILD_ID:-unknown}"
}
EOF

echo "🎉 Build completed successfully!"
echo "📁 Build directory: client/build"
echo "📊 Build size: $(du -sh client/build | cut -f1)" 