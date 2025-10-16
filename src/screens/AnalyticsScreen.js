import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { useMood } from '../contexts/MoodContext';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const { width: screenWidth } = Dimensions.get('window');

const AnalyticsScreen = () => {
  const { moods, getMoodAnalytics } = useMood();
  const { t } = useTranslation();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    setAnalytics(getMoodAnalytics());
  }, [moods]);

  if (!analytics || moods.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {t('analytics.noDataAvailable')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Prepare chart data
  const chartConfig = {
    backgroundColor: theme.colors.white,
    backgroundGradientFrom: theme.colors.white,
    backgroundGradientTo: theme.colors.white,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  // Mood trend data for line chart
  const moodTrendData = {
    labels: analytics.moodTrend.slice(-7).map((item, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }),
    datasets: [
      {
        data: analytics.moodTrend.slice(-7).map(item => item.value),
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  // Mood distribution data for pie chart
  const moodDistributionData = Object.entries(analytics.moodDistribution).map(
    ([label, count], index) => ({
      name: label,
      population: count,
      color: [
        '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#7C2D12'
      ][index % 5],
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    })
  );

  // Weekly mood comparison
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: Array.from({ length: 7 }, (_, i) => {
          const dayMoods = moods.filter(mood => {
            const moodDate = new Date(mood.timestamp);
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - (6 - i));
            return moodDate.toDateString() === targetDate.toDateString();
          });
          return dayMoods.length > 0 
            ? dayMoods.reduce((sum, mood) => sum + mood.value, 0) / dayMoods.length
            : 0;
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Summary Stats */}
        <Card>
          <Text style={styles.cardTitle}>{t('analytics.moodSummary')}</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {analytics.averageMood.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>{t('analytics.averageMood')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {moods.length}
              </Text>
              <Text style={styles.statLabel}>{t('analytics.totalEntries')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {analytics.weeklyAverage.toFixed(1)}
              </Text>
              <Text style={styles.statLabel}>{t('analytics.thisWeek')}</Text>
            </View>
          </View>
        </Card>

        {/* Mood Trend Chart */}
        <Card>
          <Text style={styles.cardTitle}>7-Day Mood Trend</Text>
          <LineChart
            data={moodTrendData}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withDots
            withShadow={false}
            withVerticalLabels
            withHorizontalLabels
            fromZero
            segments={4}
          />
        </Card>

        {/* Weekly Comparison */}
        <Card>
          <Text style={styles.cardTitle}>Weekly Overview</Text>
          <BarChart
            data={weeklyData}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
            segments={4}
          />
        </Card>

        {/* Mood Distribution */}
        <Card>
          <Text style={styles.cardTitle}>Mood Distribution</Text>
          <PieChart
            data={moodDistributionData}
            width={screenWidth - 60}
            height={200}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={styles.chart}
            absolute
          />
        </Card>

        {/* Insights */}
        <Card>
          <Text style={styles.cardTitle}>Insights</Text>
          <View style={styles.insights}>
            <View style={styles.insightItem}>
              <Text style={styles.insightTitle}>Most Common Mood</Text>
              <Text style={styles.insightValue}>
                {Object.entries(analytics.moodDistribution).reduce((a, b) => 
                  analytics.moodDistribution[a[0]] > analytics.moodDistribution[b[0]] ? a : b
                )[0]}
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightTitle}>Streak</Text>
              <Text style={styles.insightValue}>
                {calculateStreak(moods)} days
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightTitle}>Best Day</Text>
              <Text style={styles.insightValue}>
                {getBestDay(moods)}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper functions
const calculateStreak = (moods) => {
  if (moods.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    const hasEntry = moods.some(mood => 
      new Date(mood.timestamp).toDateString() === checkDate.toDateString()
    );
    
    if (hasEntry) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const getBestDay = (moods) => {
  if (moods.length === 0) return 'N/A';
  
  const bestMood = moods.reduce((best, current) => 
    current.value > best.value ? current : best
  );
  
  return new Date(bestMood.timestamp).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  chart: {
    marginVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  insights: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  insightItem: {
    alignItems: 'center',
    flex: 1,
  },
  insightTitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default AnalyticsScreen;
