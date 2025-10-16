import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import { useTranslation } from '../hooks/useTranslation';

// Import du catalogue généré automatiquement
import pdfCatalog from '../../assets/data/pdf-catalog.json';

const GuidesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('hydratation');
  const [hydratationDocs, setHydratationDocs] = useState([]);
  const [exercisesDocs, setExercisesDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Charger le catalogue au démarrage
    setHydratationDocs(pdfCatalog.hydratation || []);
    setExercisesDocs(pdfCatalog.exercices || []);
    setLoading(false);
  }, []);

  const currentDocs = selectedCategory === 'hydratation' ? hydratationDocs : exercisesDocs;

  const getCategoryIcon = () => {
    return selectedCategory === 'hydratation' ? 'local-drink' : 'fitness-center';
  };

  const getCategoryColor = () => {
    return selectedCategory === 'hydratation' ? theme.colors.info : theme.colors.success;
  };

  const openPDF = (doc) => {
    console.log('📄 Ouverture PDF mobile:', doc);
    
    // Construire le chemin du PDF pour mobile
    const pdfPath = `/assets/pdfs/${doc.file}`;
    
    console.log('🔗 Chemin PDF construit:', pdfPath);
    
    // Navigation vers le viewer PDF avec les bonnes données
    navigation.navigate('PDFViewer', {
      pdfUrl: pdfPath,
      pdfTitle: doc.title,
      pdfFile: doc.file,
      pdfSource: { uri: pdfPath }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t('guides.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>📚 {t('guides.title')}</Text>
          <Text style={styles.subtitle}>{t('guides.subtitle')}</Text>
        </View>

        {/* Sélecteur de catégorie */}
        <View style={styles.categorySelector}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'hydratation' && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory('hydratation')}
          >
            <MaterialIcons 
              name="local-drink" 
              size={24} 
              color={selectedCategory === 'hydratation' ? '#fff' : theme.colors.info} 
            />
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'hydratation' && styles.categoryButtonTextActive
            ]}>
              {t('guides.hydration')}
            </Text>
            <View style={[
              styles.badge,
              { backgroundColor: selectedCategory === 'hydratation' ? '#fff' : theme.colors.info }
            ]}>
              <Text style={[
                styles.badgeText,
                { color: selectedCategory === 'hydratation' ? theme.colors.info : '#fff' }
              ]}>
                {hydratationDocs.length}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'exercices' && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory('exercices')}
          >
            <MaterialIcons 
              name="fitness-center" 
              size={24} 
              color={selectedCategory === 'exercices' ? '#fff' : theme.colors.success} 
            />
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === 'exercices' && styles.categoryButtonTextActive
            ]}>
              {t('guides.exercises')}
            </Text>
            <View style={[
              styles.badge,
              { backgroundColor: selectedCategory === 'exercices' ? '#fff' : theme.colors.success }
            ]}>
              <Text style={[
                styles.badgeText,
                { color: selectedCategory === 'exercices' ? theme.colors.success : '#fff' }
              ]}>
                {exercisesDocs.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Info catégorie */}
        <Card style={styles.infoCard}>
          <MaterialIcons name="info" size={20} color={getCategoryColor()} />
          <Text style={styles.infoText}>
            {selectedCategory === 'hydratation' 
              ? t('guides.hydrationDescription')
              : t('guides.exercisesDescription')
            }
          </Text>
        </Card>

        {/* Liste des documents */}
        <View style={styles.documentsContainer}>
          {currentDocs.length > 0 ? (
            currentDocs.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                onPress={() => openPDF(doc)}
              >
                <Card style={styles.docCard}>
                  <View style={[styles.docIcon, { backgroundColor: getCategoryColor() + '20' }]}>
                    <MaterialIcons name={doc.icon} size={28} color={getCategoryColor()} />
                  </View>
                  <View style={styles.docContent}>
                    <Text style={styles.docTitle}>{doc.title}</Text>
                    <View style={styles.docMeta}>
                      <MaterialIcons name="picture-as-pdf" size={14} color={theme.colors.textSecondary} />
                      <Text style={styles.docType}>{t('guides.documentPDF')}</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card style={styles.emptyCard}>
              <MaterialIcons name="folder-open" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyTitle}>{t('guides.noDocumentsAvailable')}</Text>
              <Text style={styles.emptyText}>
                {t('guides.documentsComingSoon')}
              </Text>
            </Card>
          )}
        </View>

        {/* Statistiques */}
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <MaterialIcons name="library-books" size={24} color={theme.colors.primary} />
            <Text style={styles.statsTitle}>{t('guides.completeLibrary')}</Text>
          </View>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{hydratationDocs.length + exercisesDocs.length}</Text>
              <Text style={styles.statLabel}>{t('guides.totalGuides')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{selectedCategory === 'hydratation' ? hydratationDocs.length : exercisesDocs.length}</Text>
              <Text style={styles.statLabel}>{t('guides.inThisCategory')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>{t('guides.free')}</Text>
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
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
  },
  categorySelector: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
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
  documentsContainer: {
    paddingHorizontal: theme.spacing.md,
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  docIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  docTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  docMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docType: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  statsCard: {
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary + '05',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  emptyCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptyText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default GuidesScreen;
