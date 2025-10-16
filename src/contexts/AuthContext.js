import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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
    }
    return result;
  };

  const signUpWithEmail = async (email, password, displayName) => {
    const result = await authService.signUpWithEmail(email, password, displayName);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const signInWithGoogle = async () => {
    const result = await authService.signInWithGoogle();
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const signInWithFacebook = async () => {
    const result = await authService.signInWithFacebook();
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };


  const signInWithDefault = async () => {
    const result = await authService.signInWithDefault();
    if (result.success) {
      setUser(result.user);
      // Sauvegarder les données utilisateur
      await authService.saveUserData(result.user);
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
