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
            {userPhoto && userPhoto.includes("http") ? (
              <img src={userPhoto} alt="U" />
            ) : (
              // Si ce n'est pas une URL, afficher la première lettre du nom de l'utilisateur
              <div className="user-initial">{userPhoto ? userPhoto.charAt(0).toUpperCase() : 'A'}</div>
            )}
          </div>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default HeaderContainer;

{/* <IonTitle className="custom-title">ACTIPOD</IonTitle> */}