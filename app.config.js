export default {
  expo: {
    name: 'MOOD',
    slug: 'mood',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/logomood.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/logomood.png',
      resizeMode: 'contain',
      backgroundColor: '#6366F1',
      hideExponentText: true
    },
    extra: {
      eas: {
        projectId: "457b09f7-4e95-4831-a99f-2273d5227dac"
      }
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
        foregroundImage: './assets/logomood.png',
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
      icon: './assets/logomood.png',
      color: '#6366F1',
      androidMode: 'default',
      androidCollapsedTitle: 'Rappels MOOD',
    },
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/logomood.png',
          color: '#6366F1',
          sounds: ['./public/digital_alarm_clock_151920.wav'],
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: "com.googleusercontent.apps.300243750008-2tvafeivrod3t7qbblpuskefrrd70l5p"
        }
      ]
    ]
  }
};
