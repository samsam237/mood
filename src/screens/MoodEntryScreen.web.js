import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useMood } from '../contexts/MoodContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';

const MoodEntryScreen = () => {
  const { addMood } = useMood();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  const moods = [
    { id: 1, emoji: '😢', label: 'Très triste', value: 1, color: '#FF6B6B' },
    { id: 2, emoji: '😔', label: 'Triste', value: 2, color: '#FF8E8E' },
    { id: 3, emoji: '😐', label: 'Neutre', value: 3, color: '#FFD93D' },
    { id: 4, emoji: '😊', label: 'Content', value: 4, color: '#6BCF7F' },
    { id: 5, emoji: '😄', label: 'Très heureux', value: 5, color: '#4ECDC4' },
  ];

  const handleSaveMood = async () => {
    if (!selectedMood) {
      alert('Veuillez sélectionner une humeur');
      return;
    }

    const moodData = {
      value: selectedMood.value,
      emoji: selectedMood.emoji,
      label: selectedMood.label,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };

    await addMood(moodData);
    setSelectedMood(null);
    setNote('');
    alert('Humeur enregistrée avec succès !');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Comment vous sentez-vous ?</Text>
          <Text style={styles.subtitle}>
            Sélectionnez votre humeur actuelle
          </Text>
        </View>

        <Card style={styles.moodCard}>
          <View style={styles.moodGrid}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodOption,
                  selectedMood?.id === mood.id && styles.selectedMood,
                  { borderColor: mood.color }
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.noteCard}>
          <Text style={styles.cardTitle}>Note (optionnelle)</Text>
          <View style={styles.noteContainer}>
            <textarea
              style={styles.noteInput}
              placeholder="Décrivez ce qui influence votre humeur..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Enregistrer l'humeur"
            onPress={handleSaveMood}
            disabled={!selectedMood}
            variant="primary"
            size="large"
            style={styles.saveButton}
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
  scrollView: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    marginVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  moodCard: {
    marginBottom: theme.spacing.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '48%',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  selectedMood: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  moodLabel: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  noteCard: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  noteContainer: {
    width: '100%',
  },
  noteInput: {
    width: '100%',
    minHeight: 80,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  buttonContainer: {
    marginBottom: theme.spacing.xl,
  },
  saveButton: {
    width: '100%',
  },
});

export default MoodEntryScreen;
