import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonButton } from '@ionic/react';
import firebase from 'firebase/app';
import 'firebase/auth';

import { useHistory } from 'react-router-dom';

import {initializeStorage} from '../../services/storageService';

import GoogleLogin from '../../components/authentication/GoogleAuth';
import FacebookLogin from '../../components/authentication/FacebookAuth';
import PhoneLogin from '../../components/authentication/PhoneAuth';
import EmailPasswordLogin from '../../components/authentication/EmailPasswordAuth';


import './Login.css'

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';


const Login: React.FC = () => {

  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      const storage = await initializeStorage();
      const storedUser = await storage.get('user');
      if (storedUser) {
        setUser(storedUser);
        history.replace('/main'); 
      }
    };
    fetchUserData();
  }, [history]);

  const [method, setMethod] = useState('email');

  /*   const [isLogin, setIsLogin] = useState(true);*/

  const goToNextPage = () => {
    history.push('/main');
  };

  return (
    <IonPage>
      <IonContent fullscreen >
        <div className="container">

          <div className="login-title">
            <h2 className="title">
              {/* {isLogin ? 'Connexion' : 'Inscription'} */}
              ACTIPOD - CONNEXION
            </h2>
          </div>

          <div className="login-links">
            <button
              onClick={() => setMethod('email')}
              className={`login-link ${
                method === 'email'
                  ? 'login-link-checked'
                  : ''
              }`}
            >
              Email
            </button>
            <button
              onClick={() => setMethod('phone')}
              className={`login-link ${
                method === 'phone'
                  ? 'login-link-checked'
                  : ''
              }`}
            >
              Téléphone
            </button>
          </div>

          
            {method === 'email' ? <EmailPasswordLogin /> : <PhoneLogin />}

            {/* <div>
              <button
                type="submit"
                className=""
              >
                {isLogin ? 'Se connecter' : "S'inscrire"}
              </button>
            </div> */}

          

          <div className="divider-container">
            <div className="divider-line"></div>
            <span className="divider-text">Ou continuer avec</span>
          </div>

          <div className='auth-provider-links'>
            <GoogleLogin />
            <FacebookLogin />
          </div>

          {/* <div className="">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className=""
            >
              {isLogin
                ? "Pas encore de compte ? S'inscrire"
                : 'Déjà un compte ? Se connecter'}
            </button>
          </div> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;

{/* <h2>ACTIPOD</h2> */}
{/* <img src="images/data 5.png"></img>
<p>
    Rejoignez-nous aujourd’hui !!!
    <br />Connectez-vous avec
</p>
<IonButton size="small" color="danger" className='btn-continue' expand="block" onClick={goToNextPage}>
    <img src="images/data 3.png"></img>Google
</IonButton> */}