// HomeScreen.js - VERSION AVEC ANIMATION DE BALLONS
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useHealth } from '../contexts/HealthContext';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Composant Ballon
const Balloon = ({ color, size, duration, delay, emoji }) => {
  const [position] = useState(new Animated.Value(0));

  useEffect(() => {
    const startAnimation = () => {
      position.setValue(SCREEN_HEIGHT + 100);
      
      Animated.timing(position, {
        toValue: -200,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }).start();
    };

    startAnimation();
  }, []);

  const getRandomRotation = () => {
    return Math.random() * 20 - 10; // Rotation entre -10 et 10 degrés
  };

  return (
    <Animated.View
      style={[
        styles.balloon,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
          transform: [
            { translateY: position },
            { rotate: `${getRandomRotation()}deg` }
          ],
          left: Math.random() * (SCREEN_WIDTH - size),
        },
      ]}
    >
      <Text style={[styles.balloonEmoji, { fontSize: size * 0.4 }]}>
        {emoji}
      </Text>
    </Animated.View>
  );
};

const HomeScreen = () => {
  const { waterIntake, movements, dailyGoals, addWater, addMovement, getStats } = useHealth();
  const { t } = useTranslation();
  
  const stats = getStats();

  // États pour gérer les animations
  const [waterScale] = useState(new Animated.Value(1));
  const [waterRotation] = useState(new Animated.Value(0));
  const [movementScale] = useState(new Animated.Value(1));
  const [movementRotation] = useState(new Animated.Value(0));
  
  const [waterPulse] = useState(new Animated.Value(0));
  const [movementPulse] = useState(new Animated.Value(0));

  // État pour l'animation des ballons
  const [showBalloons, setShowBalloons] = useState(false);
  const [balloonType, setBalloonType] = useState(''); // 'water' ou 'movement'

  // 🔥 MÉMOISATION DES CALCULS COÛTEUX
  const dailyTip = useMemo(() => {
    const tips = [
      t('home.tip1'),
      t('home.tip2'),
      t('home.tip3'),
      t('home.tip4'),
      t('home.tip5'),
      t('home.tip6'),
      t('home.tip7'),
    ];
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return tips[dayOfYear % tips.length];
  }, [t]);

  const formattedDate = useMemo(() => {
    const today = new Date();
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = t('common.locale') || 'fr-FR';
    return today.toLocaleDateString(locale, dateOptions);
  }, [t]);

  // Fonction pour lancer l'animation des ballons
  const triggerBalloons = (type) => {
    setBalloonType(type);
    setShowBalloons(true);
    
    // Arrêter l'animation après 5 secondes
    setTimeout(() => {
      setShowBalloons(false);
    }, 5000);
  };

  // Effet pour déclencher l'animation hydratation
  useEffect(() => {
    if (stats.waterPercentage >= 100) {
      triggerWaterAnimation();
      triggerBalloons('water');
    }
  }, [stats.waterPercentage]);

  // Effet pour déclencher l'animation mouvements
  useEffect(() => {
    if (stats.movementsPercentage >= 100) {
      triggerMovementAnimation();
      triggerBalloons('movement');
    }
  }, [stats.movementsPercentage]);

  const triggerWaterAnimation = () => {
    // Animation de pulsation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(waterScale, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(waterRotation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(waterScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(waterRotation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de pulsation continue pour l'icône
    Animated.loop(
      Animated.sequence([
        Animated.timing(waterPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(waterPulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const triggerMovementAnimation = () => {
    // Animation de pulsation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(movementScale, {
          toValue: 1.05,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(movementRotation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(movementScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(movementRotation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de pulsation continue pour l'icône
    Animated.loop(
      Animated.sequence([
        Animated.timing(movementPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(movementPulse, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const waterCardStyle = {
    transform: [
      { scale: waterScale },
      { 
        rotate: waterRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '5deg']
        }) 
      }
    ]
  };

  const movementCardStyle = {
    transform: [
      { scale: movementScale },
      { 
        rotate: movementRotation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-5deg']
        }) 
      }
    ]
  };

  const waterIconStyle = {
    transform: [
      { 
        scale: waterPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.3]
        }) 
      }
    ]
  };

  const movementIconStyle = {
    transform: [
      { 
        scale: movementPulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.3]
        }) 
      }
    ]
  };

  // Générer les ballons
  const generateBalloons = () => {
    if (!showBalloons) return null;

    const balloonColors = balloonType === 'water' 
      ? ['#4FC3F7', '#29B6F6', '#03A9F4', '#0288D1', '#4FC3F7'] // Bleus pour l'eau
      : ['#81C784', '#66BB6A', '#4CAF50', '#388E3C', '#81C784']; // Verts pour les mouvements

    const balloonEmojis = ['🎈', '🎉', '🌟', '⚡', '💫', '✨', '🎊', '🥳'];

    const balloons = [];
    const balloonCount = 15; // Nombre de ballons

    for (let i = 0; i < balloonCount; i++) {
      const size = 40 + Math.random() * 30; // Taille entre 40 et 70
      const duration = 4000 + Math.random() * 3000; // Durée entre 4 et 7 secondes
      const delay = Math.random() * 2000; // Délai aléatoire jusqu'à 2 secondes
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      const emoji = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];

      balloons.push(
        <Balloon
          key={i}
          color={color}
          size={size}
          duration={duration}
          delay={delay}
          emoji={emoji}
        />
      );
    }

    return balloons;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Ballons en overlay */}
      {showBalloons && (
        <View style={styles.balloonsContainer}>
          {generateBalloons()}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>
            💪 <Text style={styles.moText}>mo</Text>
            <Text style={styles.odText}>od</Text>
          </Text>
          <Text style={styles.subtitle}>{t('app.shortTagline')}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {/* Conseil du jour */}
        <Card style={styles.tipCard}>
          <MaterialIcons name="lightbulb" size={24} color={theme.colors.warning} />
          <Text style={styles.tipTitle}>{t('home.dailyTip')}</Text>
          <Text style={styles.tipText}>{dailyTip}</Text>
        </Card>

        {/* Hydratation */}
        <Animated.View style={[styles.animatedCard, waterCardStyle]}>
          <Card style={[
            styles.actionCard,
            stats.waterPercentage >= 100 && styles.completedCard
          ]}>
            <View style={styles.cardHeader}>
              <Animated.View style={waterIconStyle}>
                <MaterialIcons 
                  name="local-drink" 
                  size={32} 
                  color={theme.colors.info} 
                />
              </Animated.View>
              <Text style={styles.cardTitle}>{t('home.hydration')}</Text>
              {stats.waterPercentage >= 100 && (
                <View style={styles.badge}>
                  <MaterialIcons name="celebration" size={16} color="#fff" />
                </View>
              )}
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(stats.waterPercentage, 100)}%`,
                      backgroundColor: theme.colors.info
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {waterIntake}ml / {dailyGoals.water}ml ({Math.round(stats.waterPercentage)}%)
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.info }]}
              onPress={() => addWater(250)}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
              <Text style={styles.buttonText}>{t('home.waterButton')}</Text>
            </TouchableOpacity>

            {stats.waterRemaining > 0 && (
              <Text style={styles.remainingText}>
                {t('home.waterRemaining', { amount: stats.waterRemaining })}
              </Text>
            )}
            
            {stats.waterPercentage >= 100 && (
              <Text style={styles.congratsText}>
                🎉 {t('home.congratulations')} {t('home.hydrationGoal')}
              </Text>
            )}
          </Card>
        </Animated.View>

        {/* Mouvements */}
        <Animated.View style={[styles.animatedCard, movementCardStyle]}>
          <Card style={[
            styles.actionCard,
            stats.movementsPercentage >= 100 && styles.completedCard
          ]}>
            <View style={styles.cardHeader}>
              <Animated.View style={movementIconStyle}>
                <MaterialIcons 
                  name="directions-run" 
                  size={32} 
                  color={theme.colors.success} 
                />
              </Animated.View>
              <Text style={styles.cardTitle}>{t('home.movements')}</Text>
              {stats.movementsPercentage >= 100 && (
                <View style={[styles.badge, { backgroundColor: theme.colors.success }]}>
                  <MaterialIcons name="celebration" size={16} color="#fff" />
                </View>
              )}
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${Math.min(stats.movementsPercentage, 100)}%`,
                      backgroundColor: theme.colors.success
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {t('home.movementsProgress', {
                  current: movements,
                  goal: dailyGoals.movements,
                  percentage: Math.round(stats.movementsPercentage)
                })}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
              onPress={addMovement}
            >
              <MaterialIcons name="add" size={24} color="#fff" />
              <Text style={styles.buttonText}>{t('home.moveButton')}</Text>
            </TouchableOpacity>

            {stats.movementsRemaining > 0 && (
              <Text style={styles.remainingText}>
                {t('home.movementsRemaining', { amount: stats.movementsRemaining })}
              </Text>
            )}
            
            {stats.movementsPercentage >= 100 && (
              <Text style={styles.congratsText}>
                🎉 {t('home.congratulations')} {t('home.movementsGoal')}
              </Text>
            )}
          </Card>
        </Animated.View>

      
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Styles pour les ballons
  balloonsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    pointerEvents: 'none',
  },
  balloon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balloonEmoji: {
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
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
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  date: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  tipCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.warning + '15',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  animatedCard: {
    margin: theme.spacing.md,
  },
  actionCard: {
    padding: theme.spacing.lg,
  },
  completedCard: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  badge: {
    backgroundColor: theme.colors.info,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBar: {
    height: 12,
    backgroundColor: theme.colors.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  remainingText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  congratsText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.success,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  statusCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
});

export default HomeScreen;