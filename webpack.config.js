const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Configuration pour résoudre les problèmes de compatibilité
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': 'react-native-web',
  };
  
  // Ignorer les modules problématiques
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": false,
    "stream": false,
    "util": false,
  };
  
  return config;
};
