import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../constants/theme';

const Card = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    margin: theme.spacing.sm,
    ...theme.shadows.medium,
  },
});

export default Card;
