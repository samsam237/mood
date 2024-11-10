import React, { useState, useEffect } from 'react';
import { IonList, IonItem, IonInput, IonCard, IonCardHeader, IonCardContent, IonLabel, IonButton } from '@ionic/react';

import { myScheduleDailyAlarms, getReminder, setDrinkReminder, setMoveReminder } from '../../services/notificationService';

import "./ReminderFrequencyComponent.css";

const ReminderFrequencyComponent: React.FC = () => {
  const [hydrationFrequency, setHydrationFrequency] = useState<string>('');
  const [movementFrequency, setMovementFrequency] = useState<string>('');

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
        <IonCard>
            <IonCardHeader className='card-header'>
              <div className="circle image">
                <img src="images/water-icon.png" alt="water" />
              </div>
              <div className='label'>
                <IonLabel>Rappel Hydration (en min) </IonLabel>
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
              <div className='button button-remider-value-hydratation' onClick={() => {myScheduleDailyAlarms(parseInt(hydrationFrequency), "Il faut s'hydrater"), setDrinkReminder(parseInt(hydrationFrequency))}}>
                Sauvegarder
              </div>
            </IonCardContent>
        </IonCard>       
      </IonItem>
      <IonItem>
        <IonCard>
            <IonCardHeader className='card-header'>
              <div className="circle image">
                <img src="images/move-icon.png" alt="water" />
              </div>
              <div className='label'>
                <IonLabel>Rappel Mouvement (en min) </IonLabel>
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
              <div className='button button-remider-value-move' onClick={() => {myScheduleDailyAlarms(parseInt(movementFrequency), "Il faut bouger"), setMoveReminder(parseInt(movementFrequency))}}>
                Sauvegarder
              </div>
            </IonCardContent>
        </IonCard>
      </IonItem>
    </IonList>
  );
};

export default ReminderFrequencyComponent;
