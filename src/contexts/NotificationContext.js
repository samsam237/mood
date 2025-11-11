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
  
  const mountedRef = useRef(true);
  const notificationProcessedRef = useRef(new Set());

  // 🔥 INITIALISATION STABLE SANS INTERVALLE
  useEffect(() => {
    console.log('🔔 NotificationProvider INIT');
    mountedRef.current = true;

    const initialize = async () => {
      if (!isInitialized) {
        console.log('🔄 Initialisation des rappels...');
        try {
          await notificationService.initializeReminders();
          await updateNextNotifications();
          setIsInitialized(true);
          console.log('✅ Initialisation terminée');
        } catch (error) {
          console.error('❌ Erreur initialisation:', error);
        }
      }
    };

    // Démarrer l'initialisation après un court délai
    setTimeout(initialize, 3000);

    // 🔥 ÉCOUTEUR STABLE : Seulement pour les vraies notifications
    const subscription = Notifications.addNotificationReceivedListener(async (notification) => {
      if (!mountedRef.current) return;
      
      const type = notification.request.content.data?.type;
      const notificationId = notification.request.identifier;
      const timestamp = new Date().toLocaleTimeString();
      
      // Éviter les doublons
      if (notificationProcessedRef.current.has(notificationId)) {
        return;
      }
      
      notificationProcessedRef.current.add(notificationId);
      
      console.log(`🔔 Notification ${type} reçue à ${timestamp}`);
      setLastNotification({ type, timestamp, id: notificationId });
      
      // Reprogrammer SEULEMENT pour les types water/movement
      if (type === 'water' || type === 'movement') {
        console.log(`🔄 Reprogrammation planifiée pour ${type}`);
        
        // Délai avant reprogrammation
        setTimeout(async () => {
          if (mountedRef.current) {
            try {
              await notificationService.rescheduleNotification(type);
              // 🔥 Mise à jour UNIQUE après reprogrammation
              setTimeout(updateNextNotifications, 1000);
            } catch (error) {
              console.error(`❌ Erreur reprogrammation ${type}:`, error);
            }
          }
        }, 2000);
      }
      
      // Nettoyer les IDs après 1 minute
      setTimeout(() => {
        notificationProcessedRef.current.delete(notificationId);
      }, 60000);
    });

    // 🔥 SUPPRIMER L'INTERVALLE QUI CAUSE LES RE-RENDERS
    // Plus de setInterval ici !

    return () => {
      console.log('🔔 NotificationProvider CLEANUP');
      mountedRef.current = false;
      subscription.remove();
      notificationProcessedRef.current.clear();
    };
  }, []);

  // 🔥 FONCTION DE MISE À JOUR OPTIMISÉE
  const updateNextNotifications = async () => {
    if (!mountedRef.current) return;

    try {
      const times = await notificationService.getNextNotificationTimesRealTime();
      
      if (mountedRef.current) {
        setNextWater(times.nextWater);
        setNextMove(times.nextMove);
        
        console.log('🔔 Temps mis à jour:', {
          nextWater: times.nextWater?.toLocaleTimeString(),
          nextMove: times.nextMove?.toLocaleTimeString()
        });
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour notifications:', error);
    }
  };

  // Fonctions de debug
  const debugNotifications = async () => {
    return await notificationService.debugScheduledNotifications();
  };

  const forceResetSystem = async () => {
    console.log('💥 Reset forcé du système');
    await notificationService.cancelAllReminders();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await notificationService.initializeReminders();
    await updateNextNotifications();
  };

  const forceReschedule = async (type) => {
    console.log(`🔧 Reprogrammation forcée pour ${type}`);
    await notificationService.rescheduleNotification(type);
    await updateNextNotifications();
  };

  const value = {
    nextWater,
    nextMove,
    isInitialized,
    lastNotification,
    updateNextNotifications,
    forceReschedule,
    debugNotifications,
    forceResetSystem
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};