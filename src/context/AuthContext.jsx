import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginWithBluesky } from '../services/bluesky';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSession = localStorage.getItem('bluesky_session');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setSession(sessionData);
      } catch (error) {
        console.error('Failed to parse stored session:', error);
        localStorage.removeItem('bluesky_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (identifier, password) => {
    try {
      const response = await loginWithBluesky(identifier, password);
      if (response.success) {
        setSession(response.data);
        localStorage.setItem('bluesky_session', JSON.stringify(response.data));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Failed to connect to Bluesky. Please try again.' 
      };
    }
  };

  const logout = () => {
    setSession(null);
    localStorage.removeItem('bluesky_session');
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      session, 
      login, 
      logout,
      isAuthenticated: !!session 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
