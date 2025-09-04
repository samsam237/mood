import React, { useState, useEffect } from 'react';
import { IonList, IonItem, IonInput, IonLabel, IonAlert, IonDatetime, IonButton } from '@ionic/react';
import { storageService, UserProfile } from '../../services/storageService';
import * as notificationService from '../../services/notificationService';

import "./ReminderFrequencyComponent.css";

const ReminderFrequencyComponent: React.FC = () => {
  const [wakeUpTime, setWakeUpTime] = useState('07:00');
  const [sleepTime, setSleepTime] = useState('23:00');
  const [hydrationGoal, setHydrationGoal] = useState(2000);
  const [waterReminderFreq, setWaterReminderFreq] = useState<number | undefined>();
  const [moveReminderFreq, setMoveReminderFreq] = useState<number | undefined>();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        const profile = await storageService.getUserProfile();
        if (profile) {
            setWakeUpTime(profile.wakeTime || '07:00');
            setSleepTime(profile.sleepTime || '23:00');
            setHydrationGoal(profile.goalHydration || 2000);
            setWaterReminderFreq(profile.waterReminderFrequency);
            setMoveReminderFreq(profile.moveReminderFrequency);
        }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    const profile = await storageService.getUserProfile();
    const updatedProfile: UserProfile = {
        ...profile,
        wakeTime: wakeUpTime,
        sleepTime: sleepTime,
        goalHydration: hydrationGoal,
        waterReminderFrequency: waterReminderFreq,
        moveReminderFrequency: moveReminderFreq
    };
    await storageService.saveUserProfile(updatedProfile);
    await notificationService.initializeReminders();
    setShowAlert(true);
  };

  const getWakingHours = () => {
    const [wakeHour, wakeMin] = wakeUpTime.split(':').map(Number);
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    let wakeDate = new Date();
    wakeDate.setHours(wakeHour, wakeMin, 0, 0);
    let sleepDate = new Date();
    sleepDate.setHours(sleepHour, sleepMin, 0, 0);
    if (sleepDate <= wakeDate) sleepDate.setDate(sleepDate.getDate() + 1);
    return (sleepDate.getTime() - wakeDate.getTime()) / (1000 * 60 * 60);
  };

  const calculateWaterPerInterval = () => {
    const wakingHours = getWakingHours();
    const intervalMinutes = waterReminderFreq || (wakingHours / 8) * 60;
    if (wakingHours <= 0 || intervalMinutes <= 0) return 0;
    const numberOfIntervals = (wakingHours * 60) / intervalMinutes;
    return Math.round(hydrationGoal / numberOfIntervals);
  };

  return (
    <IonList className='reminders-list'>
      <IonItem>
        <IonLabel>Heure de réveil</IonLabel>
        <IonDatetime 
          presentation="time"
          value={wakeUpTime}
          onIonChange={e => setWakeUpTime(e.detail.value as string)}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Heure de coucher</IonLabel>
        <IonDatetime 
          presentation="time"
          value={sleepTime}
          onIonChange={e => setSleepTime(e.detail.value as string)}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Objectif Hydratation (en ml)</IonLabel>
        <IonInput
          type="number"
          value={hydrationGoal}
          onIonChange={e => setHydrationGoal(parseInt(e.detail.value!, 10))}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Fréquence rappel hydratation (en minutes)</IonLabel>
        <IonInput
          type="number"
          value={waterReminderFreq}
          placeholder="Défaut (calculé automatiquement)"
          onIonChange={e => setWaterReminderFreq(parseInt(e.detail.value!, 10))}
        />
      </IonItem>
      <IonItem>
          <IonLabel>
            Eau par rappel : ~{calculateWaterPerInterval()} ml
          </IonLabel>
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Fréquence rappel mouvement (en minutes)</IonLabel>
        <IonInput
          type="number"
          value={moveReminderFreq}
          placeholder="Défaut (toutes les 60 minutes)"
          onIonChange={e => setMoveReminderFreq(parseInt(e.detail.value!, 10))}
        />
      </IonItem>

      <IonButton expand="full" onClick={handleSave} className="ion-margin-top save-button-light-green">
        Valider
      </IonButton>

      <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Succès"}
          message={"Vos réglages de rappel ont été mis à jour."}
          buttons={['OK']}
        />
    </IonList>
  );
};

export default ReminderFrequencyComponent;
