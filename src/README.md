# 90-Day Challenge iOS App

Transform your life with 9 daily actions over 90 days. This native iOS app helps you track your progress and build lasting habits.

## Features

- 🎯 **9 Daily Activities**: Calories, workout, supplements, sleep, habits, LOI, gratitude, connections, posts
- 📊 **Progress Tracking**: Daily completion, streaks, and achievement levels
- 📱 **Native iOS**: Built with Capacitor for optimal performance
- 💾 **Local Storage**: All data stored locally on device
- 🎨 **Beautiful UI**: Clean, modern interface following iOS design guidelines

## Development Setup

### Prerequisites
- Node.js 16+
- Xcode 14+ (for iOS development)
- iOS Simulator or physical iOS device

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add iOS platform:**
   ```bash
   npm run cap:add:ios
   ```

3. **Build and sync:**
   ```bash
   npm run ios:dev
   ```

### Development Scripts

- `npm run build` - Build the React app
- `npm run cap:sync` - Sync web assets with native platforms
- `npm run cap:open:ios` - Open project in Xcode
- `npm run ios:dev` - Build, sync, and open in Xcode
- `npm run ios:build` - Build for production

## App Store Submission

### 1. App Configuration
- Update `capacitor.config.ts` with your app details
- Set bundle identifier in `ios/App/App.xcodeproj`
- Configure app icons and splash screens

### 2. Required Assets
- App icons (all sizes required by Apple)
- Launch screens for all device sizes
- App Store screenshots
- App metadata and description

### 3. Apple Developer Requirements
- Apple Developer Account ($99/year)
- Code signing certificates
- Provisioning profiles
- App Store Connect configuration

### 4. Build for Release
```bash
# 1. Build the web app
npm run build

# 2. Sync with iOS
npm run cap:sync

# 3. Open in Xcode
npm run cap:open:ios

# 4. In Xcode:
# - Select "Any iOS Device" or your connected device
# - Choose Product > Archive
# - Upload to App Store Connect
```

## App Store Guidelines Compliance

### ✅ This app meets Apple's requirements:
- **Native iOS Experience**: Built with Capacitor
- **No External Dependencies**: All functionality is self-contained
- **Local Data Storage**: No external servers required
- **iOS Design Guidelines**: Follows Human Interface Guidelines
- **Performance**: Optimized for iOS devices
- **Privacy**: No data collection or tracking

### App Categories
- **Primary**: Health & Fitness
- **Secondary**: Productivity

### Privacy
- No data collection
- No analytics tracking
- All data stored locally
- No network requests required

## Technical Details

- **Framework**: React 18 + TypeScript
- **Native Bridge**: Capacitor 5
- **UI Library**: Custom components with Tailwind CSS
- **State Management**: React hooks + localStorage
- **Target iOS**: iOS 13.0+
- **Supported Devices**: iPhone, iPad

## License

MIT License - see LICENSE file for details.