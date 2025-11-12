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
  
  // 🔥 ÉTATS POUR SUIVRE LES CHAMPS MODIFIÉS
  const [modifiedFields, setModifiedFields] = useState({});
  const [originalData, setOriginalData] = useState(null);
  
  // États pour chaque champ
  const [waterGoal, setWaterGoal] = useState('');
  const [movementsGoal, setMovementsGoal] = useState('');
  const [waterFrequency, setWaterFrequency] = useState('');
  const [moveFrequency, setMoveFrequency] = useState('');

  // 🔥 CHARGEMENT INITIAL DES DONNÉES
  useEffect(() => {
    if (dailyGoals && userProfile && !originalData) {
      const original = {
        waterGoal: dailyGoals.water.toString(),
        movementsGoal: dailyGoals.movements.toString(),
        waterFrequency: (userProfile.waterReminderFrequency || 120 * 60).toString(),
        moveFrequency: (userProfile.moveReminderFrequency || 60 * 60).toString()
      };
      
      setOriginalData(original);
      
      // Initialiser tous les champs
      setWaterGoal(original.waterGoal);
      setMovementsGoal(original.movementsGoal);
      setWaterFrequency(original.waterFrequency);
      setMoveFrequency(original.moveFrequency);
      
      // Réinitialiser les champs modifiés
      setModifiedFields({});
    }
  }, [dailyGoals, userProfile, originalData]);

  // 🔥 FONCTIONS POUR DÉTECTER LES MODIFICATIONS
  const handleFieldChange = (field, value, originalValue) => {
    const hasChanged = value !== originalValue;
    
    setModifiedFields(prev => ({
      ...prev,
      [field]: hasChanged ? value : undefined
    }));
  };

  const handleWaterGoalChange = (text) => {
    setWaterGoal(text);
    handleFieldChange('waterGoal', text, originalData?.waterGoal || '');
  };

  const handleMovementsGoalChange = (text) => {
    setMovementsGoal(text);
    handleFieldChange('movementsGoal', text, originalData?.movementsGoal || '');
  };

  // 🔥 LES CHAMPS DE FRÉQUENCE SONT MAINTENANT GRISÉS ET NON MODIFIABLES
  const handleWaterFrequencyChange = (text) => {
    // Désactivé - ne fait rien
    return;
  };

  const handleMoveFrequencyChange = (text) => {
    // Désactivé - ne fait rien
    return;
  };

  // 🔥 VERSION INTELLIGENTE DE handleSaveGoals
  const handleSaveGoals = async () => {
    try {
      // 🔥 FILTRER SEULEMENT LES CHAMPS MODIFIÉS (EXCLURE LES FRÉQUENCES)
      const goalsUpdates = {};
      const profileUpdates = {};

      // Objectifs modifiés (SEULEMENT CES CHAMPS SONT MODIFIABLES)
      if (modifiedFields.waterGoal !== undefined) {
        goalsUpdates.water = parseInt(modifiedFields.waterGoal) || 2000;
      }
      if (modifiedFields.movementsGoal !== undefined) {
        goalsUpdates.movements = parseInt(modifiedFields.movementsGoal) || 12;
      }

      // 🔥 LES FRÉQUENCES NE SONT PLUS MODIFIABLES - ELLES RESTENT FIXES
      // waterFrequency et moveFrequency conservent leurs valeurs par défaut

      // 🔥 VÉRIFIER S'IL Y A DES MODIFICATIONS
      const hasGoalsUpdates = Object.keys(goalsUpdates).length > 0;

      if (!hasGoalsUpdates) {
        showSuccess('Aucune modification à sauvegarder');
        return;
      }

      console.log('📝 Objectifs à mettre à jour:', goalsUpdates);

      // 🔥 SAUVEGARDER LES MODIFICATIONS (OBJECTIFS SEULEMENT)
      if (hasGoalsUpdates) {
        await updateGoals(goalsUpdates);
      }

      showSuccess('Objectifs mis à jour avec succès');

      // 🔥 RÉINITIALISER LES CHAMPS MODIFIÉS
      setModifiedFields({});
      setOriginalData({
        waterGoal: waterGoal,
        movementsGoal: movementsGoal,
        waterFrequency: waterFrequency, // Conserve les valeurs originales
        moveFrequency: moveFrequency    // Conserve les valeurs originales
      });

    } catch (error) {
      showError(t('goals.saveError'));
      console.error(error);
    }
  };

  // 🔥 FONCTION POUR CONVERTIR LES SECONDES EN MINUTES POUR L'AFFICHAGE
  const formatFrequencyDisplay = (seconds) => {
    const minutes = Math.round(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête avec indicateur de modifications */}
        <View style={styles.header}>
          <Text style={styles.title}>{t('goals.title')}</Text>
          <Text style={styles.subtitle}>{t('goals.subtitle')}</Text>
          
          {/* 🔥 INDICATEUR DE MODIFICATIONS */}
          {Object.keys(modifiedFields).length > 0 && (
            <View style={styles.modifiedIndicator}>
              <MaterialIcons name="edit" size={16} color={theme.colors.warning} />
              <Text style={styles.modifiedText}>
                {Object.keys(modifiedFields).length} modification(s) en attente
              </Text>
            </View>
          )}
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
              style={[
                styles.input,
                modifiedFields.waterGoal !== undefined && styles.modifiedInput
              ]}
              value={waterGoal}
              onChangeText={handleWaterGoalChange}
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
              style={[
                styles.input,
                modifiedFields.movementsGoal !== undefined && styles.modifiedInput
              ]}
              value={movementsGoal}
              onChangeText={handleMovementsGoalChange}
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

        {/* Fréquence des rappels - SECTION GRISÉE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('goals.reminderFrequency')}</Text>
          <Text style={styles.disabledSectionSubtitle}>
            Les fréquences de rappel sont optimisées automatiquement
          </Text>
          
          {/* 🔥 CARTE GRISÉE POUR RAPPELS HYDRATION */}
          <Card style={[styles.goalCard, styles.disabledCard]}>
            <View style={styles.goalHeader}>
              <View style={[styles.iconContainer, styles.disabledIcon]}>
                <MaterialIcons name="notifications" size={32} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={[styles.goalTitle, styles.disabledText]}>{t('goals.hydrationReminders')}</Text>
                <Text style={[styles.goalSubtitle, styles.disabledText]}>{t('goals.reminderInterval')}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formatFrequencyDisplay(parseInt(waterFrequency) || 120 * 60)}
                onChangeText={handleWaterFrequencyChange}
                editable={false}
                keyboardType="numeric"
                placeholder="120 min"
                placeholderTextColor={theme.colors.textSecondary}
              />
              <Text style={[styles.unit, styles.disabledText]}>{t('goals.minutes')}</Text>
            </View>

            <View style={[styles.recommendationBox, styles.disabledRecommendation]}>
              <MaterialIcons name="lock" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.recommendationText, styles.disabledText]}>
                Fréquence fixe - 120 minutes (valeur optimisée)
              </Text>
            </View>
          </Card>

          {/* 🔥 CARTE GRISÉE POUR RAPPELS MOUVEMENT */}
          <Card style={[styles.goalCard, styles.disabledCard]}>
            <View style={styles.goalHeader}>
              <View style={[styles.iconContainer, styles.disabledIcon]}>
                <MaterialIcons name="notifications-active" size={32} color={theme.colors.textSecondary} />
              </View>
              <View style={styles.goalInfo}>
                <Text style={[styles.goalTitle, styles.disabledText]}>{t('goals.movementReminders')}</Text>
                <Text style={[styles.goalSubtitle, styles.disabledText]}>{t('goals.reminderInterval')}</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={formatFrequencyDisplay(parseInt(moveFrequency) || 60 * 60)}
                onChangeText={handleMoveFrequencyChange}
                editable={false}
                keyboardType="numeric"
                placeholder="60 min"
                placeholderTextColor={theme.colors.textSecondary}
              />
              <Text style={[styles.unit, styles.disabledText]}>{t('goals.minutes')}</Text>
            </View>

            <View style={[styles.recommendationBox, styles.disabledRecommendation]}>
              <MaterialIcons name="lock" size={16} color={theme.colors.textSecondary} />
              <Text style={[styles.recommendationText, styles.disabledText]}>
                Fréquence fixe - 60 minutes (valeur optimisée)
              </Text>
            </View>
          </Card>

          {/* Note d'information sur les fréquences fixes */}
          <Card style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              Les fréquences de rappel sont prédéfinies pour une optimisation maximale de votre bien-être.
              Elles ne peuvent pas être modifiées manuellement.
            </Text>
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

        {/* Bouton Enregistrer avec indicateur */}
        <View style={styles.buttonContainer}>
          <Button
            title={
              Object.keys(modifiedFields).length > 0 
                ? `Enregistrer les modifications (${Object.keys(modifiedFields).length})`
                : t('goals.saveGoals')
            }
            onPress={handleSaveGoals}
            variant={Object.keys(modifiedFields).length > 0 ? "primary" : "secondary"}
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
  modifiedInput: {
    borderColor: theme.colors.warning,
    backgroundColor: theme.colors.warning + '10',
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
  // 🔥 STYLES POUR LES CHAMPS GRISÉS/DÉSACTIVÉS
  disabledCard: {
    backgroundColor: theme.colors.disabled + '15',
    borderColor: theme.colors.disabled + '30',
    opacity: 0.7,
  },
  disabledInput: {
    backgroundColor: theme.colors.disabled + '20',
    borderColor: theme.colors.disabled,
    color: theme.colors.textSecondary,
  },
  disabledIcon: {
    backgroundColor: theme.colors.disabled + '30',
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
  disabledRecommendation: {
    backgroundColor: theme.colors.disabled + '20',
  },
  disabledSectionSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontStyle: 'italic',
  },
  // 🔥 NOUVEAUX STYLES
  modifiedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  modifiedText: {
    fontSize: 12,
    color: theme.colors.warning,
    marginLeft: 4,
    fontWeight: '600',
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  infoCard: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + '15',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    lineHeight: 18,
  },
});

export default GoalsScreen;