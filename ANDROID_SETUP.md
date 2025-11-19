# Android Native Setup Guide

## ✅ Native Capacitor Plugins Used

Your app uses these **native** Capacitor plugins (not web APIs):

1. **@capacitor/geolocation** - For emergency location, tracking, geofencing
2. **@capacitor/camera** - For intruder detection photos
3. **@capacitor/haptics** - For emergency gesture feedback
4. **@capacitor/device** - For device info and battery status
5. **@capacitor/network** - For connectivity status
6. **@capacitor/app** - For app lifecycle management
7. **@capacitor/status-bar** - For UI customization

## 🎯 3 Demo-Ready Features for Hackathon

### 1. Emergency Alert System (Emergency Page)
- ✅ Native geolocation tracking
- ✅ Native haptics (shake to activate)
- ✅ Native camera for evidence
- ✅ Offline-capable alert storage

### 2. Device Security & Intruder Detection (Device Security Page)
- ✅ Native location tracking when marked stolen
- ✅ Native camera for intruder photos
- ✅ Real-time tracking updates
- ✅ Export user data capability

### 3. Safe Zones / Geofencing (Safe Zones Page)
- ✅ Native geolocation for boundaries
- ✅ Real-time entry/exit detection
- ✅ Background location tracking
- ✅ Push notifications for zone events

## 📱 Required Android Permissions

Add these to your `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Location Permissions -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

<!-- Camera Permissions -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- Network & Device -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.VIBRATE" />

<!-- Push Notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

## 🚀 Building for Android Studio

1. **Build the web app:**
   ```bash
   npm run build
   ```

2. **Sync Capacitor:**
   ```bash
   npx cap sync android
   ```

3. **Open in Android Studio:**
   ```bash
   npx cap open android
   ```

4. **Test on Device/Emulator:**
   - Click "Run" in Android Studio
   - All native features will work!

## 🎬 Demo Script

### Feature 1: Emergency Alert
1. Shake the phone → Emergency dialog appears (native haptics)
2. Confirm emergency → Gets real location (native GPS)
3. Takes photo automatically (native camera)
4. Stores alert in database

### Feature 2: Device Security
1. Mark device as stolen
2. Background tracking activates (native location)
3. Shows real-time location updates
4. Take intruder photo (native camera)

### Feature 3: Safe Zones
1. Create safe zone at current location (native GPS)
2. Walk outside the radius
3. Receive alert when exiting zone
4. See real-time status updates

## ⚠️ Note on Mesh Network

The mesh network feature uses `BroadcastChannel` API which only works:
- ✅ Between browser tabs (web version)
- ✅ In demo/simulation mode (shows simulated peers)
- ❌ NOT between separate Android devices

For the hackathon, focus on the **3 working native features** above!

## 🔧 Troubleshooting

If features don't work:
1. Check permissions in Android Settings > Apps > SafeGuard Nigeria
2. Enable Location, Camera, Storage manually
3. For background location, select "Allow all the time"
4. Restart the app after granting permissions
