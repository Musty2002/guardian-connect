# App Icons & Splash Screen Setup

Your app icons and splash screen have been configured with:
- **Icon**: Your SafeGuard Nigeria logo
- **Splash Screen**: White background with logo and subtitle "Protecting Every Family, Every Child, Every Street"

## Automatic Generation

After you've added iOS and Android platforms, generate all required icon and splash screen sizes:

```bash
# After running: npx cap add ios && npx cap add android
npm run build
npx capacitor-assets generate
```

This will automatically generate:
- **iOS**: All required icon sizes and splash screens in `ios/App/App/Assets.xcassets`
- **Android**: All required icon sizes and splash screens in `android/app/src/main/res`

## Manual Setup (if needed)

If you need to manually place icons:

### iOS
Place icons in: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
Place splash in: `ios/App/App/Assets.xcassets/Splash.imageset/`

### Android
Place icons in: `android/app/src/main/res/mipmap-*/`
Place splash in: `android/app/src/main/res/drawable*/`

## Current Configuration

Your `capacitor.config.ts` is configured with:
- White background (#FFFFFF)
- 3-second display duration
- No loading spinner
- Source files in `/resources` folder

## Source Files

- `resources/icon.png` - Your app icon (512x512 recommended)
- `resources/splash.png` - Your splash screen (1920x1080)
