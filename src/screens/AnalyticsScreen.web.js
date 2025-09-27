import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useMood } from '../contexts/MoodContext';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';

const { width } = Dimensions.get('window');

const AnalyticsScreen = () => {
  const { moods, getMoodAnalytics } = useMood();
  const analytics = getMoodAnalytics();

  // Données pour les graphiques (version simplifiée pour le web)
  const chartData = {
    lineData: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        data: [3, 4, 3, 5, 4, 3, 4], // Données d'exemple
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }]
    },
    pieData: [
      { name: 'Très triste', population: 2, color: '#FF6B6B', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Triste', population: 3, color: '#FF8E8E', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Neutre', population: 5, color: '#FFD93D', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Content', population: 8, color: '#6BCF7F', legendFontColor: '#7F7F7F', legendFontSize: 15 },
      { name: 'Très heureux', population: 4, color: '#4ECDC4', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ]
  };

  const renderSimpleChart = (title, data, type = 'bar') => (
    <Card style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartContainer}>
        {type === 'bar' ? (
          <View style={styles.barChart}>
            {data.map((value, index) => (
              <View key={index} style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: (value / Math.max(...data)) * 100,
                      backgroundColor: theme.colors.primary
                    }
                  ]} 
                />
                <Text style={styles.barLabel}>{['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.pieChart}>
            <Text style={styles.pieText}>Graphique en secteurs</Text>
            <Text style={styles.pieSubtext}>Données de répartition des humeurs</Text>
          </View>
        )}
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>
            Analysez vos tendances d'humeur
          </Text>
        </View>

        {/* Statistiques principales */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Statistiques Générales</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{analytics.weeklyAverage.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Moyenne Hebdomadaire</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moods.length}</Text>
              <Text style={styles.statLabel}>Entrées Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{analytics.trend}</Text>
              <Text style={styles.statLabel}>Tendance</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{analytics.weeklyAverage > 3 ? '📈' : '📉'}</Text>
              <Text style={styles.statLabel}>Direction</Text>
            </View>
          </View>
        </Card>

        {/* Graphique en barres */}
        {renderSimpleChart('Évolution Hebdomadaire', [3, 4, 3, 5, 4, 3, 4], 'bar')}

        {/* Graphique en secteurs */}
        {renderSimpleChart('Répartition des Humeurs', chartData.pieData, 'pie')}

        {/* Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.cardTitle}>Insights</Text>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <Text style={styles.insightEmoji}>📊</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Moyenne Stable</Text>
                <Text style={styles.insightText}>
                  Votre humeur moyenne est de {analytics.weeklyAverage.toFixed(1)}/5 cette semaine.
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightEmoji}>🎯</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Objectif Atteint</Text>
                <Text style={styles.insightText}>
                  Vous avez enregistré {moods.length} entrées cette semaine.
                </Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightEmoji}>💡</Text>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Conseil</Text>
                <Text style={styles.insightText}>
                  Continuez à suivre votre humeur quotidiennement pour de meilleurs insights.
                </Text>
              </View>
            </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    marginVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  chartCard: {
    marginBottom: theme.spacing.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chartContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    width: '100%',
    justifyContent: 'space-around',
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    marginBottom: theme.spacing.xs,
    borderRadius: 2,
  },
  barLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  pieChart: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  pieText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  pieSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  insightsCard: {
    marginBottom: theme.spacing.xl,
  },
  insightsList: {
    gap: theme.spacing.md,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  insightText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default AnalyticsScreen;
