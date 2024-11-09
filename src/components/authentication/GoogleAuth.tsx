// src/components/GoogleLogin.tsx

import React from 'react';
import { signInWithGoogle, saveUserData } from '../../services/authServices';

import './GoogleAuth.css'

const GoogleLogin: React.FC = () => {
  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      await saveUserData(res.user);
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
