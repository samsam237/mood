// src/components/EmailPasswordLogin.tsx

import React, { useState } from 'react';
import { signIn, signUp } from '../../services/authServices';

import './EmailPasswordAuth.css'

const EmailPasswordLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
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
        {isLogin ? 'Switch to Sign Up' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default EmailPasswordLogin;
