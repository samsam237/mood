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

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>
            Select your current mood and add any notes
          </Text>
        </View>

        {/* Mood Selection */}
        <Card style={styles.moodCard}>
          <Text style={styles.sectionTitle}>Select Your Mood</Text>
          <View style={styles.moodOptions}>
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                style={[
                  styles.moodOption,
                  selectedMood?.value === mood.value && styles.selectedMoodOption,
                  { borderColor: mood.color }
                ]}
                onPress={() => handleMoodSelect(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  selectedMood?.value === mood.value && styles.selectedMoodLabel
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Note Section */}
        <Card style={styles.noteCard}>
          <Text style={styles.sectionTitle}>Add a Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="How are you feeling? What's on your mind?"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <Text style={styles.characterCount}>
            {note.length}/500 characters
          </Text>
        </Card>

        {/* Quick Notes */}
        <Card style={styles.quickNotesCard}>
          <Text style={styles.sectionTitle}>Quick Notes</Text>
          <View style={styles.quickNotes}>
            {[
              'Had a great day!',
              'Feeling stressed',
              'Grateful for today',
              'Need some rest',
              'Excited about something',
              'Feeling lonely'
            ].map((quickNote, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickNoteButton}
                onPress={() => setNote(quickNote)}
              >
                <Text style={styles.quickNoteText}>{quickNote}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Save Button */}
        <View style={styles.saveButtonContainer}>
          <Button
            title="Save Mood"
            onPress={handleSaveMood}
            loading={loading}
            disabled={!selectedMood}
            variant="primary"
            size="large"
            style={styles.saveButton}
          />
        </View>

        {/* Selected Mood Preview */}
        {selectedMood && (
          <Card style={styles.previewCard}>
            <Text style={styles.previewTitle}>Preview</Text>
            <View style={styles.previewContent}>
              <Text style={styles.previewEmoji}>{selectedMood.emoji}</Text>
              <View style={styles.previewText}>
                <Text style={styles.previewMood}>{selectedMood.label}</Text>
                <Text style={styles.previewTime}>
                  {new Date().toLocaleString()}
                </Text>
                {note && (
                  <Text style={styles.previewNote}>"{note}"</Text>
                )}
              </View>
            </View>
          </Card>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  moodCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
  },
  selectedMoodOption: {
    backgroundColor: theme.colors.primary + '20',
    borderWidth: 3,
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
  selectedMoodLabel: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  noteCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
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
  quickNotesCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  quickNotes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  quickNoteButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  quickNoteText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  saveButtonContainer: {
    padding: theme.spacing.lg,
  },
  saveButton: {
    width: '100%',
  },
  previewCard: {
    margin: theme.spacing.lg,
    marginTop: 0,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewEmoji: {
    fontSize: 40,
    marginRight: theme.spacing.md,
  },
  previewText: {
    flex: 1,
  },
  previewMood: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  previewTime: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  previewNote: {
    fontSize: 14,
    color: theme.colors.text,
    fontStyle: 'italic',
  },
});

export default MoodEntryScreen;