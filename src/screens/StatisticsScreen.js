import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const StatisticsScreen = () => {
  console.log('📊 StatisticsScreen MOBILE version loaded!');
  const { history, dailyGoals, waterIntake, movements } = useHealth();
  const { t } = useTranslation();

  // Obtenir les 7 derniers jours
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Chercher les données pour ce jour
      const dayData = history.find(item => item.date === dateStr);
      
      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString(t('common.locale'), { weekday: 'short' }),
        water: dayData?.water || (i === 0 ? waterIntake : 0),
        movements: dayData?.movements || (i === 0 ? movements : 0),
      });
    }
    
    return days;
  };

  const last7Days = getLast7Days();

  // Calculer les moyennes
  const calculateAverage = (data, key) => {
    const sum = data.reduce((acc, day) => acc + (day[key] || 0), 0);
    return Math.round(sum / data.length);
  };

  const avgWater = calculateAverage(last7Days, 'water');
  const avgMovements = calculateAverage(last7Days, 'movements');

  // Trouver le max pour l'échelle du graphique
  const maxWater = Math.max(...last7Days.map(d => d.water), dailyGoals.water);
  const maxMovements = Math.max(...last7Days.map(d => d.movements), dailyGoals.movements);

  // Calculer le pourcentage de réussite
  const successRate = last7Days.filter(day => 
    day.water >= dailyGoals.water && day.movements >= dailyGoals.movements
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('statistics.title')}</Text>
          <Text style={styles.subtitle}>{t('statistics.subtitle')}</Text>
        </View>

        {/* Résumé rapide */}
        <View style={styles.summaryContainer}>
          <Card style={styles.summaryCard}>
            <MaterialIcons name="local-drink" size={24} color={theme.colors.info} />
            <Text style={styles.summaryValue}>{avgWater} mL</Text>
            <Text style={styles.summaryLabel}>{t('statistics.averageWaterPerDay')}</Text>
          </Card>
          
          <Card style={styles.summaryCard}>
            <MaterialIcons name="directions-run" size={24} color={theme.colors.success} />
            <Text style={styles.summaryValue}>{avgMovements}</Text>
            <Text style={styles.summaryLabel}>{t('statistics.avgMovementsPerDay')}</Text>
          </Card>
          
          <Card style={styles.summaryCard}>
            <MaterialIcons name="emoji-events" size={24} color={theme.colors.warning} />
            <Text style={styles.summaryValue}>{successRate}/7</Text>
            <Text style={styles.summaryLabel}>{t('statistics.goalsAchieved')}</Text>
          </Card>
        </View>

        {/* Graphique Hydratation */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <MaterialIcons name="local-drink" size={28} color={theme.colors.info} />
            <Text style={styles.chartTitle}>{t('statistics.hydrationMl')}</Text>
          </View>
          
          {/* Ligne d'objectif */}
          <View style={styles.goalLineContainer}>
            <View style={styles.goalLine} />
            <Text style={styles.goalLineText}>{t('statistics.goal')}: {dailyGoals.water} mL</Text>
          </View>

          <View style={styles.chartContainer}>
            {last7Days.map((day, index) => {
              const percentage = (day.water / maxWater) * 100;
              const isGoalMet = day.water >= dailyGoals.water;
              
              return (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barValue}>{day.water}</Text>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar,
                        { 
                          height: `${Math.max(percentage, 5)}%`,
                          backgroundColor: isGoalMet ? theme.colors.success : theme.colors.info,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{day.dayName}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Graphique Mouvements */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <MaterialIcons name="directions-run" size={28} color={theme.colors.success} />
            <Text style={styles.chartTitle}>{t('statistics.movements')}</Text>
          </View>
          
          {/* Ligne d'objectif */}
          <View style={styles.goalLineContainer}>
            <View style={styles.goalLine} />
            <Text style={styles.goalLineText}>{t('statistics.goalWithValue', { value: dailyGoals.movements })}</Text>
          </View>

          <View style={styles.chartContainer}>
            {last7Days.map((day, index) => {
              const percentage = (day.movements / maxMovements) * 100;
              const isGoalMet = day.movements >= dailyGoals.movements;
              
              return (
                <View key={index} style={styles.barContainer}>
                  <Text style={styles.barValue}>{day.movements}</Text>
                  <View style={styles.barWrapper}>
                    <View 
                      style={[
                        styles.bar,
                        { 
                          height: `${Math.max(percentage, 5)}%`,
                          backgroundColor: isGoalMet ? theme.colors.success : theme.colors.primary,
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{day.dayName}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Conseils basés sur les stats */}
        <Card style={styles.tipsCard}>
          <MaterialIcons name="lightbulb" size={24} color={theme.colors.warning} />
          <Text style={styles.tipsTitle}>{t('statistics.analysisTitle')}</Text>
          <View style={styles.tipsList}>
            {avgWater < dailyGoals.water && (
              <Text style={styles.tipText}>
                {t('statistics.tips.increaseHydration', { percentage: Math.round((avgWater/dailyGoals.water)*100) })}
              </Text>
            )}
            {avgWater >= dailyGoals.water && (
              <Text style={[styles.tipText, { color: theme.colors.success }]}>
                {t('statistics.tips.hydrationGoalMet')}
              </Text>
            )}
            {avgMovements < dailyGoals.movements && (
              <Text style={styles.tipText}>
                {t('statistics.tips.moveMore', { current: avgMovements, goal: dailyGoals.movements })}
              </Text>
            )}
            {avgMovements >= dailyGoals.movements && (
              <Text style={[styles.tipText, { color: theme.colors.success }]}>
                {t('statistics.tips.movementGoalMet')}
              </Text>
            )}
            {successRate >= 5 && (
              <Text style={[styles.tipText, { color: theme.colors.success }]}>
                {t('statistics.tips.greatConsistency')}
              </Text>
            )}
          </View>
        </Card>

        {/* Impact santé */}
        <Card style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <MaterialIcons name="favorite" size={32} color={theme.colors.error} />
            <Text style={styles.impactTitle}>{t('statistics.impactTitle')}</Text>
          </View>
          <Text style={styles.impactText}>
            {t('statistics.impactDescription', {
              days: last7Days.length,
              movements: last7Days.reduce((acc, day) => acc + day.movements, 0),
              water: (last7Days.reduce((acc, day) => acc + day.water, 0) / 1000).toFixed(1)
            })}
          </Text>
          <Text style={styles.impactSubtext}>
            {t('statistics.impactSubtext')}
          </Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginVertical: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  goalLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  goalLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.success,
    borderStyle: 'dashed',
  },
  goalLineText: {
    fontSize: 11,
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: theme.spacing.lg,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barValue: {
    fontSize: 10,
    color: theme.colors.text,
    marginBottom: 4,
    fontWeight: '600',
  },
  barWrapper: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 10,
  },
  barLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    textTransform: 'capitalize',
  },
  tipsCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.warning + '15',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tipsList: {
    marginTop: theme.spacing.xs,
  },
  tipText: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.xs,
  },
  impactCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary + '10',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  impactText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  impactHighlight: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  impactSubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default StatisticsScreen;

