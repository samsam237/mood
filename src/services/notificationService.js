import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types de notifications
const NOTIFICATION_TYPE_WATER = 'water';
const NOTIFICATION_TYPE_MOVE = 'movement';
const DAILY_TIP_ID = 'daily_tip';

// Conseils santé
const healthTips = [
  "Marcher 15 minutes par jour réduit la mortalité de 14%",
  "150 minutes d'activité par semaine pour sauver votre vie",
  "30 minutes de marche quotidienne réduisent de 50% le risque de maladies cardiaques",
  "Boire suffisamment d'eau améliore la concentration et l'énergie",
  "Se lever toutes les heures réduit les risques de diabète",
  "L'activité physique régulière améliore la qualité du sommeil",
  "Rester assis 8h par jour augmente de 40% le risque de mortalité précoce",
];

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

/**
 * Demander les permissions de notifications
 */
export const requestPermissions = async () => {
  if (!Device.isDevice) {
    console.log('Les notifications ne fonctionnent pas sur émulateur');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Permissions de notifications refusées. Activez-les dans les paramètres.');
    return false;
  }

  // Configuration pour Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Rappels MOOD',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#6366F1',
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
      bypassDnd: true, // Contourner le mode Ne pas déranger
      showBadge: true,
    });
  }

  return true;
};

/**
 * Planifier les rappels d'hydratation (120 minutes par défaut)
 */
