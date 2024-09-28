import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../../store';
import { authLoginUser } from '../../../services/user';
import { ROLES } from '../../../constants';

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await authLoginUser({ email, password });
      localStorage.setItem('session', JSON.stringify(user));
      login(user);

      if (user.role === ROLES.ADMIN) navigate('/clients');
      if (user.role === ROLES.CLIENT) navigate('/');

      setErrorMessage('Invalid email or password');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl mb-4">Login</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-4 w-full"
          required
          data-testid="email-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-4 w-full"
          required
          data-testid="password-input"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginView;
