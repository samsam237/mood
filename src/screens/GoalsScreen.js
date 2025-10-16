import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useHealth } from '../contexts/HealthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';
import notificationService from '../services/notificationService';
import { useTranslation } from '../hooks/useTranslation';
import CustomNotification from '../components/common/CustomNotification';
import { useCustomNotification } from '../hooks/useCustomNotification';

const GoalsScreen = () => {
  console.log('🎯 GoalsScreen MOBILE version loaded!');
  const { dailyGoals, userProfile, updateGoals, updateUserProfile } = useHealth();
  const { t } = useTranslation();
  const { notification, showSuccess, showError, hideNotification } = useCustomNotification();
  const [waterGoal, setWaterGoal] = useState(dailyGoals.water.toString());
  const [movementsGoal, setMovementsGoal] = useState(dailyGoals.movements.toString());
  const [waterFrequency, setWaterFrequency] = useState('30');
  const [moveFrequency, setMoveFrequency] = useState('30');

  useEffect(() => {
    // Charger les fréquences existantes
    if (userProfile) {
      setWaterFrequency((userProfile.waterReminderFrequency || 30).toString());
      setMoveFrequency((userProfile.moveReminderFrequency || 30).toString());
    }
  }, [userProfile]);

  const handleSaveGoals = async () => {
    try {
      // Sauvegarder les objectifs
      await updateGoals({
        water: parseInt(waterGoal) || 2000,
        movements: parseInt(movementsGoal) || 12,
      });

      // Sauvegarder les fréquences de rappel
      await updateUserProfile({
        waterReminderFrequency: parseInt(waterFrequency) || 30,
        moveReminderFrequency: parseInt(moveFrequency) || 30,
      });

      // Réinitialiser les rappels avec les nouvelles fréquences
      const result = await notificationService.initializeReminders();
      
      if (result.success) {
        showSuccess(t('goals.goalsUpdatedSuccess'));
      } else {
        showError(t('goals.goalsUpdatedError', { error: result.error }));
      }
    } catch (error) {
      showError(t('goals.saveError'));
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('goals.title')}</Text>
          <Text style={styles.subtitle}>{t('goals.subtitle')}</Text>
        </View>

        {/* Objectif Hydratation */}
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="local-drink" size={32} color={theme.colors.info} />
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>{t('goals.dailyHydration')}</Text>
              <Text style={styles.goalSubtitle}>{t('goals.waterQuantityPerDay')}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={waterGoal}
              onChangeText={setWaterGoal}
              keyboardType="numeric"
              placeholder="2000"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.unit}>mL</Text>
          </View>

          <View style={styles.recommendationBox}>
            <MaterialIcons name="info" size={16} color={theme.colors.info} />
            <Text style={styles.recommendationText}>
              {t('goals.waterRecommended')}
            </Text>
          </View>
        </Card>

        {/* Objectif Mouvements */}
        <Card style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="directions-run" size={32} color={theme.colors.success} />
            </View>
            <View style={styles.goalInfo}>
              <Text style={styles.goalTitle}>{t('goals.dailyMovements')}</Text>
              <Text style={styles.goalSubtitle}>{t('goals.movementsPerDay')}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={movementsGoal}
              onChangeText={setMovementsGoal}
              keyboardType="numeric"
              placeholder="12"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.unit}>{t('goals.movements')}</Text>
          </View>

          <View style={styles.recommendationBox}>
            <MaterialIcons name="info" size={16} color={theme.colors.success} />
            <Text style={styles.recommendationText}>
              {t('goals.movementsRecommended')}
            </Text>
          </View>
        </Card>

        {/* Fréquence des rappels */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('goals.reminderFrequency')}</Text>
          
          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="notifications" size={32} color={theme.colors.info} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{t('goals.hydrationReminders')}</Text>
                <Text style={styles.goalSubtitle}>{t('goals.reminderInterval')}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={waterFrequency}
                onChangeText={setWaterFrequency}
                keyboardType="numeric"
                placeholder="30"
                placeholderTextColor={theme.colors.textSecondary}
              />
              <Text style={styles.unit}>{t('goals.minutes')}</Text>
            </View>

            <View style={styles.recommendationBox}>
              <MaterialIcons name="info" size={16} color={theme.colors.info} />
              <Text style={styles.recommendationText}>
                {t('goals.waterReminderRecommended')}
              </Text>
            </View>
          </Card>

          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="notifications-active" size={32} color={theme.colors.success} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={styles.goalTitle}>{t('goals.movementReminders')}</Text>
                <Text style={styles.goalSubtitle}>{t('goals.reminderInterval')}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={moveFrequency}
                onChangeText={setMoveFrequency}
                keyboardType="numeric"
                placeholder="60"
                placeholderTextColor={theme.colors.textSecondary}
              />
              <Text style={styles.unit}>{t('goals.minutes')}</Text>
            </View>

            <View style={styles.recommendationBox}>
              <MaterialIcons name="info" size={16} color={theme.colors.success} />
              <Text style={styles.recommendationText}>
                {t('goals.movementReminderRecommended')}
              </Text>
            </View>
          </Card>
        </View>

        {/* Conseils */}
        <Card style={styles.tipsCard}>
          <MaterialIcons name="lightbulb" size={24} color={theme.colors.warning} />
          <Text style={styles.tipsTitle}>{t('goals.tipsTitle')}</Text>
          <Text style={styles.tipsText}>
            {t('goals.tip1')}{'\n'}
            {t('goals.tip2')}{'\n'}
            {t('goals.tip3')}{'\n'}
            {t('goals.tip4')}
          </Text>
        </Card>

        {/* Bouton Enregistrer */}
        <View style={styles.buttonContainer}>
          <Button
            title={t('goals.saveGoals')}
            onPress={handleSaveGoals}
            variant="primary"
            size="large"
          />
        </View>

      </ScrollView>
      
      {/* Notification personnalisée */}
      <CustomNotification
        visible={notification.visible}
        onClose={hideNotification}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        duration={notification.duration}
        position={notification.position}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  goalCard: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  goalSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  unit: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
  recommendationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.info + '10',
    borderRadius: theme.borderRadius.sm,
  },
  recommendationText: {
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
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
  tipsText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});

export default GoalsScreen;

