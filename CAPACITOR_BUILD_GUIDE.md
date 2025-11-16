# 📱 SafeGuard Nigeria - Native Mobile App Build Guide

This guide will walk you through building and running your SafeGuard Nigeria app as a native mobile application for iOS and Android using Capacitor.

## 🚀 Quick Start

### Prerequisites

#### For Android:
- **Android Studio** (latest version)
- **Java Development Kit (JDK)** 11 or higher
- **Android SDK** (installed via Android Studio)

#### For iOS (Mac only):
- **macOS** (required for iOS development)
- **Xcode** (latest version from Mac App Store)
- **CocoaPods** (install via: `sudo gem install cocoapods`)

### Step 1: Export Project to GitHub

1. Click the **"Export to GitHub"** button in Lovable
2. Connect your GitHub account if not already connected
3. Create a new repository or select an existing one
4. Wait for the export to complete

### Step 2: Clone Your Project

```bash
# Clone your repository
git clone <your-github-repo-url>
cd safeguard-nigeria

# Install dependencies
npm install
```

### Step 3: Build the Web App

```bash
# Build the production web app
npm run build
```

This creates an optimized build in the `dist` folder that Capacitor will use.

### Step 4: Add Native Platforms

#### Add Android:
```bash
npx cap add android
```

#### Add iOS (Mac only):
```bash
npx cap add ios
```

### Step 5: Sync Capacitor

This copies the web build and updates native dependencies:

```bash
# For Android
npx cap sync android

# For iOS
npx cap sync ios

# Or sync both
npx cap sync
```

### Step 6: Configure App Icons and Splash Screens

Generate all required icon and splash screen sizes:

```bash
npx @capacitor/assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#ffffff' --splashBackgroundColor '#ffffff' --splashBackgroundColorDark '#ffffff'
```

This uses the `resources/icon.png` and `resources/splash.png` files to generate all required sizes.

## 📱 Running on Android

### Option 1: Using Android Emulator

1. **Open Android Studio:**
   ```bash
   npx cap open android
   ```

2. **In Android Studio:**
   - Wait for Gradle sync to complete
   - Click the **"Run"** button (green play icon) in the toolbar
   - Select an emulator or connected device
   - Wait for the app to build and launch

### Option 2: Using Physical Device

1. **Enable Developer Options on your Android device:**
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings > Developer Options
   - Enable "USB Debugging"

2. **Connect your device via USB**

3. **Run the app:**
   ```bash
   npx cap run android
   ```

4. **Or open in Android Studio:**
   ```bash
   npx cap open android
   ```
   Then click Run and select your device

### Quick Android Commands:

```bash
# Run directly on connected device
npx cap run android

# Run on specific device
npx cap run android --target=<device-id>

# List available devices
adb devices
```

## 🍎 Running on iOS (Mac Only)

### Option 1: Using iOS Simulator

1. **Open Xcode:**
   ```bash
   npx cap open ios
   ```

2. **In Xcode:**
   - Select a simulator (e.g., iPhone 15 Pro)
   - Click the **"Run"** button (▶️) or press `Cmd + R`
   - Wait for the app to build and launch in the simulator

### Option 2: Using Physical Device

1. **Connect your iPhone/iPad via USB**

2. **In Xcode:**
   - Connect your device
   - Select your device from the device menu
   - You may need to sign the app with your Apple ID:
     - Go to Signing & Capabilities tab
     - Select your Team (your Apple ID)
   - Click Run

3. **Trust the Developer Certificate on your device:**
   - Go to Settings > General > VPN & Device Management
   - Trust your developer certificate

### Quick iOS Commands:

```bash
# Run on simulator
npx cap run ios

# Open in Xcode
npx cap open ios
```

## 🔄 Development Workflow

### Making Changes

When you make changes to your code:

