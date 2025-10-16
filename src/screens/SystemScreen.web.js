import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';

const SystemScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>🔧 Système</Text>
          <Text style={styles.subtitle}>Paramètres de l'application</Text>
        </View>

        {/* Langue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Langue</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Card style={styles.languageCard}>
                <Text style={styles.flag}>{lang.flag}</Text>
                <Text style={styles.languageName}>{lang.name}</Text>
                {selectedLanguage === lang.code && (
                  <MaterialIcons name="check-circle" size={24} color={theme.colors.success} />
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Thème */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apparence</Text>
          <Card style={styles.themeCard}>
            <View style={styles.themeContent}>
              <MaterialIcons 
                name="light-mode" 
                size={24} 
                color="#B0B0B0" 
              />
              <View style={styles.themeInfo}>
                <Text style={styles.themeTitle}>Mode sombre</Text>
                <Text style={styles.themeDescription}>
                  Désactivé
                </Text>
              </View>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}} // Désactivé
              trackColor={{ false: '#E0E0E0', true: '#E0E0E0' }}
              thumbColor="#B0B0B0"
              disabled={true}
            />
          </Card>
        </View>

        {/* À propos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>À propos</Text>
          
          <Card style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <Text style={styles.appName}>💪 
                <Text style={styles.moText}>mo</Text>
                <Text style={styles.odText}>od</Text>
              </Text>
              <Text style={styles.version}>Version 1.0.0</Text>
            </View>
            
            <Text style={styles.aboutTitle}>Mouvement pour la Santé</Text>
            <Text style={styles.aboutDescription}>
              MOOD est votre coach santé personnel qui vous aide à lutter contre la sédentarité 
              en vous rappelant de bouger et de boire de l'eau régulièrement.
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialIcons name="check" size={20} color={theme.colors.success} />
                <Text style={styles.featureText}>Rappels d'hydratation</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check" size={20} color={theme.colors.success} />
                <Text style={styles.featureText}>Rappels de mouvement</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check" size={20} color={theme.colors.success} />
                <Text style={styles.featureText}>Suivi des progrès</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check" size={20} color={theme.colors.success} />
                <Text style={styles.featureText}>Guides d'exercices</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Impact sur la santé */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Votre Impact Santé</Text>
          
          <Card style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <MaterialIcons name="favorite" size={32} color={theme.colors.error} />
              <Text style={styles.impactTitle}>Mission de Santé Publique</Text>
            </View>
            
            <Text style={styles.impactDescription}>
              En utilisant MOOD, vous participez activement à la lutte contre la sédentarité, 
              responsable de 3,2 millions de décès par an dans le monde.
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="fitness-center" size={24} color={theme.colors.primary} />
                <Text style={styles.statText}>-40%</Text>
                <Text style={styles.statLabel}>Risque de mortalité</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="health-and-safety" size={24} color={theme.colors.success} />
                <Text style={styles.statText}>-50%</Text>
                <Text style={styles.statLabel}>Maladies cardiaques</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="trending-up" size={24} color={theme.colors.info} />
                <Text style={styles.statText}>+100%</Text>
                <Text style={styles.statLabel}>Qualité de vie</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            "Vivre mieux en bougeant plus"
          </Text>
          <Text style={styles.copyright}>
            © 2025 MOOD - Tous droits réservés
          </Text>
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
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  flag: {
    fontSize: 28,
    marginRight: theme.spacing.md,
  },
  languageName: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: '500',
  },
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  themeInfo: {
    marginLeft: theme.spacing.md,
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  themeDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  aboutCard: {
    padding: theme.spacing.lg,
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  moText: {
    color: '#059669', // Vert foncé
    fontSize: 32,
    fontWeight: 'bold',
  },
  odText: {
    color: '#10B981', // Vert clair
    fontSize: 32,
    fontWeight: 'bold',
  },
  version: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  aboutDescription: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  featuresList: {
    marginTop: theme.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  impactCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary + '05',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  impactDescription: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginVertical: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  copyright: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default SystemScreen;

