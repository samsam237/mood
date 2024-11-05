// src/components/GoogleLogin.tsx

import React from 'react';
import { signInWithGoogle } from '../../services/authServices';

import './GoogleAuth.css'

const GoogleLogin: React.FC = () => {
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Handle successful login (e.g., redirect or show a message)
    } catch (error) {
      console.error("Google login error", error);
    }
  };

  return (
    <button onClick={handleGoogleLogin} className='google-login-button'>Login with Google</button>
  );
};

export default GoogleLogin;
