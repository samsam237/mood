// src/components/GoogleLogin.tsx

import React from 'react';
import { signInWithGoogle, saveUserData } from '../../services/authServices';

import { useHistory } from 'react-router-dom';

import './GoogleAuth.css'

const GoogleLogin: React.FC = () => {
  const history = useHistory();

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      await saveUserData(res.user);
      history.replace('/main'); 
      // Handle successful login (e.g., redirect or show a message)
    } catch (error) {
      console.error("Google login error", error);
    }
  };

  return (
    <button onClick={handleGoogleLogin} className='google-login-button'>Google</button>
  );
};

export default GoogleLogin;
