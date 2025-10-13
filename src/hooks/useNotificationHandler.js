import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useHealth } from '../contexts/HealthContext';

/**
 * Hook pour gérer les réponses aux notifications
 * Incrémente automatiquement les compteurs quand l'utilisateur clique sur une notification
 */
export const useNotificationHandler = () => {
  const { addWater, addMovement } = useHealth();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Listener pour les notifications reçues (quand l'app est au premier plan)
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📬 Notification reçue:', notification);
    });

    // Listener pour les réponses aux notifications (quand l'utilisateur clique)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Utilisateur a cliqué sur la notification:', response);
      
      const notificationData = response.notification.request.content.data;
      
      if (notificationData) {
        if (notificationData.type === 'water') {
          console.log('💧 Ajout automatique d\'eau depuis la notification');
          const amount = notificationData.amount || 250;
          addWater(amount);
        } else if (notificationData.type === 'movement') {
          console.log('💪 Ajout automatique de mouvement depuis la notification');
          addMovement();
        }
      }
    });

    // Cleanup
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [addWater, addMovement]);
};

export default useNotificationHandler;

