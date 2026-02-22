// Create a complete authentication context provider for Expo Router.
// Requirements:
// - Use React Context API.
// - Store JWT token & role.
// - Load token and role from AsyncStorage on app startup.
// - Provide login() and logout() functions.
// - Auto-handle loading state.
// - Export useAuth hook.

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  token: string | null;
  role: string | null;
  login: (token: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  role: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuth();
  }, []);

  const loadAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedRole = await AsyncStorage.getItem('userRole');
      setToken(storedToken);
      setRole(storedRole);
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (newToken: string, newRole: string) => {
    await AsyncStorage.setItem('userToken', newToken);
    await AsyncStorage.setItem('userRole', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export useAuth hook for convenience
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};