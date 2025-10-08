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
import { useAuth } from '../contexts/AuthContext.web';
import { useMood } from '../contexts/MoodContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';

// Simple icon component for web
const SimpleIcon = ({ name, size, color }) => (
  <View style={[styles.icon, { width: size, height: size, backgroundColor: color }]}>
    <Text style={styles.iconText}>{name.charAt(0).toUpperCase()}</Text>
  </View>
);

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

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      1: '😢', // Very Sad
      2: '😔', // Sad
      3: '😐', // Neutral
      4: '😊', // Happy
      5: '😄', // Very Happy
    };
    return moodEmojis[mood] || '😐';
  };

  const getMoodDescription = (mood) => {
    const descriptions = {
      1: 'Very Sad',
      2: 'Sad',
      3: 'Neutral',
      4: 'Happy',
      5: 'Very Happy',
    };
    return descriptions[mood] || 'Unknown';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Hello, {user?.name || 'User'}! 👋
          </Text>
          <Text style={styles.subtitle}>
            How are you feeling today?
          </Text>
        </View>

        {/* Today's Mood Card */}
        <Card style={styles.moodCard}>
          <View style={styles.moodHeader}>
            <Text style={styles.moodTitle}>Today's Mood</Text>
            <Text style={styles.moodDate}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
          
          {todaysMood ? (
            <View style={styles.moodContent}>
              <Text style={styles.moodEmoji}>
                {getMoodEmoji(todaysMood.mood)}
              </Text>
              <Text style={styles.moodDescription}>
                {getMoodDescription(todaysMood.mood)}
              </Text>
              {todaysMood.note && (
                <Text style={styles.moodNote}>
                  "{todaysMood.note}"
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.noMoodContent}>
              <Text style={styles.noMoodText}>
                No mood entry for today yet
              </Text>
              <Button
                title="Add Mood"
                onPress={() => navigation.navigate('Mood')}
                variant="primary"
                size="small"
                style={styles.addMoodButton}
              />
            </View>
          )}
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <SimpleIcon name="trending-up" size={24} color={theme.colors.success} />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{analytics.totalEntries}</Text>
                <Text style={styles.statLabel}>Total Entries</Text>
              </View>
            </View>
          </Card>
          
          <Card style={styles.statCard}>
            <View style={styles.statContent}>
              <SimpleIcon name="calendar" size={24} color={theme.colors.info} />
              <View style={styles.statText}>
                <Text style={styles.statValue}>{analytics.currentStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionButton, { borderLeftColor: action.color }]}
                onPress={action.onPress}
              >
                <SimpleIcon name={action.icon} size={24} color={action.color} />
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Moods */}
        {moods.length > 0 && (
          <View style={styles.recentContainer}>
            <Text style={styles.sectionTitle}>Recent Moods</Text>
            <View style={styles.recentMoods}>
              {moods.slice(0, 5).map((mood, index) => (
                <Card key={index} style={styles.recentMoodCard}>
                  <View style={styles.recentMoodContent}>
                    <Text style={styles.recentMoodEmoji}>
                      {getMoodEmoji(mood.mood)}
                    </Text>
                    <View style={styles.recentMoodInfo}>
                      <Text style={styles.recentMoodDate}>
                        {new Date(mood.timestamp).toLocaleDateString()}
                      </Text>
                      <Text style={styles.recentMoodDescription}>
                        {getMoodDescription(mood.mood)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        )}
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
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  moodCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  moodHeader: {
    marginBottom: theme.spacing.md,
  },
  moodTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  moodDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  moodContent: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  moodDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  moodNote: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noMoodContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  noMoodText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  addMoodButton: {
    paddingHorizontal: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: theme.spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    borderLeftWidth: 4,
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  recentContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  recentMoods: {
    gap: theme.spacing.sm,
  },
  recentMoodCard: {
    padding: theme.spacing.sm,
  },
  recentMoodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentMoodEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  recentMoodInfo: {
    flex: 1,
  },
  recentMoodDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  recentMoodDescription: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  iconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default HomeScreen;