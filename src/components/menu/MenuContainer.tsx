import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <IonMenu side="start" contentId="main-content">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <Link to="/home">
              <IonLabel>Home</IonLabel>
            </Link>
          </IonItem>
          <IonItem>
            <Link to="/activity">
              <IonLabel>Activity</IonLabel>
            </Link>
          </IonItem>
          <IonItem>
            <Link to="/hydration">
              <IonLabel>Hydration</IonLabel>
            </Link>
          </IonItem>
          <IonItem>
            <Link to="/tips">
              <IonLabel>Health Tips</IonLabel>
            </Link>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
