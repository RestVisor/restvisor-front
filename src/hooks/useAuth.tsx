import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AuthStateSchema, User } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const navigate = useNavigate();

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if we have a token
        const token = authService.getToken();
        if (!token) {
          console.log('No token found, clearing auth state');
          authService.clearAuthState();
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        // Try to get stored auth state
        const storedAuth = authService.getAuthState();
        if (storedAuth && storedAuth.user) {
          console.log('Found stored auth state, validating token');
          // Validate token and user data
          const isValid = await authService.validateToken();
          if (isValid) {
            console.log('Token validated successfully');
            setAuthState({
              user: storedAuth.user,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
        
        // If we get here, either there was no stored auth state or token validation failed
        console.log('No valid auth state found, clearing auth state');
        authService.clearAuthState();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
        authService.clearAuthState();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await authService.login(email, password);
      
      // Validate the complete auth state with Zod
      const result = AuthStateSchema.safeParse({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      if (!result.success) {
        throw new Error('Invalid auth state format');
      }
      
      setAuthState(result.data);
      
      // Redirect based on role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'chef':
          navigate('/kitchen');
          break;
        case 'waiter':
          navigate('/waiter');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      const response = await authService.register(name, email, password, role);
      
      // Validate the complete auth state with Zod
      const result = AuthStateSchema.safeParse({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      if (!result.success) {
        throw new Error('Invalid auth state format');
      }
      
      setAuthState(result.data);
      
      // Redirect based on role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'chef':
          navigate('/kitchen');
          break;
        case 'waiter':
          navigate('/waiter');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = () => {
    authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
