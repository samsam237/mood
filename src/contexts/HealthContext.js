import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HealthContext = createContext();

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export const HealthProvider = ({ children }) => {
  const [waterIntake, setWaterIntake] = useState(0); // en mL
  const [movements, setMovements] = useState(0); // nombre de mouvements
  const [dailyGoals, setDailyGoals] = useState({
    water: 2000, // mL par jour (sera mis à jour automatiquement)
    movements: 12, // mouvements par jour
  });
  const [history, setHistory] = useState([]); // 7 derniers jours
  const [todayTip, setTodayTip] = useState('');
  const [userProfile, setUserProfile] = useState({
    wakeTime: '07:00',
    sleepTime: '23:00',
    waterReminderFrequency: 120, // minutes (120min = 2h)
    moveReminderFrequency: 60, // minutes (60min = 1h)
  });

  // Charger les données au démarrage
  useEffect(() => {
    loadTodayData();
    loadHistory();
    loadDailyTip();
    loadUserProfile();
    loadDailyGoals();
  }, []);

  const loadTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await AsyncStorage.getItem(`health_${today}`);
      
      if (data) {
        const parsed = JSON.parse(data);
        
        // Vérifier et corriger les valeurs chargées
        const safeWater = typeof parsed.water === 'number' && parsed.water >= 0 ? parsed.water : 0;
        const safeMovements = typeof parsed.movements === 'number' && parsed.movements >= 0 ? parsed.movements : 0;
        
        setWaterIntake(safeWater);
        setMovements(safeMovements);
        
        // Si les données étaient corrompues, les sauvegarder corrigées
        if (parsed.water !== safeWater || parsed.movements !== safeMovements) {
          await AsyncStorage.setItem(`health_${today}`, JSON.stringify({
            water: safeWater,
            movements: safeMovements,
            date: today,
          }));
          console.log('Données du jour corrigées:', { water: safeWater, movements: safeMovements });
        }
      }
    } catch (error) {
      console.error('Error loading today data:', error);
      // En cas d'erreur, utiliser les valeurs par défaut
      setWaterIntake(0);
      setMovements(0);
    }
  };

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem('health_history');
      if (historyData) {
        setHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const loadDailyTip = () => {
    // Les conseils seront chargés dynamiquement selon la langue
    // Pour l'instant, on utilise un conseil par défaut
    setTodayTip("Conseil santé du jour");
  };

  const loadUserProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem('user_profile');
      if (profileData) {
        setUserProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadDailyGoals = async () => {
    try {
      const goalsData = await AsyncStorage.getItem('daily_goals');
      if (goalsData) {
        const goals = JSON.parse(goalsData);
        
        // Vérifier et corriger les valeurs corrompues
        const safeGoals = {
          water: typeof goals.water === 'number' && goals.water > 0 ? goals.water : 2000,
          movements: typeof goals.movements === 'number' && goals.movements > 0 ? goals.movements : 12
        };
        
        setDailyGoals(safeGoals);
        
        // Si les données étaient corrompues, les sauvegarder corrigées
        if (goals.water !== safeGoals.water || goals.movements !== safeGoals.movements) {
          await AsyncStorage.setItem('daily_goals', JSON.stringify(safeGoals));
          console.log('Objectifs quotidiens corrigés:', safeGoals);
        }
        
        // Si l'objectif d'eau n'est pas défini, utiliser la valeur recommandée du profil
        if (!safeGoals.water && userProfile.recommendedWaterGoal) {
          const newGoals = { ...safeGoals, water: userProfile.recommendedWaterGoal };
          setDailyGoals(newGoals);
          await AsyncStorage.setItem('daily_goals', JSON.stringify(newGoals));
        }
      }
    } catch (error) {
      console.error('Error loading daily goals:', error);
      // En cas d'erreur, utiliser les valeurs par défaut
      setDailyGoals({ water: 2000, movements: 12 });
    }
  };

  const addWater = async (amount = 250) => {
    try {
      const newWater = waterIntake + amount;
      setWaterIntake(newWater);
      
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(`health_${today}`, JSON.stringify({
        water: newWater,
        movements,
        date: today,
      }));
      
      await updateHistory({ water: newWater, movements });
    } catch (error) {
      console.error('Error adding water:', error);
    }
  };

  const addMovement = async () => {
    try {
      const newMovements = movements + 1;
      setMovements(newMovements);
      
      const today = new Date().toISOString().split('T')[0];
      await AsyncStorage.setItem(`health_${today}`, JSON.stringify({
        water: waterIntake,
        movements: newMovements,
        date: today,
      }));
      
      await updateHistory({ water: waterIntake, movements: newMovements });
    } catch (error) {
      console.error('Error adding movement:', error);
    }
  };

  const updateHistory = async (todayData) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const newHistory = [...history];
      
      // Chercher si aujourd'hui existe déjà
      const todayIndex = newHistory.findIndex(item => item.date === today);
      
      if (todayIndex >= 0) {
        newHistory[todayIndex] = { date: today, ...todayData };
      } else {
        newHistory.push({ date: today, ...todayData });
      }
      
      // Garder seulement les 7 derniers jours
      const last7Days = newHistory.slice(-7);
      setHistory(last7Days);
      
      await AsyncStorage.setItem('health_history', JSON.stringify(last7Days));
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  const updateGoals = async (newGoals) => {
    try {
      setDailyGoals(newGoals);
      await AsyncStorage.setItem('daily_goals', JSON.stringify(newGoals));
    } catch (error) {
      console.error('Error updating goals:', error);
    }
  };

  const updateUserProfile = async (newProfile) => {
    try {
      const updatedProfile = { ...userProfile, ...newProfile };
      setUserProfile(updatedProfile);
      await AsyncStorage.setItem('user_profile', JSON.stringify(updatedProfile));
      
      // Mettre à jour automatiquement l'objectif d'eau si une quantité recommandée est fournie
      if (newProfile.recommendedWaterGoal && newProfile.recommendedWaterGoal !== dailyGoals.water) {
        const newGoals = { ...dailyGoals, water: newProfile.recommendedWaterGoal };
        setDailyGoals(newGoals);
        await AsyncStorage.setItem('daily_goals', JSON.stringify(newGoals));
        console.log('Objectif d\'eau mis à jour automatiquement:', newProfile.recommendedWaterGoal, 'ml');
      }
      
      console.log('Profil utilisateur mis à jour:', updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const getStats = () => {
    // Vérifier que toutes les valeurs sont valides
    const safeWaterIntake = typeof waterIntake === 'number' ? waterIntake : 0;
    const safeMovements = typeof movements === 'number' ? movements : 0;
    const safeWaterGoal = typeof dailyGoals?.water === 'number' && dailyGoals.water > 0 ? dailyGoals.water : 2000;
    const safeMovementsGoal = typeof dailyGoals?.movements === 'number' && dailyGoals.movements > 0 ? dailyGoals.movements : 12;
    
    return {
      waterPercentage: Math.min((safeWaterIntake / safeWaterGoal) * 100, 100),
      movementsPercentage: Math.min((safeMovements / safeMovementsGoal) * 100, 100),
      waterRemaining: Math.max(safeWaterGoal - safeWaterIntake, 0),
      movementsRemaining: Math.max(safeMovementsGoal - safeMovements, 0),
    };
  };

  const value = {
    waterIntake,
    movements,
    dailyGoals,
    history,
    todayTip,
    userProfile,
    addWater,
    addMovement,
    updateGoals,
    updateUserProfile,
    getStats,
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};

