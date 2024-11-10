// src/components/EmailPasswordLogin.tsx

import React, { useState } from 'react';
import { signIn, signUp, saveUserData } from '../../services/authServices';

import { IonLoading } from '@ionic/react';

import { useHistory } from 'react-router-dom';

import './EmailPasswordAuth.css'

const EmailPasswordLogin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMessage("Veuillez remplir tous les champs.");
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      if (isLogin) {
        const res = await signIn(email, password);
        await saveUserData(res.user);
      } else {
        const res = await signUp(email, password);
        await saveUserData(res.user);
      }
      setIsLoading(false);
      history.replace('/main'); 
      // Handle successful login/signup (e.g., redirect or show a message)
    } catch (error) {
        // Analyser les erreurs renvoyées par l'API pour déterminer le message d'erreur approprié
      const messageError = (error as Error).message || "Une erreur est survenue. Veuillez réessayer.";
      if (messageError.includes('auth/user-not-found')) {
        setErrorMessage("Compte non trouvé. Veuillez vérifier votre email.");
      } else if (messageError.includes('auth/wrong-password') ) {
        setErrorMessage("Mot de passe incorrect. Veuillez réessayer.");
      } else if (messageError.includes('auth/email-already-in-use')) {
        setErrorMessage("Cet email est déjà utilisé pour un autre compte.");
      } else if (messageError.includes('auth/invalid-email')) {
        setErrorMessage("Format de l'email invalide.");
      } else if (messageError.includes('auth/weak-password')) {
        setErrorMessage("Le mot de passe est trop faible. Veuillez choisir un mot de passe plus complexe.");
      } else {
        setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
      }
      setIsLoading(false);
      console.error("Email/Password error", error);
    }
  };

  return (
    <div className='auth-form'>
      <h2 className='auth-form-title'>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <input 
        type="email" 
        placeholder="Email" 
        className='auth-input'
        onChange={e => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Password" 
        className='auth-input'
        onChange={e => setPassword(e.target.value)} 
      />
      <button className='auth-button' onClick={handleSubmit}>{isLogin ? 'Login' : 'Sign Up'}</button>
      <button className='auth-button-swicth' onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? `Pas encore de compte ? S'inscrire`
          : `Déjà un compte ? Se connecter`}
      </button>
      <IonLoading
        isOpen={isLoading}
        message={'Encours de traitement...'}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default EmailPasswordLogin;
