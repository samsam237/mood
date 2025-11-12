import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types de notifications
const NOTIFICATION_TYPE_WATER = 'water';
const NOTIFICATION_TYPE_MOVE = 'movement';
const DAILY_TIP_ID = 'daily_tip';

// Intervalles par défaut (en secondes) - VALEURS DE PRODUCTION
const DEFAULT_WATER_INTERVAL = 120 * 60; // 120 minutes = 7200 secondes
const DEFAULT_MOVE_INTERVAL = 60 * 60;   // 60 minutes = 3600 secondes

// Configuration des notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});

export const requestPermissions = async () => {
  if (!Device.isDevice) {
    console.log('⚠️  Les notifications ne fonctionnent pas sur émulateur');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('❌ Permissions de notifications refusées');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Rappels MOOD',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 500, 200, 500],
      lightColor: '#6366F1',
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
      bypassDnd: true,
      showBadge: true,
    });
  }

  return true;
};

const cancelRemindersByType = async (type) => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter(n => n.content?.data?.type === type);
    
    for (const notification of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
    
    console.log(`🗑️  Annulé ${toCancel.length} notifications de type ${type}`);
    return { success: true, count: toCancel.length };
  } catch (error) {
    console.error('❌ Error cancelling notifications by type:', error);
    return { success: false, error: error.message };
  }
};

export const scheduleSingleReminder = async (type, intervalSeconds) => {
  try {
    const content = {
      title: type === 'water' ? "💧 Il est temps de s'hydrater !" : "💪 Un petit mouvement s'impose !",
      body: type === 'water' 
        ? "Buvez un verre d'eau pour rester en bonne santé" 
        : "Levez-vous et bougez pendant 2-3 minutes",
      sound: 'default',
      priority: Notifications.AndroidNotificationPriority.MAX,
      data: { 
        type: type,
        timestamp: Date.now(),
        interval: intervalSeconds,
        isRepeating: true,
        notificationId: `${type}_${Date.now()}`
      },
    };

    if (type === 'water') {
      content.data.amount = 250;
    }

    const triggerDate = new Date(Date.now() + (intervalSeconds * 1000));
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        date: triggerDate,
        repeats: false,
      },
    });

    console.log(`✅ ${type === 'water' ? '💧 Eau' : '💪 Mouvement'} planifié pour ${triggerDate.toLocaleTimeString()}`);
    console.log(`   ID: ${notificationId}`);
    
    return { 
      success: true, 
      id: notificationId,
      triggerTime: triggerDate,
      interval: intervalSeconds 
    };
  } catch (error) {
    console.error(`❌ Erreur planification ${type}:`, error);
    return { success: false, error: error.message };
  }
};

