import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';

// Import screens
import HomeScreen from './src/screens/HomeScreen.web';
import MoodEntryScreen from './src/screens/MoodEntryScreen.web';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ProfileScreen from './src/screens/ProfileScreen.web';
import AuthScreen from './src/screens/AuthScreen.web';
import PDFViewerScreen from './src/screens/PDFViewerScreen';

// Import contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext.web';
import { MoodProvider } from './src/contexts/MoodContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Import theme
import { theme } from './src/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Simple icon component for web
const SimpleIcon = ({ name, size, color }) => (
  <View style={[styles.icon, { width: size, height: size, backgroundColor: color }]}>
    <Text style={styles.iconText}>{name.charAt(0).toUpperCase()}</Text>
  </View>
);

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'Home';
              break;
            case 'Mood':
              iconName = 'Mood';
              break;
            case 'Analytics':
              iconName = 'Analytics';
              break;
            case 'Profile':
              iconName = 'Profile';
              break;
            default:
              iconName = 'Help';
          }
          return <SimpleIcon name={iconName} size={size} color={color} />;
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
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.text,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  iconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
