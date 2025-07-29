#!/bin/bash

echo "🚀 Preparing Space Mission Risk Assessment for Netlify Deployment"
echo "================================================================"

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"

# Create a zip file for Netlify
echo "📁 Creating deployment package..."
cd client/build
zip -r ../../netlify-deploy.zip .
cd ../..

echo "✅ Deployment package created: netlify-deploy.zip"
echo ""
echo "🌐 To deploy to Netlify:"
echo "1. Go to https://app.netlify.com/"
echo "2. Sign up/Login to your account"
echo "3. Drag and drop the 'netlify-deploy.zip' file onto the deployment area"
echo "4. Your site will be deployed automatically!"
echo ""
echo "📋 Alternative method:"
echo "1. Go to https://app.netlify.com/"
echo "2. Click 'New site from Git'"
echo "3. Connect your GitHub account"
echo "4. Select this repository: https://github.com/Salahuddin-Butt/space-mission-risk-assessment"
echo "5. Set build command: npm run build"
echo "6. Set publish directory: client/build"
echo "7. Click 'Deploy site'"
echo ""
echo "🎯 Your app will be available at: https://your-site-name.netlify.app" 