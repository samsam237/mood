import React, { useState } from 'react';
import { IonInput, IonSelect, IonSelectOption, IonButton, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

import './HealthCalculatorComponent.css'

const HealthCalculatorComponent: React.FC = () => {
    const [weight, setWeight] = useState<number | undefined>();
    const [height, setHeight] = useState<number | undefined>();
    const [sex, setSex] = useState<string>('male');
    const [age, setAge] = useState<number | undefined>();
    const [wakeTime, setWakeTime] = useState<string>('');
    const [sleepTime, setSleepTime] = useState<string>('');

    const calculateIdealWeight = () => {
        if (height) {
            return sex === 'male'
                ? height - 100 - (height - 150) / 4
                : height - 100 - (height - 150) / 2;
        }
        return 0;
    };

    const calculateWaterIntake = () => {
        return weight ? weight * 30 : 0;
    };

    const calculateBMI = () => {
        if (height && weight) {
            return weight / Math.pow(height / 100, 2);
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
            <IonItem className="ion-item">
                <IonLabel className="label">Poids (kg)</IonLabel>
                <IonInput
                    className="value"
                    type="number"
                    value={weight}
                    onIonChange={(e) => setWeight(Number(e.detail.value))}
                    required
                />
            </IonItem>

            <IonItem className="ion-item">
                <IonLabel className="label">Taille (cm)</IonLabel>
                <IonInput
                    className="value"
                    type="number"
                    value={height}
                    onIonChange={(e) => setHeight(Number(e.detail.value))}
                    required
                />
            </IonItem>

            <IonItem className="ion-item">
                <IonLabel className="label">Âge (années)</IonLabel>
                <IonInput
                    className="value"
                    type="number"
                    value={age}
                    onIonChange={(e) => setAge(Number(e.detail.value))}
                    required
                />
            </IonItem>

            <IonItem className="ion-item">
                <IonLabel className="label">Sexe</IonLabel>
                <IonSelect
                    className="value"
                    value={sex}
                    onIonChange={(e) => setSex(e.detail.value)}
                >
                    <IonSelectOption value="male">Homme</IonSelectOption>
                    <IonSelectOption value="female">Femme</IonSelectOption>
                </IonSelect>
            </IonItem>

            <IonItem className="ion-item">
                <IonLabel className="label">Heure de Réveil</IonLabel>
                <IonInput
                    className="value"
                    type="time"
                    value={wakeTime}
                    onIonChange={(e) => setWakeTime(e.detail.value!)}
                />
            </IonItem>

            <IonItem className="ion-item">
                <IonLabel className="label">Heure de Coucher</IonLabel>
                <IonInput
                    className="value"
                    type="time"
                    value={sleepTime}
                    onIonChange={(e) => setSleepTime(e.detail.value!)}
                />
            </IonItem>

            <IonButton expand="full" type="submit">
                Calculer
            </IonButton>
        </form>
    );
};

export default HealthCalculatorComponent;
