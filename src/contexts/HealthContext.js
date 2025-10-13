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
    water: 2000, // mL par jour
    movements: 12, // mouvements par jour
  });
  const [history, setHistory] = useState([]); // 7 derniers jours
  const [todayTip, setTodayTip] = useState('');
  const [userProfile, setUserProfile] = useState({
    wakeTime: '07:00',
    sleepTime: '23:00',
    waterReminderFrequency: 30, // minutes (30min)
    moveReminderFrequency: 30, // minutes (30min)
  });

  // Charger les données au démarrage
  useEffect(() => {
    loadTodayData();
    loadHistory();
    loadDailyTip();
    loadUserProfile();
  }, []);

  const loadTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await AsyncStorage.getItem(`health_${today}`);
      
      if (data) {
        const parsed = JSON.parse(data);
        setWaterIntake(parsed.water || 0);
        setMovements(parsed.movements || 0);
      }
    } catch (error) {
      console.error('Error loading today data:', error);
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
    const tips = [
      "Marcher 15 minutes par jour réduit la mortalité de 14%",
      "150 minutes d'activité par semaine pour sauver votre vie",
      "30 minutes de marche quotidienne réduisent de 50% le risque de maladies cardiaques",
      "Boire suffisamment d'eau améliore la concentration et l'énergie",
      "Se lever toutes les heures réduit les risques de diabète",
      "L'activité physique régulière améliore la qualité du sommeil",
      "Rester assis 8h par jour augmente de 40% le risque de mortalité précoce",
    ];
    
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    setTodayTip(tips[dayOfYear % tips.length]);
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
      console.log('Profil utilisateur mis à jour:', updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const getStats = () => {
    return {
      waterPercentage: Math.min((waterIntake / dailyGoals.water) * 100, 100),
      movementsPercentage: Math.min((movements / dailyGoals.movements) * 100, 100),
      waterRemaining: Math.max(dailyGoals.water - waterIntake, 0),
      movementsRemaining: Math.max(dailyGoals.movements - movements, 0),
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

