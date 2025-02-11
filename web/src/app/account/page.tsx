'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isClient, setIsClient] = useState(false); 
  const [users, setUsers] = useState<{ name: string, surname: string, email: string, password: string }[]>([]); 
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); 
  }, []);

  useEffect(() => {
    if (isClient) {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    }
  }, [isClient]);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !surname || !email || password.length < 6) {
      setError('Будь ласка, введіть коректні дані');
      return;
    }

   
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      setError('Цей користувач вже існує');
      return;
    }


    const newUser = { name, surname, email, password };
    const updatedUsers = [...users, newUser];

    if (typeof window !== 'undefined') {
     
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    setError('');
    setIsLogin(true);
  };


  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = storedUsers.find((user: { email: string; password: string }) => user.email === email && user.password === password);

    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('loggedInUser', JSON.stringify(user)); 
      }
      router.push('/office'); 
    } else {
      setError('Невірний логін або пароль');
    }
  };


  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (loggedInUser) {
      router.push('/office'); 
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-yellow-600">
   
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? 'Вхід в особистий кабінет' : 'Реєстрація'}
        </h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-lg">Ім'я</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded text-yellow-600"
                  placeholder="Введіть ваше ім'я"
                />
              </div>
              <div>
                <label className="block text-lg">Прізвище</label>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded text-yellow-600"
                  placeholder="Введіть ваше прізвище"
                />
              </div>
            </>
          )}
          <div>
            <label className="block text-lg">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-yellow-600"
              placeholder="Введіть вашу електронну пошту"
            />
          </div>
          <div>
            <label className="block text-lg">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-yellow-600"
              placeholder="Введіть ваш пароль (мінімум 6 символів)"
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

export default AuthPage;
