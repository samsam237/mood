import React from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';

import { useHistory } from 'react-router-dom';

import './Welcome.css'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const Welcome: React.FC = () => {
    const history = useHistory();

    const goToNextPage = () => {
      history.push('/login');
    };

  return (
    <IonPage>
      <IonContent fullscreen >
        <div className="container">
            <h2>ACTIPOD</h2>
            <img src="images/data 4.png"></img>
            <p>
                Bonjour, je suis ACTIPOD, 
                <br />votre compagnon d’hydratation et qui vous aident à lutter contre la sédentarité.
            </p>
            <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={goToNextPage}>
                Allons-y
            </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
