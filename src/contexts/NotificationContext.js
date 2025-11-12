// contexts/NotificationContext.js - VERSION SIMPLIFIÉE (répétition automatique)
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import notificationService from '../services/notificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [nextWater, setNextWater] = useState(null);
  const [nextMove, setNextMove] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastNotification, setLastNotification] = useState(null);
  const [profileMissing, setProfileMissing] = useState(false); // 🔥 Nouvel état
  
  const mountedRef = useRef(true);
  const updateIntervalRef = useRef(null);

  // 🔥 INITIALISATION AU MONTAGE
  useEffect(() => {
    console.log('🔔 NotificationProvider MONTÉ');
    mountedRef.current = true;

    const initialize = async () => {
      if (!isInitialized) {
        /* console.log('🔄 Initialisation du système de notifications...');
        try {
          const result = await notificationService.initializeReminders();
          
          if (result.success) {
            if (result.profileMissing) {
              console.log('⚠️  Notifications non activées: profil manquant');
              setProfileMissing(true); // 🔥 Marquer que le profil est manquant
              setIsInitialized(true); // 🔥 On considère quand même le contexte comme initialisé
            } else {
              console.log('✅ Notifications initialisées avec succès');
              await updateNextNotifications();
              setIsInitialized(true);
              setProfileMissing(false);
            }
          } else {
            console.error('❌ Échec initialisation:', result.error);
          }
        } catch (error) {
          console.error('❌ Erreur initialisation:', error);
        } */
      }
    };


    // Démarrer après un court délai
    const initTimer = setTimeout(initialize, 2000);

    // 🔥 LISTENER POUR REPLANIFIER APRÈS CHAQUE NOTIFICATION
    // 🔥 CORRECTION - Modifiez le listener dans NotificationContext.js
// 🔥 REMPLACEZ le listener de notifications
const receivedSubscription = Notifications.addNotificationReceivedListener(async (notification) => {
  if (!mountedRef.current) return;
  
  const type = notification.request.content.data?.type;
  const isRepeating = notification.request.content.data?.isRepeating;
  const interval = notification.request.content.data?.interval;
  const timestamp = new Date().toLocaleTimeString();
  
  console.log(`🔔 Notification ${type} reçue à ${timestamp}`);
  
  setLastNotification({ 
    type, 
    timestamp, 
    id: notification.request.identifier 
  });
  
  // 🔥 CORRECTION : Vérifier que c'est une vraie notification utilisateur
  // Ignorer les notifications de test ou les doublons
  if (isRepeating && interval && (type === 'water' || type === 'movement')) {
    console.log(`⏳ Attente de ${interval}s avant replanification...`);
    
    // 🔥 ATTENDRE l'intervalle complet avant de replanifier
    setTimeout(async () => {
      if (mountedRef.current) {
        try {
          console.log(`🔄 Replanification de ${type}`);
          await notificationService.rescheduleNotification(type);
          setTimeout(updateNextNotifications, 1000);
        } catch (error) {
          console.error(`❌ Erreur replanification ${type}:`, error);
        }
      }
    }, interval * 1000); // 🔥 ATTENTION : interval en millisecondes
  }
});
    // 🔥 LISTENER POUR LES INTERACTIONS (tap sur notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!mountedRef.current) return;
      
      const type = response.notification.request.content.data?.type;
      console.log(`👆 Utilisateur a tapé sur notification ${type}`);
      
      // Vous pouvez ajouter une logique ici (navigation, etc.)
    });

    // 🔥 MISE À JOUR PÉRIODIQUE DES TEMPS (toutes les 30 secondes)
    // Pour garder l'affichage à jour sans trop de re-renders
    const startPeriodicUpdate = () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      
      updateIntervalRef.current = setInterval(() => {
        if (mountedRef.current && isInitialized) {
          updateNextNotifications();
        }
      }, 30000); // Toutes les 30 secondes
    };

    // Démarrer les mises à jour après initialisation
    if (isInitialized) {
      startPeriodicUpdate();
    }

    return () => {
      console.log('🔔 NotificationProvider NETTOYAGE');
      mountedRef.current = false;
      clearTimeout(initTimer);
      receivedSubscription.remove();
      responseSubscription.remove();
      
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [isInitialized]);

  // 🔥 FONCTION DE MISE À JOUR DES TEMPS
  const updateNextNotifications = async () => {
    if (!mountedRef.current) return;

    try {
      const times = await notificationService.getNextNotificationTimesRealTime();
      
      if (mountedRef.current) {
        setNextWater(times.nextWater);
        setNextMove(times.nextMove);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour notifications:', error);
    }
  };

  // 🔥 FONCTIONS DE DEBUG ET MAINTENANCE
  const debugNotifications = async () => {
    const result = await notificationService.debugScheduledNotifications();
    await updateNextNotifications();
    return result;
  };

  const forceResetSystem = async () => {
    console.log('💥 RESET COMPLET DU SYSTÈME');
    try {
      await notificationService.cancelAllReminders();
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await notificationService.initializeReminders();
      if (result.success) {
        await updateNextNotifications();
        console.log('✅ Système réinitialisé avec succès');
      }
    } catch (error) {
      console.error('❌ Erreur reset système:', error);
    }
  };

  const forceReschedule = async (type) => {
    console.log(`🔧 Reprogrammation manuelle pour ${type}`);
    try {
      await notificationService.rescheduleNotification(type);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await updateNextNotifications();
    } catch (error) {
      console.error(`❌ Erreur reprogrammation ${type}:`, error);
    }
  };

  const value = {
    nextWater,
    nextMove,
    isInitialized,
    lastNotification,
    updateNextNotifications,
    forceReschedule,
    debugNotifications,
    forceResetSystem,
    profileMissing, // 🔥 Exposer l'état du profil
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};