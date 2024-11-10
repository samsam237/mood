import React from 'react';
import { IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import './HeaderContainer.css';  // Fichier CSS externe

interface HeaderContainerProps {
  userName: string;
  userPhoto: string;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({userName, userPhoto}) => {
  return (
    <IonHeader>
      <IonToolbar >
        <div className="custom-toolbar">
          <div className='custom-user-name'>ACTIPOD</div>
          <div className="custom-user-photoURL">
            <img src={userPhoto} alt={userPhoto} />
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default HeaderContainer;

{/* <IonTitle className="custom-title">ACTIPOD</IonTitle> */}