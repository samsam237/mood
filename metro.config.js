const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Configuration pour résoudre les problèmes de compatibilité web
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Résoudre les modules manquants pour le web
config.resolver.alias = {
  'react-native': 'react-native-web',
};

// Configuration pour les extensions de fichiers
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx'];

module.exports = config;
