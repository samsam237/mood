import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com',
      webClientId: '300243750008-oba368e0050b8h1e89e3la0crlrlase3.apps.googleusercontent.com',
      iosClientId: '300243750008-2tvafeivrod3t7qbblpuskefrrd70l5p.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
  appId: 'com.mood.health',
  appName: 'MOOD',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
