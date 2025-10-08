export default {
  expo: {
    name: 'Mood Tracker',
    slug: 'mood-tracker',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#6366F1'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.moodtracker'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#6366F1'
      },
      package: 'com.yourcompany.moodtracker',
      permissions: [
        'android.permission.INTERNET',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE'
      ]
    },
    web: {
      favicon: './assets/favicon.png'
    },
    notification: {
      icon: './assets/icon.png',
      color: '#6366F1',
      androidMode: 'default',
      androidCollapsedTitle: 'Rappels MOOD',
    },
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/icon.png',
          color: '#6366F1',
          sounds: ['./public/digital_alarm_clock_151920.wav'],
        }
      ]
    ]
  }
};
