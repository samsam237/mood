import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens conditionnels
import { 
  AuthScreen, 
  HomeScreen, 
  MoodEntryScreen, 
  AnalyticsScreen, 
  ProfileScreen, 
  PDFViewerScreen 
} from './src/utils/platform';

// Import contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { MoodProvider } from './src/contexts/MoodContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Import theme
import { theme } from './src/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Mood':
              iconName = 'mood';
              break;
            case 'Analytics':
              iconName = 'analytics';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mood" component={MoodEntryScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabNavigator} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PDFViewer" 
        component={PDFViewerScreen}
        options={{ 
          title: 'PDF Viewer',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
    </Stack.Navigator>
  );
};

// App Content Component
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Add loading screen here
  }

  return (
    <NavigationContainer>
      {user ? <MainStackNavigator /> : <AuthScreen />}
    </NavigationContainer>
  );
};

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <MoodProvider>
            <StatusBar style="light" backgroundColor={theme.colors.primary} />
            <AppContent />
          </MoodProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
