// src/components/EmailPasswordLogin.tsx

import React, { useState } from 'react';
import { signIn, signUp, saveUserData } from '../../services/authServices';

import './EmailPasswordAuth.css'

const EmailPasswordLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await signIn(email, password);
        await saveUserData(res.user);
      } else {
        const res = await signUp(email, password);
        await saveUserData(res.user);
      }
      // Handle successful login/signup (e.g., redirect or show a message)
    } catch (error) {
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
    </div>
  );
};

export default EmailPasswordLogin;
