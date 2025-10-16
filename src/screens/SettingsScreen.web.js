import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Card from '../components/common/Card';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const SettingsScreen = ({ navigation }) => {
  console.log('⚙️ SettingsScreen WEB version loaded!');
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    Alert.alert(
      t('settings.signOut'),
      t('settings.confirmSignOut'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('settings.signOut'),
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (!result.success) {
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 1,
      title: t('settings.dailyGoals'),
      description: t('settings.dailyGoalsDescription'),
      icon: 'flag',
      color: theme.colors.primary,
      screen: 'Goals',
    },
    {
      id: 2,
      title: t('settings.personalInfo'),
      description: t('settings.personalInfoDescription'),
      icon: 'person',
      color: theme.colors.info,
      screen: 'Profile',
    },
    {
      id: 3,
      title: t('settings.system'),
      description: t('settings.systemDescription'),
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
          <Text style={styles.title}>⚙️ {t('settings.title')}</Text>
          <Text style={styles.subtitle}>{t('settings.subtitle')}</Text>
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

        {/* User Info */}
        {user && (
          <View style={styles.userInfoContainer}>
            <Card style={styles.userCard}>
              <View style={styles.userInfo}>
                <MaterialIcons name="person" size={24} color={theme.colors.primary} />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>
                    {user.displayName || 'Utilisateur'}
                  </Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={24} color={theme.colors.error} />
            <Text style={styles.signOutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            <Text style={styles.moText}>mo</Text>
            <Text style={styles.odText}>od</Text>
            {' '}- Version 1.0.0
          </Text>
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
  userInfoContainer: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  userCard: {
    padding: theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  signOutContainer: {
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.error + '10',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.error + '30',
  },
  signOutText: {
    marginLeft: theme.spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
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
  moText: {
    color: '#059669', // Vert foncé
    fontSize: 14,
    fontWeight: '600',
  },
  odText: {
    color: '#10B981', // Vert clair
    fontSize: 14,
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default SettingsScreen;
