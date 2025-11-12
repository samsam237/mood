import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthContext.js - MODIFIEZ LES INTERVALLES
const createInitialUserProfile = async (user) => {
  try {
    const defaultProfile = {
      name: user.displayName || 'Utilisateur',
      email: user.email,
      water_goal: 2000,
      movement_goal: 20,
      reminder_intervals: {
        water: 7200,    // 🔥 120 minutes en secondes (2 heures)
        movement: 3600  // 🔥 60 minutes en secondes (1 heure)
      },
      wakeTime: '07:00',
      sleepTime: '23:00',
      activityLevel: 'moderate',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await AsyncStorage.setItem('user_profile', JSON.stringify(defaultProfile));
    console.log('✅ Profil utilisateur créé avec intervalles par défaut');
    return defaultProfile;
  } catch (error) {
    console.error('❌ Erreur création profil:', error);
    return null;
  }
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Écouter les changements d'état d'authentification
      const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Erreur d\'initialisation auth:', error);
      setLoading(false);
    }
  };

  const signInWithEmail = async (email, password) => {
    const result = await authService.signInWithEmail(email, password);
    if (result.success) {
      setUser(result.user);
      // Vérifier si le profil existe déjà, sinon le créer
      const existingProfile = await AsyncStorage.getItem('user_profile');
      if (!existingProfile) {
        await createInitialUserProfile(result.user);
      }
    }
    return result;
  };

  const signUpWithEmail = async (email, password, displayName) => {
    const result = await authService.signUpWithEmail(email, password, displayName);
    if (result.success) {
      setUser(result.user);
      // Création du profil pour les nouveaux utilisateurs
      await createInitialUserProfile(result.user);
    }
    return result;
  };

  const signInWithGoogle = async () => {
    const result = await authService.signInWithGoogle();
    if (result.success) {
      setUser(result.user);
      // Vérifier si le profil existe déjà, sinon le créer
      const existingProfile = await AsyncStorage.getItem('user_profile');
      if (!existingProfile) {
        await createInitialUserProfile(result.user);
      }
    }
    return result;
  };

  const signInWithFacebook = async () => {
    const result = await authService.signInWithFacebook();
    if (result.success) {
      setUser(result.user);
      // Vérifier si le profil existe déjà, sinon le créer
      const existingProfile = await AsyncStorage.getItem('user_profile');
      if (!existingProfile) {
        await createInitialUserProfile(result.user);
      }
    }
    return result;
  };

  const signInWithDefault = async () => {
    const result = await authService.signInWithDefault();
    if (result.success) {
      setUser(result.user);
      // Vérifier si le profil existe déjà, sinon le créer
      const existingProfile = await AsyncStorage.getItem('user_profile');
      if (!existingProfile) {
        await createInitialUserProfile(result.user);
      }
    }
    return result;
  };

  const signOut = async () => {
    const result = await authService.signOut();
    if (result.success) {
      setUser(null);
      // Nettoyer les données utilisateur
      await authService.clearUserData();
    }
    return result;
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    signInWithDefault,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};