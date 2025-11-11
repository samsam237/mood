// notificationService.js - VERSION CORRIGÉE SANS BOUCLE
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types de notifications
const NOTIFICATION_TYPE_WATER = 'water';
const NOTIFICATION_TYPE_MOVE = 'movement';
const DAILY_TIP_ID = 'daily_tip';

// Intervalles de test (en secondes)
const TEST_WATER_INTERVAL = 180; // 3 minutes
const TEST_MOVE_INTERVAL = 120;  // 2 minutes

// 🔥 DÉLAI MINIMAL entre planifications (en ms)
const MIN_SCHEDULING_DELAY = 5000;

// Drapeaux globaux pour éviter les conflits
let isInitializing = false;
let lastWaterSchedule = 0;
let lastMoveSchedule = 0;

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
    console.log('Permissions de notifications refusées');
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
    console.error('Error cancelling notifications by type:', error);
    return { success: false, error: error.message };
  }
};

// 🔥 FONCTION CORRIGÉE : Vérification anti-boucle
const canSchedule = (type) => {
  const now = Date.now();
  const lastSchedule = type === 'water' ? lastWaterSchedule : lastMoveSchedule;
  
  if (now - lastSchedule < MIN_SCHEDULING_DELAY) {
    console.log(`⏳ ${type} - Attente avant nouvelle planification`);
    return false;
  }
  
  // Mettre à jour le timestamp
  if (type === 'water') {
    lastWaterSchedule = now;
  } else {
    lastMoveSchedule = now;
  }
  
  return true;
};

// 🔥 PLANIFICATION SIMPLIFIÉE sans déclenchement immédiat
export const scheduleSingleReminder = async (type, intervalSeconds) => {
  try {
    // Vérifier anti-boucle
    if (!canSchedule(type)) {
      return { success: false, error: 'Planification trop rapide' };
    }

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
        interval: intervalSeconds
      },
    };

    if (type === 'water') {
      content.data.amount = 250;
    }

    // 🔥 S'assurer que la date est dans le futur
    const triggerDate = new Date(Date.now() + (intervalSeconds * 1000));
    
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        date: triggerDate,
      },
    });

    console.log(`✅ ${type === 'water' ? '💧 Eau' : '💪 Mouvement'} planifié à ${triggerDate.toLocaleTimeString()} - ID: ${notificationId}`);
    return { success: true, id: notificationId, triggerTime: triggerDate };
  } catch (error) {
    console.error(`❌ Erreur planification ${type}:`, error);
    return { success: false, error: error.message };
  }
};

// 🔥 REPROGRAMMATION AVEC PROTECTION ANTI-BOUCLE
export const rescheduleNotification = async (type) => {
  try {
    console.log(`🔄 Tentative replanification ${type}...`);
    
    // Vérifier anti-boucle
    if (!canSchedule(type)) {
      return { success: false, error: 'Replanification trop rapide' };
    }

    // Petite pause pour laisser le système se stabiliser
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Annuler les anciennes notifications de ce type
    await cancelRemindersByType(type);
    
    // Déterminer l'intervalle
    const intervalSeconds = type === 'water' ? TEST_WATER_INTERVAL : TEST_MOVE_INTERVAL;
    
    // Programmer la nouvelle notification
    const result = await scheduleSingleReminder(type, intervalSeconds);
    
    if (result.success) {
      console.log(`✅ ${type} replanifié avec succès`);
    } else {
      console.log(`⚠️  ${type} non replanifié: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ Erreur replanification ${type}:`, error);
    return { success: false, error: error.message };
  }
};

// 🔥 FONCTION AMÉLIORÉE : Obtenir les prochains temps
// notificationService.js - Amélioration de la fonction getNextNotificationTimesRealTime
export const getNextNotificationTimesRealTime = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const now = new Date();
    
    let nextWater = null;
    let nextMove = null;

    scheduled.forEach(notification => {
      const type = notification.content.data?.type;
      const trigger = notification.trigger;
      
      if (trigger.type === 'date' && trigger.date) {
        const triggerDate = new Date(trigger.date);
        
        // S'assurer que la date est dans le futur
        if (triggerDate > now) {
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
      }
    });

    // Si pas de notification programmée, calculer la suivante
    if (!nextWater) {
      nextWater = new Date(now.getTime() + (TEST_WATER_INTERVAL * 1000));
    }
    
    if (!nextMove) {
      nextMove = new Date(now.getTime() + (TEST_MOVE_INTERVAL * 1000));
    }

    return { nextWater, nextMove };
  } catch (error) {
    console.error('❌ Erreur calcul temps réel:', error);
    
    // Fallback simple
    const now = new Date();
    return {
      nextWater: new Date(now.getTime() + (TEST_WATER_INTERVAL * 1000)),
      nextMove: new Date(now.getTime() + (TEST_MOVE_INTERVAL * 1000))
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
    
    // 🔥 Planifier pour demain 9h pour éviter le déclenchement immédiat
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_TIP_ID,
      content: {
        title: "📚 Conseil Santé du Jour",
        body: randomTip,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        date: tomorrow,
        repeats: true,
      },
    });

    console.log('✅ Conseil quotidien planifié pour 9:00 AM (demain)');
    return { success: true };
  } catch (error) {
    console.error('Error scheduling daily tip:', error);
    return { success: false, error: error.message };
  }
};

