import React, { createContext, useContext, useState, useEffect } from 'react';

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
    // Auth complètement désactivée pour les tests
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    // Désactivé pour les tests
    return { success: false, error: 'Auth désactivée' };
  };

  const signInWithFacebook = async () => {
    // Désactivé pour les tests
    return { success: false, error: 'Auth désactivée' };
  };

  const signOut = async () => {
    // Désactivé pour les tests
    setUser(null);
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
