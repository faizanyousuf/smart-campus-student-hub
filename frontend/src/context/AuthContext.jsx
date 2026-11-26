import { createContext, useContext, useEffect, useState } from 'react';
import api, { forgetCredentials, rememberCredentials } from '../api/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        forgetCredentials();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    rememberCredentials(email, password);
    localStorage.setItem('token', response.data.token);
    setUser(response.data);
    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    rememberCredentials(payload.email, payload.password);
    localStorage.setItem('token', response.data.token);
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    forgetCredentials();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