export const rescheduleNotification = async (type) => {
  try {
    console.log(`🔄 Replanification ${type}...`);
    
    // Petite pause pour éviter les conflits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Annuler les anciennes notifications de ce type
    await cancelRemindersByType(type);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Récupérer les intervalles depuis le profil utilisateur
    const profileData = await AsyncStorage.getItem('user_profile');
    let intervalSeconds;
    
    if (profileData) {
      const profile = JSON.parse(profileData);
      if (type === 'water') {
        const intervalMinutes = profile.waterReminderFrequency || 120;
        intervalSeconds = intervalMinutes * 60;
      } else {
        const intervalMinutes = profile.moveReminderFrequency || 60;
        intervalSeconds = intervalMinutes * 60;
      }
    } else {
      // Utiliser les valeurs par défaut si pas de profil
      intervalSeconds = type === 'water' ? DEFAULT_WATER_INTERVAL : DEFAULT_MOVE_INTERVAL;
    }
    
    // Programmer la nouvelle notification
    const result = await scheduleSingleReminder(type, intervalSeconds);
    
    if (result.success) {
      console.log(`✅ ${type} replanifié avec succès`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Erreur replanification ${type}:`, error);
    return { success: false, error: error.message };
  }
};

export const getNextNotificationTimesRealTime = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const now = new Date();
    
    let nextWater = null;
    let nextMove = null;

    scheduled.forEach(notification => {
      const type = notification.content.data?.type;
      const trigger = notification.trigger;
      
      let triggerDate = null;
      
      if (trigger.type === 'timeInterval') {
        const intervalSeconds = trigger.seconds;
        const nextOccurrence = trigger.nextTriggerDate;
        
        if (nextOccurrence) {
          triggerDate = new Date(nextOccurrence * 1000);
        } else {
          triggerDate = new Date(now.getTime() + (intervalSeconds * 1000));
        }
      } else if (trigger.type === 'date' && trigger.date) {
        triggerDate = new Date(trigger.date);
      }
      
      if (triggerDate && triggerDate > now) {
        if (type === 'water') {
          if (!nextWater || triggerDate < nextWater) {
            nextWater = triggerDate;
          }
        } else if (type === 'movement') {
          if (!nextMove || triggerDate < nextMove) {
            nextMove = triggerDate;
          }
        }
      }
    });

    // Si pas de notification programmée, calculer la suivante
    if (!nextWater) {
      nextWater = new Date(now.getTime() + (DEFAULT_WATER_INTERVAL * 1000));
    }
    
    if (!nextMove) {
      nextMove = new Date(now.getTime() + (DEFAULT_MOVE_INTERVAL * 1000));
    }

    return { nextWater, nextMove };
  } catch (error) {
    console.error('❌ Erreur calcul temps réel:', error);
    
    const now = new Date();
    return {
      nextWater: new Date(now.getTime() + (DEFAULT_WATER_INTERVAL * 1000)),
      nextMove: new Date(now.getTime() + (DEFAULT_MOVE_INTERVAL * 1000))
    };
  }
};

export const scheduleDailyTip = async () => {
  try {
    await Notifications.cancelScheduledNotificationAsync(DAILY_TIP_ID);
    
    const healthTips = [
      "Marcher 15 minutes par jour réduit la mortalité de 14%",
      "150 minutes d'activité par semaine pour sauver votre vie",
      "Boire 2L d'eau par jour améliore les fonctions cognitives",
      "Se lever toutes les heures réduit les risques cardiovasculaires",
      "Une bonne hydratation améliore la concentration de 25%",
      "5 minutes de stretching par jour prévient les douleurs musculaires",
      "Respirer profondément 3 fois réduit le stress instantanément"
    ];
    
    const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];
    
    // Calculer le temps jusqu'à demain 9h
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const secondsUntilTomorrow = Math.floor((tomorrow - new Date()) / 1000);
    
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_TIP_ID,
      content: {
        title: "📚 Conseil Santé du Jour",
        body: randomTip,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        seconds: secondsUntilTomorrow,
        repeats: true,
      },
    });

    console.log('✅ Conseil quotidien planifié (répétition quotidienne)');
    return { success: true };
  } catch (error) {
    console.error('❌ Error scheduling daily tip:', error);
    return { success: false, error: error.message };
  }
};

export const initializeReminders = async () => {
  try {
    console.log('🔔 Début initialisation rappels...');
    
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      return { success: false, error: 'Permissions refusées' };
    }

    const profileData = await AsyncStorage.getItem('user_profile');
    
    if (!profileData) {
      console.log('⚠️  Aucun profil utilisateur trouvé');
      console.log('💡 Conseil: L\'utilisateur doit configurer son profil dans l\'écran Profil');
      
      return { 
        success: true, 
        warning: 'Profil non configuré - Notifications désactivées',
        profileMissing: true 
      };
    }

    const profile = JSON.parse(profileData);
    console.log('✅ Profil utilisateur trouvé, planification des notifications...');
    
    console.log('🗑️  Nettoyage des anciennes notifications...');
    await Notifications.cancelAllScheduledNotificationsAsync();
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('📅 Planification des nouvelles notifications...');
    
    // Planifier le conseil quotidien
    await scheduleDailyTip();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Récupérer les intervalles depuis le profil (en minutes) et convertir en secondes
    const waterIntervalMinutes = profile.waterReminderFrequency || 120;
    const moveIntervalMinutes = profile.moveReminderFrequency || 60;
    
    const waterIntervalSeconds = waterIntervalMinutes * 60;
    const moveIntervalSeconds = moveIntervalMinutes * 60;

    // Planifier eau
    const waterResult = await scheduleSingleReminder('water', waterIntervalSeconds);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Planifier mouvement
    const moveResult = await scheduleSingleReminder('movement', moveIntervalSeconds);

    console.log(`✅ Rappels initialisés avec répétition automatique`);
    console.log(`   Eau: toutes les ${waterIntervalMinutes}min (${waterIntervalSeconds}s)`);
    console.log(`   Mouvement: toutes les ${moveIntervalMinutes}min (${moveIntervalSeconds}s)`);
    
    return { 
      success: waterResult.success && moveResult.success,
      water: waterResult,
      movement: moveResult
    };
  } catch (error) {
    console.error('❌ Erreur initialisation rappels:', error);
    return { success: false, error: error.message };
  }
};

export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Tous les rappels ont été annulés');
    return { success: true };
  } catch (error) {
    console.error('❌ Error cancelling all reminders:', error);
    return { success: false, error: error.message };
  }
};

export const debugScheduledNotifications = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`\n📋 === DEBUG NOTIFICATIONS (${scheduled.length} planifiées) ===`);
    
    const now = new Date();
    const result = {
      total: scheduled.length,
      notifications: []
    };
    
    scheduled.forEach((notif, index) => {
      const type = notif.content.data?.type || 'inconnu';
      const trigger = notif.trigger;
      
      let nextTime = null;
      let triggerInfo = '';
      
      if (trigger.type === 'timeInterval') {
        const intervalSec = trigger.seconds;
        const intervalMin = Math.round(intervalSec / 60);
        triggerInfo = `Répétition: ${intervalSec}s (${intervalMin}min)`;
        
        if (trigger.nextTriggerDate) {
          nextTime = new Date(trigger.nextTriggerDate * 1000);
        } else {
          nextTime = new Date(now.getTime() + (intervalSec * 1000));
        }
      } else if (trigger.type === 'date') {
        nextTime = new Date(trigger.date);
        triggerInfo = 'Déclenchement unique';
      }
      
      const timeUntil = nextTime ? Math.max(0, Math.floor((nextTime - now) / 1000)) : null;
      const timeUntilMin = timeUntil ? Math.floor(timeUntil / 60) : null;
      
      const notificationInfo = {
        index: index + 1,
        type: type,
        id: notif.identifier,
        title: notif.content.title,
        triggerType: trigger.type,
        triggerInfo: triggerInfo,
        nextTime: nextTime ? nextTime.toLocaleTimeString() : 'inconnu',
        timeUntilSeconds: timeUntil,
        timeUntilMinutes: timeUntilMin
      };
      
      result.notifications.push(notificationInfo);
      
      console.log(`\n${index + 1}. ${notif.content.title}`);
      console.log(`   Type: ${type}`);
      console.log(`   ID: ${notif.identifier}`);
      console.log(`   Trigger: ${triggerInfo}`);
      console.log(`   Prochaine: ${nextTime ? nextTime.toLocaleTimeString() : 'inconnu'}`);
      if (timeUntil !== null) {
        console.log(`   Dans: ${timeUntilMin}min ${timeUntil % 60}s`);
      }
    });
    
    console.log('\n==========================================\n');
    
    return result;
  } catch (error) {
    console.error('❌ Error debugging notifications:', error);
    return { error: error.message };
  }
};

export default {
  requestPermissions,
  initializeReminders,
  scheduleSingleReminder,
  rescheduleNotification,
  scheduleDailyTip,
  getNextNotificationTimes: getNextNotificationTimesRealTime,
  getNextNotificationTimesRealTime,
  cancelAllReminders,
  debugScheduledNotifications,
};