import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../constants/theme';
import { authConfig } from '../config/authConfig';
import SimpleBackground from '../components/web/SimpleBackground';
import CustomAlert from '../components/common/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { useTranslation } from '../hooks/useTranslation';

const { height } = Dimensions.get('window');

const AuthScreen = () => {
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithFacebook, 
    signInWithDefault 
  } = useAuth();
  
  const { alert, showError, showSuccess, hideAlert } = useCustomAlert();
  const { t } = useTranslation();
  
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleEmailAuth = async () => {
    const { email, password, displayName, confirmPassword } = formData;
    
    if (!email || !password) {
      showError('Champs obligatoires', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim();
    
    if (!emailRegex.test(cleanEmail)) {
      showError('Format d\'email invalide', 'Veuillez saisir un email valide (ex: nom@exemple.com)');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      showError('Mots de passe différents', 'Les mots de passe ne correspondent pas');
      return;
    }

    setLoading({ ...loading, email: true });
    
    try {
      const result = isLogin 
        ? await signInWithEmail(cleanEmail, password)
        : await signUpWithEmail(cleanEmail, password, displayName);
      
      if (!result.success) {
        // Message d'erreur générique pour la sécurité
        let alertTitle = 'Erreur de connexion';
        let alertMessage = 'Email ou mot de passe incorrect. Veuillez vérifier vos identifiants.';
        
        // Seules les erreurs de format d'email peuvent être spécifiques
        if (result.error.includes('invalid-email')) {
          alertTitle = 'Format d\'email invalide';
          alertMessage = 'Veuillez saisir une adresse email valide (ex: nom@exemple.com)';
        } else if (result.error.includes('weak-password')) {
          alertTitle = 'Mot de passe trop faible';
          alertMessage = 'Le mot de passe doit contenir au moins 6 caractères.';
        } else if (result.error.includes('email-already-in-use')) {
          alertTitle = 'Compte existant';
          alertMessage = 'Un compte existe déjà avec cette adresse email. Essayez de vous connecter.';
        }
        
        showError(alertTitle, alertMessage);
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
      let alertTitle = 'Erreur Google';
      let alertMessage = result.error || 'Connexion Google échouée';
      
      if (result.error.includes('popup-closed-by-user')) {
        alertTitle = 'Connexion annulée';
        alertMessage = 'Vous avez fermé la fenêtre de connexion Google. Réessayez si vous souhaitez vous connecter.';
      } else if (result.error.includes('popup-blocked')) {
        alertTitle = 'Fenêtre bloquée';
        alertMessage = 'Votre navigateur a bloqué la fenêtre de connexion Google. Autorisez les popups pour ce site.';
      }
      
      Alert.alert(alertTitle, alertMessage);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading({ ...loading, facebook: true });
    const result = await signInWithFacebook();
    setLoading({ ...loading, facebook: false });
    
    if (!result.success) {
      let alertTitle = 'Erreur Facebook';
      let alertMessage = result.error || 'Connexion Facebook échouée';
      
      if (result.error.includes('popup-closed-by-user')) {
        alertTitle = 'Connexion annulée';
        alertMessage = 'Vous avez fermé la fenêtre de connexion Facebook. Réessayez si vous souhaitez vous connecter.';
      } else if (result.error.includes('popup-blocked')) {
        alertTitle = 'Fenêtre bloquée';
        alertMessage = 'Votre navigateur a bloqué la fenêtre de connexion Facebook. Autorisez les popups pour ce site.';
      }
      
      Alert.alert(alertTitle, alertMessage);
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>
              <Text style={styles.moText}>mo</Text>
              <Text style={styles.odText}>od</Text>
            </Text>
            <Text style={styles.subtitle}>
               Luttez contre la sédentarité avec des{'\n'}exercices réguliers et une hydratation optimale
            </Text>
          </View>

          {/* Auth Card */}
          <View style={styles.authCard}>
            {/* Toggle Login/Signup */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, isLogin && styles.toggleButtonActive]}
                onPress={() => setIsLogin(true)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                  {t('auth.login')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, !isLogin && styles.toggleButtonActive]}
                onPress={() => setIsLogin(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                  {t('auth.signup')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email/Password Form */}
            <View style={styles.formContainer}>
              {!isLogin && (
                <View style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="person" size={22} color={theme.colors.primary} />
                    <TextInput
                      style={styles.input}
                      placeholder={t('auth.username')}
                      placeholderTextColor="#999"
                      value={formData.displayName}
                      onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={22} color={theme.colors.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('auth.email')}
                    placeholderTextColor="#999"
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={22} color={theme.colors.primary} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('auth.password')}
                    placeholderTextColor="#999"
                    value={formData.password}
                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons 
                      name={showPassword ? "visibility" : "visibility-off"} 
                      size={20} 
                      color={theme.colors.textSecondary} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {!isLogin && (
                <View style={styles.inputWrapper}>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="lock" size={22} color={theme.colors.primary} />
                    <TextInput
                      style={styles.input}
                      placeholder={t('auth.confirmPassword')}
                      placeholderTextColor="#999"
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <MaterialIcons 
                        name={showConfirmPassword ? "visibility" : "visibility-off"} 
                        size={20} 
                        color={theme.colors.textSecondary} 
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

               <TouchableOpacity
                 style={styles.emailButton}
                 onPress={handleEmailAuth}
                 disabled={loading.email}
                 activeOpacity={0.8}
               >
                 {loading.email ? (
                   <Text style={styles.emailButtonText}>{t('auth.loading')}</Text>
                 ) : (
                   <Text style={styles.emailButtonText}>
                     {isLogin ? t('auth.loginButton') : t('auth.signupButton')}
                   </Text>
                 )}
               </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              <TouchableOpacity 
                style={[styles.socialButton, styles.disabledSocialButton]}
              onPress={handleGoogleSignIn}
                disabled={true}
                activeOpacity={0.8}
              >
                 <MaterialIcons name="search" size={24} color="#999999" />
                <Text style={[styles.socialButtonText, styles.disabledSocialText]}>{t('auth.googleLogin')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.socialButton, styles.facebookButton, styles.disabledSocialButton]}
              onPress={handleFacebookSignIn}
                disabled={true}
                activeOpacity={0.8}
              >
                <MaterialIcons name="facebook" size={24} color="#999999" />
                <Text style={[styles.socialButtonText, styles.facebookText, styles.disabledSocialText]}>
                  {t('auth.facebookLogin')}
                </Text>
              </TouchableOpacity>

               {/* Bouton de connexion rapide - Seulement en mode connexion */}
               {isLogin && (
                 <TouchableOpacity 
                   style={[styles.socialButton, styles.defaultButton]}
                   onPress={handleDefaultSignIn}
                   disabled={loading.default}
                   activeOpacity={0.8}
                 >
                   <MaterialIcons name="flash-on" size={24} color={theme.colors.primary} />
                   <Text style={styles.socialButtonText}>{t('auth.quickLogin')}</Text>
                 </TouchableOpacity>
               )}
             </View>

             {/* Demo Credentials Info - Seulement en mode connexion */}
             {isLogin && (
               <View style={styles.demoInfo}>
                 <Text style={styles.demoTitle}>{t('auth.demoTitle')}</Text>
                 <View style={styles.demoCredentialsContainer}>
                   <Text style={styles.demoCredentials}>
                     {t('auth.demoEmail', { email: authConfig.defaultCredentials.email })}
                   </Text>
                   <Text style={styles.demoCredentials}>
                     {t('auth.demoPassword', { password: authConfig.defaultCredentials.password })}
                   </Text>
                 </View>
               </View>
             )}
          </View>

          {/* Footer */}
          <Text style={styles.disclaimer}>
            En continuant, vous acceptez nos{' '}
            <Text style={styles.disclaimerLink}>Conditions d'utilisation</Text>
            {' '}et notre{' '}
            <Text style={styles.disclaimerLink}>Politique de confidentialité</Text>
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Alerte personnalisée */}
      <CustomAlert
        visible={alert.visible}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  moText: {
    color: '#059669', // Vert foncé
    fontSize: 32,
    fontWeight: 'bold',
  },
  odText: {
    color: '#10B981', // Vert clair
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.white,
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 4,
    position: 'absolute',
    right: 16,
  },
  emailButton: {
    marginTop: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emailButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    color: '#999',
    paddingHorizontal: 16,
    fontSize: 13,
    fontWeight: '600',
  },
  socialContainer: {
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  facebookButton: {
    backgroundColor: '#4267B2',
    borderColor: '#4267B2',
  },
  facebookText: {
    color: '#FFFFFF',
  },
  defaultButton: {
    backgroundColor: '#F8F9FA',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  demoInfo: {
    backgroundColor: '#F0F8FF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D0E8FF',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoCredentialsContainer: {
    gap: 6,
  },
  demoCredentials: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
  disclaimerLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  disabledSocialButton: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  disabledSocialText: {
    color: '#999999',
  },
});

export default AuthScreen;