import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuthService } from '../services/firebaseAuthService';
import { webStorage } from '../services/webStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Écouter les changements d'état d'authentification Firebase
      const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          // Utilisateur connecté
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email,
            photo: firebaseUser.photoURL,
            provider: firebaseUser.providerData[0]?.providerId || 'unknown'
          };
          
          // Sauvegarder dans le stockage local
          await webStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
        } else {
          // Utilisateur déconnecté
          await webStorage.deleteItem('user');
          setUser(null);
        }
        setLoading(false);
      });

      // Nettoyer l'écouteur lors du démontage
      return () => unsubscribe();
    } catch (error) {
      console.error('Auth initialization error:', error);
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await firebaseAuthService.signInWithGoogle();
      return result;
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return { success: false, error: error.message };
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await firebaseAuthService.signInWithFacebook();
      return result;
    } catch (error) {
      console.error('Facebook Sign-In Error:', error);
      return { success: false, error: error.message };
    }
  };

  const signInWithEmail = async (email, password) => {
    try {
      const result = await firebaseAuthService.signInWithEmail(email, password);
      return result;
    } catch (error) {
      console.error('Email Sign-In Error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUpWithEmail = async (email, password, displayName = null) => {
    try {
      const result = await firebaseAuthService.signUpWithEmail(email, password, displayName);
      return result;
    } catch (error) {
      console.error('Email Sign-Up Error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const result = await firebaseAuthService.signOut();
      return result;
    } catch (error) {
      console.error('Sign Out Error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};