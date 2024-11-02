import React, { useState } from 'react';
import { IonInput, IonSelect, IonSelectOption, IonButton, IonItem, IonList } from '@ionic/react';

import './HealthCalculatorComponent.css'

const HealthCalculatorComponent: React.FC = () => {
    const [weight, setWeight] = useState<string | ''>('');
    const [height, setHeight] = useState<string | ''>('');
    const [sex, setSex] = useState<string>('male');
    const [age, setAge] = useState<string | ''>('');
    const [wakeTime, setWakeTime] = useState<string>('');
    const [sleepTime, setSleepTime] = useState<string>('');

    const calculateIdealWeight = () => {
        if (height) {
            const numberOfHeight = parseInt(height);
            return sex === 'male'
                ? numberOfHeight - 100 - (numberOfHeight - 150) / 4
                : numberOfHeight - 100 - (numberOfHeight - 150) / 2;
        }
        return 0;
    };

    const calculateWaterIntake = () => {
        const numberOfWeight = parseInt (weight);
        return numberOfWeight ? numberOfWeight * 30 : 0;
    };

    const calculateBMI = () => {
        const numberOfHeight = parseInt(height);
        const numberOfWeight = parseInt (weight);
        if (height && weight) {
            return numberOfWeight / Math.pow(numberOfHeight / 100, 2);
        }
        return 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const idealWeight = calculateIdealWeight();
        const waterIntake = calculateWaterIntake();
        const bmi = calculateBMI();

        alert(
            `Poids idéal: ${idealWeight.toFixed(2)} kg\nQuantité d'eau: ${waterIntake} ml\nIMC: ${bmi.toFixed(2)}`
        );
    };

    return (
      <form onSubmit={handleSubmit}>
        <IonList>
          <IonItem className="ion-item" onClick={() => console.log(`Clicked on`)}>
              <IonInput
                  label='Poids (kg)'
                  labelPlacement="stacked"
                  className="value"
                  type="number"
                  value={weight}
                  onIonChange={(e) => { if (e.detail.value) setWeight(e.detail.value.toString())}}
                  required
              />
          </IonItem>

          <IonItem className="ion-item" onClick={() => console.log(`Clicked on`)}>
              <IonInput
                  label='Taille (cm)'
                  labelPlacement="stacked"
                  className="value"
                  type="number"
                  value={height}
                  onIonChange={(e) => {if (e.detail.value) setHeight(e.detail.value)}}
                  required
              />
          </IonItem>

          <IonItem className="ion-item" onClick={() => console.log(`Clicked on`)}>
              <IonInput
                  label='Age (années)'
                  labelPlacement="stacked"
                  className="value"
                  type="number"
                  value={age}
                  onIonChange={(e) => {if(e.detail.value) setAge(e.detail.value)}}
                  required
              />
          </IonItem>

          <IonItem className="ion-item" onClick={() => console.log(`Clicked on`)}>
              <IonSelect
                  label='Sexe'
                  labelPlacement="stacked"
                  className="value"
                  value={sex}
                  onIonChange={(e) => setSex(e.detail.value)}
              >
                  <IonSelectOption value="male">Homme</IonSelectOption>
                  <IonSelectOption value="female">Femme</IonSelectOption>
              </IonSelect>
          </IonItem>

          <IonItem className="ion-item" onClick={() => console.log(`Clicked on`)}>
              <IonInput
                  label='Heure de Réveil'
                  labelPlacement="stacked"
                  className="value"
                  type="time"
                  value={wakeTime}
                  onIonChange={(e) => setWakeTime(e.detail.value!)}
              />
          </IonItem>

          <IonItem className="ion-item" onClick={() => console.log(`Clicked on`)}>
              <IonInput
                  label='Heure de Coucher'
                  labelPlacement="stacked"
                  className="value"
                  type="time"
                  value={sleepTime}
                  onIonChange={(e) => setSleepTime(e.detail.value!)}
              />
          </IonItem>
        </IonList>

        <IonButton expand="full" type="submit">
          Calculer
        </IonButton>
      </form>
    );
};

export default HealthCalculatorComponent;
