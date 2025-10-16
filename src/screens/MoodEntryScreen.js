import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useMood } from '../contexts/MoodContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';
import CustomAlert from '../components/common/CustomAlert';
import { useCustomAlert } from '../hooks/useCustomAlert';

// Les options d'humeur seront créées dynamiquement avec les traductions

const MoodEntryScreen = () => {
  const { saveMood } = useMood();
  const { t } = useTranslation();
  const { alert, showError, showSuccess, hideAlert } = useCustomAlert();
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  // Options d'humeur avec traductions
  const MOOD_OPTIONS = [
    { value: 5, label: t('mood.excellent'), emoji: '😍', color: '#10B981' },
    { value: 4, label: t('mood.good'), emoji: '😊', color: '#3B82F6' },
    { value: 3, label: t('mood.okay'), emoji: '😐', color: '#F59E0B' },
    { value: 2, label: t('mood.bad'), emoji: '😔', color: '#EF4444' },
    { value: 1, label: t('mood.terrible'), emoji: '😭', color: '#7C2D12' },
  ];

  const handleSaveMood = async () => {
    if (!selectedMood) {
      showError(t('common.error'), t('mood.selectMood'));
      return;
    }

    setLoading(true);
    const result = await saveMood({
      ...selectedMood,
      note: note.trim(),
    });
    setLoading(false);

    if (result.success) {
      showSuccess(t('common.success'), t('mood.savedSuccessfully'));
      setSelectedMood(null);
      setNote('');
    } else {
      showError(t('common.error'), result.error || t('mood.saveFailed'));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('mood.howAreYouFeeling')}</Text>
          <Text style={styles.subtitle}>
            {t('mood.reflectOnEmotionalState')}
          </Text>
        </View>

        <Card>
          <Text style={styles.sectionTitle}>{t('mood.selectYourMood')}</Text>
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
          <Text style={styles.sectionTitle}>{t('mood.addNoteOptional')}</Text>
          <TextInput
            style={styles.noteInput}
            placeholder={t('mood.whatsOnYourMind')}
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
          title={t('mood.saveMood')}
          onPress={handleSaveMood}
          loading={loading}
          disabled={!selectedMood}
          variant="primary"
          size="large"
          style={styles.saveButton}
        />
      </ScrollView>
      
      {/* Alerte personnalisée */}
      <CustomAlert
        visible={alert.visible}
        onClose={hideAlert}
        title={alert.title}
        message={alert.message}
        type={alert.type}
      />
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
