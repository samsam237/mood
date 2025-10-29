import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
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

const ProfileScreen = () => {
  const { userProfile, updateUserProfile, updateGoals } = useHealth();
  const { t } = useTranslation();
  const { notification, showSuccess, showError, hideNotification } = useCustomNotification();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [sedentaryHours, setSedentaryHours] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [fatMass, setFatMass] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [gender, setGender] = useState('');
  const [useAutoCalculation, setUseAutoCalculation] = useState(true);

  useEffect(() => {
    // Charger le profil existant
    if (userProfile) {
      setName(userProfile.name || '');
      setAge(userProfile.age ? userProfile.age.toString() : '');
      setWeight(userProfile.weight ? userProfile.weight.toString() : '');
      setHeight(userProfile.height ? userProfile.height.toString() : '');
      setWakeTime(userProfile.wakeTime || '07:00');
      setSleepTime(userProfile.sleepTime || '23:00');
      setSedentaryHours(userProfile.sedentaryHours ? userProfile.sedentaryHours.toString() : '');
      setMuscleMass(userProfile.muscleMass ? userProfile.muscleMass.toString() : '');
      setFatMass(userProfile.fatMass ? userProfile.fatMass.toString() : '');
      setActivityLevel(userProfile.activityLevel || 'moderate');
      setGender(userProfile.gender || '');
      setUseAutoCalculation(userProfile.useAutoCalculation !== false);
    }
  }, [userProfile]);

  const calculateBMI = () => {
    if (weight && height) {
      const heightInMeters = parseInt(height) / 100;
      const bmi = parseInt(weight) / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    if (bmi < 18.5) return { text: t('profile.bmiUnderweight'), color: theme.colors.warning };
    if (bmi < 25) return { text: t('profile.bmiNormal'), color: theme.colors.success };
    if (bmi < 30) return { text: t('profile.bmiOverweight'), color: theme.colors.warning };
    return { text: t('profile.bmiObese'), color: theme.colors.error };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  // Calcul automatique de la composition corporelle
  const calculateBodyComposition = () => {
    const weightKg = parseFloat(weight);
    const heightCm = parseFloat(height);
    const ageYears = parseFloat(age);
    
    if (!weightKg || !heightCm || !ageYears || !gender) return null;
    
    // Formule de Deurenberg pour le pourcentage de masse grasse
    let fatPercentage;
    if (gender === 'male') {
      // Formule pour homme : 1.20 × BMI + 0.23 × âge - 16.2
      fatPercentage = (1.20 * bmi) + (0.23 * ageYears) - 16.2;
    } else {
      // Formule pour femme : 1.20 × BMI + 0.23 × âge - 5.4
      fatPercentage = (1.20 * bmi) + (0.23 * ageYears) - 5.4;
    }
    
    // Limiter le pourcentage entre 5% et 50%
    fatPercentage = Math.max(5, Math.min(50, fatPercentage));
    
    // Calculer la masse grasse
    const calculatedFatMass = (weightKg * fatPercentage) / 100;
    
    // Estimation de la masse osseuse (environ 15% du poids pour un adulte)
    const boneMass = weightKg * 0.15;
    
    // Calculer la masse musculaire : Poids - Masse grasse - Masse osseuse
    const calculatedMuscleMass = weightKg - calculatedFatMass - boneMass;
    
    return {
      fatPercentage: fatPercentage,
      fatMass: calculatedFatMass,
      muscleMass: calculatedMuscleMass,
      musclePercentage: (calculatedMuscleMass / weightKg) * 100
    };
  };

  const bodyComposition = calculateBodyComposition();

  // Calcul de la période d'éveil
  const calculateWakePeriod = () => {
    if (!wakeTime || !sleepTime) return 0;
    
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    
    const wakeMinutes = wakeHour * 60 + wakeMin;
    const sleepMinutes = sleepHour * 60 + sleepMin;
    
    // Si l'heure de coucher est le lendemain (après minuit)
    if (sleepMinutes < wakeMinutes) {
      return (24 * 60) - wakeMinutes + sleepMinutes;
    }
    
    return sleepMinutes - wakeMinutes;
  };

  // Calcul du ratio de sédentarité
  const calculateSedentarityRatio = () => {
    const sedentary = parseFloat(sedentaryHours);
    const wakePeriodHours = calculateWakePeriod() / 60;
    
    if (!sedentary || !wakePeriodHours) return null;
    
    const ratio = (sedentary / wakePeriodHours) * 100;
    return Math.min(ratio, 100); // Limiter à 100%
  };

  const getSedentarityCategory = (ratio) => {
    if (!ratio) return null;
    if (ratio < 50) return { text: t('profile.sedentarityLow'), color: theme.colors.success };
    if (ratio < 75) return { text: t('profile.sedentarityModerate'), color: theme.colors.warning };
    return { text: t('profile.sedentarityHigh'), color: theme.colors.error };
  };

  const wakePeriodHours = calculateWakePeriod() / 60;
  const sedentarityRatio = calculateSedentarityRatio();
  const sedentarityCategory = getSedentarityCategory(sedentarityRatio);

  // Calcul de l'hydratation recommandée
  const calculateRecommendedWater = () => {
    const weightKg = parseFloat(weight);
    
    if (!weightKg) return null;
    
    // Utiliser les valeurs calculées automatiquement si disponibles, sinon les valeurs manuelles
    let muscleKg, fatKg;
    
    if (useAutoCalculation && bodyComposition) {
      muscleKg = bodyComposition.muscleMass;
      fatKg = bodyComposition.fatMass;
    } else {
      muscleKg = parseFloat(muscleMass);
      fatKg = parseFloat(fatMass);
    }
    
    // Formule de base : poids × 35ml
    let baseWater = weightKg * 35;
    
    // Ajustement selon l'activité
    switch (activityLevel) {
      case 'sedentary':
        baseWater += 0; // Pas d'ajout
        break;
      case 'moderate':
        baseWater += 500; // +500ml
        break;
      case 'intense':
        baseWater += 1000; // +1000ml
        break;
    }
    
    // Ajustement selon la composition corporelle
    if (muscleKg && fatKg) {
      // Les muscles contiennent 76% d'eau, la graisse 10%
      // Plus de muscle = plus de besoins en eau
      const muscleRatio = muscleKg / weightKg;
      
      // Ajustement basé sur la proportion musculaire
      if (muscleRatio > 0.4) { // Plus de 40% de muscle
        baseWater *= 1.1; // +10%
      } else if (muscleRatio < 0.25) { // Moins de 25% de muscle
        baseWater *= 0.95; // -5%
      }
    }
    
    return Math.round(baseWater);
  };

  const recommendedWater = calculateRecommendedWater();

  const handleUseRecommendedGoal = async () => {
    if (!recommendedWater) return;
    
    try {
      await updateGoals({ water: recommendedWater });
      showSuccess(`Objectif d'eau mis à jour: ${recommendedWater} ml`);
    } catch (error) {
      showError('Erreur lors de la mise à jour de l\'objectif');
      console.error(error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Sauvegarder le profil
      await updateUserProfile({
        name,
        age: parseInt(age) || null,
        weight: parseInt(weight) || null,
        height: parseInt(height) || null,
        wakeTime,
        sleepTime,
        sedentaryHours: parseFloat(sedentaryHours) || null,
        muscleMass: useAutoCalculation && bodyComposition ? bodyComposition.muscleMass : (parseFloat(muscleMass) || null),
        fatMass: useAutoCalculation && bodyComposition ? bodyComposition.fatMass : (parseFloat(fatMass) || null),
        activityLevel,
        gender,
        useAutoCalculation,
        recommendedWaterGoal: recommendedWater || null,
      });

      // Initialiser les rappels avec les nouvelles heures
      const result = await notificationService.initializeReminders();
      
      if (result.success) {
        showSuccess(t('profile.profileSavedSuccess'));
      } else {
        showError(t('profile.profileSavedError', { error: result.error }));
      }
    } catch (error) {
      showError(t('profile.saveError'));
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={64} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>{t('profile.title')}</Text>
          <Text style={styles.subtitle}>{t('profile.subtitle')}</Text>
        </View>

        {/* Informations de base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.basicInfo')}</Text>
          
          <Card style={styles.inputCard}>
            <Text style={styles.label}>{t('profile.fullName')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('profile.namePlaceholder')}
              placeholderTextColor={theme.colors.textSecondary}
            />
        </Card>

          <Card style={styles.inputCard}>
            <Text style={styles.label}>{t('profile.age')}</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder={t('profile.agePlaceholder')}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </Card>

          <Card style={styles.inputCard}>
            <Text style={styles.label}>{t('profile.gender')}</Text>
            <View style={styles.genderButtons}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'male' && styles.genderButtonActive
                ]}
                onPress={() => setGender('male')}
              >
                <Text style={[
                  styles.genderButtonText,
                  gender === 'male' && styles.genderButtonTextActive
                ]}>
                  {t('profile.genderMale')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === 'female' && styles.genderButtonActive
                ]}
                onPress={() => setGender('female')}
              >
                <Text style={[
                  styles.genderButtonText,
                  gender === 'female' && styles.genderButtonTextActive
                ]}>
                  {t('profile.genderFemale')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helpText}>
              {t('profile.genderHelp')}
            </Text>
          </Card>
        </View>

        {/* Horaires de rappel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.reminderSchedule')}</Text>
          
          <Card style={styles.inputCard}>
            <View style={styles.timeHeader}>
              <MaterialIcons name="wb-sunny" size={24} color={theme.colors.warning} />
              <Text style={styles.label}>{t('profile.wakeTime')}</Text>
            </View>
            <TextInput
              style={styles.timeInput}
              value={wakeTime}
              onChangeText={setWakeTime}
              placeholder="07:00"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.helpText}>
              {t('profile.timeFormat')}
              </Text>
          </Card>

          <Card style={styles.inputCard}>
            <View style={styles.timeHeader}>
              <MaterialIcons name="nightlight" size={24} color={theme.colors.primary} />
              <Text style={styles.label}>{t('profile.sleepTime')}</Text>
            </View>
            <TextInput
              style={styles.timeInput}
              value={sleepTime}
              onChangeText={setSleepTime}
              placeholder="23:00"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.helpText}>
              {t('profile.timeFormat')}
            </Text>
          </Card>

          <Card style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              {t('profile.reminderInfo')}
              </Text>
          </Card>
            </View>

        {/* Calculateur IMC */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.bmiCalculator')}</Text>
          
          <Card style={styles.inputCard}>
            <Text style={styles.label}>{t('profile.weight')}</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              placeholder="70"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
        </Card>

          <Card style={styles.inputCard}>
            <Text style={styles.label}>{t('profile.height')}</Text>
            <TextInput
              style={styles.input}
              value={height}
              onChangeText={setHeight}
              placeholder="175"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </Card>

          {bmi && (
            <Card style={styles.bmiCard}>
              <View style={styles.bmiHeader}>
                <MaterialIcons name="assessment" size={32} color={bmiCategory.color} />
                <Text style={styles.bmiTitle}>{t('profile.yourBMI')}</Text>
              </View>
              <Text style={styles.bmiValue}>{bmi}</Text>
              <View style={[styles.bmiCategory, { backgroundColor: bmiCategory.color + '20' }]}>
                <Text style={[styles.bmiCategoryText, { color: bmiCategory.color }]}>
                  {bmiCategory.text}
                </Text>
              </View>
            </Card>
          )}

          <Card style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              {t('profile.bmiInfo')}
            </Text>
        </Card>
        </View>

        {/* Calculateur de sédentarité */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.sedentarityCalculator')}</Text>
          
          <Card style={styles.inputCard}>
            <Text style={styles.label}>{t('profile.sedentaryHours')}</Text>
            <TextInput
              style={styles.input}
              value={sedentaryHours}
              onChangeText={setSedentaryHours}
              placeholder={t('profile.sedentaryHoursPlaceholder')}
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.helpText}>
              {t('profile.sedentaryHoursHelp')}
            </Text>
          </Card>

          {/* Affichage de la période d'éveil */}
          <Card style={styles.infoCard}>
            <MaterialIcons name="schedule" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              {t('profile.wakePeriod')}: {wakePeriodHours.toFixed(1)}h ({t('profile.wakePeriodHelp')})
            </Text>
          </Card>

          {/* Résultat du calcul de sédentarité */}
          {sedentarityRatio !== null && (
            <Card style={styles.sedentarityCard}>
              <View style={styles.sedentarityHeader}>
                <MaterialIcons name="trending-up" size={32} color={sedentarityCategory.color} />
                <Text style={styles.sedentarityTitle}>{t('profile.sedentarityRatio')}</Text>
              </View>
              <Text style={styles.sedentarityValue}>{sedentarityRatio.toFixed(1)}%</Text>
              <View style={[styles.sedentarityCategory, { backgroundColor: sedentarityCategory.color + '20' }]}>
                <Text style={[styles.sedentarityCategoryText, { color: sedentarityCategory.color }]}>
                  {sedentarityCategory.text}
                </Text>
              </View>
              <Text style={styles.sedentarityHelp}>
                {t('profile.sedentarityRatioHelp')}
              </Text>
            </Card>
          )}

          <Card style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              {t('profile.sedentarityInfo')}
            </Text>
          </Card>
        </View>

        {/* Calculateur d'hydratation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.hydrationCalculator')}</Text>
          
          {/* Composition corporelle */}
          <Text style={styles.subsectionTitle}>{t('profile.bodyComposition')}</Text>
          
          {/* Boutons de basculement */}
          <Card style={styles.inputCard}>
            <View style={styles.toggleButtons}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  useAutoCalculation && styles.toggleButtonActive
                ]}
                onPress={() => setUseAutoCalculation(true)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  useAutoCalculation && styles.toggleButtonTextActive
                ]}>
                  {t('profile.bodyCompositionAuto')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !useAutoCalculation && styles.toggleButtonActive
                ]}
                onPress={() => setUseAutoCalculation(false)}
              >
                <Text style={[
                  styles.toggleButtonText,
                  !useAutoCalculation && styles.toggleButtonTextActive
                ]}>
                  {t('profile.bodyCompositionManual')}
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Affichage des résultats automatiques */}
          {useAutoCalculation && bodyComposition && (
            <Card style={styles.compositionCard}>
              <View style={styles.compositionHeader}>
                <MaterialIcons name="calculate" size={24} color={theme.colors.primary} />
                <Text style={styles.compositionTitle}>Calcul automatique</Text>
              </View>
              <View style={styles.compositionRow}>
                <Text style={styles.compositionLabel}>{t('profile.fatPercentage')}</Text>
                <Text style={styles.compositionValue}>{bodyComposition.fatPercentage.toFixed(1)}%</Text>
              </View>
              <View style={styles.compositionRow}>
                <Text style={styles.compositionLabel}>{t('profile.musclePercentage')}</Text>
                <Text style={styles.compositionValue}>{bodyComposition.musclePercentage.toFixed(1)}%</Text>
              </View>
              <View style={styles.compositionRow}>
                <Text style={styles.compositionLabel}>{t('profile.fatMass')}</Text>
                <Text style={styles.compositionValue}>{bodyComposition.fatMass.toFixed(1)} kg</Text>
              </View>
              <View style={styles.compositionRow}>
                <Text style={styles.compositionLabel}>{t('profile.muscleMass')}</Text>
                <Text style={styles.compositionValue}>{bodyComposition.muscleMass.toFixed(1)} kg</Text>
              </View>
            </Card>
          )}

          {/* Champs de saisie manuelle */}
          {!useAutoCalculation && (
            <>
              <Card style={styles.inputCard}>
                <Text style={styles.label}>{t('profile.muscleMass')}</Text>
                <TextInput
                  style={styles.input}
                  value={muscleMass}
                  onChangeText={setMuscleMass}
                  placeholder={t('profile.muscleMassPlaceholder')}
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
                <Text style={styles.helpText}>
                  {t('profile.muscleMassHelp')}
                </Text>
              </Card>

              <Card style={styles.inputCard}>
                <Text style={styles.label}>{t('profile.fatMass')}</Text>
                <TextInput
                  style={styles.input}
                  value={fatMass}
                  onChangeText={setFatMass}
                  placeholder={t('profile.fatMassPlaceholder')}
                  keyboardType="numeric"
                  placeholderTextColor={theme.colors.textSecondary}
                />
                <Text style={styles.helpText}>
                  {t('profile.fatMassHelp')}
                </Text>
              </Card>
            </>
          )}

          {/* Niveau d'activité */}
          <Card style={styles.inputCard}>
            <Text style={styles.label}>{t('profile.activityLevel')}</Text>
            <View style={styles.activityButtons}>
              <TouchableOpacity
                style={[
                  styles.activityButton,
                  activityLevel === 'sedentary' && styles.activityButtonActive
                ]}
                onPress={() => setActivityLevel('sedentary')}
              >
                <Text style={[
                  styles.activityButtonText,
                  activityLevel === 'sedentary' && styles.activityButtonTextActive
                ]}>
                  {t('profile.activitySedentary')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.activityButton,
                  activityLevel === 'moderate' && styles.activityButtonActive
                ]}
                onPress={() => setActivityLevel('moderate')}
              >
                <Text style={[
                  styles.activityButtonText,
                  activityLevel === 'moderate' && styles.activityButtonTextActive
                ]}>
                  {t('profile.activityModerate')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.activityButton,
                  activityLevel === 'intense' && styles.activityButtonActive
                ]}
                onPress={() => setActivityLevel('intense')}
              >
                <Text style={[
                  styles.activityButtonText,
                  activityLevel === 'intense' && styles.activityButtonTextActive
                ]}>
                  {t('profile.activityIntense')}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.helpText}>
              {t('profile.activityHelp')}
            </Text>
          </Card>

          {/* Résultat du calcul d'hydratation */}
          {recommendedWater && (
            <Card style={styles.hydrationCard}>
              <View style={styles.hydrationHeader}>
                <MaterialIcons name="local-drink" size={32} color={theme.colors.primary} />
                <Text style={styles.hydrationTitle}>{t('profile.recommendedWater')}</Text>
              </View>
              <Text style={styles.hydrationValue}>{recommendedWater} ml</Text>
              <Text style={styles.hydrationSubValue}>{(recommendedWater / 1000).toFixed(1)} L</Text>
              <Text style={styles.hydrationHelp}>
                {t('profile.recommendedWaterHelp')}
              </Text>
              
              {/* Bouton pour utiliser comme objectif */}
              <TouchableOpacity
                style={styles.useGoalButton}
                onPress={handleUseRecommendedGoal}
              >
                <MaterialIcons name="check-circle" size={20} color={theme.colors.success} />
                <Text style={styles.useGoalButtonText}>
                  {t('profile.useRecommendedGoal')}
                </Text>
              </TouchableOpacity>
            </Card>
          )}

          <Card style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              {t('profile.hydrationInfo')}
            </Text>
          </Card>
        </View>

        {/* Bouton Enregistrer */}
        <View style={styles.buttonContainer}>
          <Button
            title={t('profile.saveProfile')}
            onPress={handleSaveProfile}
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
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
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
  },
  section: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  timeInput: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    textAlign: 'center',
  },
  helpText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  bmiCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary + '05',
  },
  bmiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  bmiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  bmiCategory: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  bmiCategoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.info + '15',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    lineHeight: 18,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  sedentarityCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary + '05',
  },
  sedentarityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sedentarityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  sedentarityValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  sedentarityCategory: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  sedentarityCategoryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sedentarityHelp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  activityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  activityButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
    marginHorizontal: 2,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  activityButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  activityButtonText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
  },
  activityButtonTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  hydrationCard: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary + '05',
  },
  hydrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  hydrationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  hydrationValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  hydrationSubValue: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  hydrationHelp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: theme.spacing.md,
  },
  useGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.success + '20',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.success,
  },
  useGoalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.success,
    marginLeft: theme.spacing.sm,
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: 4,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  genderButtonText: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  toggleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    marginHorizontal: 2,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toggleButtonText: {
    fontSize: 12,
    color: theme.colors.text,
    fontWeight: '500',
  },
  toggleButtonTextActive: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  compositionCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary + '05',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  compositionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  compositionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  compositionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + '30',
  },
  compositionLabel: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  compositionValue: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;