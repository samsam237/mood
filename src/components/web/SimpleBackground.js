import React from 'react';
import { View } from 'react-native';

// Version simplifiée avec couleur solide pour éviter les problèmes de gradient
const SimpleBackground = ({ colors, style, children, ...props }) => {
  // Utiliser la couleur primaire comme background solide
  const backgroundStyle = {
    backgroundColor: colors[0],
    minHeight: '100%',
    minWidth: '100%',
    ...style,
  };

  return (
    <View style={backgroundStyle} {...props}>
      {children}
    </View>
  );
};

export default SimpleBackground;
