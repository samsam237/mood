import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import des traductions
import fr from '../locales/fr.json';
import en from '../locales/en.json';

// Clé pour stocker la langue dans AsyncStorage
const LANGUAGE_STORAGE_KEY = 'app_language';

// Détection de la langue du système (compatible Expo Go)
const getSystemLanguage = () => {
  try {
    // Utiliser navigator.language pour détecter la langue du système
    const systemLanguage = navigator.language || navigator.languages?.[0] || 'fr';
    const languageCode = systemLanguage.split('-')[0];
    
    // Retourner 'fr' pour français, 'en' pour anglais, sinon 'fr' par défaut
    return languageCode.startsWith('fr') ? 'fr' : languageCode.startsWith('en') ? 'en' : 'fr';
  } catch (error) {
    console.log('Erreur lors de la détection de la langue système:', error);
    return 'fr'; // Langue par défaut
  }
};

// Récupération de la langue sauvegardée ou détection automatique
const getStoredOrDeviceLanguage = async () => {
  try {
    // Essayer de récupérer la langue sauvegardée
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage) {
      return storedLanguage;
    }
  } catch (error) {
    console.log('Erreur lors de la récupération de la langue:', error);
  }
  
  // Si pas de langue sauvegardée, détecter la langue du système
  return getSystemLanguage();
};

// Sauvegarde de la langue
const saveLanguage = async (language) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.log('Erreur lors de la sauvegarde de la langue:', error);
  }
};

// Configuration i18n
const initI18n = async () => {
  const initialLanguage = await getStoredOrDeviceLanguage();
  
  await i18n
    .use(initReactI18next)
    .init({
      // Ressources de traduction
      resources: {
        fr: {
          translation: fr
        },
        en: {
          translation: en
        }
      },
      
      // Langue par défaut
      lng: initialLanguage,
    
    // Langue de fallback
    fallbackLng: 'fr',
    
    // Configuration du debug (désactivé en production)
    debug: __DEV__,
    
    // Options d'interpolation
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
    
      // Configuration React
      react: {
        useSuspense: false, // Évite les problèmes avec React Native
      },
    });
  
  return i18n;
};

// Initialisation
i18n.on('languageChanged', (lng) => {
  saveLanguage(lng);
});

// Initialiser i18n
initI18n();

export default i18n;



