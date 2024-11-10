// src/components/PhoneLogin.tsx

import React, { useEffect, useRef, useState } from 'react';
import { signInWithPhone, saveUserData } from '../../services/authServices';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

import { IonLoading } from '@ionic/react';

import { useHistory } from 'react-router-dom';

import "./PhoneAuth.css"

const PhoneLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const history = useHistory();
  const auth = getAuth();

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {});
  }, [auth]);

  const handlePhoneLogin = async () => {
    if (!recaptchaVerifier.current) return;
    setIsLoading(true);
    try {
      const confirmation = await signInWithPhone(phoneNumber, recaptchaVerifier.current);
      setConfirmationResult(confirmation);
      setIsLoading(true);
      setErrorMessage(''); 
    } catch (error) {
      setIsLoading(false);
      const errorMsg = (error as Error).message || "Une erreur est survenue lors de l'envoi du code.";
      
      if (errorMsg.includes("auth/invalid-phone-number")) {
        setErrorMessage("Le numéro de téléphone est invalide.");
      } else if (errorMsg.includes("auth/too-many-requests")) {
        setErrorMessage("Trop de tentatives. Veuillez réessayer plus tard.");
      } else {
        setErrorMessage("Erreur lors de la connexion par téléphone.");
      }
      console.error("Phone login error", error);
    }
  };

  const handleVerifyCode = async () => {
    if (confirmationResult) {
      try {
        const res = await confirmationResult.confirm(verificationCode);
        await saveUserData(res.user);
        setErrorMessage('');
        history.replace('/main');
        // Handle successful login
      } catch (error) {
        
        console.error("Verification code error", error);
      }
    }
  };

  return (
    <div className='phone-login'>
      {/* <h2>Phone Login</h2> */}
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Phone Number" 
          className='phone-input'
          onChange={e => setPhoneNumber(e.target.value)} 
        />
        <div id="recaptcha-container"></div>
        <button onClick={handlePhoneLogin} className='phone-button'>Send Code</button>
      </div>

      {confirmationResult && (
        <>
          <input 
            type="text" 
            placeholder="Verification Code" 
            className='verification-input'
            onChange={e => setVerificationCode(e.target.value)} 
          />
          <button onClick={handleVerifyCode} >Verify Code</button>
        </>
      )}
      <IonLoading
        isOpen={isLoading}
        message={'Encours de traitement...'}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default PhoneLogin;
