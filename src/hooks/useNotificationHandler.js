// hooks/useNotificationHandler.js - VERSION CORRIGÉE
import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useHealth } from '../contexts/HealthContext';
import notificationService from '../services/notificationService';

/**
 * Hook pour gérer les réponses aux notifications
 * Incrémente automatiquement les compteurs quand l'utilisateur clique sur une notification
 * Et replanifie automatiquement le prochain rappel
 */
export const useNotificationHandler = () => {
  const { addWater, addMovement } = useHealth();
  const responseListener = useRef();

  useEffect(() => {
    // ✅ UN SEUL LISTENER - Pour les clics utilisateur uniquement
    responseListener.current = Notifications.addNotificationResponseReceivedListener(async response => {
      console.log('👆 Utilisateur a cliqué sur la notification');
      
      const notificationData = response.notification.request.content.data;
      
      if (notificationData) {
        if (notificationData.type === 'water') {
          console.log('💧 Ajout automatique d\'eau depuis la notification');
          const amount = notificationData.amount || 250;
          addWater(amount);
          
          // ✅ Replanifier en utilisant la bonne fonction
          try {
            await notificationService.rescheduleNotification('water');
            console.log('✅ Prochain rappel eau replanifié');
          } catch (error) {
            console.error('❌ Erreur replanification eau:', error);
          }
        } else if (notificationData.type === 'movement') {
          console.log('💪 Ajout automatique de mouvement depuis la notification');
          addMovement();
          
          // ✅ Replanifier en utilisant la bonne fonction
          try {
            await notificationService.rescheduleNotification('movement');
            console.log('✅ Prochain rappel mouvement replanifié');
          } catch (error) {
            console.error('❌ Erreur replanification mouvement:', error);
          }
        }
      }
    });

    // Cleanup
    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [addWater, addMovement]);
};

export default useNotificationHandler;