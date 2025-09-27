import React from 'react';
import { View } from 'react-native';

// Version web simplifiée de LinearGradient
const WebLinearGradient = ({ colors, style, children, ...props }) => {
  const gradientStyle = {
    background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
    ...style,
  };

  return (
    <View style={gradientStyle} {...props}>
      {children}
    </View>
  );
};

export default WebLinearGradient;
