import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

const CustomSplashScreen = ({ onFinish }) => {
  const [showSplash, setShowSplash] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (onFinish) {
        onFinish();
      }
    }, 3000); // Affiche pendant 3 secondes

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!showSplash) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            {/* Ici vous pouvez ajouter votre logo si nécessaire */}
          </View>
          
          {/* Texte personnalisé MOOD */}
          <View style={styles.textContainer}>
            <Text style={styles.appName}>
              <Text style={styles.moText}>mo</Text>
              <Text style={styles.odText}>od</Text>
            </Text>
          </View>
          
          {/* Sous-titre */}
          <Text style={styles.subtitle}>{t('app.splashSubtitle')}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    // Vous pouvez ajouter votre logo ici si nécessaire
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
  },
  moText: {
    color: '#059669', // Vert foncé
    fontSize: 48,
    fontWeight: 'bold',
  },
  odText: {
    color: '#10B981', // Vert clair
    fontSize: 48,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '300',
  },
});

export default CustomSplashScreen;







