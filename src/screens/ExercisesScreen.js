import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

const ExercisesScreen = () => {
  console.log('🏃 ExercisesScreen MOBILE version loaded!');
  const { t } = useTranslation();
  const exercises = [
    {
      id: 1,
      title: t('exercises.exerciseList.squats.title'),
      duration: t('exercises.exerciseList.squats.duration'),
      icon: 'fitness-center',
      description: t('exercises.exerciseList.squats.description'),
    },
    {
      id: 2,
      title: t('exercises.exerciseList.stretching.title'),
      duration: t('exercises.exerciseList.stretching.duration'),
      icon: 'self-improvement',
      description: t('exercises.exerciseList.stretching.description'),
    },
    {
      id: 3,
      title: t('exercises.exerciseList.walking.title'),
      duration: t('exercises.exerciseList.walking.duration'),
      icon: 'directions-walk',
      description: t('exercises.exerciseList.walking.description'),
    },
    {
      id: 4,
      title: t('exercises.exerciseList.stairs.title'),
      duration: t('exercises.exerciseList.stairs.duration'),
      icon: 'stairs',
      description: t('exercises.exerciseList.stairs.description'),
    },
  ];

  const locations = [
    {
      id: 1,
      title: t('exercises.locations.office.title'),
      icon: 'business',
      tips: [
        t('exercises.locations.office.tips.0'),
        t('exercises.locations.office.tips.1'),
        t('exercises.locations.office.tips.2')
      ],
    },
    {
      id: 2,
      title: t('exercises.locations.home.title'),
      icon: 'home',
      tips: [
        t('exercises.locations.home.tips.0'),
        t('exercises.locations.home.tips.1'),
        t('exercises.locations.home.tips.2')
      ],
    },
    {
      id: 3,
      title: t('exercises.locations.outdoor.title'),
      icon: 'park',
      tips: [
        t('exercises.locations.outdoor.tips.0'),
        t('exercises.locations.outdoor.tips.1'),
        t('exercises.locations.outdoor.tips.2')
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('exercises.title')}</Text>
          <Text style={styles.subtitle}>{t('exercises.subtitle')}</Text>
        </View>

        {/* Exercices recommandés */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('exercises.quickExercises')}</Text>
          {exercises.map((exercise) => (
            <Card key={exercise.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <View style={styles.iconContainer}>
                  <MaterialIcons name={exercise.icon} size={32} color={theme.colors.primary} />
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseTitle}>{exercise.title}</Text>
                  <Text style={styles.exerciseDuration}>
                    <MaterialIcons name="schedule" size={14} /> {exercise.duration}
                  </Text>
                </View>
              </View>
              <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </Card>
          ))}
        </View>

        {/* Lieux d'activité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('exercises.whereToMove')}</Text>
          {locations.map((location) => (
            <Card key={location.id} style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <MaterialIcons name={location.icon} size={28} color={theme.colors.success} />
                <Text style={styles.locationTitle}>{location.title}</Text>
              </View>
              <View style={styles.tipsList}>
                {location.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <MaterialIcons name="check-circle" size={16} color={theme.colors.success} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </Card>
          ))}
        </View>

        {/* Conseils */}
        <Card style={styles.tipsCard}>
          <MaterialIcons name="info" size={24} color={theme.colors.info} />
          <Text style={styles.tipsTitle}>{t('exercises.didYouKnow')}</Text>
          <Text style={styles.tipsText}>
            {t('exercises.tipText')}
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
    textAlign: 'center',
  },
  section: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  exerciseCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  exerciseDuration: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  exerciseDescription: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  locationCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  tipsList: {
    marginTop: theme.spacing.xs,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  tipsCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + '15',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
    marginBottom: theme.spacing.xl,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  tipsText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
});

export default ExercisesScreen;

