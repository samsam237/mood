// HomeScreen.js - VERSION STABLE SANS RE-RENDERS
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useHealth } from '../contexts/HealthContext';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

// 🔥 COMPOSANT COUNTDOWN ISOLÉ ET STABLE
const CountdownDisplay = React.memo(({ targetTime, label, color }) => {
  const [displayTime, setDisplayTime] = useState('--:--');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!targetTime) {
      setDisplayTime('--:--');
      return;
    }

    const updateDisplay = () => {
      const now = new Date();
      const diff = targetTime - now;
      
      if (diff <= 0) {
        setDisplayTime('Maintenant!');
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    // Mettre à jour immédiatement
    updateDisplay();

    // Intervalle chaque seconde
    intervalRef.current = setInterval(updateDisplay, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetTime]);

  return (
    <View style={styles.nextReminderBox}>
      <MaterialIcons name="alarm" size={16} color={color} />
      <Text style={[styles.nextReminderText, { color }]}>
        {label} {displayTime}
      </Text>
    </View>
  );
});

const HomeScreen = () => {
  console.log('🏠 HomeScreen RENDER!');
  
  const { waterIntake, movements, dailyGoals, addWater, addMovement, getStats } = useHealth();
  const { t } = useTranslation();
  const { 
    nextWater, 
    nextMove, 
    updateNextNotifications,
    debugNotifications,
    forceResetSystem,
    forceReschedule
  } = useNotification();
  
  const stats = getStats();
  const [debugInfo, setDebugInfo] = useState('');
  const renderCountRef = useRef(0);

  // 🔥 COMPTEUR DE RENDER POUR DEBUG
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`🏠 HomeScreen Render #${renderCountRef.current}`);
  });

  // 🔥 INITIALISATION UNE SEULE FOIS
  useEffect(() => {
    console.log('🏠 HomeScreen Monté - État global déjà géré');
    
    // Mettre à jour une fois au montage
    const timer = setTimeout(() => {
      updateNextNotifications();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

  // 🔥 FONCTIONS MÉMOISÉES
  const handleDebug = useCallback(async () => {
    const result = await debugNotifications();
    setDebugInfo(JSON.stringify(result, null, 2));
  }, [debugNotifications]);

  const handleForceReset = useCallback(async () => {
    await forceResetSystem();
  }, [forceResetSystem]);

  const handleRefresh = useCallback(async () => {
    await updateNextNotifications();
  }, [updateNextNotifications]);

  const handleAddWater = useCallback(() => {
    addWater(250);
  }, [addWater]);

  const handleAddMovement = useCallback(() => {
    addMovement();
  }, [addMovement]);

  const handleTestReschedule = useCallback(async (type) => {
    await forceReschedule(type);
  }, [forceReschedule]);

  return (
    <SafeAreaView style={styles.container}>
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
        <Card style={styles.actionCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="local-drink" size={32} color={theme.colors.info} />
            <Text style={styles.cardTitle}>{t('home.hydration')}</Text>
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
            onPress={handleAddWater}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.buttonText}>{t('home.waterButton')}</Text>
          </TouchableOpacity>

          {stats.waterRemaining > 0 && (
            <Text style={styles.remainingText}>
              {t('home.waterRemaining', { amount: stats.waterRemaining })}
            </Text>
          )}

          <CountdownDisplay 
            targetTime={nextWater}
            label={t('home.nextWaterReminder')}
            color={theme.colors.info}
          />

          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: 'orange', marginTop: 10 }]}
            onPress={() => handleTestReschedule('water')}
          >
            <Text style={styles.debugButtonText}>Test Replanif Eau</Text>
          </TouchableOpacity>
        </Card>

        {/* Mouvements */}
        <Card style={styles.actionCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="directions-run" size={32} color={theme.colors.success} />
            <Text style={styles.cardTitle}>{t('home.movements')}</Text>
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
            onPress={handleAddMovement}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.buttonText}>{t('home.moveButton')}</Text>
          </TouchableOpacity>

          {stats.movementsRemaining > 0 && (
            <Text style={styles.remainingText}>
              {t('home.movementsRemaining', { amount: stats.movementsRemaining })}
            </Text>
          )}

          <CountdownDisplay 
            targetTime={nextMove}
            label={t('home.nextMoveReminder')}
            color={theme.colors.success}
          />

          <TouchableOpacity 
            style={[styles.debugButton, { backgroundColor: 'purple', marginTop: 10 }]}
            onPress={() => handleTestReschedule('movement')}
          >
            <Text style={styles.debugButtonText}>Test Replanif Mouvement</Text>
          </TouchableOpacity>
        </Card>

        {/* Section Debug */}
        <Card style={styles.debugCard}>
          <Text style={styles.debugTitle}>🔧 Debug - Système de Notifications</Text>
          
          <View style={styles.debugButtons}>
            <TouchableOpacity 
              style={[styles.debugButton, { backgroundColor: 'blue' }]}
              onPress={handleRefresh}
            >
              <Text style={styles.debugButtonText}>Actualiser</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.debugButton, { backgroundColor: 'green' }]}
              onPress={handleDebug}
            >
              <Text style={styles.debugButtonText}>Debug</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.debugButton, { backgroundColor: 'red' }]}
              onPress={handleForceReset}
            >
              <Text style={styles.debugButtonText}>RESET</Text>
            </TouchableOpacity>
          </View>

          {debugInfo ? (
            <View style={styles.debugInfoContainer}>
              <Text style={styles.debugInfoTitle}>Informations:</Text>
              <Text style={styles.debugInfo}>{debugInfo}</Text>
            </View>
          ) : null}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles (inchangés)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  actionCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
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
  nextReminderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.warning + '15',
    borderRadius: theme.borderRadius.sm,
  },
  nextReminderText: {
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  debugCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#6c757d',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  debugButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  debugButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.xs,
  },
  debugButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugInfoContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: '#e9ecef',
    borderRadius: theme.borderRadius.sm,
  },
  debugInfoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: theme.spacing.xs,
  },
  debugInfo: {
    fontSize: 11,
    color: '#6c757d',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default React.memo(HomeScreen);