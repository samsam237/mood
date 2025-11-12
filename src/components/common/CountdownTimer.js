// CountdownTimer.js - VERSION CORRIGÉE
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

const CountdownTimer = React.memo(({ targetTime, label, color }) => {
  const [displayTime, setDisplayTime] = useState('--:--');
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);
  
  // 🔥 REF pour tracker le dernier targetTime sans causer de re-render
  const lastTargetTimeRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;

    // 🔥 ÉVITER LES RÉINITIALISATIONS INUTILES
    // Si le nouveau targetTime est le même que l'ancien, on ne fait rien
    if (targetTime && lastTargetTimeRef.current && 
        targetTime.getTime() === lastTargetTimeRef.current.getTime()) {
      return;
    }
    
    lastTargetTimeRef.current = targetTime;

    if (!targetTime) {
      setDisplayTime('--:--');
      return;
    }

    const updateDisplay = () => {
      if (!mountedRef.current) return;

      const now = new Date();
      const diff = targetTime - now;
      
      if (diff <= 0) {
        setDisplayTime('Maintenant!');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;

      setDisplayTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    // Nettoyer l'ancien intervalle
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Mettre à jour immédiatement
    updateDisplay();
    
    // Intervalle chaque seconde
    intervalRef.current = setInterval(updateDisplay, 1000);

    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetTime]); // 🔥 Dépendance uniquement sur targetTime

  return (
    <View style={styles.nextReminderBox}>
      <MaterialIcons name="alarm" size={16} color={color} />
      <Text style={[styles.nextReminderText, { color }]}>
        {label} {displayTime}
      </Text>
    </View>
  );
}, (prevProps, nextProps) => {
  // 🔥 COMPARAISON OPTIMISÉE POUR ÉVITER LES RE-RENDERS
  if (!prevProps.targetTime || !nextProps.targetTime) {
    return prevProps.targetTime === nextProps.targetTime;
  }
  
  // Ne re-render que si le temps cible change de plus de 30 secondes
  const prevTime = prevProps.targetTime.getTime();
  const nextTime = nextProps.targetTime.getTime();
  const timeDiff = Math.abs(nextTime - prevTime);
  
  return timeDiff < 30000 && // 30 secondes
         prevProps.label === nextProps.label && 
         prevProps.color === nextProps.color;
});

const styles = StyleSheet.create({
  nextReminderBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.warning + '15',
    borderRadius: theme.borderRadius.sm,
  },
  nextReminderText: {
    fontSize: 13,
    color: theme.colors.text,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
});

export default CountdownTimer;