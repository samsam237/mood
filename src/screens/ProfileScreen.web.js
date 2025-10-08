import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext.web';
import { useMood } from '../contexts/MoodContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme as defaultTheme } from '../constants/theme';

// Simple icon component for web
const SimpleIcon = ({ name, size, color }) => (
  <View style={[styles.icon, { width: size, height: size, backgroundColor: color }]}>
    <Text style={styles.iconText}>{name.charAt(0).toUpperCase()}</Text>
  </View>
);

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const { moods } = useMood();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will export your mood data to a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export data') },
      ]
    );
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your mood entries. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => console.log('Delete all data'),
          style: 'destructive' 
        },
      ]
    );
  };

  const profileStats = [
    {
      title: 'Total Entries',
      value: moods.length,
      icon: 'assessment',
      color: theme.colors.primary,
    },
    {
      title: 'Days Tracked',
      value: new Set(moods.map(mood => 
        new Date(mood.timestamp).toDateString()
      )).size,
      icon: 'calendar-today',
      color: theme.colors.secondary,
    },
    {
      title: 'Average Mood',
      value: moods.length > 0 
        ? (moods.reduce((sum, mood) => sum + mood.mood, 0) / moods.length).toFixed(1)
        : '0',
      icon: 'sentiment-satisfied',
      color: theme.colors.success,
    },
  ];

  const settingsOptions = [
    {
      title: 'Notifications',
      subtitle: 'Get reminders to log your mood',
      type: 'switch',
      value: notificationsEnabled,
      onValueChange: setNotificationsEnabled,
      icon: 'notifications',
    },
    {
      title: 'Dark Mode',
      subtitle: 'Switch between light and dark themes',
      type: 'switch',
      value: isDarkMode,
      onValueChange: toggleTheme,
      icon: 'dark-mode',
    },
    {
      title: 'Export Data',
      subtitle: 'Download your mood data',
      type: 'button',
      onPress: handleExportData,
      icon: 'file-download',
    },
    {
      title: 'Delete All Data',
      subtitle: 'Permanently remove all your data',
      type: 'button',
      onPress: handleDeleteData,
      icon: 'delete-forever',
      destructive: true,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: user?.photo || require('../../assets/default-avatar.png') }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.userName, { color: theme.colors.text }]}>
                {user?.name || 'Anonymous User'}
              </Text>
              <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
                {user?.email || 'No email provided'}
              </Text>
            </View>
          </View>
        </Card>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          {profileStats.map((stat, index) => (
            <Card key={index} style={styles.statCard}>
              <View style={styles.statContent}>
                <SimpleIcon name={stat.icon} size={24} color={stat.color} />
                <View style={styles.statText}>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {stat.value}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    {stat.title}
                  </Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.settingsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Settings
          </Text>
          <Card style={styles.settingsCard}>
            {settingsOptions.map((option, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={option.onPress}
                  disabled={option.type === 'switch'}
                >
                  <View style={styles.settingLeft}>
                    <SimpleIcon 
                      name={option.icon} 
                      size={20} 
                      color={option.destructive ? theme.colors.error : theme.colors.textSecondary} 
                    />
                    <View style={styles.settingText}>
                      <Text style={[
                        styles.settingTitle,
                        { color: option.destructive ? theme.colors.error : theme.colors.text }
                      ]}>
                        {option.title}
                      </Text>
                      <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                        {option.subtitle}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.settingRight}>
                    {option.type === 'switch' ? (
                      <Switch
                        value={option.value}
                        onValueChange={option.onValueChange}
                        trackColor={{ 
                          false: theme.colors.border, 
                          true: theme.colors.primary 
                        }}
                        thumbColor={option.value ? theme.colors.white : theme.colors.textSecondary}
                      />
                    ) : (
                      <SimpleIcon name="chevron-right" size={16} color={theme.colors.textSecondary} />
                    )}
                  </View>
                </TouchableOpacity>
                {index < settingsOptions.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: theme.colors.border }]} />
                )}
              </View>
            ))}
          </Card>
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            size="large"
            style={[styles.signOutButton, { borderColor: theme.colors.error }]}
            textStyle={{ color: theme.colors.error }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    margin: defaultTheme.spacing.lg,
    marginBottom: defaultTheme.spacing.md,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: defaultTheme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: defaultTheme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: defaultTheme.spacing.lg,
    marginBottom: defaultTheme.spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: defaultTheme.spacing.xs,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: defaultTheme.spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
  },
  settingsContainer: {
    paddingHorizontal: defaultTheme.spacing.lg,
    marginBottom: defaultTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: defaultTheme.spacing.md,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: defaultTheme.spacing.lg,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: defaultTheme.spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: defaultTheme.spacing.xs,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingRight: {
    marginLeft: defaultTheme.spacing.sm,
  },
  separator: {
    height: 1,
    marginLeft: defaultTheme.spacing.lg,
  },
  signOutContainer: {
    paddingHorizontal: defaultTheme.spacing.lg,
    marginBottom: defaultTheme.spacing.xl,
  },
  signOutButton: {
    borderWidth: 1,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  iconText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ProfileScreen;