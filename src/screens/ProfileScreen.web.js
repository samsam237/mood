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

const ProfileScreen = () => {
  const { userProfile, updateUserProfile } = useHealth();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');

  useEffect(() => {
    // Charger le profil existant
    if (userProfile) {
      setWakeTime(userProfile.wakeTime || '07:00');
      setSleepTime(userProfile.sleepTime || '23:00');
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
    if (bmi < 18.5) return { text: 'Insuffisance pondérale', color: theme.colors.warning };
    if (bmi < 25) return { text: 'Poids normal', color: theme.colors.success };
    if (bmi < 30) return { text: 'Surpoids', color: theme.colors.warning };
    return { text: 'Obésité', color: theme.colors.error };
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

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
      });

      // Initialiser les rappels avec les nouvelles heures
      const result = await notificationService.initializeReminders();
      
      if (result.success) {
        alert('Profil et rappels enregistrés avec succès !');
      } else {
        alert(`Profil enregistré, mais erreur rappels : ${result.error}`);
      }
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
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
          <Text style={styles.title}>👤 Informations Personnelles</Text>
          <Text style={styles.subtitle}>Gérez votre profil santé</Text>
        </View>

        {/* Informations de base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de base</Text>
          
          <Card style={styles.inputCard}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Votre nom"
              placeholderTextColor={theme.colors.textSecondary}
            />
        </Card>

          <Card style={styles.inputCard}>
            <Text style={styles.label}>Âge</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              placeholder="Votre âge"
              keyboardType="numeric"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </Card>
        </View>

        {/* Horaires de rappel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires de rappel</Text>
          
          <Card style={styles.inputCard}>
            <View style={styles.timeHeader}>
              <MaterialIcons name="wb-sunny" size={24} color={theme.colors.warning} />
              <Text style={styles.label}>Heure de réveil</Text>
            </View>
            <TextInput
              style={styles.timeInput}
              value={wakeTime}
              onChangeText={setWakeTime}
              placeholder="07:00"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.helpText}>
              Format : HH:MM (ex: 07:00)
              </Text>
          </Card>

          <Card style={styles.inputCard}>
            <View style={styles.timeHeader}>
              <MaterialIcons name="nightlight" size={24} color={theme.colors.primary} />
              <Text style={styles.label}>Heure de coucher</Text>
            </View>
            <TextInput
              style={styles.timeInput}
              value={sleepTime}
              onChangeText={setSleepTime}
              placeholder="23:00"
              placeholderTextColor={theme.colors.textSecondary}
            />
            <Text style={styles.helpText}>
              Format : HH:MM (ex: 23:00)
            </Text>
        </Card>

          <Card style={styles.infoCard}>
            <MaterialIcons name="info" size={20} color={theme.colors.info} />
            <Text style={styles.infoText}>
              Les rappels seront envoyés uniquement entre votre heure de réveil et de coucher.
            </Text>
          </Card>
        </View>

        {/* Calculateur IMC */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Calculateur d'IMC</Text>
          
          <Card style={styles.inputCard}>
            <Text style={styles.label}>Poids (kg)</Text>
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
            <Text style={styles.label}>Taille (cm)</Text>
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
                <Text style={styles.bmiTitle}>Votre IMC</Text>
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
              L'IMC est un indicateur de votre corpulence. Un IMC entre 18,5 et 25 est considéré comme normal.
            </Text>
          </Card>
          </View>

        {/* Bouton Enregistrer */}
        <View style={styles.buttonContainer}>
          <Button
            title="Enregistrer le profil"
            onPress={handleSaveProfile}
            variant="primary"
            size="large"
          />
        </View>

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
});

export default ProfileScreen;
