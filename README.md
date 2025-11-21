# Family Safety & Parental Control Platform

A comprehensive family safety and parental control application designed to help parents monitor and protect their children in the digital age. This platform combines real-time location tracking, device security, threat detection, and intelligent parental controls into a single, user-friendly solution.

## Features

### 🔐 Parental Controls
- **Screen Time Management**: Set daily limits and track device usage in real-time
- **App Blocking**: Control which applications children can access
- **Smart Scheduling**: Configure school mode and bedtime restrictions
- **Usage Analytics**: Monitor app usage patterns and screen time statistics
- **Real-time Alerts**: Get notified when limits are exceeded or violations occur

### 📍 Location & Geofencing
- **Real-time Location Tracking**: Monitor your children's whereabouts with GPS precision
- **Safe Zones**: Define geographical boundaries (home, school, etc.)
- **Smart Alerts**: Receive instant notifications when children enter or exit safe zones
- **Location History**: Access historical location data for safety audits
- **Map Visualization**: View locations and safe zones on an interactive map

### 🚨 Emergency Features
- **Emergency Button**: Quick-access panic button for immediate assistance
- **Gesture Detection**: Emergency activation through power button gestures
- **Automatic Alerts**: Instant notifications to emergency contacts
- **Threat Detection**: AI-powered analysis of potential dangers based on location
- **Danger Zone Mapping**: Community-reported unsafe areas

### 🔒 Device Security
- **Theft Protection**: Mark devices as stolen with remote tracking
- **Intensive Tracking Mode**: Enhanced location monitoring for lost devices
- **Security Event Logging**: Comprehensive audit trail of security events
- **Remote Recovery**: Tools to assist in device recovery
- **Data Export**: Export user data for backup and compliance

### 👨‍👩‍👧‍👦 Family Management
- **Multi-child Support**: Manage multiple children from a single parent account
- **Connection Codes**: Secure family linking system
- **Role-based Access**: Separate parent and child interfaces
- **Privacy Controls**: Granular privacy settings for each family member
- **Profile Management**: Update personal information, emergency contacts, and avatars

### 📱 Native Mobile Features
- **Cross-platform**: Works on iOS and Android via Capacitor
- **Push Notifications**: Real-time alerts and updates
- **Camera Integration**: Profile photo capture and upload
- **Haptic Feedback**: Enhanced user experience with tactile responses
- **Offline Support**: Core features work without internet connectivity
- **Mesh Networking**: Peer-to-peer communication in network-limited scenarios

## Technology Stack

### Frontend
- **React 18**: Modern UI library with hooks and concurrent features
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Beautiful, accessible component library
- **React Router**: Client-side routing and navigation
- **TanStack Query**: Powerful data fetching and caching
- **React Hook Form**: Performant form validation
- **Zod**: TypeScript-first schema validation

### Mobile
- **Capacitor**: Native mobile app framework
- **Capacitor Plugins**:
  - Camera, Geolocation, Haptics
  - Push Notifications, Local Notifications
  - Device Info, Network Status
  - Bluetooth LE for mesh networking

### Backend & Database
- Real-time database with PostgreSQL
- RESTful API and serverless functions
- Row-level security for data protection
- Real-time subscriptions for live updates
- File storage for avatars and media

### Maps & Visualization
- **Leaflet**: Interactive mapping library
- **Recharts**: Data visualization and analytics charts

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Configure your environment variables in .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

### Mobile Development

#### Android
```bash
npm run build
npx cap sync android
npx cap open android
```

#### iOS
```bash
npm run build
npx cap sync ios
npx cap open ios
```

Refer to `CAPACITOR_BUILD_GUIDE.md` for detailed mobile build instructions.

## Project Structure

```
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base shadcn components
│   │   └── ...          # Feature-specific components
│   ├── pages/           # Route-level page components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions and helpers
│   ├── integrations/    # External service integrations
│   └── lib/             # Shared libraries and configurations
├── supabase/
│   ├── functions/       # Edge functions for backend logic
│   └── config.toml      # Backend configuration
├── public/              # Static assets
└── resources/           # App icons and splash screens
```

## Key Features Documentation

### Parental Controls
The parental control system allows parents to:
- Set screen time limits per child
- Block specific applications
- Configure time-based restrictions (school mode, bedtime)
- Monitor app usage in real-time

See `README_PARENTAL_CONTROLS.md` for detailed implementation.

### Geofencing
Create safe zones around important locations and receive alerts when children:
- Enter a designated safe zone
- Exit a safe zone
- Move to unexpected locations

See `README_GEOFENCING.md` for detailed implementation.

### Emergency System
Multi-layered emergency response system featuring:
- One-tap emergency button
- Power button gesture activation
- Automatic location sharing
- Emergency contact notifications

### Device Security
Comprehensive device protection including:
- Theft reporting and tracking
- Intensive location monitoring
- Security event logging
- Data backup and export

## Security & Privacy

This application takes security and privacy seriously:

- **End-to-End Encryption**: Sensitive data is encrypted in transit and at rest
- **Row-Level Security**: Database policies ensure users can only access their own data
- **Authentication**: Secure user authentication with password hashing
- **Authorization**: Role-based access control for parents and children
- **Data Privacy**: Compliance with data protection regulations
- **Audit Logging**: Comprehensive security event tracking

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

The application can be deployed to various platforms:

- **Web**: Deploy to Vercel, Netlify, or any static hosting service
- **Mobile**: Publish to Google Play Store and Apple App Store
- **Backend**: Serverless edge functions deploy automatically

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:
- Open an issue in the GitHub repository
- Check existing documentation in the `/docs` folder
- Review the troubleshooting guides

## Acknowledgments

- Built with React, TypeScript, and modern web technologies
- UI components powered by shadcn/ui
- Mobile capabilities via Capacitor
- Maps provided by Leaflet and OpenStreetMap

## Roadmap

### Planned Features
- [ ] Advanced content filtering
- [ ] Social media monitoring
- [ ] Screen recording capabilities
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with school systems
- [ ] Web filtering and safe browsing
- [ ] Time-based app access rules
- [ ] Family communication features
- [ ] Activity reports and insights

---

**Note**: This is a family safety application designed to promote responsible device usage and child safety. Always respect privacy laws and regulations in your jurisdiction when using monitoring features.
