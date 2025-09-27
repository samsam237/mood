import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useMood } from '../contexts/MoodContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';

const MOOD_OPTIONS = [
  { value: 5, label: 'Excellent', emoji: '😍', color: '#10B981' },
  { value: 4, label: 'Good', emoji: '😊', color: '#3B82F6' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#F59E0B' },
  { value: 2, label: 'Bad', emoji: '😔', color: '#EF4444' },
  { value: 1, label: 'Terrible', emoji: '😭', color: '#7C2D12' },
];

const MoodEntryScreen = () => {
  const { saveMood } = useMood();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert('Error', 'Please select a mood');
      return;
    }

    setLoading(true);
    const result = await saveMood({
      ...selectedMood,
      note: note.trim(),
    });
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Mood saved successfully!', [
        { text: 'OK', onPress: () => {
          setSelectedMood(null);
          setNote('');
        }}
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to save mood');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>
            Take a moment to reflect on your current emotional state
          </Text>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>Select Your Mood</Text>
          <View style={styles.moodGrid}>
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodOption,
                  selectedMood?.value === mood.value && styles.selectedMood,
                  { borderColor: mood.color }
                ]}
                onPress={() => setSelectedMood(mood)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${mood.label} mood`}
                accessibilityState={{ selected: selectedMood?.value === mood.value }}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Add a Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What's on your mind? How was your day?"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
            accessibilityLabel="Mood note input"
            accessibilityHint="Add optional details about your mood"
          />
          <Text style={styles.characterCount}>
            {note.length}/500 characters
          </Text>
        </Card>

        {selectedMood && (
          <Card style={styles.previewCard}>
            <Text style={styles.sectionTitle}>Preview</Text>
            <View style={styles.preview}>
              <Text style={styles.previewEmoji}>{selectedMood.emoji}</Text>
              <Text style={styles.previewLabel}>{selectedMood.label}</Text>
              {note.trim() && (
                <Text style={styles.previewNote}>"{note.trim()}"</Text>
              )}
            </View>
          </Card>
        )}

        <Button
          title="Save Mood"
          onPress={handleSaveMood}
          loading={loading}
          disabled={!selectedMood}
          variant="primary"
          size="large"
          style={styles.saveButton}
        />
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
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '30%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  selectedMood: {
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 3,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  previewCard: {
    backgroundColor: theme.colors.primary + '05',
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
  },
  preview: {
    alignItems: 'center',
  },
  previewEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  previewLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  previewNote: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  saveButton: {
    marginVertical: theme.spacing.xl,
  },
});

export default MoodEntryScreen;
