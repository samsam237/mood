// src/components/FacebookLogin.tsx

import React from 'react';
import { signInWithFacebook } from '../../services/authServices';

import './FacebookAuth.css'

const FacebookLogin: React.FC = () => {
  const handleFacebookLogin = async () => {
    try {
      await signInWithFacebook();
      // Handle successful login (e.g., redirect or show a message)
    } catch (error) {
      console.error("Facebook login error", error);
    }
  };

  return (
    <button onClick={handleFacebookLogin} className='facebook-login-button'>Login with Facebook</button>
  );
};

export default FacebookLogin;
