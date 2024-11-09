import React, { useState } from 'react';
import { IonList, IonItem, IonInput, IonCard, IonCardHeader, IonCardContent, IonLabel, IonButton } from '@ionic/react';

import { myScheduleDailyAlarms } from '../../services/notificationService';

import "./ReminderFrequencyComponent.css";

const ReminderFrequencyComponent: React.FC = () => {
  const [hydrationFrequency, setHydrationFrequency] = useState<string>('');
  const [movementFrequency, setMovementFrequency] = useState<string>('');

  return (
    <IonList className='reminders-list'>
      <IonItem>
        <IonCard>
            <IonCardHeader>
              <div className="circle">
                <img src="images/water-icon.png" alt="water" />
              </div>
              <IonLabel>Rappel Hydration (en min) </IonLabel>
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
              <IonButton expand="full" onClick={() => myScheduleDailyAlarms(parseInt(hydrationFrequency), "Il faut s'hydrater")}>
                Sauvegarder
              </IonButton>
            </IonCardContent>
        </IonCard>       
        {/* <IonSelect value={hydrationFrequency} placeholder="Frequency" onIonChange={(e) => setHydrationFrequency(e.detail.value)}>
          <IonSelectOption value="30">Every 30 mins</IonSelectOption>
          <IonSelectOption value="60">Every 1 hour</IonSelectOption>
          <IonSelectOption value="120">Every 2 hours</IonSelectOption>
        </IonSelect> */}
      </IonItem>

      <IonItem>
        {/* <IonLabel>Movement Reminder</IonLabel> */}
        <IonCard>
            <IonCardHeader>
              <div className="circle">
              <img src="images/move-icon.png" alt="water" />
              </div>
              <IonLabel>Rappel Mouvement (en min) </IonLabel>
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
              <IonButton expand="full" onClick={() => myScheduleDailyAlarms(parseInt(hydrationFrequency), "Il faut bouger")}>
                Sauvegarder
              </IonButton>
            </IonCardContent>
        </IonCard>
        {/* <IonSelect value={movementFrequency} placeholder="Frequency" onIonChange={(e) => setMovementFrequency(e.detail.value)}>
          <IonSelectOption value="30">Every 30 mins</IonSelectOption>
          <IonSelectOption value="60">Every 1 hour</IonSelectOption>
          <IonSelectOption value="120">Every 2 hours</IonSelectOption>
        </IonSelect> */}
      </IonItem>
    </IonList>
  );
};

export default ReminderFrequencyComponent;
