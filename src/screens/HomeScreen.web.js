import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import notificationService from '../services/notificationService';
import { useTranslation } from '../hooks/useTranslation';

const HomeScreen = () => {
  console.log('🌐 HomeScreen WEB version loaded!');
  const { waterIntake, movements, dailyGoals, userProfile, addWater, addMovement, getStats } = useHealth();
  const { t } = useTranslation();
  const stats = getStats();
  
  // Conseils traduits selon la langue
  const getDailyTip = () => {
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
  };
  const [nextWater, setNextWater] = useState(null);
  const [nextMove, setNextMove] = useState(null);
  const [timeUntilWater, setTimeUntilWater] = useState('');
  const [timeUntilMove, setTimeUntilMove] = useState('');

  // Mettre à jour les comptes à rebours toutes les minutes
  useEffect(() => {
    updateNextNotifications();
    const interval = setInterval(updateNextNotifications, 60000); // Toutes les minutes
    return () => clearInterval(interval);
  }, [userProfile]);

  const updateNextNotifications = async () => {
    const times = await notificationService.getNextNotificationTimes();
    setNextWater(times.nextWater);
    setNextMove(times.nextMove);

    if (times.nextWater) {
      setTimeUntilWater(formatTimeUntil(times.nextWater));
    }
    if (times.nextMove) {
      setTimeUntilMove(formatTimeUntil(times.nextMove));
    }
  };

  const formatTimeUntil = (targetDate) => {
    const now = new Date();
    const diff = targetDate - now;
    
    if (diff < 0) return 'Bientôt';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes} min`;
  };

  // Obtenir la date du jour formatée
  const today = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('fr-FR', dateOptions);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>💪 
            <Text style={styles.moText}>mo</Text>
            <Text style={styles.odText}>od</Text>
          </Text>
          <Text style={styles.subtitle}>Mouvement pour la Santé</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {/* Conseil du jour */}
        <Card style={styles.tipCard}>
          <MaterialIcons name="lightbulb" size={24} color={theme.colors.warning} />
          <Text style={styles.tipTitle}>{t('home.dailyTip')}</Text>
          <Text style={styles.tipText}>{getDailyTip()}</Text>
        </Card>

        {/* Hydratation */}
        <Card style={styles.actionCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="local-drink" size={32} color={theme.colors.info} />
            <Text style={styles.cardTitle}>Hydratation</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${stats.waterPercentage}%`, backgroundColor: theme.colors.info }
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
            <Text style={styles.buttonText}>J'ai bu de l'eau (250ml)</Text>
          </TouchableOpacity>

          {stats.waterRemaining > 0 && (
            <Text style={styles.remainingText}>
              Encore {stats.waterRemaining}ml à boire aujourd'hui
            </Text>
          )}

          {timeUntilWater && (
            <View style={styles.nextReminderBox}>
              <MaterialIcons name="alarm" size={16} color={theme.colors.info} />
              <Text style={styles.nextReminderText}>
                Prochain rappel dans {timeUntilWater}
              </Text>
            </View>
          )}
        </Card>

        {/* Mouvements */}
        <Card style={styles.actionCard}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="directions-run" size={32} color={theme.colors.success} />
            <Text style={styles.cardTitle}>Mouvements</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${stats.movementsPercentage}%`, backgroundColor: theme.colors.success }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {movements} / {dailyGoals.movements} mouvements ({Math.round(stats.movementsPercentage)}%)
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
            onPress={addMovement}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
            <Text style={styles.buttonText}>J'ai bougé !</Text>
          </TouchableOpacity>

          {stats.movementsRemaining > 0 && (
            <Text style={styles.remainingText}>
              Encore {stats.movementsRemaining} mouvements à faire
            </Text>
          )}

          {timeUntilMove && (
            <View style={styles.nextReminderBox}>
              <MaterialIcons name="alarm" size={16} color={theme.colors.success} />
              <Text style={styles.nextReminderText}>
                Prochain rappel dans {timeUntilMove}
              </Text>
            </View>
          )}
        </Card>

        {/* Statistiques rapides */}
        <View style={styles.quickStats}>
          <Card style={styles.statCard}>
            <MaterialIcons name="emoji-events" size={32} color={theme.colors.warning} />
            <Text style={styles.statValue}>{movements + Math.floor(waterIntake / 250)}</Text>
            <Text style={styles.statLabel}>Actions aujourd'hui</Text>
          </Card>
          
          <Card style={styles.statCard}>
            <MaterialIcons name="trending-up" size={32} color={theme.colors.primary} />
            <Text style={styles.statValue}>{Math.round((stats.waterPercentage + stats.movementsPercentage) / 2)}%</Text>
            <Text style={styles.statLabel}>Objectifs atteints</Text>
          </Card>
        </View>

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
  quickStats: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
