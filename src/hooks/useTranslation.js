import { useTranslation as useI18nTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Clé de stockage pour la langue préférée
const LANGUAGE_STORAGE_KEY = 'user_preferred_language';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  // Changer la langue
  const changeLanguage = async (languageCode) => {
    try {
      await i18n.changeLanguage(languageCode);
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      console.log(`Language changed to: ${languageCode}`);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Obtenir la langue actuelle
  const getCurrentLanguage = () => {
    return i18n.language;
  };

  // Obtenir la langue préférée depuis le stockage
  const getPreferredLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      return storedLanguage || 'fr'; // Français par défaut
    } catch (error) {
      console.error('Error getting preferred language:', error);
      return 'fr';
    }
  };

  // Initialiser la langue au démarrage
  const initializeLanguage = async () => {
    try {
      const preferredLanguage = await getPreferredLanguage();
      if (i18n.language !== preferredLanguage) {
        await i18n.changeLanguage(preferredLanguage);
      }
    } catch (error) {
      console.error('Error initializing language:', error);
    }
  };

  // Fonction de traduction avec fallback
  const translate = (key, options = {}) => {
    try {
      return t(key, options);
    } catch (error) {
      console.warn(`Translation key not found: ${key}`);
      return key; // Retourner la clé si la traduction n'existe pas
    }
  };

  // Fonction pour obtenir les langues disponibles
  const getAvailableLanguages = () => {
    return [
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ];
  };

  return {
    t: translate,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    getPreferredLanguage,
    initializeLanguage,
    getAvailableLanguages,
    // Propriétés utiles
    currentLanguage: i18n.language,
    isRTL: false, // Pas de support RTL pour l'instant
  };
};

export default useTranslation;




