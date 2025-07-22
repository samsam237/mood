import React, { useState } from 'react';
import { IonInput, IonSelect, IonSelectOption, IonButton, IonItem, IonList, IonLabel } from '@ionic/react';
import { UserHealthStatusInterface } from '../../interfaces/userHeatlhStatut';
import storageService from '../../services/storageService';
import { myScheduleDailyAlarms } from '../../services/notificationService';
import './HealthCalculatorComponent.css'

const HealthCalculatorComponent: React.FC = () => {
    const [weight, setWeight] = useState<string | ''>('');
    const [height, setHeight] = useState<string | ''>('');
    const [sex, setSex] = useState<string>('male');
    const [age, setAge] = useState<string | ''>('');
    const [wakeTime, setWakeTime] = useState<string>('');
    const [sleepTime, setSleepTime] = useState<string>('');
    const [goalHydration, setGoalHydration] = useState<string>('');
    const [goalMovement, setGoalMovement] = useState<string>('12');
    const [intervalHours, setIntervalHours] = useState<string>('2');
    const [results, setResults] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);

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
        const numberOfWeight = parseInt(weight);
        return numberOfWeight ? numberOfWeight * 30 : 0;
    };

    const calculateBMI = () => {
        const numberOfHeight = parseInt(height);
        const numberOfWeight = parseInt(weight);
        if (height && weight) {
            return numberOfWeight / Math.pow(numberOfHeight / 100, 2);
        }
        return 0;
    };

    // Calculate the number of intervals based on user-selected intervalHours
    const getIntervals = () => {
        if (!wakeTime || !sleepTime || !intervalHours) return 0;
        const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
        const [sleepHour, sleepMinute] = sleepTime.split(':').map(Number);
        let start = wakeHour + wakeMinute / 60;
        let end = sleepHour + sleepMinute / 60;
        if (end <= start) end += 24; // handle overnight
        const duration = end - start;
        const interval = Math.max(1, Math.min(6, parseInt(intervalHours))); // Clamp between 1 and 6
        return Math.floor(duration / interval);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const idealWeight = calculateIdealWeight();
        // If user hasn't set a custom goal, use calculated value
        const waterIntake = goalHydration ? parseInt(goalHydration) : calculateWaterIntake();
        const movementGoal = goalMovement ? parseInt(goalMovement) : 12;
        const bmi = calculateBMI();
        const interval = Math.max(1, Math.min(6, parseInt(intervalHours)));
        const intervals = getIntervals();
        const intervalMinutes = interval * 60;
        const waterPerInterval = intervals ? Math.round(waterIntake / intervals) : 0;
        const movementPerInterval = intervals ? Math.round(movementGoal / intervals) : 0;

        setResults(
            `Poids idéal: ${idealWeight.toFixed(2)} kg\n` +
            `Quantité d'eau (objectif): ${waterIntake} ml\n` +
            `IMC: ${bmi.toFixed(2)}\n` +
            `Objectif Mouvement: ${movementGoal} mouvements/jour\n` +
            `Nombre d'intervalles (${interval}h): ${intervals}\n` +
            `Eau à boire par intervalle: ${waterPerInterval} ml\n` +
            `Mouvements par intervalle: ${movementPerInterval}`
        );

        // Save user data and goals automatically
        setSaving(true);
        const userData: UserHealthStatusInterface = {
            weight: parseInt(weight),
            height: parseInt(height),
            sex,
            age: parseInt(age),
            wakeTime,
            sleepTime
        };
        const storage = await storageService.initializeStorage();
        await storage.set('userHealth', userData);
        await storage.set('goalHydration', waterIntake);
        await storage.set('goalMovement', movementGoal);
        await storage.set('reminderIntervalHours', interval);
        await storage.set('waterPerInterval', waterPerInterval);
        await storage.set('movementPerInterval', movementPerInterval);

        // Schedule alarms for water and movement
        await myScheduleDailyAlarms(intervalMinutes, "Il faut s'hydrater", 0);
        await myScheduleDailyAlarms(intervalMinutes, "Il faut bouger", 100);
        setSaving(false);
    };

    // Suggest goal hydration based on weight
    React.useEffect(() => {
        if (weight) {
            setGoalHydration((parseInt(weight) * 30).toString());
        } else {
            setGoalHydration('');
        }
    }, [weight]);

    return (
      <div className='div-container'>
        <form className="health-form-redesigned" onSubmit={handleSubmit}>
          <IonList className="form-list-redesigned">
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Poids (kg)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={weight}
                onIonChange={(e) => { if (e.detail.value) setWeight(e.detail.value.toString())}}
                required
              />
            </IonItem>
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Taille (cm)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={height}
                onIonChange={(e) => {if (e.detail.value) setHeight(e.detail.value)}}
                required
              />
            </IonItem>
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Age (années)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={age}
                onIonChange={(e) => {if(e.detail.value) setAge(e.detail.value)}}
                required
              />
            </IonItem>
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Sexe</IonLabel>
              <IonSelect
                className="value"
                value={sex}
                onIonChange={(e) => setSex(e.detail.value)}
              >
                <IonSelectOption value="male">Homme</IonSelectOption>
                <IonSelectOption value="female">Femme</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Heure de Réveil</IonLabel>
              <IonInput
                className="value"
                type="time"
                value={wakeTime}
                onIonChange={(e) => setWakeTime(e.detail.value!)}
              />
            </IonItem>
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Heure de Coucher</IonLabel>
              <IonInput
                className="value"
                type="time"
                value={sleepTime}
                onIonChange={(e) => setSleepTime(e.detail.value!)}
              />
            </IonItem>
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Objectif d'eau (ml/jour)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={goalHydration}
                onIonChange={(e) => setGoalHydration(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Objectif Mouvement (par jour)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={goalMovement}
                onIonChange={(e) => setGoalMovement(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="ion-item redesigned-item">
              <IonLabel position="stacked">Fréquence de rappel (heures)</IonLabel>
              <IonInput
                className="value"
                type="number"
                min={1}
                max={6}
                value={intervalHours}
                onIonChange={(e) => setIntervalHours(e.detail.value!)}
                required
              />
            </IonItem>
          </IonList>
          <IonButton expand="block" type="submit" className="submit-btn-redesigned" disabled={saving}>
            {saving ? 'Enregistrement...' : 'Get IMC'}
          </IonButton>
        </form>
        {results && (
          <div className="result-container redesigned">
            <h3>Résultats :</h3>
            <pre>{results}</pre>
          </div>
        )}
      </div>
    );
};

export default HealthCalculatorComponent;
