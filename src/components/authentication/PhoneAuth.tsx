// src/components/PhoneLogin.tsx

import React, { useEffect, useRef, useState } from 'react';
import { signInWithPhone, verifyPhoneCode, saveUserData } from '../../services/authServices';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { IonButton, IonInput, IonItem, IonLabel, IonLoading, IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import app from '../../firebaseConfig';
import './PhoneAuth.css';

const PhoneLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const history = useHistory();
  const auth = getAuth(app);

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    const isNative = Capacitor.isNativePlatform();

    recaptchaVerifier.current = new RecaptchaVerifier(auth, isNative ? 'recaptcha' : 'recaptcha-container', {
      size: isNative ? 'invisible' : 'normal', // Invisible for native, normal for web
      callback: () => {
        console.log('reCAPTCHA résolu');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expiré');
        setErrorMessage('Le reCAPTCHA a expiré. Veuillez réessayer.');
      },
    });

    // Render reCAPTCHA on web
    if (!isNative && recaptchaVerifier.current) {
      recaptchaVerifier.current.render().catch((error) => {
        console.error('Erreur lors du rendu du reCAPTCHA:', error);
        setErrorMessage('Erreur lors du rendu du reCAPTCHA.');
      });
    }

    // Cleanup reCAPTCHA on component unmount
    return () => {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
    };
  }, [auth]);

  const handlePhoneLogin = async () => {
    if (!recaptchaVerifier.current) {
      setErrorMessage('Erreur: reCAPTCHA non initialisé.');
      return;
    }

    setIsLoading(true);
    try {
      const confirmation = await signInWithPhone(phoneNumber, recaptchaVerifier.current, auth);
      setConfirmationResult(confirmation);
      setErrorMessage('');
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error.message || 'Une erreur est survenue lors de l’envoi du code.';
      if (error.code === 'auth/invalid-phone-number') {
        setErrorMessage('Le numéro de téléphone est invalide. Utilisez le format international (ex: +33123456789).');
      } else if (error.code === 'auth/too-many-requests') {
        setErrorMessage('Trop de tentatives. Veuillez réessayer plus tard.');
      } else {
        setErrorMessage('Erreur lors de la connexion par téléphone.');
      }
      console.error('Phone login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!confirmationResult) {
      setErrorMessage('Aucun code de vérification envoyé.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await verifyPhoneCode(confirmationResult, verificationCode);
      await saveUserData(userCredential);
      setErrorMessage('');
      history.replace('/main');
    } catch (error: any) {
      setIsLoading(false);
      const errorMsg = error.message || 'Erreur lors de la vérification du code.';
      if (error.code === 'auth/invalid-verification-code') {
        setErrorMessage('Code de vérification invalide.');
      } else {
        setErrorMessage('Erreur lors de la vérification.');
      }
      console.error('Verification code error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="phone-login">
        <div id="recaptcha-container"></div>
        <IonItem>
          <IonLabel position="floating">Numéro de téléphone</IonLabel>
          <IonInput
            value={phoneNumber}
            onIonChange={(e) => setPhoneNumber(e.detail.value!)}
            placeholder="+33123456789"
            type="tel"
            className="phone-input"
          />
        </IonItem>
        <IonButton expand="block" onClick={handlePhoneLogin} className="phone-button">
          Envoyer le code
        </IonButton>
        {confirmationResult && (
          <>
            <IonItem>
              <IonLabel position="floating">Code de vérification</IonLabel>
              <IonInput
                value={verificationCode}
                onIonChange={(e) => setVerificationCode(e.detail.value!)}
                placeholder="123456"
                type="text"
                className="verification-input"
              />
            </IonItem>
            <IonButton expand="block" onClick={handleVerifyCode}>
              Vérifier le code
            </IonButton>
          </>
        )}
        <IonLoading isOpen={isLoading} message={'En cours de traitement...'} />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </IonContent>
    </IonPage>
  );
};

export default PhoneLogin;