import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { api } from '../services/api';

interface AuthFormProps {
  mode: 'register' | 'login' | 'reset';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (mode === 'register') {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Create user in our backend with the Firebase UID
        await api.post('/api/v1/users/', {
          email: email,
          password: password,
          user_uid: userCredential.user.uid,
          theme: 'light' // Default theme
        });
        setMessage('Регистрация успешно завершена!');
        navigate('/login');
      } else if (mode === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await login(userCredential.user.email || '', userCredential.user.uid);
        navigate('/dashboard');
      } else if (mode === 'reset') {
        await sendPasswordResetEmail(auth, email);
        setMessage('Инструкции по сбросу пароля отправлены на вашу почту');
      }
    } catch (error: any) {
      let errorMessage = 'Произошла ошибка';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Этот email уже зарегистрирован';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Неверный формат email';
          break;
        case 'auth/weak-password':
          errorMessage = 'Пароль слишком простой';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Пользователь не найден';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Неверный пароль';
          break;
        default:
          errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'register' && 'Регистрация'}
            {mode === 'login' && 'Вход'}
            {mode === 'reset' && 'Сброс пароля'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="sr-only">
                  Пароль
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}
          {message && (
            <div className="text-green-600 text-sm text-center">{message}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {mode === 'register' && 'Зарегистрироваться'}
              {mode === 'login' && 'Войти'}
              {mode === 'reset' && 'Отправить'}
            </button>
          </div>

          <div className="text-sm text-center">
            {mode === 'login' && (
              <>
                <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
                  Регистрация
                </Link>
                {' • '}
                <Link to="/reset" className="font-medium text-green-600 hover:text-green-500">
                  Забыли пароль?
                </Link>
              </>
            )}
            {mode === 'register' && (
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Уже есть аккаунт? Войти
              </Link>
            )}
            {mode === 'reset' && (
              <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                Вернуться к входу
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm; 