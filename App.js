import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Import de l'internationalisation
import './src/config/i18n';

// Import du splash screen personnalisé
import CustomSplashScreen from './src/components/common/CustomSplashScreen';

// Import screens avec détection de plateforme
import HomeScreenWeb from './src/screens/HomeScreen.web';
import HomeScreenMobile from './src/screens/HomeScreen.js';
import StatisticsScreenWeb from './src/screens/StatisticsScreen.web';
import StatisticsScreenMobile from './src/screens/StatisticsScreen.js';
import ExercisesScreenWeb from './src/screens/ExercisesScreen.web';
import ExercisesScreenMobile from './src/screens/ExercisesScreen.js';
import GuidesScreenWeb from './src/screens/GuidesScreen.web';
import GuidesScreenMobile from './src/screens/GuidesScreen.js';
import { PDFViewerScreen } from './src/utils/platform';
import SettingsScreenWeb from './src/screens/SettingsScreen.web';
import SettingsScreenMobile from './src/screens/SettingsScreen.js';
import GoalsScreenWeb from './src/screens/GoalsScreen.web';
import GoalsScreenMobile from './src/screens/GoalsScreen.js';
import ProfileScreenWeb from './src/screens/ProfileScreen.web';
import ProfileScreenMobile from './src/screens/ProfileScreen.js';
import SystemScreenWeb from './src/screens/SystemScreen.web';
import SystemScreenMobile from './src/screens/SystemScreen.js';
import AuthScreenWeb from './src/screens/AuthScreen.web';
import AuthScreenMobile from './src/screens/AuthScreen.js';

// Import contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { HealthProvider } from './src/contexts/HealthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { MoodProvider } from './src/contexts/MoodContext';

// Import hooks
import { useNotificationHandler } from './src/hooks/useNotificationHandler';
import { useTranslation } from './src/hooks/useTranslation';

// Import theme
import { theme } from './src/constants/theme';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Sélection des bons écrans selon la plateforme
const AuthScreen = Platform.OS === 'web' ? AuthScreenWeb : AuthScreenMobile;
const HomeScreen = Platform.OS === 'web' ? HomeScreenWeb : HomeScreenMobile;
const StatisticsScreen = Platform.OS === 'web' ? StatisticsScreenWeb : StatisticsScreenMobile;
const ExercisesScreen = Platform.OS === 'web' ? ExercisesScreenWeb : ExercisesScreenMobile;
const GuidesScreen = Platform.OS === 'web' ? GuidesScreenWeb : GuidesScreenMobile;
const SettingsScreen = Platform.OS === 'web' ? SettingsScreenWeb : SettingsScreenMobile;
const GoalsScreen = Platform.OS === 'web' ? GoalsScreenWeb : GoalsScreenMobile;
const ProfileScreen = Platform.OS === 'web' ? ProfileScreenWeb : ProfileScreenMobile;
const SystemScreen = Platform.OS === 'web' ? SystemScreenWeb : SystemScreenMobile;

// Main Tab Navigator
const MainTabNavigator = () => {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Statistics':
              iconName = 'bar-chart';
              break;
            case 'Exercises':
              iconName = 'fitness-center';
              break;
            case 'Guides':
              iconName = 'menu-book';
              break;
            case 'Settings':
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
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          headerShown: false,
          title: t('navigation.home')
        }} 
      />
      <Tab.Screen 
        name="Statistics" 
        component={StatisticsScreen} 
        options={{ 
          headerShown: false,
          title: t('navigation.statistics')
        }} 
      />
      <Tab.Screen 
        name="Exercises" 
        component={ExercisesScreen} 
        options={{ 
          headerShown: false,
          title: t('navigation.exercises')
        }} 
      />
      <Tab.Screen 
        name="Guides" 
        component={GuidesScreen} 
        options={{ 
          headerShown: false,
          title: t('navigation.guides')
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          headerShown: false,
          title: t('navigation.settings')
        }} 
      />
    </Tab.Navigator>
  );
};

// Authenticated Stack Navigator
const AuthenticatedStackNavigator = () => {
  // Activer le gestionnaire de notifications
  useNotificationHandler();
  const { t } = useTranslation();

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
          title: t('navigation.guides'),
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="Goals" 
        component={GoalsScreen}
        options={{ 
          title: t('navigation.goals'),
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          title: t('navigation.profile'),
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
      <Stack.Screen 
        name="System" 
        component={SystemScreen}
        options={{ 
          title: t('navigation.system'),
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.white,
        }}
      />
    </Stack.Navigator>
  );
};

// Main App Navigator with Authentication
const AppNavigator = () => {
  const { user, loading } = useAuth();

  // Écran de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: theme.colors.primary 
      }}>
        <Text style={{ color: theme.colors.white, fontSize: 18 }}>
          Chargement...
        </Text>
      </View>
    );
  }

  // Navigation conditionnelle basée sur l'état d'authentification
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Utilisateur connecté : afficher l'application principale
        <Stack.Screen name="Authenticated" component={AuthenticatedStackNavigator} />
      ) : (
        // Utilisateur non connecté : afficher l'écran d'authentification
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

// Main App Component
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <HealthProvider>
            <MoodProvider>
              <NavigationContainer>
                <StatusBar style="light" backgroundColor={theme.colors.primary} />
                <AppNavigator />
              </NavigationContainer>
            </MoodProvider>
          </HealthProvider>
        </AuthProvider>
      </ThemeProvider>
      
      {/* Splash Screen Personnalisé */}
      {showSplash && (
        <CustomSplashScreen onFinish={handleSplashFinish} />
      )}
    </SafeAreaProvider>
  );
}
