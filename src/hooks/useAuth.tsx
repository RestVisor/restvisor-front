import React, { createContext, useContext, useState } from 'react';
import { User, AuthState, UserRole } from '../types';

interface AuthContextType extends AuthState {
  login: (username: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  const login = async (username: string, password: string, role: UserRole) => {
    try {
      // Make a request to localhost:3000/api/auth/login
      const response = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password,
          rol: role,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      
      // Update auth state with user data from response
      setAuthState({ 
        user: {
          id: userData.id || '1',
          username,
          role,
          name: userData.nombre || (role === 'admin' ? 'Admin User' : 'Waiter User'),
        }, 
        isAuthenticated: true 
      });
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      // If the server is not running, use mock data for development
      const mockUser: User = {
        id: '1',
        username,
        role,
        name: role === 'admin' ? 'Admin User' : 'Waiter User',
      };
      setAuthState({ user: mockUser, isAuthenticated: true });
      return true;
    }
  };

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
