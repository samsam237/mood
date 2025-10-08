import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';

const SettingsScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: 1,
      title: 'Objectifs quotidiens',
      description: 'Définir vos objectifs d\'eau et de mouvements',
      icon: 'flag',
      color: theme.colors.primary,
      screen: 'Goals',
    },
    {
      id: 2,
      title: 'Informations personnelles',
      description: 'Gérer votre profil et vos données',
      icon: 'person',
      color: theme.colors.info,
      screen: 'Profile',
    },
    {
      id: 3,
      title: 'Système',
      description: 'Langue, thème, à propos et impact',
      icon: 'settings',
      color: theme.colors.success,
      screen: 'System',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>⚙️ Paramètres</Text>
          <Text style={styles.subtitle}>Personnalisez votre expérience</Text>
        </View>

        {/* Menu principal */}
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Card style={styles.menuCard}>
                <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                  <MaterialIcons name={item.icon} size={32} color={item.color} />
                </View>
                <View style={styles.menuContent}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={theme.colors.textSecondary} />
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>MOOD - Version 1.0.0</Text>
          <Text style={styles.versionSubtext}>Mouvement pour la Santé</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  menuContainer: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  menuDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  versionText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default SettingsScreen;
