// src/components/PhoneLogin.tsx

import React, { useEffect, useRef, useState } from 'react';
import { signInWithPhone } from '../../services/authServices';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';

import "./PhoneAuth.css"

const PhoneLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const auth = getAuth();

  useEffect(() => {
    // Initialize reCAPTCHA verifier
    recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {});
  }, [auth]);

  const handlePhoneLogin = async () => {
    if (!recaptchaVerifier.current) return;

    try {
      const confirmation = await signInWithPhone(phoneNumber, recaptchaVerifier.current);
      setConfirmationResult(confirmation);
    } catch (error) {
      console.error("Phone login error", error);
    }
  };

  const handleVerifyCode = async () => {
    if (confirmationResult) {
      try {
        await confirmationResult.confirm(verificationCode);
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
    </div>
  );
};

export default PhoneLogin;
