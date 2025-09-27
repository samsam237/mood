import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useMood } from '../contexts/MoodContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme } from '../constants/theme';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { moods, clearAllMoods } = useMood();
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await signOut();
    }
  };

  const handleClearData = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes vos données ? Cette action est irréversible.')) {
      await clearAllMoods();
      alert('Données supprimées avec succès');
    }
  };

  const handleExportData = () => {
    const data = {
      user: user,
      moods: moods,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mood-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.name || 'Utilisateur'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>

        {/* Statistiques utilisateur */}
        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>Vos Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moods.length}</Text>
              <Text style={styles.statLabel}>Entrées Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {moods.filter(mood => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(mood.timestamp) >= weekAgo;
                }).length}
              </Text>
              <Text style={styles.statLabel}>Cette Semaine</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {moods.length > 0 ? Math.round(moods.reduce((acc, mood) => acc + mood.value, 0) / moods.length * 10) / 10 : 0}
              </Text>
              <Text style={styles.statLabel}>Moyenne</Text>
            </View>
          </View>
        </Card>

        {/* Paramètres d'affichage */}
        <Card style={styles.settingsCard}>
          <Text style={styles.cardTitle}>Paramètres</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Mode Sombre</Text>
              <Text style={styles.settingDescription}>
                Basculer entre le thème clair et sombre
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={isDarkMode ? theme.colors.white : theme.colors.surface}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Recevoir des rappels pour enregistrer votre humeur
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={notifications ? theme.colors.white : theme.colors.surface}
            />
          </View>
        </Card>

        {/* Gestion des données */}
        <Card style={styles.dataCard}>
          <Text style={styles.cardTitle}>Gestion des Données</Text>
          
          <TouchableOpacity style={styles.dataItem} onPress={handleExportData}>
            <View style={styles.dataIcon}>
              <Text style={styles.dataIconText}>📤</Text>
            </View>
            <View style={styles.dataInfo}>
              <Text style={styles.dataTitle}>Exporter les Données</Text>
              <Text style={styles.dataDescription}>
                Télécharger vos données au format JSON
              </Text>
            </View>
            <Text style={styles.dataArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dataItem} onPress={handleClearData}>
            <View style={styles.dataIcon}>
              <Text style={styles.dataIconText}>🗑️</Text>
            </View>
            <View style={styles.dataInfo}>
              <Text style={styles.dataTitle}>Supprimer Toutes les Données</Text>
              <Text style={styles.dataDescription}>
                Effacer toutes vos entrées d'humeur
              </Text>
            </View>
            <Text style={styles.dataArrow}>›</Text>
          </TouchableOpacity>
        </Card>

        {/* Informations de l'app */}
        <Card style={styles.infoCard}>
          <Text style={styles.cardTitle}>À Propos</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Développé par</Text>
            <Text style={styles.infoValue}>Mood Tracker Team</Text>
          </View>
        </Card>

        {/* Bouton de déconnexion */}
        <View style={styles.logoutContainer}>
          <Button
            title="Se Déconnecter"
            onPress={handleSignOut}
            variant="secondary"
            size="large"
            style={styles.logoutButton}
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
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  statsCard: {
    marginBottom: theme.spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
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
  settingsCard: {
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  dataCard: {
    marginBottom: theme.spacing.md,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dataIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  dataIconText: {
    fontSize: 20,
  },
  dataInfo: {
    flex: 1,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  dataDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  dataArrow: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  logoutContainer: {
    marginVertical: theme.spacing.xl,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
  },
});

export default ProfileScreen;
