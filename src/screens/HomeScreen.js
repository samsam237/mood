// HomeScreen.js - VERSION FINALE PROPRE
import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

import { useHealth } from '../contexts/HealthContext';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const HomeScreen = () => {
  const { waterIntake, movements, dailyGoals, addWater, addMovement, getStats } = useHealth();
  const { t } = useTranslation();
  
  const stats = getStats();

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
        </Card>

        {/* 🔥 SECTION STATUT SIMPLIFIÉE */}
        <Card style={styles.statusCard}>
          <Text style={styles.statusTitle}>📊 Votre journée</Text>
          <View style={styles.statusItem}>
            <MaterialIcons name="notifications" size={20} color={theme.colors.info} />
            <Text style={styles.statusText}>Rappels activés</Text>
          </View>
          <View style={styles.statusItem}>
            <MaterialIcons name="local-drink" size={20} color={theme.colors.info} />
            <Text style={styles.statusText}>Hydratation suivie</Text>
          </View>
          <View style={styles.statusItem}>
            <MaterialIcons name="directions-run" size={20} color={theme.colors.success} />
            <Text style={styles.statusText}>Mouvements enregistrés</Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

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