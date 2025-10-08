import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Obtenir l'URL du serveur Metro automatiquement
export const getServerUrl = () => {
  if (Platform.OS === 'web') {
    return ''; // Sur web, les chemins relatifs fonctionnent
  }
  
  // Sur mobile, utiliser l'adresse du serveur Expo
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':').shift();
  return debuggerHost ? `http://${debuggerHost}:8081` : 'http://localhost:8081';
};

export const getAssetUrl = (assetPath) => {
  const serverUrl = getServerUrl();
  return serverUrl ? `${serverUrl}${assetPath}` : assetPath;
};

