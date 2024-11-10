import React from 'react';
import { IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonIcon } from '@ionic/react';
import { logoFacebook, logoYoutube, star } from 'ionicons/icons';

import './LinksAndRatingsComponent.css'

const LinksAndRatingsComponent: React.FC = () => {
  const [rating, setRating] = React.useState<number | null>(null);

  return (
    <div className="social-links">
      <IonList className='social-links-list'>
        <div>
          <IonLabel className='label'>
            Suivez nous 
          </IonLabel>
          <div className='content'>
            <IonButton color="" href="https://facebook.com" target="_blank">
              <IonIcon icon={logoFacebook} slot="icon-only" />
            </IonButton>
            <IonButton color="danger" href="https://youtube.com" target="_blank">
              <IonIcon icon={logoYoutube} slot="icon-only" />
            </IonButton>
          </div>
        </div>
        <div>
          <IonLabel className='label'>
            Notez nous
          </IonLabel>
          <div className="content">
            <IonButton color="warning" href="https://example.com/rating" target="_blank">
              <IonIcon icon={star} slot="icon-only" />
            </IonButton>
          </div>
        </div>
      </IonList>

    </div>
  );
};

export default LinksAndRatingsComponent;
