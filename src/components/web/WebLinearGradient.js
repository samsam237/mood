import React from 'react';
import { View } from 'react-native';

// Version web simplifiée de LinearGradient
const WebLinearGradient = ({ colors, style, children, ...props }) => {
  // Style de base avec couleur de fallback
  const baseStyle = {
    backgroundColor: colors[0], // Couleur primaire comme fallback
    minHeight: '100%',
    minWidth: '100%',
    ...style,
  };

  // Style CSS pour le gradient web
  const webGradientStyle = {
    ...baseStyle,
    // Utilisation de CSS custom properties pour une meilleure compatibilité
    background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
    backgroundAttachment: 'fixed',
    WebkitBackgroundClip: 'padding-box',
    backgroundClip: 'padding-box',
  };

  return (
    <View style={webGradientStyle} {...props}>
      {children}
    </View>
  );
};

export default WebLinearGradient;
