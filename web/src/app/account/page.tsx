'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

const AuthForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
   
    if (username === 'user' && password === 'password') {
      router.push('/page'); 
    } else {
      setError('Невірний логін або пароль');
    }
  };

  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

   
    if (username === 'user' && password === 'password') {
      setError('Цей користувач вже існує');
    } else {
     
      router.push('/account'); 
    }
  };

 
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-yellow-600">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? 'Вхід в особистий кабінет' : 'Реєстрація'}
        </h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-lg">Логін</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-yellow-600"
              placeholder="Введіть ваш логін"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-yellow-600"
              placeholder="Введіть ваш пароль"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 rounded text-white font-semibold"
          >
            {isLogin ? 'Увійти' : 'Зареєструватися'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-yellow-600 hover:underline"
          >
            {isLogin ? 'Немає акаунту? Зареєструйтесь' : 'Маєте акаунт? Увійти'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
