#!/bin/bash

# Netlify Build Script for Mission Risk Assessment
echo "🚀 Starting Netlify Build Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[BUILD]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if we're in a Netlify environment
if [ "$NETLIFY" = "true" ]; then
    print_info "Running in Netlify environment"
    print_info "Build ID: $NETLIFY_BUILD_ID"
    print_info "Deploy URL: $NETLIFY_DEPLOY_URL"
fi

# Check Node.js version
print_status "Checking Node.js version..."
NODE_VERSION=$(node -v)
print_info "Node.js version: $NODE_VERSION"

# Install root dependencies
print_status "Installing root dependencies..."
npm ci --only=production

# Install client dependencies
print_status "Installing client dependencies..."
cd client
npm ci --only=production

# Build the React app
print_status "Building React application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    print_status "✅ React build completed successfully!"
else
    print_error "❌ React build failed!"
    exit 1
fi

# Go back to root
cd ..

# Install Netlify function dependencies
print_status "Installing Netlify function dependencies..."
cd netlify/functions
npm ci --only=production
cd ../..

# Create build info
print_status "Creating build information..."
BUILD_INFO="{
  \"buildTime\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
  \"nodeVersion\": \"$NODE_VERSION\",
  \"environment\": \"$NODE_ENV\",
  \"netlifyBuild\": \"$NETLIFY_BUILD_ID\"
}"

echo "$BUILD_INFO" > client/build/build-info.json

# Copy space background to build directory
print_status "Copying assets..."
if [ -f "client/public/space-background.png" ]; then
    cp client/public/space-background.png client/build/
    print_status "✅ Space background copied to build directory"
else
    print_warning "⚠️  Space background not found"
fi

# Create .nojekyll file for GitHub Pages compatibility
touch client/build/.nojekyll

# Set proper permissions
chmod -R 755 client/build

# Build summary
print_status "🎉 Build completed successfully!"
print_info "Build directory: client/build"
print_info "Build size: $(du -sh client/build | cut -f1)"

# List build contents
print_status "Build contents:"
ls -la client/build/

echo ""
print_status "🚀 Your app is ready for Netlify deployment!"
print_info "Publish directory: client/build"
print_info "Functions directory: netlify/functions" 