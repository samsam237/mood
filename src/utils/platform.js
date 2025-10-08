import { Platform } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Enhanced component loading with error handling
const loadComponent = (webPath, nativePath) => {
  try {
    if (isWeb) {
      return require(webPath).default;
    } else {
      return require(nativePath).default;
    }
  } catch (error) {
    console.warn(`Failed to load component, falling back to native version:`, error);
    try {
      return require(nativePath).default;
    } catch (fallbackError) {
      console.error('Failed to load fallback component:', fallbackError);
      // Return a minimal fallback component
      return () => {
        const React = require('react');
        const { View, Text } = require('react-native');
        return React.createElement(View, { 
          style: { flex: 1, justifyContent: 'center', alignItems: 'center' } 
        }, React.createElement(Text, null, 'Component Loading Error'));
      };
    }
  }
};

// Screen exports with error handling
export const AuthScreen = loadComponent('../screens/AuthScreen.web', '../screens/AuthScreen');
export const HomeScreen = loadComponent('../screens/HomeScreen.web', '../screens/HomeScreen');
export const MoodEntryScreen = loadComponent('../screens/MoodEntryScreen.web', '../screens/MoodEntryScreen');
export const AnalyticsScreen = loadComponent('../screens/AnalyticsScreen.web', '../screens/AnalyticsScreen');
export const ProfileScreen = loadComponent('../screens/ProfileScreen.web', '../screens/ProfileScreen');
export const PDFViewerScreen = loadComponent('../screens/PDFViewerScreen.web', '../screens/PDFViewerScreen');

// Component exports with error handling
export const LinearGradient = isWeb 
  ? loadComponent('../components/web/WebLinearGradient', '../components/web/WebLinearGradient')
  : (() => {
      try {
        return require('expo-linear-gradient').LinearGradient;
      } catch (error) {
        // Fallback for missing expo-linear-gradient
        const React = require('react');
        const { View } = require('react-native');
        return ({ colors, style, children, ...props }) => {
          return React.createElement(View, { 
            style: [{ backgroundColor: colors[0] }, style], 
            ...props 
          }, children);
        };
      }
    })();

export const PDFViewer = isWeb
  ? loadComponent('../components/web/WebPDFViewer', '../components/web/WebPDFViewer')
  : (() => {
      try {
        return require('react-native-pdf').default;
      } catch (error) {
        // Fallback for missing react-native-pdf
        const React = require('react');
        const { View, Text } = require('react-native');
        return ({ source, ...props }) => {
          return React.createElement(View, { 
            style: { flex: 1, justifyContent: 'center', alignItems: 'center' } 
          }, React.createElement(Text, null, 'PDF Viewer not available'));
        };
      }
    })();
