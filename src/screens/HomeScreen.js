import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../contexts/MoodContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { moods, getMoodAnalytics } = useMood();
  
  const analytics = getMoodAnalytics();
  const todaysMood = moods.find(mood => 
    new Date(mood.timestamp).toDateString() === new Date().toDateString()
  );

  const quickActions = [
    {
      title: 'Add Mood',
      icon: 'add-circle',
      onPress: () => navigation.navigate('Mood'),
      color: theme.colors.primary,
    },
    {
      title: 'View Analytics',
      icon: 'analytics',
      onPress: () => navigation.navigate('Analytics'),
      color: theme.colors.secondary,
    },
    {
      title: 'Read Journal',
      icon: 'picture-as-pdf',
      onPress: () => navigation.navigate('PDFViewer', { 
        pdfUrl: 'https://example.com/sample.pdf' 
      }),
      color: theme.colors.info,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.name || 'User'}! 👋
          </Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>

        {/* Today's Mood Status */}
        <Card style={styles.moodCard}>
          <Text style={styles.cardTitle}>Today's Mood</Text>
          {todaysMood ? (
            <View style={styles.moodStatus}>
              <Text style={styles.moodEmoji}>{todaysMood.emoji}</Text>
              <Text style={styles.moodLabel}>{todaysMood.label}</Text>
              <Text style={styles.moodNote}>{todaysMood.note}</Text>
            </View>
          ) : (
            <View style={styles.noMood}>
              <Text style={styles.noMoodText}>No mood recorded today</Text>
              <Button
                title="Add Your Mood"
                onPress={() => navigation.navigate('Mood')}
                variant="primary"
                size="small"
                style={styles.addMoodButton}
              />
            </View>
          )}
        </Card>

        {/* Quick Actions */}
        <Card>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={action.onPress}
                accessibilityRole="button"
                accessibilityLabel={action.title}
              >
                <Icon name={action.icon} size={24} color={theme.colors.white} />
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Weekly Summary */}
        <Card>
          <Text style={styles.cardTitle}>This Week</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {analytics.weeklyAverage.toFixed(1)}
              </Text>
              <Text style={styles.summaryLabel}>Avg Mood</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {moods.filter(mood => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(mood.timestamp) >= weekAgo;
                }).length}
              </Text>
              <Text style={styles.summaryLabel}>Entries</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>
                {Math.max(0, analytics.weeklyAverage - 3).toFixed(1)}
              </Text>
              <Text style={styles.summaryLabel}>Improvement</Text>
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  moodCard: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  moodStatus: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  moodNote: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  noMood: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  noMoodText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  addMoodButton: {
    marginTop: theme.spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  actionText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '600',
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default HomeScreen;
