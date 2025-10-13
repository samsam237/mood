import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { useMood } from '../contexts/MoodContext';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { theme as defaultTheme } from '../constants/theme';
import { MaterialIcons as Icon } from '@expo/vector-icons';

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
      'This action cannot be undone. All your mood entries will be permanently deleted.',
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

  const settingsOptions = [
    {
      title: 'Dark Mode',
      icon: 'dark-mode',
      type: 'switch',
      value: isDarkMode,
      onPress: toggleTheme,
    },
    {
      title: 'Notifications',
      icon: 'notifications',
      type: 'switch',
      value: notificationsEnabled,
      onPress: () => setNotificationsEnabled(!notificationsEnabled),
    },
    {
      title: 'Export Data',
      icon: 'file-download',
      type: 'action',
      onPress: handleExportData,
    },
    {
      title: 'Privacy Policy',
      icon: 'privacy-tip',
      type: 'action',
      onPress: () => console.log('Privacy Policy'),
    },
    {
      title: 'Terms of Service',
      icon: 'description',
      type: 'action',
      onPress: () => console.log('Terms of Service'),
    },
    {
      title: 'Help & Support',
      icon: 'help',
      type: 'action',
      onPress: () => console.log('Help & Support'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Image
              source={
                user?.photo 
                  ? { uri: user.photo }
                  : require('../../assets/default-avatar.png')
              }
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            </View>
          </View>
        </Card>

        {/* Stats Section */}
        <Card>
          <Text style={styles.cardTitle}>Your Journey</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moods.length}</Text>
              <Text style={styles.statLabel}>Total Entries</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.max(1, Math.floor(moods.length / 30))}
              </Text>
              <Text style={styles.statLabel}>Months Active</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {moods.length > 0 ? calculateStreak(moods) : 0}
              </Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
        </Card>

        {/* Settings Section */}
        <Card>
          <Text style={styles.cardTitle}>Settings</Text>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingRow}
              onPress={option.onPress}
              disabled={option.type === 'switch'}
              accessibilityRole={option.type === 'switch' ? 'switch' : 'button'}
              accessibilityLabel={option.title}
            >
              <View style={styles.settingLeft}>
                <Icon 
                  name={option.icon} 
                  size={24} 
                  color={defaultTheme.colors.textSecondary} 
                />
                <Text style={styles.settingTitle}>{option.title}</Text>
              </View>
              {option.type === 'switch' ? (
                <Switch
                  value={option.value}
                  onValueChange={option.onPress}
                  trackColor={{ 
                    false: defaultTheme.colors.border, 
                    true: defaultTheme.colors.primary 
                  }}
                  thumbColor={defaultTheme.colors.white}
                />
              ) : (
                <Icon 
                  name="chevron-right" 
                  size={24} 
                  color={defaultTheme.colors.textSecondary} 
                />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Danger Zone */}
        <Card style={styles.dangerCard}>
          <Text style={styles.cardTitle}>Danger Zone</Text>
          <Button
            title="Delete All Data"
            onPress={handleDeleteData}
            variant="outline"
            style={[styles.dangerButton, { borderColor: defaultTheme.colors.error }]}
          />
        </Card>

        {/* Sign Out Button */}
        <Button
          title="Sign Out"
          onPress={handleSignOut}
          variant="outline"
          style={styles.signOutButton}
        />

        {/* App Version */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Mood Tracker v1.0.0</Text>
          <Text style={styles.versionText}>Made with ❤️</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function (reused from AnalyticsScreen)
const calculateStreak = (moods) => {
  if (moods.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    
    const hasEntry = moods.some(mood => 
      new Date(mood.timestamp).toDateString() === checkDate.toDateString()
    );
    
    if (hasEntry) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultTheme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: defaultTheme.spacing.md,
  },
  profileCard: {
    marginTop: defaultTheme.spacing.md,
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
    backgroundColor: defaultTheme.colors.surface,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: defaultTheme.colors.text,
    marginBottom: defaultTheme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: defaultTheme.colors.textSecondary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: defaultTheme.colors.text,
    marginBottom: defaultTheme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: defaultTheme.colors.primary,
    marginBottom: defaultTheme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: defaultTheme.colors.textSecondary,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: defaultTheme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: defaultTheme.colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingTitle: {
    fontSize: 16,
    color: defaultTheme.colors.text,
    marginLeft: defaultTheme.spacing.md,
  },
  dangerCard: {
    borderColor: defaultTheme.colors.error + '20',
    borderWidth: 1,
  },
  dangerButton: {
    borderColor: defaultTheme.colors.error,
  },
  signOutButton: {
    marginVertical: defaultTheme.spacing.lg,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: defaultTheme.spacing.xl,
  },
  versionText: {
    fontSize: 12,
    color: defaultTheme.colors.textSecondary,
    marginBottom: defaultTheme.spacing.xs,
  },
});

export default ProfileScreen;
