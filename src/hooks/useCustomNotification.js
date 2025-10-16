import { useState } from 'react';

export const useCustomNotification = () => {
  const [notification, setNotification] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success',
    duration: 3000,
    position: 'top'
  });

  const showNotification = (title, message = '', type = 'success', duration = 3000, position = 'top') => {
    setNotification({
      visible: true,
      title,
      message,
      type,
      duration,
      position
    });
  };

  const showSuccess = (title, message = '', duration = 3000) => {
    showNotification(title, message, 'success', duration);
  };

  const showError = (title, message = '', duration = 3000) => {
    showNotification(title, message, 'error', duration);
  };

  const showWarning = (title, message = '', duration = 3000) => {
    showNotification(title, message, 'warning', duration);
  };

  const showInfo = (title, message = '', duration = 3000) => {
    showNotification(title, message, 'info', duration);
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false
    }));
  };

  return {
    notification,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideNotification
  };
};
