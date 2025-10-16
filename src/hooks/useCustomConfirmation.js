import { useState } from 'react';
import { useTranslation } from './useTranslation';

export const useCustomConfirmation = () => {
  const { t } = useTranslation();
  
  const [confirmation, setConfirmation] = useState({
    visible: false,
    title: '',
    message: '',
    confirmText: t('common.confirm'),
    cancelText: t('common.cancel'),
    type: 'warning',
    onConfirm: null
  });

  const showConfirmation = (
    title, 
    message, 
    onConfirm, 
    confirmText = t('common.confirm'),
    cancelText = t('common.cancel'),
    type = 'warning'
  ) => {
    setConfirmation({
      visible: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm
    });
  };

  const showDangerConfirmation = (title, message, onConfirm) => {
    showConfirmation(title, message, onConfirm, t('common.confirm'), t('common.cancel'), 'danger');
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({
      ...prev,
      visible: false
    }));
  };

  const handleConfirm = () => {
    if (confirmation.onConfirm) {
      confirmation.onConfirm();
    }
    hideConfirmation();
  };

  return {
    confirmation,
    showConfirmation,
    showDangerConfirmation,
    hideConfirmation,
    handleConfirm
  };
};
