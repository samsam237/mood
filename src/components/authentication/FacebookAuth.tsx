// src/components/FacebookLogin.tsx

import React from 'react';
import { signInWithFacebook, saveUserData } from '../../services/authServices';

import './FacebookAuth.css'

const FacebookLogin: React.FC = () => {
  const handleFacebookLogin = async () => {
    try {
      const res = await signInWithFacebook();
      await saveUserData(res.user);
      // Handle successful login (e.g., redirect or show a message)
    } catch (error) {
      console.error("Facebook login error", error);
    }
  };

  return (
    <button onClick={handleFacebookLogin} className='facebook-login-button'>Facebook</button>
  );
};

export default FacebookLogin;
