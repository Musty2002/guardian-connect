# Native Capacitor Plugins Guide

This app uses several native Capacitor plugins to provide advanced mobile features. Here's a comprehensive guide:

## 🔌 Installed Native Plugins

### 1. **@capacitor/geolocation** (Location Services)
**Used for:**
- Emergency location tracking
- Geofencing (Safe Zones)
- Device tracking when marked as stolen
- Real-time position updates

**Key Features:**
```typescript
import { useNativeGeolocation } from '@/hooks/useNativeGeolocation';

const { getCurrentPosition, watchPosition } = useNativeGeolocation();
const position = await getCurrentPosition();
```

### 2. **@capacitor/camera** (Camera Access)
**Used for:**
- Emergency photo capture
- Intruder detection photos
- Evidence documentation

**Key Features:**
```typescript
import { useNativeCamera } from '@/hooks/useNativeCamera';

const { takePicture, isCapturing } = useNativeCamera();
const photo = await takePicture();
```

### 3. **@capacitor/haptics** (Vibration Feedback)
**Used for:**
- Emergency gesture feedback
- Shake detection confirmation
- UI interaction feedback

**Key Features:**
```typescript
import { useNativeHaptics } from '@/hooks/useNativeHaptics';

const { impact, notification } = useNativeHaptics();
await impact(ImpactStyle.Heavy);
await notification(NotificationType.Success);
```

### 4. **@capacitor/device** (Device Information)
**Used for:**
- Device ID retrieval
- Battery level monitoring
- Device info display

**Key Features:**
```typescript
import { useNativeDevice } from '@/hooks/useNativeDevice';

const { deviceInfo, batteryLevel, getDeviceId } = useNativeDevice();
```

### 5. **@capacitor/network** (Network Status)
**Used for:**
- Online/offline detection
- Connection type monitoring (WiFi, Cellular, None)
- Mesh network fallback triggering

**Key Features:**
```typescript
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const { isOnline, connectionType, getCurrentStatus } = useNetworkStatus();
```

### 6. **@capacitor/local-notifications** (Background Notifications)
**Used for:**
- Emergency alerts even when app is closed
- Geofence entry/exit notifications
- Screen time limit alerts

**Key Features:**
```typescript
import { useNativeLocalNotifications } from '@/hooks/useNativeLocalNotifications';

const { scheduleEmergencyNotification, requestPermissions } = useNativeLocalNotifications();
await scheduleEmergencyNotification("Emergency Alert", "Your alert is active");
```

### 7. **@capacitor/push-notifications** (Remote Notifications)
**Used for:**
- Family connection alerts
- Remote emergency notifications
- Parental control updates

**Key Features:**
```typescript
import { useNativePushNotifications } from '@/hooks/useNativePushNotifications';

const { register, addListener } = useNativePushNotifications();
```

### 8. **@capacitor/app** (App Lifecycle)
**Used for:**
- App state monitoring
- Background/foreground detection
- URL handling

### 9. **@capacitor/status-bar** (UI Customization)
**Used for:**
- Status bar styling
- Immersive mode support

### 10. **@capacitor-community/bluetooth-le** (Bluetooth Low Energy)
**Used for:**
- Mesh network peer-to-peer communication
- Offline emergency broadcasting
- Device discovery

**Key Features:**
```typescript
import { useNativeMeshNetwork } from '@/hooks/useNativeMeshNetwork';

const { startScanning, broadcastEmergency, nearbyPeers } = useNativeMeshNetwork();
```

## 📱 Required Android Permissions

Add these to `android/app/src/main/AndroidManifest.xml`:

```xml
<!-- Location (Emergency, Tracking, Geofencing) -->
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />

<!-- Camera (Emergency Photos, Intruder Detection) -->
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<!-- Bluetooth (Mesh Network) -->
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />

<!-- Network -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

<!-- Notifications -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Vibration -->
<uses-permission android:name="android.permission.VIBRATE" />

<!-- Features -->
<uses-feature android:name="android.hardware.bluetooth_le" android:required="true" />
<uses-feature android:name="android.hardware.camera" android:required="false" />
<uses-feature android:name="android.hardware.location.gps" android:required="false" />
```

## 🍎 iOS Info.plist Permissions

Add these to `ios/App/App/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to provide emergency services and tracking</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need background location access for geofencing and emergency alerts</string>

<key>NSCameraUsageDescription</key>
<string>We need camera access to capture emergency photos</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save emergency photos</string>

<key>NSBluetoothAlwaysUsageDescription</key>
<string>We need Bluetooth access for offline mesh network communication</string>

<key>NSLocalNetworkUsageDescription</key>
<string>We need local network access for mesh network communication</string>
```

