import React from 'react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import './HeaderContainer.css';  // Fichier CSS externe

const HeaderContainer: React.FC = () => {
  return (
    <IonHeader>
      <IonToolbar className="custom-toolbar">
        <IonTitle className="custom-title">ACTIPOD</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default HeaderContainer;
