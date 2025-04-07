import axios from 'axios';
import { AuthResponse, AuthResponseSchema, LoginRequest, RegisterRequest, User, UserSchema } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL;

// Create a persistent storage key
const AUTH_STORAGE_KEY = 'restvisor_auth';

export const authService = {
  setToken(token: string) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  removeToken() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const userData = JSON.parse(userStr);
      // Validate user data with Zod schema
      const result = UserSchema.safeParse(userData);
      if (result.success) {
        return result.data;
      } else {
        console.error('Invalid user data in storage:', result.error);
        this.removeUser();
        return null;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.removeUser();
      return null;
    }
  },

  removeUser() {
    localStorage.removeItem('user');
  },

  // Store complete auth state
  setAuthState(authState: { user: User | null; isAuthenticated: boolean }) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  },

  // Get complete auth state
  getAuthState(): { user: User | null; isAuthenticated: boolean } | null {
    const authStateStr = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authStateStr) return null;
    
    try {
      const authState = JSON.parse(authStateStr);
      return authState;
    } catch (error) {
      console.error('Error parsing auth state:', error);
      return null;
    }
  },

  // Clear all auth data
  clearAuthState() {
    this.removeToken();
    this.removeUser();
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await axios.get(`${API_URL}/users/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // The validate endpoint returns { user: User } format
      if (response.data && response.data.user) {
        // Validate user data with Zod schema
        const result = UserSchema.safeParse(response.data.user);
        if (result.success) {
          // Update user data from validation response
          this.setUser(result.data);
          // Update auth state
          this.setAuthState({ user: result.data, isAuthenticated: true });
          return true;
        } else {
          console.error('Invalid user data in validation response:', result.error);
          this.clearAuthState();
          return false;
        }
      } else {
        console.error('Invalid validation response format:', response.data);
        this.clearAuthState();
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      this.clearAuthState();
      return false;
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // Validate input with Zod schema
      const loginData: LoginRequest = { email, password };
      
      const response = await axios.post(`${API_URL}/users/login`, loginData);
      
      // Validate response with Zod schema
      const result = AuthResponseSchema.safeParse(response.data);
      if (!result.success) {
        throw new Error('Invalid login response format');
      }
      
      const { token, user } = result.data;
      this.setToken(token);
      this.setUser(user);
      this.setAuthState({ user, isAuthenticated: true });
      
      return result.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(name: string, email: string, password: string, role: string): Promise<AuthResponse> {
    try {
      // Validate input with Zod schema
      const registerData: RegisterRequest = { name, email, password, role: role as any };
      
      const response = await axios.post(`${API_URL}/users/register`, registerData);
      
      // Validate response with Zod schema
      const result = AuthResponseSchema.safeParse(response.data);
      if (!result.success) {
        throw new Error('Invalid registration response format');
      }
      
      const { token, user } = result.data;
      this.setToken(token);
      this.setUser(user);
      this.setAuthState({ user, isAuthenticated: true });
      
      return result.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout() {
    this.clearAuthState();
  }
}; 
