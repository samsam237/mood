import React, { useState, useEffect } from 'react';
import { IonInput, IonButton, IonItem, IonList, IonLabel, IonRadioGroup, IonRadio, IonAlert, IonDatetime, IonModal, IonToolbar, IonTitle, IonButtons, IonContent as IonModalContent } from '@ionic/react';
import { storageService, UserProfile } from '../../services/storageService';
import * as notificationService from '../../services/notificationService';
import './HealthCalculatorComponent.css';

const HealthCalculatorComponent: React.FC = () => {
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [sex, setSex] = useState<string>('male');
    const [age, setAge] = useState<string>('');
    const [wakeTime, setWakeTime] = useState<string>('07:00');
    const [sleepTime, setSleepTime] = useState<string>('23:00');
    const [goalHydration, setGoalHydration] = useState<string>('');
    const [waterReminderFreq, setWaterReminderFreq] = useState<number | undefined>();
    const [moveReminderFreq, setMoveReminderFreq] = useState<number | undefined>();
    const [results, setResults] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState(false);

    const [showWakeTimeModal, setShowWakeTimeModal] = useState(false);
    const [showSleepTimeModal, setShowSleepTimeModal] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            const profile = await storageService.getUserProfile();
            if (profile) {
                setWeight(profile.weight?.toString() || '');
                setHeight(profile.height?.toString() || '');
                setSex(profile.sex || 'male');
                setAge(profile.age?.toString() || '');
                setWakeTime(profile.wakeTime || '07:00');
                setSleepTime(profile.sleepTime || '23:00');
                setGoalHydration(profile.goalHydration?.toString() || '');
                setWaterReminderFreq(profile.waterReminderFrequency);
                setMoveReminderFreq(profile.moveReminderFrequency);
            }
        };
        loadData();
    }, []);

    const calculateBMI = (h: number, w: number) => h && w ? w / Math.pow(h / 100, 2) : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const numWeight = parseInt(weight);
        const numHeight = parseInt(height);
        const numAge = parseInt(age);
        const numGoalHydration = parseInt(goalHydration);

        const userProfile: UserProfile = {
            weight: numWeight,
            height: numHeight,
            sex,
            age: numAge,
            wakeTime,
            sleepTime,
            goalHydration: numGoalHydration,
            waterReminderFrequency: waterReminderFreq,
            moveReminderFrequency: moveReminderFreq
        };

        await storageService.saveUserProfile(userProfile);
        
        await notificationService.initializeReminders();

        const bmi = calculateBMI(numHeight, numWeight);
        setResults(`Profil sauvegardé !\nIMC: ${bmi.toFixed(2)}`);
        setShowAlert(true);
        
        setSaving(false);
    };

    useEffect(() => {
        if (weight) {
            setGoalHydration((parseInt(weight) * 30).toString());
        } else {
            setGoalHydration('');
        }
    }, [weight]);

    const getWakingHours = () => {
        const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
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
        if (wakingHours <= 0 || intervalMinutes <= 0 || !goalHydration) return 0;
        const numberOfIntervals = (wakingHours * 60) / intervalMinutes;
        const numGoalHydration = parseInt(goalHydration);
        return Math.round(numGoalHydration / numberOfIntervals);
    };

    return (
      <div className='div-container'>
        <form className="health-form" onSubmit={handleSubmit}>
          <IonList className="form-list">
            <IonItem className="ion-item">
              <IonLabel position="stacked">Poids (kg)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={weight}
                onIonChange={(e) => setWeight(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="ion-item">
              <IonLabel position="stacked">Taille (cm)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={height}
                onIonChange={(e) => setHeight(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="ion-item">
              <IonLabel position="stacked">Age (années)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={age}
                onIonChange={(e) => setAge(e.detail.value!)}
                required
              />
            </IonItem>
            <IonItem className="ion-item">
              <IonLabel position="stacked">Sexe</IonLabel>
              <IonRadioGroup value={sex} onIonChange={e => setSex(e.detail.value)}>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                  <IonItem lines="none">
                    <IonLabel>Homme</IonLabel>
                    <IonRadio slot="start" value="male" />
                  </IonItem>
                  <IonItem lines="none">
                    <IonLabel>Femme</IonLabel>
                    <IonRadio slot="start" value="female" />
                  </IonItem>
                </div>
              </IonRadioGroup>
            </IonItem>
            <IonItem  className="ion-item">
                <IonLabel position="stacked">Heure de réveil</IonLabel>
                <IonInput
                    className="value"
                    value={wakeTime}
                    onClick={() => setShowWakeTimeModal(true)}
                    readonly
                />
                <IonModal isOpen={showWakeTimeModal} onDidDismiss={() => setShowWakeTimeModal(false)}>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setShowWakeTimeModal(false)}>Annuler</IonButton>
                        </IonButtons>
                        <IonTitle>Heure de réveil</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowWakeTimeModal(false)}>Confirmer</IonButton>
                        </IonButtons>
                    </IonToolbar>
                    <IonModalContent>
                        <IonDatetime
                            presentation="time"
                            value={wakeTime}
                            onIonChange={e => setWakeTime(e.detail.value as string)}
                        />
                    </IonModalContent>
                </IonModal>
            </IonItem>
            <IonItem className="ion-item">
                <IonLabel position="stacked">Heure de coucher</IonLabel>
                <IonInput
                    className="value"
                    value={sleepTime}
                    onClick={() => setShowSleepTimeModal(true)}
                    readonly
                />
                <IonModal isOpen={showSleepTimeModal} onDidDismiss={() => setShowSleepTimeModal(false)}>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={() => setShowSleepTimeModal(false)}>Annuler</IonButton>
                        </IonButtons>
                        <IonTitle>Heure de coucher</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowSleepTimeModal(false)}>Confirmer</IonButton>
                        </IonButtons>
                    </IonToolbar>
                    <IonModalContent>
                        <IonDatetime
                            presentation="time"
                            value={sleepTime}
                            onIonChange={e => setSleepTime(e.detail.value as string)}
                        />
                    </IonModalContent>
                </IonModal>
            </IonItem>
            <IonItem className="ion-item">
              <IonLabel position="stacked">Objectif d'eau (ml/jour)</IonLabel>
              <IonInput
                className="value"
                type="number"
                value={goalHydration}
                onIonChange={(e) => setGoalHydration(e.detail.value!)}
                placeholder={`Suggéré: ${weight ? parseInt(weight) * 30 : ''}`}
              />
            </IonItem>
            <IonItem className="ion-item">
                <IonLabel position="stacked">Fréquence rappel hydratation (en minutes)</IonLabel>
                <IonInput
                className="value"
                type="number"
                value={waterReminderFreq}
                placeholder="Défaut (calculé automatiquement)"
                onIonChange={e => setWaterReminderFreq(parseInt(e.detail.value!, 10))}
                />
            </IonItem>
            <IonItem className="ion-item" lines="none">
                <IonLabel>
                    Eau par rappel : ~{calculateWaterPerInterval()} ml
                </IonLabel>
            </IonItem>

            <IonItem className="ion-item">
                <IonLabel position="stacked">Fréquence rappel mouvement (en minutes)</IonLabel>
                <IonInput
                className="value"
                type="number"
                value={moveReminderFreq}
                placeholder="Défaut (toutes les 60 minutes)"
                onIonChange={e => setMoveReminderFreq(parseInt(e.detail.value!, 10))}
                />
            </IonItem>
          </IonList>
          <IonButton expand="block" type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'En cours...' : 'Valider'}
          </IonButton>
        </form>
        {results && (
          <div className="result-container">
            <h3>Résultats :</h3>
            <pre>{results}</pre>
          </div>
        )}
         <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={"Succès"}
          message={"Vos réglages de rappel ont été mis à jour."}
          buttons={['OK']}
        />
      </div>
    );
};

export default HealthCalculatorComponent;