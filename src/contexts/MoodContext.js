import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moodService } from '../services/moodService';

const MoodContext = createContext();

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

export const MoodProvider = ({ children }) => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMoods();
  }, []);

  const loadMoods = async () => {
    try {
      setLoading(true);
      const savedMoods = await AsyncStorage.getItem('moods');
      if (savedMoods) {
        setMoods(JSON.parse(savedMoods));
      }
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMood = async (moodData) => {
    try {
      const newMood = {
        id: Date.now().toString(),
        ...moodData,
        timestamp: new Date().toISOString(),
      };
      
      const updatedMoods = [newMood, ...moods];
      setMoods(updatedMoods);
      await AsyncStorage.setItem('moods', JSON.stringify(updatedMoods));
      
      return { success: true };
    } catch (error) {
      console.error('Error saving mood:', error);
      return { success: false, error: error.message };
    }
  };

  const getMoodAnalytics = () => {
    return moodService.generateAnalytics(moods);
  };

  const value = {
    moods,
    loading,
    saveMood,
    getMoodAnalytics,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};
