#!/bin/bash

# 90-Day Challenge - iOS Build Script
# This script prepares the app for App Store submission

echo "🚀 Building 90-Day Challenge for iOS App Store..."

# Step 1: Clean previous builds
echo "📝 Cleaning previous builds..."
rm -rf build/
rm -rf ios/App/App/public/

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 3: Build React app
echo "⚛️ Building React app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ React build failed!"
    exit 1
fi

# Step 4: Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync ios

if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed!"
    exit 1
fi

# Step 5: Open in Xcode
echo "📱 Opening in Xcode..."
echo ""
echo "✅ Build preparation complete!"
echo ""
echo "Next steps in Xcode:"
echo "1. Select 'Any iOS Device (arm64)'"
echo "2. Product → Archive"
echo "3. Validate App"
echo "4. Distribute App → App Store Connect"
echo ""

npx cap open ios