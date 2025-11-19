// contexts/NotificationContext.js - VERSION CORRIGÉE
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
  const [profileMissing, setProfileMissing] = useState(false);
  
  const mountedRef = useRef(true);
  const updateIntervalRef = useRef(null);
  const lastRescheduleRef = useRef({}); // ✅ Tracker les dernières replanifications

  useEffect(() => {
    console.log('🔔 NotificationProvider MONTÉ');
    mountedRef.current = true;

    const initialize = async () => {
      if (!isInitialized) {
        console.log('🔄 Initialisation du système de notifications...');
        try {
          const result = await notificationService.initializeReminders();
          
          if (result.success) {
            if (result.profileMissing) {
              console.log('⚠️  Notifications non activées: profil manquant');
              setProfileMissing(true);
              setIsInitialized(true);
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
        }
      }
    };

    // Démarrer après un court délai
    const initTimer = setTimeout(initialize, 2000);

    // 🔥 LISTENER AUTOMATIQUE - Replanifie dès qu'une notification arrive
    const receivedSubscription = Notifications.addNotificationReceivedListener(async (notification) => {
      if (!mountedRef.current) return;
      
      const type = notification.request.content.data?.type;
      const timestamp = new Date().toLocaleTimeString();
      
      console.log(`🔔 Notification ${type} reçue à ${timestamp}`);
      
      setLastNotification({ 
        type, 
        timestamp, 
        id: notification.request.identifier 
      });
      
      // ✅ REPLANIFIER AUTOMATIQUEMENT (sans clic utilisateur)
      if (type === 'water' || type === 'movement') {
        console.log(`🔄 Replanification automatique de ${type}...`);
        
        // Petite pause pour éviter les conflits
        setTimeout(async () => {
          if (mountedRef.current) {
            try {
              await notificationService.rescheduleNotification(type);
              console.log(`✅ ${type} replanifié automatiquement`);
              setTimeout(updateNextNotifications, 1000);
            } catch (error) {
              console.error(`❌ Erreur replanification ${type}:`, error);
            }
          }
        }, 1000);
      }
    });

    // 🔥 LISTENER POUR LES INTERACTIONS (tap sur notification)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      if (!mountedRef.current) return;
      
      const type = response.notification.request.content.data?.type;
      console.log(`👆 Utilisateur a tapé sur notification ${type}`);
      
      // La replanification est gérée par useNotificationHandler
    });

    // 🔥 MISE À JOUR PÉRIODIQUE DES TEMPS (toutes les 30 secondes)
    const startPeriodicUpdate = () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
      
      updateIntervalRef.current = setInterval(() => {
        if (mountedRef.current && isInitialized) {
          updateNextNotifications();
        }
      }, 30000);
    };

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
    profileMissing,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};