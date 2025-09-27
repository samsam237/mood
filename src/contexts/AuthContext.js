import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import * as SecureStore from 'expo-secure-store';
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
      // Configure Google Sign-In
      GoogleSignin.configure({
        webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your actual web client ID
        iosClientId: 'YOUR_IOS_CLIENT_ID', // Replace with your actual iOS client ID
        offlineAccess: true,
        hostedDomain: '',
        forceCodeForRefreshToken: true,
      });

      // Check for existing authentication
      const savedUser = await SecureStore.getItemAsync('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      await SecureStore.setItemAsync('googleToken', userInfo.idToken);
      await SecureStore.setItemAsync('user', JSON.stringify(userInfo.user));
      
      setUser(userInfo.user);
      return { success: true };
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      return { success: false, error: error.message };
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        return { success: false, error: 'Login cancelled' };
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (data) {
        const { accessToken } = data;
        await SecureStore.setItemAsync('facebookToken', accessToken);
        
        // Fetch user info from Facebook Graph API
        const userInfo = await authService.getFacebookUserInfo(accessToken);
        await SecureStore.setItemAsync('user', JSON.stringify(userInfo));
        
        setUser(userInfo);
        return { success: true };
      }
    } catch (error) {
      console.error('Facebook Login Error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await LoginManager.logOut();
      await SecureStore.deleteItemAsync('user');
      await SecureStore.deleteItemAsync('googleToken');
      await SecureStore.deleteItemAsync('facebookToken');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
