// src/components/GoogleLogin.tsx

import React from 'react';
import { signInWithGoogle, saveUserData } from '../../services/authServices';

import { useHistory } from 'react-router-dom';

import './GoogleAuth.css'

const GoogleLogin: React.FC = () => {
  const history = useHistory();

  const handleGoogleLogin = async () => {
    try {
      console.log('Tentative de connexion Google...');
      alert('🔄 Début de la connexion Google...');
      
      const res = await signInWithGoogle();
      console.log('Google login successful:', res);
      alert('✅ Google login successful!');
      
      await saveUserData(res.user);
      console.log('User data saved');
      alert('💾 User data saved!');
      
      history.replace('/main'); 
    } catch (error: any) {
      console.error("Google login error", error);
      alert(`❌ Erreur de connexion Google: ${error.message || 'Erreur inconnue'}`);
    }
  };

  return (
    <button onClick={handleGoogleLogin} className='google-login-button'>Google</button>
  );
};

export default GoogleLogin;
