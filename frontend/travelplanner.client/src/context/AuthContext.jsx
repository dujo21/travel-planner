import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import User from '../models/User';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pri pokretanju aplikacije obnavljamo korisnika iz localStorage.
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        setCurrentUser(new User(JSON.parse(storedUser)));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    const result = await authService.login(email, password);
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    setCurrentUser(result.user);
    return result.user;
  }

  async function register(fullName, email, password) {
    const result = await authService.register(fullName, email, password);
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));
    setCurrentUser(result.user);
    return result.user;
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  }

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin ?? false,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti koriscen unutar AuthProvider-a.');
  }
  return context;
}