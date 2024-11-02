import React from 'react';
import { IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton } from '@ionic/react';

const LinksAndRatingsComponent: React.FC = () => {
  const [rating, setRating] = React.useState<number | null>(null);

  return (
    <IonList>
      <IonItem>
        <IonLabel>Nous suivre</IonLabel>
        <IonButton href="https://youtube.com" target="_blank">Visiter notre site</IonButton>
      </IonItem>

      <IonItem>
        <IonLabel>Rate this Resource</IonLabel>
        <IonSelect value={rating} placeholder="Select Rating" onIonChange={(e) => setRating(e.detail.value)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IonSelectOption key={star} value={star}>{star} Stars</IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
    </IonList>
  );
};

export default LinksAndRatingsComponent;
