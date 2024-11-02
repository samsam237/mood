import React, { useState } from 'react';
import { IonList, IonItem, IonInput, IonCard, IonCardHeader, IonCardContent, IonLabel } from '@ionic/react';

import "./ReminderFrequencyComponent.css";

const ReminderFrequencyComponent: React.FC = () => {
  const [hydrationFrequency, setHydrationFrequency] = useState<string>('');
  const [movementFrequency, setMovementFrequency] = useState<string>('');

  return (
    <IonList className='reminders-list'>
      <IonItem>
        <IonCard>
            <IonCardHeader>
                <div className="circle bg-blue"></div>
                <IonLabel>Rappel Hydration (en min) </IonLabel>
            </IonCardHeader>
            <IonCardContent>
                <IonInput
                    labelPlacement="stacked"
                    className="remider-value"
                    type="number"
                    value={hydrationFrequency}
                    placeholder='20 minutes'
                    onIonChange={(e) => {if(e.detail.value) setHydrationFrequency(e.detail.value)}}
                    required
                />
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
                <div className="circle bg-green"></div>
                <IonLabel>Rappel Mouvement (en min) </IonLabel>
            </IonCardHeader>
            <IonCardContent>
                    <IonInput
                        labelPlacement="stacked"
                        className="remider-value"
                        type="number"
                        value={movementFrequency}
                        placeholder='20 minutes'
                        onIonChange={(e) => {if(e.detail.value) setMovementFrequency(e.detail.value)}}
                        required
                    />
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
