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
import CustomAlert from '../components/common/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { useTranslation } from '../hooks/useTranslation';
import CustomNotification from '../components/common/CustomNotification';
import { useCustomNotification } from '../hooks/useCustomNotification';

const { height } = Dimensions.get('window');

const AuthScreen = () => {
  const { t } = useTranslation();
  const { 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithGoogle, 
    signInWithFacebook, 
    signInWithDefault 
  } = useAuth();
  
  const { alert, showError, showSuccess, hideAlert } = useCustomAlert();
  const { notification, showSuccess: showSuccessNotification, hideNotification } = useCustomNotification();
  
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
  const [showMobileInfo, setShowMobileInfo] = useState(false);


  const handleEmailAuth = async () => {
    const { email, password, displayName, confirmPassword } = formData;
    
    if (!email || !password) {
      showError(t('auth.errors.requiredFields'), t('auth.errors.requiredFieldsMessage'));
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = email.trim();
    
    if (!emailRegex.test(cleanEmail)) {
      showError(t('auth.errors.invalidEmail'), t('auth.errors.invalidEmailMessage'));
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      showError(t('auth.errors.passwordMismatch'), t('auth.errors.passwordMismatchMessage'));
      return;
    }

    setLoading({ ...loading, email: true });
    
    try {
      const result = isLogin 
        ? await signInWithEmail(cleanEmail, password)
        : await signUpWithEmail(cleanEmail, password, displayName);
      
      if (result.success) {
        // Connexion/inscription réussie
        showSuccessNotification(
          isLogin ? t('auth.loginSuccess') : t('auth.signupSuccess'),
          isLogin ? t('auth.welcomeBack') : t('auth.accountCreated')
        );
      } else {
        // Message d'erreur générique pour la sécurité
        let alertTitle = t('auth.errors.connectionError');
        let alertMessage = t('auth.errors.connectionErrorMessage');
        
        // Seules les erreurs de format d'email peuvent être spécifiques
        if (result.error.includes('invalid-email')) {
          alertTitle = t('auth.errors.invalidEmail');
          alertMessage = t('auth.errors.invalidEmailMessage');
        } else if (result.error.includes('weak-password')) {
          alertTitle = t('auth.errors.weakPassword');
          alertMessage = t('auth.errors.weakPasswordMessage');
        } else if (result.error.includes('email-already-in-use')) {
          alertTitle = t('auth.errors.existingAccount');
          alertMessage = t('auth.errors.existingAccountMessage');
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
      let alertTitle = t('auth.errors.googleError');
      let alertMessage = result.error || t('auth.errors.googleErrorMessage');
      
      if (result.error.includes('popup-closed-by-user')) {
        alertTitle = t('auth.errors.connectionCancelled');
        alertMessage = t('auth.errors.connectionCancelledMessage');
      } else if (result.error.includes('popup-blocked')) {
        alertTitle = t('auth.errors.popupBlocked');
        alertMessage = t('auth.errors.popupBlockedMessage');
      } else if (result.error.includes('navigateur web')) {
        alertTitle = t('auth.errors.limitedFeature');
        alertMessage = t('auth.errors.googleWebOnly');
      }
      
      showError(alertTitle, alertMessage);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading({ ...loading, facebook: true });
    const result = await signInWithFacebook();
    setLoading({ ...loading, facebook: false });
    
    if (!result.success) {
      let alertTitle = t('auth.errors.facebookError');
      let alertMessage = result.error || t('auth.errors.facebookErrorMessage');
      
      if (result.error.includes('popup-closed-by-user')) {
        alertTitle = t('auth.errors.connectionCancelled');
        alertMessage = t('auth.errors.connectionCancelledMessageFacebook');
      } else if (result.error.includes('popup-blocked')) {
        alertTitle = t('auth.errors.popupBlocked');
        alertMessage = t('auth.errors.popupBlockedMessageFacebook');
      } else if (result.error.includes('navigateur web')) {
        alertTitle = t('auth.errors.limitedFeature');
        alertMessage = t('auth.errors.facebookWebOnly');
      }
      
      showError(alertTitle, alertMessage);
    }
  };


  const handleDefaultSignIn = async () => {
    setLoading({ ...loading, default: true });
    const result = await signInWithDefault();
    setLoading({ ...loading, default: false });
    
    if (!result.success) {
      showError(t('auth.errors.defaultConnectionError'), result.error || t('auth.errors.defaultConnectionFailed'));
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
                source={require('../../assets/logomood.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            </View>
            <Text style={styles.title}>
              <Text style={styles.moText}>mo</Text>
              <Text style={styles.odText}>od</Text>
            </Text>
            <Text style={styles.subtitle}>
            {t('auth.subtitle')}
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
                      size={16} 
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

            {/* Social Login Buttons - Disabled on Mobile */}
            <View style={styles.socialContainer}>
              {/* Icône d'information cliquable pour mobile */}
              <View style={styles.mobileInfoHeader}>
                <TouchableOpacity 
                  style={styles.infoIconButton}
                  onPress={() => setShowMobileInfo(!showMobileInfo)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons 
                    name="info" 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                </TouchableOpacity>
                
                {/* Message d'information (affiché/masqué) */}
                {showMobileInfo && (
                  <View style={styles.mobileInfoContainer}>
                    <Text style={styles.mobileInfoTitle}>{t('auth.mobileOnly.socialLoginDisabled')}</Text>
                    <Text style={styles.mobileInfoMessage}>{t('auth.mobileOnly.webOnlyMessage')}</Text>
                    <Text style={styles.mobileInfoSubMessage}>{t('auth.mobileOnly.useEmailLogin')}</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[styles.googleButton, styles.disabledButton]}
                disabled={true}
                activeOpacity={0.3}
              >
                <MaterialIcons name="search" size={20} color="#999" />
                <Text style={[styles.googleButtonText, styles.disabledText]}>
                  {t('auth.googleLogin')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.facebookButton, styles.disabledButton]}
                disabled={true}
                activeOpacity={0.3}
              >
                <MaterialIcons name="facebook" size={20} color="#999" />
                <Text style={[styles.facebookButtonText, styles.disabledText]}>
                  {t('auth.facebookLogin')}
                </Text>
              </TouchableOpacity>

            </View>

  
          </View>

          {/* Footer */}
          <Text style={styles.disclaimer}>
            {t('auth.disclaimer')}
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
      
      {/* Notification personnalisée */}
      <CustomNotification
        visible={notification.visible}
        onClose={hideNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        position={notification.position}
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
   // borderRadius: 80,
   // backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
   // shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
   // shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 70,
    height: 70,
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
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    borderRadius: 12,
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
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 56,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 12,
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4267B2',
    borderRadius: 12,
    height: 56,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  facebookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#25D366',
    borderRadius: 12,
    height: 56,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  phoneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  phoneAuthContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  phoneAuthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    opacity: 0.6,
  },
  disabledText: {
    color: '#999',
  },
  mobileInfoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoIconButton: {
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mobileInfoContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D0E8FF',
    flex: 1,
  },
  mobileInfoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 3,
    textAlign: 'left',
  },
  mobileInfoMessage: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
    marginBottom: 3,
    textAlign: 'left',
  },
  mobileInfoSubMessage: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'left',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 56,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DB4437',
    marginLeft: 12,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: 56,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  demoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: 12,
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
});

export default AuthScreen;