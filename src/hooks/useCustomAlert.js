import { useState } from 'react';

export const useCustomAlert = () => {
  const [alert, setAlert] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'error',
  });

  const showAlert = (title, message, type = 'error') => {
    setAlert({
      visible: true,
      title,
      message,
      type,
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({
      ...prev,
      visible: false,
    }));
  };

  // Méthodes pratiques pour différents types d'alertes
  const showError = (title, message) => showAlert(title, message, 'error');
  const showSuccess = (title, message) => showAlert(title, message, 'success');
  const showWarning = (title, message) => showAlert(title, message, 'warning');
  const showInfo = (title, message) => showAlert(title, message, 'info');

  return {
    alert,
    showAlert,
    hideAlert,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
};







