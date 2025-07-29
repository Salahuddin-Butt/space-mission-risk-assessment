#!/bin/bash

echo "🚀 Space Mission Risk Assessment - Deployment Script"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run 'git init' first."
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Check if gh-pages is installed
if ! command -v gh-pages &> /dev/null; then
    echo "📦 Installing gh-pages..."
    npm install -g gh-pages
fi

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
gh-pages -d client/build

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌍 Your app should be available at: https://salahuddin.github.io/space-mission-risk-assessment"
    echo "⏰ It may take a few minutes to become available."
else
    echo "❌ Deployment failed!"
    echo "💡 Make sure you have:"
    echo "   1. Created a GitHub repository named 'space-mission-risk-assessment'"
    echo "   2. Pushed your code to GitHub"
    echo "   3. Have proper permissions"
fi 