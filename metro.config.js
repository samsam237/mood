const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permettre au serveur Metro de servir les fichiers PDF
config.resolver.assetExts.push('pdf');

module.exports = config;
