import React from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';

import { useHistory } from 'react-router-dom';

import './Login.css'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const Login: React.FC = () => {
    const history = useHistory();

    const goToNextPage = () => {
      history.push('/main');
    };

  return (
    <IonPage>
      <IonContent fullscreen >
        <div className="container">
            <h2>ACTIPOD</h2>
            <img src="images/data 5.png"></img>
            <p>
                Rejoignez-nous aujourd’hui !!!
                <br />Connectez-vous avec
            </p>
            <IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={goToNextPage}>
                <img src="images/data 3.png"></img>Google
            </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
