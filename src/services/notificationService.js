import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IDs pour différencier les types de notifications
const WATER_REMINDER_ID_PREFIX = 'water_';
const MOVE_REMINDER_ID_PREFIX = 'move_';
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
    priority: Notifications.AndroidNotificationPriority.HIGH,
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
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366F1',
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
    });
  }

  return true;
};

/**
 * Planifier les rappels d'hydratation
 */
export const scheduleWaterReminders = async (wakeTime, sleepTime, intervalMinutes) => {
  try {
    // Annuler les anciens rappels d'eau
    await cancelRemindersByPrefix(WATER_REMINDER_ID_PREFIX);

    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);

    const notifications = [];
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), wakeHour, wakeMinute);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sleepHour, sleepMinute);

    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    let currentTime = new Date(startTime);
    let counter = 0;

    while (currentTime < endTime) {
      notifications.push({
        content: {
          title: "💧 Il est temps de s'hydrater !",
          body: "Buvez un verre d'eau pour rester en bonne santé",
          sound: 'default',
          vibrate: [0, 250, 250, 250],
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: currentTime.getHours(),
          minute: currentTime.getMinutes(),
          repeats: true,
        },
      });

      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
      counter++;
    }

    console.log(`Scheduling ${notifications.length} water reminders`);

    for (let i = 0; i < notifications.length; i++) {
      const id = `${WATER_REMINDER_ID_PREFIX}${i}`;
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        ...notifications[i],
      });
    }

    return { success: true, count: notifications.length };
  } catch (error) {
    console.error('Error scheduling water reminders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Planifier les rappels de mouvement
 */
export const scheduleMoveReminders = async (wakeTime, sleepTime, intervalMinutes) => {
  try {
    // Annuler les anciens rappels de mouvement
    await cancelRemindersByPrefix(MOVE_REMINDER_ID_PREFIX);

    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);

    const notifications = [];
    const now = new Date();
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), wakeHour, wakeMinute);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sleepHour, sleepMinute);

    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    let currentTime = new Date(startTime);
    let counter = 0;

    while (currentTime < endTime) {
      notifications.push({
        content: {
          title: "💪 Un petit mouvement s'impose !",
          body: "Levez-vous et bougez pendant 2-3 minutes",
          sound: 'default',
          vibrate: [0, 250, 250, 250],
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: currentTime.getHours(),
          minute: currentTime.getMinutes(),
          repeats: true,
        },
      });

      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
      counter++;
    }

    console.log(`Scheduling ${notifications.length} move reminders`);

    for (let i = 0; i < notifications.length; i++) {
      const id = `${MOVE_REMINDER_ID_PREFIX}${i}`;
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        ...notifications[i],
      });
    }

    return { success: true, count: notifications.length };
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

    // Planifier les rappels d'eau
    const waterInterval = profile.waterReminderFrequency || 30; // 30 min par défaut
    await scheduleWaterReminders(profile.wakeTime, profile.sleepTime, waterInterval);

    // Planifier les rappels de mouvement
    const moveInterval = profile.moveReminderFrequency || 60; // 60 min par défaut
    await scheduleMoveReminders(profile.wakeTime, profile.sleepTime, moveInterval);

    console.log('✅ Tous les rappels ont été planifiés');
    return { success: true };

  } catch (error) {
    console.error('Error initializing reminders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Annuler les rappels par préfixe
 */
const cancelRemindersByPrefix = async (prefix) => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter(n => n.identifier.startsWith(prefix));
    
    for (const notification of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
    
    console.log(`Cancelled ${toCancel.length} notifications with prefix: ${prefix}`);
  } catch (error) {
    console.error('Error cancelling notifications:', error);
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

    const waterInterval = profile.waterReminderFrequency || 30;
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
  const endTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), sleepHour, sleepMinute);

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
};

