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
  console.log('🏃 ExercisesScreen WEB version loaded!');
  const { t } = useTranslation();
  const exercises = [
    {
      id: 1,
      title: 'Squats',
      duration: '2-3 minutes',
      icon: 'fitness-center',
      description: 'Flexions des jambes pour renforcer les muscles',
    },
    {
      id: 2,
      title: 'Étirements',
      duration: '5 minutes',
      icon: 'self-improvement',
      description: 'Étirer bras, jambes et dos pour la flexibilité',
    },
    {
      id: 3,
      title: 'Marche',
      duration: '10-15 minutes',
      icon: 'directions-walk',
      description: 'Marcher autour du bureau ou à l\'extérieur',
    },
    {
      id: 4,
      title: 'Escaliers',
      duration: '3-5 minutes',
      icon: 'stairs',
      description: 'Monter et descendre les escaliers',
    },
  ];

  const locations = [
    {
      id: 1,
      title: 'Au bureau',
      icon: 'business',
      tips: ['Marcher pendant les appels', 'Utiliser un bureau debout', 'Faire des étirements'],
    },
    {
      id: 2,
      title: 'À la maison',
      icon: 'home',
      tips: ['Faire des squats devant la TV', 'Jardiner', 'Monter les escaliers'],
    },
    {
      id: 3,
      title: 'Extérieur',
      icon: 'park',
      tips: ['Promenade dans le parc', 'Vélo', 'Course légère'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>💪 Exercices</Text>
          <Text style={styles.subtitle}>Des mouvements simples pour rester actif</Text>
        </View>

        {/* Exercices recommandés */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercices Rapides</Text>
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
          <Text style={styles.sectionTitle}>Où Bouger ?</Text>
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
          <Text style={styles.tipsTitle}>Le saviez-vous ?</Text>
          <Text style={styles.tipsText}>
            Même de petits mouvements de 2-3 minutes, répétés tout au long de la journée, 
            ont un impact significatif sur votre santé et réduisent les risques liés à la sédentarité.
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

