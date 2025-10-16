const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permettre au serveur Metro de servir les fichiers PDF
config.resolver.assetExts.push('pdf');

// Résoudre l'erreur Systrace
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Configuration pour résoudre les modules React Native
config.resolver.alias = {
  ...config.resolver.alias,
  'react-native/Libraries/Performance/Systrace': './src/utils/systrace-polyfill.js',
};

// Ajouter les extensions de fichiers supportées
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'];

module.exports = config;
