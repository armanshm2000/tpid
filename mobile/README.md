# TPID Mobile App

React Native mobile companion for the Titan Project Intelligence Dashboard.

## Setup

```bash
# Create React Native project
npx react-native init TPIDMobile
cd TPIDMobile

# Install dependencies
npm install @react-navigation/native @react-navigation/stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
```

## Structure

```
mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ProjectsScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── components/
│   │   ├── ProjectCard.tsx
│   │   ├── HealthBadge.tsx
│   │   └── StatCard.tsx
│   ├── services/
│   │   └── api.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── theme/
│       └── colors.ts
├── App.tsx
└── package.json
```

## API Base URL

Set `API_URL` environment variable or configure in `src/services/api.ts`:

```typescript
export const API_BASE = process.env.API_URL || "http://localhost:4000";
```

## Features

- View dashboard stats
- Browse projects with health scores
- View evidence and reports
- Push notifications (via FCM/APNs)
- Dark mode support
- Offline data caching
