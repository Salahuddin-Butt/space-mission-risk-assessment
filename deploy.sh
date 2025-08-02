#!/bin/bash

# Mission Risk Assessment Deployment Script
echo "🚀 Starting Mission Risk Assessment Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Install dependencies
print_status "Installing dependencies..."
npm install
cd client && npm install && cd ..

# Build the application
print_status "Building the application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    print_status "Build completed successfully!"
else
    print_error "Build failed!"
    exit 1
fi

# Create production environment file
print_status "Creating production environment..."
cat > .env.production << EOF
NODE_ENV=production
PORT=5000
EOF

print_status "Deployment files created successfully!"
print_status "Your app is ready for deployment!"

echo ""
echo "📋 Deployment Options:"
echo "1. Netlify: Push to GitHub and connect to Netlify"
echo "2. Vercel: Push to GitHub and connect to Vercel"
echo "3. Docker: Run 'docker-compose up -d'"
echo "4. Manual: Run 'npm start' on your server"
echo ""
echo "🔧 Next Steps:"
echo "- Commit and push your code to GitHub"
echo "- Connect your repository to your preferred hosting platform"
echo "- Set up environment variables if needed"
echo "- Deploy!" 