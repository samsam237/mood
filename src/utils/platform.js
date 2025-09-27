import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Composants conditionnels
export const LinearGradient = isWeb 
  ? require('../components/web/WebLinearGradient').default
  : require('expo-linear-gradient').default;

export const PDFViewer = isWeb
  ? require('../components/web/WebPDFViewer').default
  : require('react-native-pdf').default;

// Écrans conditionnels
export const AuthScreen = isWeb
  ? require('../screens/AuthScreen.web').default
  : require('../screens/AuthScreen').default;

export const HomeScreen = isWeb
  ? require('../screens/HomeScreen.web').default
  : require('../screens/HomeScreen').default;

export const MoodEntryScreen = isWeb
  ? require('../screens/MoodEntryScreen.web').default
  : require('../screens/MoodEntryScreen').default;

export const AnalyticsScreen = isWeb
  ? require('../screens/AnalyticsScreen.web').default
  : require('../screens/AnalyticsScreen').default;

export const ProfileScreen = isWeb
  ? require('../screens/ProfileScreen.web').default
  : require('../screens/ProfileScreen').default;

export const PDFViewerScreen = isWeb
  ? require('../screens/PDFViewerScreen.web').default
  : require('../screens/PDFViewerScreen').default;
