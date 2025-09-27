import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import WebLinearGradient from '../components/web/WebLinearGradient';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';

const AuthScreen = () => {
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const [loading, setLoading] = useState({ google: false, facebook: false });

  const handleGoogleSignIn = async () => {
    setLoading({ ...loading, google: true });
    const result = await signInWithGoogle();
    setLoading({ ...loading, google: false });
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Google sign-in failed');
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading({ ...loading, facebook: true });
    const result = await signInWithFacebook();
    setLoading({ ...loading, facebook: false });
    
    if (!result.success) {
      Alert.alert('Error', result.error || 'Facebook sign-in failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebLinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>📱</Text>
            </View>
            <Text style={styles.title}>Mood Tracker</Text>
            <Text style={styles.subtitle}>
              Track your emotions and understand your mental wellness journey
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              loading={loading.google}
              variant="primary"
              size="large"
              style={[styles.authButton, styles.googleButton]}
            />
            
            {/* Temporairement désactivé pour les tests */}
            {/* <Button
              title="Continue with Facebook"
              onPress={handleFacebookSignIn}
              loading={loading.facebook}
              variant="secondary"
              size="large"
              style={[styles.authButton, styles.facebookButton]}
            /> */}
          </View>

          <Text style={styles.disclaimer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </WebLinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoText: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  authButton: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.white,
  },
  googleButton: {
    backgroundColor: theme.colors.white,
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  disclaimer: {
    fontSize: 12,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 18,
  },
});

export default AuthScreen;