## 🏗️ Feature Implementation Map

### Emergency Alert System (Pages: Emergency)
**Plugins Used:**
- ✅ Geolocation (location tracking)
- ✅ Camera (photo capture)
- ✅ Haptics (gesture feedback)
- ✅ Local Notifications (alerts when app closed)
- ✅ Network (online/offline status)
- ✅ Bluetooth LE (mesh broadcasting)

### Device Security (Pages: DeviceSecurity)
**Plugins Used:**
- ✅ Geolocation (tracking stolen devices)
- ✅ Camera (intruder photos)
- ✅ Device (device info)
- ✅ Network (connectivity status)

### Safe Zones/Geofencing (Pages: SafeZones)
**Plugins Used:**
- ✅ Geolocation (boundary detection)
- ✅ Local Notifications (entry/exit alerts)
- ✅ Push Notifications (parent alerts)

### Family Tracking (Pages: Family, ParentDashboard)
**Plugins Used:**
- ✅ Geolocation (location sharing)
- ✅ Push Notifications (family alerts)
- ✅ Network (connectivity monitoring)

### Parental Controls (Pages: ChildControls, ParentDashboard)
**Plugins Used:**
- ✅ Local Notifications (screen time alerts)
- ✅ Device (device info)

## 🚀 Testing Native Features

### 1. Build and Sync
```bash
npm run build
npx cap sync
```

### 2. Open in Native IDE
```bash
# Android
npx cap open android

# iOS
npx cap open ios
```

### 3. Test on Device/Emulator
- Connect physical device or start emulator
- Click "Run" in Android Studio or Xcode
- Grant permissions when prompted

### 4. Test Individual Features

**Location Services:**
- Enable location in device settings
- Test emergency alert → should capture location
- Test safe zones → should detect entry/exit

**Camera:**
- Test emergency photo capture
- Test intruder detection

**Notifications:**
- Grant notification permission
- Test emergency notification (works when app closed)
- Test geofence notifications

**Bluetooth Mesh:**
- Have 2+ devices nearby
- Activate emergency on one device
- Check if other devices receive broadcast

**Network Status:**
- Toggle airplane mode
- App should show offline status
- Mesh network should activate

**Haptics:**
- Shake device 3 times quickly
- Should feel vibration and see emergency dialog

## 🐛 Troubleshooting

### Permissions Not Working
1. Check AndroidManifest.xml / Info.plist
2. Manually grant permissions in device settings
3. For background location (Android 11+), select "Allow all the time"
4. Restart app after granting permissions

### Bluetooth Not Connecting
1. Enable Bluetooth in device settings
2. Grant location permission (required for BLE on Android)
3. Check if BLE hardware is available
4. Test on physical device (emulator BLE is limited)

### Notifications Not Showing
1. Grant notification permission
2. Check device notification settings
3. Ensure app is not in battery optimization
4. Test on physical device

### Location Not Working
1. Enable location services
2. Grant precise location permission
3. For background tracking, grant "Always" permission
4. Test outdoors for better GPS signal

## 📊 Plugin Comparison: Native vs Web

| Feature | Native Plugin | Web API | Notes |
|---------|---------------|---------|-------|
| Location | ✅ Background tracking | ⚠️ Foreground only | Native required for geofencing |
| Camera | ✅ Full access | ⚠️ Limited | Native provides better quality |
| Notifications | ✅ Works when closed | ❌ Requires app open | Native essential for alerts |
| Bluetooth | ✅ BLE support | ❌ Not available | Native only |
| Haptics | ✅ Full patterns | ⚠️ Basic only | Native provides better feedback |
| Network | ✅ Detailed status | ⚠️ Basic only | Native gives connection type |
| Device Info | ✅ Full details | ⚠️ Limited | Native provides battery, etc. |

## 🎯 Key Takeaways

1. **Native plugins are essential** for core safety features (location, notifications)
2. **Always request permissions** at appropriate times (not all at app start)
3. **Test on physical devices** for accurate results (especially BLE, GPS)
4. **Provide fallbacks** for web/PWA versions where possible
5. **Monitor battery usage** when using background features

## 📚 Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Native Mesh Network Setup](./NATIVE_MESH_SETUP.md)
- [Android Setup Guide](./ANDROID_SETUP.md)
- [Geofencing Guide](./README_GEOFENCING.md)
