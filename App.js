// App.js - VERSION FINALE AVEC NotificationProvider
import React, { useState, useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';

import notificationService from './src/services/notificationService';

// 🌍 Internationalisation
import './src/config/i18n';

// 🌊 Splash personnalisé
import CustomSplashScreen from './src/components/common/CustomSplashScreen';

// 📱 Import des écrans (mobile & web)
import HomeScreenWeb from './src/screens/HomeScreen.web';
import HomeScreenMobile from './src/screens/HomeScreen.js';
import StatisticsScreenWeb from './src/screens/StatisticsScreen.web';
import StatisticsScreenMobile from './src/screens/StatisticsScreen.js';
import ExercisesScreenWeb from './src/screens/ExercisesScreen.web';
import ExercisesScreenMobile from './src/screens/ExercisesScreen.js';
import GuidesScreenWeb from './src/screens/GuidesScreen.web';
import GuidesScreenMobile from './src/screens/GuidesScreen.js';
import PDFViewerScreenMobile from './src/screens/PDFViewerScreen.js';
import PDFViewerScreenWeb from './src/screens/PDFViewerScreen.web.js';
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

// 🧠 Contexts
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { HealthProvider } from './src/contexts/HealthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { MoodProvider } from './src/contexts/MoodContext';
import { NotificationProvider } from './src/contexts/NotificationContext';

// 🔔 Hooks & Thèmes
import { useNotificationHandler } from './src/hooks/useNotificationHandler';
import { useTranslation } from './src/hooks/useTranslation';
import { theme } from './src/constants/theme';

// --- NAVIGATEURS ---
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Sélection dynamique selon la plateforme
const AuthScreen = Platform.OS === 'web' ? AuthScreenWeb : AuthScreenMobile;
const HomeScreen = Platform.OS === 'web' ? HomeScreenWeb : HomeScreenMobile;
const StatisticsScreen = Platform.OS === 'web' ? StatisticsScreenWeb : StatisticsScreenMobile;
const ExercisesScreen = Platform.OS === 'web' ? ExercisesScreenWeb : ExercisesScreenMobile;
const GuidesScreen = Platform.OS === 'web' ? GuidesScreenWeb : GuidesScreenMobile;
const SettingsScreen = Platform.OS === 'web' ? SettingsScreenWeb : SettingsScreenMobile;
const GoalsScreen = Platform.OS === 'web' ? GoalsScreenWeb : GoalsScreenMobile;
const ProfileScreen = Platform.OS === 'web' ? ProfileScreenWeb : ProfileScreenMobile;
const SystemScreen = Platform.OS === 'web' ? SystemScreenWeb : SystemScreenMobile;
const PDFViewerScreen = Platform.OS === 'web' ? PDFViewerScreenWeb : PDFViewerScreenMobile;

// --- BOTTOM TABS ---
const MainTabNavigator = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
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
          height: 70,
        },
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false, title: t('navigation.home') }} />
      <Tab.Screen name="Statistics" component={StatisticsScreen} options={{ headerShown: false, title: t('navigation.statistics') }} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} options={{ headerShown: false, title: t('navigation.exercises') }} />
      <Tab.Screen name="Guides" component={GuidesScreen} options={{ headerShown: false, title: t('navigation.guides') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false, title: t('navigation.settings') }} />
    </Tab.Navigator>
  );
};

// --- STACK AUTHENTIFIÉ ---
const AuthenticatedStackNavigator = () => {
 // useNotificationHandler();
  const { t } = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PDFViewer" component={PDFViewerScreen} options={{ title: t('navigation.guides'), headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: theme.colors.white }} />
      <Stack.Screen name="Goals" component={GoalsScreen} options={{ title: t('navigation.goals'), headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: theme.colors.white }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: t('navigation.profile'), headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: theme.colors.white }} />
      <Stack.Screen name="System" component={SystemScreen} options={{ title: t('navigation.system'), headerStyle: { backgroundColor: theme.colors.primary }, headerTintColor: theme.colors.white }} />
    </Stack.Navigator>
  );
};

// --- NAVIGATEUR GLOBAL AUTH ---
const AppNavigator = () => {
  const { user, loading } = useAuth();
    // 🔥 LOGS DE DÉBOGAGE
    useEffect(() => {
      console.log('🔄 AppNavigator - user:', user ? 'connecté' : 'déconnecté');
      console.log('🔄 AppNavigator - loading:', loading);
    }, [user, loading]);
  
  

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primary }}>
        <Text style={{ color: theme.colors.white, fontSize: 18 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Authenticated" component={AuthenticatedStackNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Configuration des notifications
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });

  // 🔥 ÉVITER L'INITIALISATION AUTOMATIQUE DANS APP.JS
  // L'initialisation se fait maintenant dans NotificationContext
  useEffect(() => {
    console.log('🚀 Application démarrée');
    
    // Juste un log, pas d'initialisation ici
    return () => {
      console.log('🧹 Application nettoyée');
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <HealthProvider>
            <MoodProvider>
              <NotificationProvider>
                <NavigationContainer>
                  <StatusBar style="light" backgroundColor={theme.colors.primary} />
                  <AppNavigator />
                </NavigationContainer>
              </NotificationProvider>
            </MoodProvider>
          </HealthProvider>
        </AuthProvider>
      </ThemeProvider>

      {showSplash && (
        <CustomSplashScreen onFinish={handleSplashFinish} />
      )}
    </SafeAreaProvider>
  );
}