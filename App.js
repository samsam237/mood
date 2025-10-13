import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen.web';
import StatisticsScreen from './src/screens/StatisticsScreen.web';
import ExercisesScreen from './src/screens/ExercisesScreen.web';
import GuidesScreen from './src/screens/GuidesScreen.web';
import { PDFViewerScreen } from './src/utils/platform';
import SettingsScreen from './src/screens/SettingsScreen.web';
import GoalsScreen from './src/screens/GoalsScreen.web';
import ProfileScreen from './src/screens/ProfileScreen.web';
import SystemScreen from './src/screens/SystemScreen.web';

// Import contexts
import { AuthProvider } from './src/contexts/AuthContext';
import { HealthProvider } from './src/contexts/HealthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

// Import hooks
import { useNotificationHandler } from './src/hooks/useNotificationHandler';

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
            case 'Accueil':
              iconName = 'home';
              break;
            case 'Statistiques':
              iconName = 'bar-chart';
              break;
            case 'Exercices':
              iconName = 'fitness-center';
              break;
            case 'Guides':
              iconName = 'menu-book';
              break;
            case 'Paramètres':
              iconName = 'settings';
              break;
            default:
              iconName = 'help';
          }
          return <MaterialIcons name={iconName} size={size} color={color} />;
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
      <Tab.Screen name="Accueil" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Statistiques" component={StatisticsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Exercices" component={ExercisesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Guides" component={GuidesScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Paramètres" component={SettingsScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

// Main Stack Navigator
const MainStackNavigator = () => {
  // Activer le gestionnaire de notifications
  useNotificationHandler();

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
          title: 'Guide Santé',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{ 
          title: 'Objectifs Quotidiens',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: 'Profil',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="System" 
        component={SystemScreen}
        options={{ 
          title: 'Système',
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
    </Stack.Navigator>
  );
};

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <HealthProvider>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor={theme.colors.primary} />
              <MainStackNavigator />
            </NavigationContainer>
          </HealthProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
