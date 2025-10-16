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
import { useTranslation } from '../hooks/useTranslation';

const SystemScreen = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, changeLanguage, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'fr');

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>🔧 {t('system.title')}</Text>
          <Text style={styles.subtitle}>{t('system.subtitle')}</Text>
        </View>

        {/* Langue */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('system.language')}</Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => {
                setSelectedLanguage(lang.code);
                changeLanguage(lang.code);
              }}
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
          <Text style={styles.sectionTitle}>{t('system.appearance')}</Text>
          <Card style={styles.themeCard}>
            <View style={styles.themeContent}>
              <MaterialIcons 
                name="light-mode" 
                size={24} 
                color="#B0B0B0" 
              />
              <View style={styles.themeInfo}>
                <Text style={styles.themeTitle}>{t('system.darkMode')}</Text>
                <Text style={styles.themeDescription}>
                  {t('system.disabled')}
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
          <Text style={styles.sectionTitle}>{t('system.about')}</Text>
          
          <Card style={styles.aboutCard}>
            <View style={styles.aboutHeader}>
              <Text style={styles.appName}>💪 
                <Text style={styles.moText}>mo</Text>
                <Text style={styles.odText}>od</Text>
              </Text>
              <Text style={styles.version}>{t('system.version')}</Text>
            </View>
            
            <Text style={styles.aboutTitle}>{t('system.movementForHealth')}</Text>
            <Text style={styles.aboutDescription}>
              {t('system.appDescription')}
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <MaterialIcons name="check" size={20} color={theme.colors.success} />
                <Text style={styles.featureText}>{t('system.hydrationReminders')}</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check" size={20} color={theme.colors.success} />
                <Text style={styles.featureText}>{t('system.movementReminders')}</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check" size={20} color={theme.colors.success} />
                <Text style={styles.featureText}>{t('system.progressTracking')}</Text>
              </View>
              <View style={styles.featureItem}>
                <MaterialIcons name="check" size={20} color={theme.colors.success} />
                <Text style={styles.featureText}>{t('system.exerciseGuides')}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Impact sur la santé */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('system.healthImpact')}</Text>
          
          <Card style={styles.impactCard}>
            <View style={styles.impactHeader}>
              <MaterialIcons name="favorite" size={32} color={theme.colors.error} />
              <Text style={styles.impactTitle}>{t('system.healthMission')}</Text>
            </View>
            
            <Text style={styles.impactDescription}>
              {t('system.healthDescription')}
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialIcons name="fitness-center" size={24} color={theme.colors.primary} />
                <Text style={styles.statText}>-40%</Text>
                <Text style={styles.statLabel}>{t('system.mortalityRisk')}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="health-and-safety" size={24} color={theme.colors.success} />
                <Text style={styles.statText}>-50%</Text>
                <Text style={styles.statLabel}>{t('system.heartDisease')}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialIcons name="trending-up" size={24} color={theme.colors.info} />
                <Text style={styles.statText}>+100%</Text>
                <Text style={styles.statLabel}>{t('system.qualityOfLife')}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('system.footerMotto')}
          </Text>
          <Text style={styles.copyright}>
            {t('system.copyright')}
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

