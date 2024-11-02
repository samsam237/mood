import React from 'react';
import { IonList, IonItem, IonLabel, IonDatetime, IonCard, IonCardContent } from '@ionic/react';

const DailyTipAndCalendarComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<string>(new Date().toISOString());

  return (
    <IonList>

      <IonCard>
        <IonCardContent>
          <h1>Conseil du jour</h1>
          <p>Boire de l'eau continuellement.</p>
        </IonCardContent>
      </IonCard>
      <IonItem>
        <IonDatetime value={selectedDate} onIonChange={(e) => setSelectedDate(String(e.detail.value))} />
      </IonItem>
      
    </IonList>
  );
};

export default DailyTipAndCalendarComponent;
