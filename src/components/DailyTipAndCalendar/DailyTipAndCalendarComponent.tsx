import React, { useState, useEffect } from 'react';
import { IonList, IonItem, IonLabel, IonDatetime, IonCard, IonCardContent } from '@ionic/react';

const DailyTipAndCalendarComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const [advice, setAdvice] = useState<string>('');

  const getDayOfYear = (date: Date) => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const fetchAdvice = async (date: Date) => {
    try {
      let res = await fetch('/data/health-tips.json');
      if (!res.ok) {
        // fallback si le premier fetch échoue
        res = await fetch('http://localhost:5173/data/health-tips.json');
      }
      const tips: string[] = await res.json();
      const dayOfYear = getDayOfYear(date);
      const adviceOfDay = tips[dayOfYear % tips.length];
      setAdvice(adviceOfDay);
    } catch (err) {
      console.error("Erreur lors du chargement des conseils : ", err);
      setAdvice("Buvez de l’eau et prenez soin de vous !");
    }
  };

  useEffect(() => {
    fetchAdvice(new Date(selectedDate));
  }, [selectedDate]);

  return (
    <IonList>
      <IonCard>
        <IonCardContent>
          <h1>Conseil du jour</h1>
          <p>{advice}</p>
        </IonCardContent>
      </IonCard>

      <IonItem>
        <IonDatetime
          value={selectedDate}
          onIonChange={e => setSelectedDate(String(e.detail.value))}
          presentation="date"
        />
      </IonItem>
    </IonList>
  );
};

export default DailyTipAndCalendarComponent;
