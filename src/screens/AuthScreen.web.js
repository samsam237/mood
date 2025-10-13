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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SimpleBackground from '../components/web/SimpleBackground';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';
import { authConfig } from '../config/authConfig';

const AuthScreen = () => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithFacebook, 
    signInWithDefault 
  } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState({ 
    email: false, 
    google: false, 
    facebook: false, 
    default: false 
  });
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });

  const handleEmailAuth = async () => {
    const { email, password, displayName, confirmPassword } = formData;
    
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading({ ...loading, email: true });
    
    try {
      const result = isLogin 
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password, displayName);
      
      if (!result.success) {
        Alert.alert('Erreur', result.error);
      }
    } finally {
      setLoading({ ...loading, email: false });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading({ ...loading, google: true });
    const result = await signInWithGoogle();
    setLoading({ ...loading, google: false });
    
    if (!result.success) {
      Alert.alert('Erreur', result.error || 'Connexion Google échouée');
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading({ ...loading, facebook: true });
    const result = await signInWithFacebook();
    setLoading({ ...loading, facebook: false });
    
    if (!result.success) {
      Alert.alert('Erreur', result.error || 'Connexion Facebook échouée');
    }
  };

  const handleDefaultSignIn = async () => {
    setLoading({ ...loading, default: true });
    const result = await signInWithDefault();
    setLoading({ ...loading, default: false });
    
    if (!result.success) {
      Alert.alert('Erreur', result.error || 'Connexion par défaut échouée');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SimpleBackground
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoText}>📱</Text>
                </View>
                <Text style={styles.title}>Mood Tracker</Text>
                <Text style={styles.subtitle}>
                  Suivez vos activités et comprenez votre parcours de santé
                </Text>
              </View>

              {/* Toggle Login/Signup */}
              <View style={styles.toggleContainer}>
                <TouchableOpacity
                  style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                    Connexion
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                    Inscription
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Email/Password Form */}
              <View style={styles.formContainer}>
                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="person" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Nom d'utilisateur"
                      value={formData.displayName}
                      onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                      autoCapitalize="words"
                    />
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={20} color={theme.colors.textSecondary} />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry
                  />
                </View>

                {!isLogin && (
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirmer le mot de passe"
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                      secureTextEntry
                    />
                  </View>
                )}

                <Button
                  title={isLogin ? 'Se connecter' : 'S\'inscrire'}
                  onPress={handleEmailAuth}
                  loading={loading.email}
                  variant="primary"
                  size="large"
                  style={styles.emailButton}
                />
              </View>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OU</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login Buttons */}
              <View style={styles.socialContainer}>
                <Button
                  title="Continuer avec Google"
                  onPress={handleGoogleSignIn}
                  loading={loading.google}
                  variant="secondary"
                  size="large"
                  style={[styles.socialButton, styles.googleButton]}
                  icon={<MaterialIcons name="google" size={20} color="#DB4437" />}
                />
                
                <Button
                  title="Continuer avec Facebook"
                  onPress={handleFacebookSignIn}
                  loading={loading.facebook}
                  variant="secondary"
                  size="large"
                  style={[styles.socialButton, styles.facebookButton]}
                  icon={<MaterialIcons name="facebook" size={20} color="#4267B2" />}
                />

                {/* Bouton de connexion rapide pour le développement */}
                <Button
                  title="Connexion rapide (Demo)"
                  onPress={handleDefaultSignIn}
                  loading={loading.default}
                  variant="outline"
                  size="large"
                  style={[styles.socialButton, styles.defaultButton]}
                  icon={<MaterialIcons name="flash-on" size={20} color={theme.colors.primary} />}
                />
              </View>

              {/* Demo Credentials Info */}
              <View style={styles.demoInfo}>
                <Text style={styles.demoText}>
                  Identifiants de démonstration:
                </Text>
                <Text style={styles.demoCredentials}>
                  Email: {authConfig.defaultCredentials.email}
                </Text>
                <Text style={styles.demoCredentials}>
                  Mot de passe: {authConfig.defaultCredentials.password}
                </Text>
              </View>

              <Text style={styles.disclaimer}>
                En continuant, vous acceptez nos Conditions d'utilisation et notre Politique de confidentialité
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SimpleBackground>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: theme.spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logoText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 4,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.white,
  },
  toggleText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  toggleTextActive: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  emailButton: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  socialButton: {
    marginBottom: theme.spacing.md,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  facebookButton: {
    backgroundColor: '#4267B2',
  },
  defaultButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  demoInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  demoText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  demoCredentials: {
    color: theme.colors.white,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 2,
  },
  disclaimer: {
    fontSize: 11,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
    paddingHorizontal: theme.spacing.md,
  },
});

export default AuthScreen;