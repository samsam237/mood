module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin',
      // Plugin pour résoudre l'erreur Systrace
      [
        'module-resolver',
        {
          alias: {
            'react-native/Libraries/Performance/Systrace': 'react-native/Libraries/Performance/Systrace',
          },
        },
      ],
    ],
  };
};
