import React, { useState, useEffect } from 'react';
import { IonList, IonItem, IonInput, IonCard, IonCardHeader, IonCardContent, IonLabel, IonAlert, IonDatetime } from '@ionic/react';

import { myScheduleDailyAlarms, getReminder, setDrinkReminder, setMoveReminder } from '../../services/notificationService';

import "./ReminderFrequencyComponent.css";

const ReminderCard = ({ icon, label, value, onValueChange, onSave }: any) => (
  <IonCard className='card-item'>
    <IonCardHeader className='card-header'>
      <div className="circle image">
        <img src={icon} alt="icon" />
      </div>
      <div className='label'>
        <IonLabel>{label}</IonLabel>
      </div>
    </IonCardHeader>
    <IonCardContent>
      <IonInput
        labelPlacement="stacked"
        className="remider-value"
        type="number"
        value={value}
        placeholder='en minutes'
        onIonChange={(e) => { if (e.detail.value) onValueChange(e.detail.value) }}
        required
      />
      <div className='button btn-save' onClick={onSave}>
        Sauvegarder
      </div>
    </IonCardContent>
  </IonCard>
);


const ReminderFrequencyComponent: React.FC = () => {
  const [hydrationFrequency, setHydrationFrequency] = useState<string>('');
  const [movementFrequency, setMovementFrequency] = useState<string>('');
  const [showAlert, setShowAlert] = useState(false);  
  const [alertMessage, setAlertMessage] = useState<string>('');

  const [wakeUpTime, setWakeUpTime] = useState<string>('07:00');
  const [sleepTime, setSleepTime] = useState<string>('23:00');

  const [hydrationGoal, setHydrationGoal] = useState<string>('2000');
  const [movementGoal, setMovementGoal] = useState<string>('60');

  const calculateHydrationPerReminder = () => {
    const totalMinutes = getActiveMinutes();
    const frequency = parseInt(hydrationFrequency);
    if (frequency && totalMinutes) {
      const reminders = Math.floor(totalMinutes / frequency);
      return reminders ? Math.round(parseInt(hydrationGoal) / reminders) : 0;
    }
    return 0;
  };
  
  const getActiveMinutes = () => {
    const [wakeHour, wakeMin] = wakeUpTime.split(':').map(Number);
    const [sleepHour, sleepMin] = sleepTime.split(':').map(Number);
    const wakeMinutes = wakeHour * 60 + wakeMin;
    const sleepMinutes = sleepHour * 60 + sleepMin;
    return sleepMinutes > wakeMinutes ? sleepMinutes - wakeMinutes : (1440 - wakeMinutes + sleepMinutes); // gestion nuit
  };
  
  const showDynamicAlert = (message : string) => {
    setAlertMessage(message); 
    setShowAlert(true);  
  };

  useEffect( () => {
    const fetchReminder = async () => {
      const reminder = await getReminder();  // Appel asynchrone à getReminderComponent
      setHydrationFrequency(reminder.drinkTime);
      setMovementFrequency(reminder.moveTime);
    };

    fetchReminder();  // Appel de la fonction d'initialisation
  }, []);

  return (
    <IonList className='reminders-list'>
      <IonItem>
        {/* <IonCard className='card-item'>
            <IonCardHeader className='card-header'>
              <div className="circle image">
                <img src="images/water-icon.png" alt="water" />
              </div>
              <div className='label'>
                <IonLabel>Hydration (en min) </IonLabel>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonInput
                labelPlacement="stacked"
                className="remider-value"
                type="number"
                value={hydrationFrequency}
                placeholder='en minutes'
                onIonChange={(e) => {if(e.detail.value) setHydrationFrequency(e.detail.value)}}
                required
              />
              <div className='button button-remider-value-hydratation' onClick={() => {myScheduleDailyAlarms(parseInt(hydrationFrequency), "Il faut s'hydrater"), setDrinkReminder(parseInt(hydrationFrequency)), showDynamicAlert('Ajustement effectué') }}>
                Sauvegarder
              </div>
            </IonCardContent>
        </IonCard>    */}    
        <ReminderCard
          icon="images/water-icon.png"
          label="Hydratation"
          value={hydrationFrequency}
          onValueChange={setHydrationFrequency}
          onSave={() => {
            myScheduleDailyAlarms(parseInt(hydrationFrequency), "Il faut s'hydrater");
            setDrinkReminder(parseInt(hydrationFrequency));
            showDynamicAlert("Ajustement effectué");
          }}
        />
      </IonItem>
      <IonItem>
        {/* <IonCard className='card-item'>
            <IonCardHeader className='card-header'>
              <div className="circle image">
                <img src="images/move-icon.png" alt="water" />
              </div>
              <div className='label'>
                <IonLabel>Mouvement (en min) </IonLabel>
              </div>
            </IonCardHeader>
            <IonCardContent>
              <IonInput
                labelPlacement="stacked"
                className="remider-value"
                type="number"
                value={movementFrequency}
                placeholder='en minutes'
                onIonChange={(e) => {if(e.detail.value) setMovementFrequency(e.detail.value)}}
                required
              />
              <div className='button button-remider-value-move' onClick={() => {myScheduleDailyAlarms(parseInt(movementFrequency), "Il faut bouger"), setMoveReminder(parseInt(movementFrequency)), showDynamicAlert('Ajustement effectué')}}>
                Sauvegarder
              </div>
            </IonCardContent>
        </IonCard> */}
        <ReminderCard
          icon="images/move-icon.png"
          label="Mouvement"
          value={movementFrequency}
          onValueChange={setMovementFrequency}
          onSave={() => {
            myScheduleDailyAlarms(parseInt(movementFrequency), "Il faut bouger");
            setMoveReminder(parseInt(movementFrequency));
            showDynamicAlert("Ajustement effectué");
          }}
        />
        {/* Alerte avec le message dynamique */}
        <IonAlert
          isOpen={showAlert}  // Affiche ou cache l'alerte
          onDidDismiss={() => setShowAlert(false)}  // Ferme l'alerte lorsqu'on clique en dehors ou sur "OK"
          header="Alerte"
          message={alertMessage}  // Le message dynamique
          buttons={['OK']}  // Affiche un bouton "OK" pour fermer l'alerte
        />
      </IonItem>
      <IonItem>
        <IonLabel>Heure de réveil</IonLabel>
        <IonDatetime 
          presentation="time"
          value={wakeUpTime}
          onIonChange={e => {
            const value = e.detail.value;
            if (typeof value === 'string') {
              setWakeUpTime(value);
            }
          }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Heure de coucher</IonLabel>
        <IonDatetime 
          presentation="time"
          value={sleepTime}
          onIonChange={e => {
            const value = e.detail.value;
            if (typeof value === 'string') {
              setSleepTime(value);
            }
          }}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Objectif Hydratation (en ml)</IonLabel>
        <IonInput
          type="number"
          value={hydrationGoal}
          onIonChange={e => setHydrationGoal(e.detail.value!)}
        />
      </IonItem>

      <IonItem>
        <IonLabel position="stacked">Objectif Mouvement (en minutes)</IonLabel>
        <IonInput
          type="number"
          value={movementGoal}
          onIonChange={e => setMovementGoal(e.detail.value!)}
        />
      </IonItem>

      <IonItem>
        <IonLabel>
          Quantité à boire à chaque rappel : {calculateHydrationPerReminder()} ml
        </IonLabel>
      </IonItem>

    </IonList>
  );
};

export default ReminderFrequencyComponent;
