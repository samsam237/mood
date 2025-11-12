import React, { useState, useEffect } from 'react';
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
  Animated,
  Easing,
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

const { height, width } = Dimensions.get('window');

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

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(50))[0];
  const logoScale = useState(new Animated.Value(0.8))[0];
  const cardOpacity = useState(new Animated.Value(0))[0];
  const cardScale = useState(new Animated.Value(0.9))[0];
  const togglePosition = useState(new Animated.Value(0))[0];
  const inputFocusAnim = useState({})[0];

  // Initialisation des animations d'input
  Object.keys(formData).forEach(key => {
    inputFocusAnim[key] = useState(new Animated.Value(0))[0];
  });

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleToggle = (login) => {
    setIsLogin(login);
    Animated.spring(togglePosition, {
      toValue: login ? 0 : 1,
      tension: 150,
      friction: 15,
      useNativeDriver: true,
    }).start();
  };

  const handleInputFocus = (fieldName) => {
    Animated.timing(inputFocusAnim[fieldName], {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleInputBlur = (fieldName) => {
    if (!formData[fieldName]) {
      Animated.timing(inputFocusAnim[fieldName], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleEmailAuth = async () => {
    const { email, password, displayName, confirmPassword } = formData;
    
    if (!email || !password) {
      showError(t('auth.errors.requiredFields'), t('auth.errors.requiredFieldsMessage'));
      return;
    }

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
        showSuccessNotification(
          isLogin ? t('auth.loginSuccess') : t('auth.signupSuccess'),
          isLogin ? t('auth.welcomeBack') : t('auth.accountCreated')
        );
      } else {
        let alertTitle = t('auth.errors.connectionError');
        let alertMessage = t('auth.errors.connectionErrorMessage');
        
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

  const togglePositionInterpolate = togglePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2 - 40]
  });

  const renderAnimatedInput = (fieldName, placeholder, icon, secureTextEntry = false, showToggle = false) => {
    const borderColor = inputFocusAnim[fieldName].interpolate({
      inputRange: [0, 1],
      outputRange: ['#E5E7EB', theme.colors.primary]
    });

    const scale = inputFocusAnim[fieldName].interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.02]
    });

    return (
      <Animated.View 
        style={[
          styles.inputWrapper,
          { 
            transform: [{ scale }],
            borderColor 
          }
        ]}
      >
        <View style={styles.inputContainer}>
          <MaterialIcons name={icon} size={22} color={theme.colors.primary} />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="#999"
            value={formData[fieldName]}
            onChangeText={(text) => setFormData({ ...formData, [fieldName]: text })}
            onFocus={() => handleInputFocus(fieldName)}
            onBlur={() => handleInputBlur(fieldName)}
            secureTextEntry={secureTextEntry}
            autoCapitalize={fieldName === 'email' ? 'none' : 'words'}
          />
          {showToggle && (
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => fieldName === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
            >
              <MaterialIcons 
                name={(fieldName === 'password' ? showPassword : showConfirmPassword) ? "visibility" : "visibility-off"} 
                size={20} 
                color={theme.colors.textSecondary} 
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
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
          {/* Header Section avec Animations */}
          <Animated.View style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: logoScale }
              ]
            }
          ]}>
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
          </Animated.View>

          {/* Auth Card avec Animation */}
          <Animated.View style={[
            styles.authCard,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }]
            }
          ]}>
            {/* Toggle Login/Signup avec Animation */}
            <View style={styles.toggleContainer}>
              <Animated.View 
                style={[
                  styles.toggleSlider,
                  { transform: [{ translateX: togglePositionInterpolate }] }
                ]} 
              />
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => handleToggle(true)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
                  {t('auth.login')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => handleToggle(false)}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
                  {t('auth.signup')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Formulaire avec entrées animées */}
            <View style={styles.formContainer}>
              {!isLogin && renderAnimatedInput('displayName', t('auth.username'), 'person')}
              
              {renderAnimatedInput('email', t('auth.email'), 'email')}
              
              {renderAnimatedInput('password', t('auth.password'), 'lock', !showPassword, true)}
              
              {!isLogin && renderAnimatedInput('confirmPassword', t('auth.confirmPassword'), 'lock', !showConfirmPassword, true)}

              {/* Bouton animé */}
              <TouchableOpacity
                style={[styles.emailButton, loading.email && styles.buttonLoading]}
                onPress={handleEmailAuth}
                disabled={loading.email}
                activeOpacity={0.8}
              >
                <Animated.View style={styles.buttonContent}>
                  {loading.email ? (
                    <Animated.View style={styles.loadingDots}>
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                    </Animated.View>
                  ) : (
                    <Text style={styles.emailButtonText}>
                      {isLogin ? t('auth.loginButton') : t('auth.signupButton')}
                    </Text>
                  )}
                </Animated.View>
              </TouchableOpacity>
            </View>

            {/* Divider avec animation */}
            <Animated.View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.or')}</Text>
              <View style={styles.dividerLine} />
            </Animated.View>

            {/* Section Social avec effets visuels */}
            <View style={styles.socialContainer}>
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
                
                {showMobileInfo && (
                  <Animated.View 
                    style={[
                      styles.mobileInfoContainer,
                      { opacity: fadeAnim }
                    ]}
                  >
                    <Text style={styles.mobileInfoTitle}>{t('auth.mobileOnly.socialLoginDisabled')}</Text>
                    <Text style={styles.mobileInfoMessage}>{t('auth.mobileOnly.webOnlyMessage')}</Text>
                    <Text style={styles.mobileInfoSubMessage}>{t('auth.mobileOnly.useEmailLogin')}</Text>
                  </Animated.View>
                )}
              </View>

              {/* Boutons sociaux avec effet de profondeur */}
              <Animated.View style={styles.socialButtons}>
                <TouchableOpacity
                  style={[styles.googleButton, styles.disabledSocialButton]}
                  disabled={true}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="search" size={20} color="#999999" />
                  <Text style={[styles.googleButtonText, styles.disabledSocialText]}>
                    {t('auth.googleLogin')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.facebookButton, styles.disabledSocialButton]}
                  disabled={true}
                  activeOpacity={0.8}
                >
                  <MaterialIcons name="facebook" size={20} color="#999999" />
                  <Text style={[styles.facebookButtonText, styles.disabledSocialText]}>
                    {t('auth.facebookLogin')}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Footer avec apparition progressive */}
          <Animated.Text style={[styles.disclaimer, { opacity: fadeAnim }]}>
            {t('auth.disclaimer')}
          </Animated.Text>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <CustomAlert
        visible={alert.visible}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
      
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
    color: '#059669',
    fontSize: 32,
    fontWeight: 'bold',
  },
  odText: {
    color: '#10B981',
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
    position: 'relative',
  },
  toggleSlider: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: '50%',
    height: '80%',
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleButton: {
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    zIndex: 1,
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
    borderWidth: 2,
    borderRadius: 12,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
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
    overflow: 'hidden',
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 2,
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
  socialButtons: {
    gap: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
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
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4267B2',
    borderRadius: 12,
    height: 56,
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
  disabledSocialButton: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
    opacity: 0.6,
  },
  disabledSocialText: {
    color: '#999999',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
  },
});

export default AuthScreen;