export const scheduleWaterReminders = async (wakeTime, sleepTime, intervalMinutes = 120) => {
  try {
    // Annuler les anciens rappels d'eau
    await cancelRemindersByType(NOTIFICATION_TYPE_WATER);

    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);

    // Calculer la prochaine notification dans la fenêtre réveil/coucher
    const now = new Date();
    const nextAt = calculateNextNotification(now, wakeHour, wakeMinute, sleepHour, sleepMinute, intervalMinutes);

    if (!nextAt) {
      return { success: false, error: 'Aucune prochaine notification calculée' };
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Il est temps de s'hydrater !",
        body: "Buvez un verre d'eau pour rester en bonne santé",
        sound: 'default',
        vibrate: [0, 500, 200, 500],
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { type: NOTIFICATION_TYPE_WATER, amount: 250 },
      },
      trigger: { date: nextAt }, // one-shot
    });

    console.log(`💧 Prochain rappel eau planifié à ${nextAt.toString()} (intervalle: ${intervalMinutes}min)`);
    return { success: true, count: 1 };
  } catch (error) {
    console.error('Error scheduling water reminders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Planifier les rappels de mouvement (60 minutes par défaut)
 */
export const scheduleMoveReminders = async (wakeTime, sleepTime, intervalMinutes = 60) => {
  try {
    // Annuler les anciens rappels de mouvement
    await cancelRemindersByType(NOTIFICATION_TYPE_MOVE);

    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);

    // Calculer la prochaine notification dans la fenêtre réveil/coucher
    const now = new Date();
    const nextAt = calculateNextNotification(now, wakeHour, wakeMinute, sleepHour, sleepMinute, intervalMinutes);

    if (!nextAt) {
      return { success: false, error: 'Aucune prochaine notification calculée' };
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💪 Un petit mouvement s'impose !",
        body: "Levez-vous et bougez pendant 2-3 minutes",
        sound: 'default',
        vibrate: [0, 500, 200, 500],
        priority: Notifications.AndroidNotificationPriority.MAX,
        data: { type: NOTIFICATION_TYPE_MOVE },
      },
      trigger: { date: nextAt }, // one-shot
    });

    console.log(`💪 Prochain rappel mouvement planifié à ${nextAt.toString()} (intervalle: ${intervalMinutes}min)`);
    return { success: true, count: 1 };
  } catch (error) {
    console.error('Error scheduling move reminders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Planifier le conseil santé quotidien
 */
export const scheduleDailyTip = async () => {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_TIP_ID);

    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_TIP_ID,
      content: {
        title: "📚 Conseil Santé du Jour",
        body: randomTip,
        sound: 'default',
        vibrate: [0, 250, 250, 250],
      },
      trigger: {
        hour: 9,
        minute: 0,
        repeats: true,
      },
    });

    console.log('Daily tip scheduled for 9:00 AM');
    return { success: true };
  } catch (error) {
    console.error('Error scheduling daily tip:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Initialiser tous les rappels
 */
export const initializeReminders = async () => {
  try {
    // Demander les permissions
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      return { success: false, error: 'Permissions refusées' };
    }

    // Charger le profil utilisateur
    const profileData = await AsyncStorage.getItem('user_profile');
    if (!profileData) {
      console.log('Aucun profil utilisateur trouvé');
      return { success: false, error: 'Profil non configuré' };
    }

    const profile = JSON.parse(profileData);

    if (!profile.wakeTime || !profile.sleepTime) {
      console.log('Heures de réveil/coucher non définies');
      return { success: false, error: 'Heures non configurées' };
    }

    // Planifier le conseil quotidien
    await scheduleDailyTip();

    // Planifier les rappels d'eau (120min par défaut)
    const waterInterval = profile.waterReminderFrequency || 120;
    await scheduleWaterReminders(profile.wakeTime, profile.sleepTime, waterInterval);

    // Planifier les rappels de mouvement (60min par défaut)
    const moveInterval = profile.moveReminderFrequency || 60;
    await scheduleMoveReminders(profile.wakeTime, profile.sleepTime, moveInterval);

    console.log('✅ Tous les rappels ont été planifiés');
    return { success: true };

  } catch (error) {
    console.error('Error initializing reminders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Annuler les rappels par type exact (water | movement)
 */
const cancelRemindersByType = async (type) => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter(n => n.content?.data?.type === type);
    for (const notification of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
    console.log(`Cancelled ${toCancel.length} notifications of type: ${type}`);
  } catch (error) {
    console.error('Error cancelling notifications by type:', error);
  }
};

/**
 * Calculer le temps avant le prochain rappel
 */
export const getNextNotificationTimes = async () => {
  try {
    const profileData = await AsyncStorage.getItem('user_profile');
    if (!profileData) {
      return { nextWater: null, nextMove: null };
    }

    const profile = JSON.parse(profileData);
    if (!profile.wakeTime || !profile.sleepTime) {
      return { nextWater: null, nextMove: null };
    }

    const [wakeHour, wakeMinute] = profile.wakeTime.split(':').map(Number);
    const [sleepHour, sleepMinute] = profile.sleepTime.split(':').map(Number);
    const now = new Date();

    const waterInterval = profile.waterReminderFrequency || 120;
    const moveInterval = profile.moveReminderFrequency || 60;

    const nextWater = calculateNextNotification(now, wakeHour, wakeMinute, sleepHour, sleepMinute, waterInterval);
    const nextMove = calculateNextNotification(now, wakeHour, wakeMinute, sleepHour, sleepMinute, moveInterval);

    return { nextWater, nextMove };
  } catch (error) {
    console.error('Error getting next notification times:', error);
    return { nextWater: null, nextMove: null };
  }
};

/**
 * Calculer la prochaine notification
 */
const calculateNextNotification = (now, wakeHour, wakeMinute, sleepHour, sleepMinute, intervalMinutes) => {
  const today = new Date();
  const startTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), wakeHour, wakeMinute);
  let endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), sleepHour, sleepMinute);

  if (endTime <= startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }

  // Si avant l'heure de réveil
  if (now < startTime) {
    return startTime;
  }

  // Si après l'heure de coucher
  if (now >= endTime) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), wakeHour, wakeMinute);
  }

  // Calculer la prochaine notification pendant les heures d'éveil
  const timeSinceWake = now.getTime() - startTime.getTime();
  const intervalsPassed = Math.floor(timeSinceWake / (intervalMinutes * 60 * 1000));
  const nextNotification = new Date(startTime.getTime() + (intervalsPassed + 1) * intervalMinutes * 60 * 1000);

  // Si la prochaine est après le coucher, c'est demain au réveil
  if (nextNotification >= endTime) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), wakeHour, wakeMinute);
  }

  return nextNotification;
};

/**
 * Replanifier automatiquement après une action utilisateur
 */
export const rescheduleNextReminder = async (type) => {
  try {
    const profileData = await AsyncStorage.getItem('user_profile');
    if (!profileData) {
      return { success: false, error: 'Profil non trouvé' };
    }

    const profile = JSON.parse(profileData);
    if (!profile.wakeTime || !profile.sleepTime) {
      return { success: false, error: 'Heures non configurées' };
    }

    if (type === 'water') {
      await scheduleWaterReminders(profile.wakeTime, profile.sleepTime, profile.waterReminderFrequency || 120);
    } else if (type === 'movement') {
      await scheduleMoveReminders(profile.wakeTime, profile.sleepTime, profile.moveReminderFrequency || 60);
    }

    return { success: true };
  } catch (error) {
    console.error('Error rescheduling reminder:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Annuler tous les rappels
 */
export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('Tous les rappels ont été annulés');
    return { success: true };
  } catch (error) {
    console.error('Error cancelling all reminders:', error);
    return { success: false, error: error.message };
  }
};

export default {
  requestPermissions,
  initializeReminders,
  scheduleWaterReminders,
  scheduleMoveReminders,
  scheduleDailyTip,
  getNextNotificationTimes,
  cancelAllReminders,
  rescheduleNextReminder,
};