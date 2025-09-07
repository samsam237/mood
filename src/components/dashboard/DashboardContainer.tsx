import React from 'react';
import './DashboardContainer.css'; 
import { IonButton } from '@ionic/react';
import AdviceContainer from '../advice/AdviceContainer'
import { useState, useEffect } from 'react';
import { addWaterIntake, addMovement, getDailyStats, getStatsForLastDays } from '../../services/statsServices';
import { storageService } from '../../services/storageService';
import { getNextNotificationTimes } from '../../services/notificationService';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardContainer: React.FC = () => {
  const [hydration, setHydration] = useState(0); // en mL
  const [hydrationGoal, setHydrationGoal] = useState(3000);
  const [movement, setMovement] = useState(0);
  const [movementGoal, setMovementGoal] = useState(12);
  const [waterPerInterval, setWaterPerInterval] = useState(100); // Quantité d'eau par intervalle
  const [nextWaterNotification, setNextWaterNotification] = useState<Date | null>(null);
  const [nextMoveNotification, setNextMoveNotification] = useState<Date | null>(null);
  const [showWaterReminders, setShowWaterReminders] = useState(false);
  const [showMoveReminders, setShowMoveReminders] = useState(false);
  const [waterReminders, setWaterReminders] = useState<any[]>([]);
  const [moveReminders, setMoveReminders] = useState<any[]>([]);

  const refreshStats = async () => {
    const stats = await getDailyStats();
    setHydration(stats.hydration);
    setMovement(stats.movement);
    setHydrationGoal(stats.goalHydration);
    setMovementGoal(stats.goalMovement);
    
    // Calculer la quantité d'eau par intervalle
    const waterPerIntervalValue = await storageService.calculateWaterPerInterval();
    setWaterPerInterval(waterPerIntervalValue);
    
    // Récupérer les prochaines notifications
    const { nextWater, nextMove } = await getNextNotificationTimes();
    setNextWaterNotification(nextWater);
    setNextMoveNotification(nextMove);
    
    console.log('Stats chargées:', { 
      hydration: stats.hydration, 
      movement: stats.movement, 
      goalHydration: stats.goalHydration, 
      goalMovement: stats.goalMovement,
      waterPerInterval: waterPerIntervalValue,
      nextWater,
      nextMove
    });
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleDrink = async () => {
    await addWaterIntake(waterPerInterval); // Utilise la quantité calculée
    refreshStats();
  };

  const handleMove = async () => {
    await addMovement(); // +1 mouvement
    refreshStats();
  };

  // Fonction pour générer les rappels de la journée
  const generateDailyReminders = async (type: 'water' | 'move') => {
    const profile = await storageService.getUserProfile();
    if (!profile) return [];

    const now = new Date();
    const [wakeHour, wakeMinute] = (profile.wakeTime || '07:00').split(':').map(Number);
    const [sleepHour, sleepMinute] = (profile.sleepTime || '23:00').split(':').map(Number);
    
    const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), wakeHour, wakeMinute);
    const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), sleepHour, sleepMinute);
    
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    let intervalMinutes;
    if (type === 'water') {
      intervalMinutes = profile.waterReminderFrequency || 30;
    } else {
      intervalMinutes = profile.moveReminderFrequency || 60;
    }

    const reminders = [];
    let currentTime = new Date(startTime);
    
    while (currentTime < endTime) {
      reminders.push({
        time: currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        type: type === 'water' ? '💧 Hydratation' : '🏃 Mouvement',
        passed: currentTime < now
      });
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }

    return reminders;
  };

  type StatsEntry = {
    date: string;
    hydration: number;
    movement: number;
  };
  
  const [graphData, setGraphData] = useState<StatsEntry[]>([]);

  useEffect(() => {
    refreshStats();
    getStatsForLastDays(7).then(setGraphData);
    
    // Mettre à jour les décomptes toutes les minutes
    const interval = setInterval(() => {
      refreshStats();
    }, 60000); // 60 secondes
    
    return () => clearInterval(interval);
  }, []);

  const [graphType, setGraphType] = useState<'hydration' | 'movement'>('hydration');

  // Fonction pour formater le temps restant
  const formatTimeRemaining = (nextNotification: Date | null) => {
    if (!nextNotification) return 'Non configuré';
    
    const now = new Date();
    const diff = nextNotification.getTime() - now.getTime();
    
    if (diff <= 0) return 'Maintenant';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  };

  return (
    <div className="dashboard-grid">
      <AdviceContainer />
      <div className="dashboard-card">
        <div className="card">          
          <div className="card-content">

            <div className='card-content-title'>
              <div className='card-content-title-content'>Hydratation</div>
              <div className="circle "><img src="images/water-icon.png" alt="water" /></div>
            </div>
            <div className="card-content-main">
              <div className="user-data">
                <span className="user-value">{(hydration).toFixed(1)}</span> mL
              </div>
              <div className="user-objectif">
                🎯 <span className="user-objectif-value">{hydrationGoal}</span> mL
              </div>
              <div className="next-notification">
                ⏰ Prochaine: {formatTimeRemaining(nextWaterNotification)}
              </div>
            </div>
          </div>            
        </div>

        <div className="button green-button" onClick={handleDrink}>
          +{waterPerInterval} mL <img src="images/ok-icon.png" alt="" />
        </div>
      </div>
      <div className="dashboard-card">
        <div className="card">
          
          <div className="card-content">
            <div className='card-content-title'>
              <div className='card-content-title-content'>Mouvements</div>
              <div className="circle"><img src="images/move-icon.png" alt="water" /></div>
            </div>
            <div className="card-content-main">
              <div className="user-data">
                <span className="user-value">{movement}</span> Mouvements
              </div>
              <div className="user-objectif">
                🎯 <span className="user-objectif-value">{movementGoal}</span>
              </div>
              <div className="next-notification">
                ⏰ Prochaine: {formatTimeRemaining(nextMoveNotification)}
              </div>
            </div>
          </div>
        </div>
        <div className="button green-button" onClick={handleMove}>
          +1 <img src="images/ok-icon.png" alt="" />
        </div>
      </div>

      {/* Boutons pour afficher les rappels */}
      <div className="dashboard-card full-width">
        <div className="card">
          <div className="card-content">
            <div className="reminders-buttons">
              <div className="button green-button" onClick={async () => {
                const reminders = await generateDailyReminders('water');
                setWaterReminders(reminders);
                setShowWaterReminders(true);
              }}>
                📅 Rappels Hydratation
              </div>
              <div className="button green-button" onClick={async () => {
                const reminders = await generateDailyReminders('move');
                setMoveReminders(reminders);
                setShowMoveReminders(true);
              }}>
                📅 Rappels Mouvement
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-card full-width ">
        <div className="card">
          {/* <div className="card-content-title">
            <div className="card-content-title-content">Évolution sur 7 jours</div>
          </div> */}
          <div className="toggle-button">
            <IonButton onClick={() => setGraphType('hydration')}>Hydratation</IonButton>
            <IonButton onClick={() => setGraphType('movement')}>Mouvements</IonButton>
          </div>
          {/* <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" label={{ value: 'Litres', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" label={{ value: 'Mouvements', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="hydration" name="Hydratation (L)" stroke="#007bff" />
              <Line yAxisId="right" type="monotone" dataKey="movement" name="Mouvements" stroke="#E85946" />
            </LineChart>
          </ResponsiveContainer> */}
          <ResponsiveContainer width="98%" height={300}>
            <LineChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: graphType === 'hydration' ? 'Litres' : 'Mouvements', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              {graphType === 'hydration' ? (
                <Line type="monotone" dataKey="hydration" name="Hydratation (L)" stroke="#007bff" />
              ) : (
                <Line type="monotone" dataKey="movement" name="Mouvements" stroke="#E85946" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Popup Rappels Hydratation */}
      {showWaterReminders && (
        <div className="popup-overlay" onClick={() => setShowWaterReminders(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>💧 Rappels Hydratation du Jour</h3>
              <button className="close-button" onClick={() => setShowWaterReminders(false)}>×</button>
            </div>
            <div className="reminders-list">
              {waterReminders.map((reminder, index) => (
                <div key={index} className={`reminder-item ${reminder.passed ? 'passed' : 'upcoming'}`}>
                  <span className="reminder-time">{reminder.time}</span>
                  <span className="reminder-type">{reminder.type}</span>
                  {reminder.passed && <span className="status">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popup Rappels Mouvement */}
      {showMoveReminders && (
        <div className="popup-overlay" onClick={() => setShowMoveReminders(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>🏃 Rappels Mouvement du Jour</h3>
              <button className="close-button" onClick={() => setShowMoveReminders(false)}>×</button>
            </div>
            <div className="reminders-list">
              {moveReminders.map((reminder, index) => (
                <div key={index} className={`reminder-item ${reminder.passed ? 'passed' : 'upcoming'}`}>
                  <span className="reminder-time">{reminder.time}</span>
                  <span className="reminder-type">{reminder.type}</span>
                  {reminder.passed && <span className="status">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

    
  );
};

export default DashboardContainer;