// 🔥 INITIALISATION CORRIGÉE avec protection
export const initializeReminders = async () => {
  if (isInitializing) {
    console.log('🚫 Initialisation déjà en cours');
    return { success: false, error: 'Déjà en cours' };
  }

  isInitializing = true;
  
  try {
    console.log('🔔 Début initialisation rappels...');
    
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      return { success: false, error: 'Permissions refusées' };
    }

    // Vérifier le profil utilisateur
    const profileData = await AsyncStorage.getItem('user_profile');
    if (!profileData) {
      console.log('Aucun profil utilisateur trouvé');
      return { success: false, error: 'Profil non configuré' };
    }

    // 🔥 VIDER progressivement les notifications existantes
    console.log('🗑️  Nettoyage des anciennes notifications...');
    await Notifications.cancelAllScheduledNotificationsAsync();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 🔥 PLANIFIER avec délais entre chaque
    console.log('📅 Planification des nouvelles notifications...');
    
    // Planifier le conseil quotidien d'abord
    await scheduleDailyTip();
    await new Promise(resolve => setTimeout(resolve, 500));

    // Planifier eau
    const waterResult = await scheduleSingleReminder('water', TEST_WATER_INTERVAL);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Planifier mouvement
    const moveResult = await scheduleSingleReminder('movement', TEST_MOVE_INTERVAL);
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`✅ Rappels initialisés (Eau: ${waterResult.success}, Mouvement: ${moveResult.success})`);
    
    return { 
      success: waterResult.success && moveResult.success,
      water: waterResult,
      movement: moveResult
    };
  } catch (error) {
    console.error('❌ Erreur initialisation rappels:', error);
    return { success: false, error: error.message };
  } finally {
    isInitializing = false;
  }
};

export const cancelAllReminders = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Tous les rappels ont été annulés');
    return { success: true };
  } catch (error) {
    console.error('Error cancelling all reminders:', error);
    return { success: false, error: error.message };
  }
};

// 🔥 FONCTION DE DIAGNOSTIC
export const debugScheduledNotifications = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`📋 Notifications planifiées: ${scheduled.length}`);
    
    const now = new Date();
    const result = {
      total: scheduled.length,
      notifications: []
    };
    
    scheduled.forEach((notif, index) => {
      const type = notif.content.data?.type || 'inconnu';
      const trigger = notif.trigger;
      let nextTime = null;
      
      if (trigger.type === 'date' && trigger.date) {
        nextTime = new Date(trigger.date);
      }
      
      const notificationInfo = {
        index: index + 1,
        type: type,
        id: notif.identifier,
        title: notif.content.title,
        nextTime: nextTime ? nextTime.toLocaleTimeString() : 'inconnu',
        timeUntil: nextTime ? Math.max(0, Math.floor((nextTime - now) / 1000)) : null
      };
      
      result.notifications.push(notificationInfo);
      
      console.log(`   ${index + 1}. ${notif.content.title}`);
      console.log(`      Type: ${type}, ID: ${notif.identifier}`);
      console.log(`      Prochaine: ${nextTime ? nextTime.toLocaleTimeString() : 'inconnu'}`);
    });
    
    return result;
  } catch (error) {
    console.error('Error debugging notifications:', error);
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