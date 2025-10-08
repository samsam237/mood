import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { WebLinearGradient } from '../components/web/WebLinearGradient';
import { useAuth } from '../contexts/AuthContext.web';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';

const AuthScreen = () => {
  const { 
    signInWithGoogle, 
    signInWithFacebook, 
    signInWithEmail, 
    signUpWithEmail 
  } = useAuth();
  
  const [loading, setLoading] = useState({ 
    google: false, 
    facebook: false, 
    email: false 
  });
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

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

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && !displayName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading({ ...loading, email: true });
    
    const result = isSignUp 
      ? await signUpWithEmail(email, password, displayName.trim())
      : await signInWithEmail(email, password);
    
    setLoading({ ...loading, email: false });

    if (!result.success) {
      Alert.alert('Error', result.error || `${isSignUp ? 'Sign up' : 'Sign in'} failed`);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setDisplayName('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <WebLinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Mood Tracker</Text>
              <Text style={styles.subtitle}>
                Track your emotions and understand your mental wellness journey
              </Text>
            </View>

            {/* Auth Form */}
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Text>

              {isSignUp && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    value={displayName}
                    onChangeText={setDisplayName}
                    autoCapitalize="words"
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>

              <Button
                title={isSignUp ? 'Sign Up' : 'Sign In'}
                onPress={handleEmailAuth}
                loading={loading.email}
                variant="primary"
                size="large"
                style={styles.emailButton}
              />

              <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleButton}>
                <Text style={styles.toggleText}>
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"
                  }
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth Buttons */}
            <View style={styles.socialContainer}>
              <Button
                title="Continue with Google"
                onPress={handleGoogleSignIn}
                loading={loading.google}
                variant="secondary"
                size="large"
                style={[styles.socialButton, styles.googleButton]}
              />
              
              <Button
                title="Continue with Facebook"
                onPress={handleFacebookSignIn}
                loading={loading.facebook}
                variant="secondary"
                size="large"
                style={[styles.socialButton, styles.facebookButton]}
              />
            </View>

            <Text style={styles.disclaimer}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.lg,
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  emailButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    width: '100%',
    maxWidth: 400,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.white,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    width: '100%',
    maxWidth: 400,
    marginBottom: theme.spacing.lg,
  },
  socialButton: {
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
    maxWidth: 400,
  },
});

export default AuthScreen;