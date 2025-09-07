// src/components/FacebookLogin.tsx

import React from 'react';
import { signInWithFacebook, saveUserData } from '../../services/authServices';

import { useHistory } from 'react-router-dom';

import './FacebookAuth.css'

const FacebookLogin: React.FC = () => {
  const history = useHistory();

  const handleFacebookLogin = async () => {
    try {
      console.log('Tentative de connexion Facebook...');
      alert('🔄 Début de la connexion Facebook...');
      
      const res = await signInWithFacebook();
      console.log('Facebook login successful:', res);
      alert('✅ Facebook login successful!');
      
      await saveUserData(res.user);
      console.log('User data saved');
      alert('💾 User data saved!');
      
      history.replace('/main'); 
    } catch (error: any) {
      console.error("Facebook login error", error);
      alert(`❌ Erreur de connexion Facebook: ${error.message || 'Erreur inconnue'}`);
    }
  };

  return (
    <button onClick={handleFacebookLogin} className='facebook-login-button'>Facebook</button>
  );
};

export default FacebookLogin;