1. **Option A: Live Reload (Recommended for Development)**
   
   Your `capacitor.config.ts` is already configured for hot reload:
   ```typescript
   server: {
     url: 'https://28732353-1c05-46f7-b52f-d55fd1f81951.lovableproject.com?forceHideBadge=true',
     cleartext: true
   }
   ```
   
   This means the app will load from your Lovable preview URL and update in real-time!

2. **Option B: Local Build (For Production Testing)**
   ```bash
   # After making changes in code
   npm run build
   npx cap sync
   
   # Then run the app
   npx cap run android
   # or
   npx cap run ios
   ```

### When to Run `npx cap sync`

Run this command whenever you:
- Change native dependencies
- Update Capacitor configuration
- Rebuild the web app for production
- Add/remove Capacitor plugins

```bash
# Sync all platforms
npx cap sync

# Sync specific platform
npx cap sync android
npx cap sync ios
```

## 🔧 Native Feature Configuration

### Camera Permissions

The app already includes camera permissions. These are configured in:

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
```

**iOS** (`ios/App/App/Info.plist`):
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture emergency photos</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save emergency photos</string>
```

### Location Permissions

**Android** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

**iOS** (`ios/App/App/Info.plist`):
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to provide emergency services and safety features</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to provide emergency services and safety features</string>
```

### Push Notifications

**Android** - Already configured via `google-services.json` (you'll need to add this)

**iOS** - Requires:
1. Apple Developer account
2. Push notification certificate
3. Configuration in Xcode

## 📦 Building for Production

### Android APK/AAB

1. **Open Android Studio:**
   ```bash
   npx cap open android
   ```

2. **Build signed APK/Bundle:**
   - Go to Build > Generate Signed Bundle/APK
   - Follow the wizard to create or use a keystore
   - Select "release" build variant
   - Generated files will be in `android/app/build/outputs/`

### iOS IPA

1. **Open Xcode:**
   ```bash
   npx cap open ios
   ```

2. **Archive the app:**
   - Select "Any iOS Device (arm64)" as target
   - Go to Product > Archive
   - Once archived, click "Distribute App"
   - Follow Apple's distribution process

## 🐛 Troubleshooting

### Android Issues

**Gradle sync failed:**
```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

**App not updating:**
```bash
npm run build
npx cap sync android
```

### iOS Issues

**Pods not installed:**
```bash
cd ios/App
pod install
cd ../..
npx cap sync ios
```

**Signing issues:**
- Make sure you're logged into Xcode with your Apple ID
- Select your team in Signing & Capabilities
- You may need to change the bundle identifier to be unique

### General Issues

**Clear everything and start fresh:**
```bash
# Remove platforms
rm -rf android ios

# Rebuild web app
npm run build

# Re-add platforms
npx cap add android
npx cap add ios

# Sync
npx cap sync
```

## 📚 Useful Commands Reference

```bash
# Install dependencies
npm install

# Build web app
npm run build

# Add platforms
npx cap add android
npx cap add ios

# Sync (copy web build + update native)
npx cap sync

# Open in IDE
npx cap open android
npx cap open ios

# Run directly
npx cap run android
npx cap run ios

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest

# List available Capacitor plugins
npm search @capacitor

# Check Capacitor doctor
npx cap doctor
```

## 🎯 Next Steps

1. **Test all features** on real devices
2. **Configure push notifications** with Firebase (Android) and APNS (iOS)
3. **Set up app signing** for production releases
4. **Submit to app stores:**
   - Google Play Console for Android
   - App Store Connect for iOS

## 📖 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com)
- [iOS Developer Guide](https://developer.apple.com)
- [Capacitor Community Plugins](https://github.com/capacitor-community)

## 💡 Pro Tips

1. **Use Live Reload during development** - It's already configured!
2. **Test on real devices** - Emulators don't always match real behavior
3. **Check permissions** - Make sure all native features request proper permissions
4. **Monitor console** - Use Chrome DevTools for Android, Safari for iOS
5. **Keep Capacitor updated** - Regular updates improve performance and add features

---

**Need Help?** Check the Capacitor Discord or GitHub issues for community support!
