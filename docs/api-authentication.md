# API Authentication Guide

This document provides technical details on how to use the authentication system in API requests within the RestVisor application.

## Making Authenticated API Requests

### Automatic Token Inclusion

The authentication system automatically adds the JWT token to all axios requests. This means you don't need to manually add the token to your requests.

```typescript
import axios from 'axios';

// The token is automatically included in the Authorization header
const response = await axios.get(`${API_URL}/api/protected-endpoint`);
```

### Manual Token Validation Before Sensitive Operations

For sensitive operations, you may want to validate the token before making the request:

```typescript
import { authService } from '../services/authService';
import axios from 'axios';

async function performSensitiveOperation() {
  // Validate token before proceeding
  const isValid = await authService.validateToken();
  if (!isValid) {
    // Handle invalid token (e.g., redirect to login)
    return;
  }

  // Proceed with the sensitive operation
  const response = await axios.post(`${API_URL}/api/sensitive-endpoint`, data);
  return response.data;
}
```

### Creating a Custom API Client with Authentication

For more complex applications, you might want to create a custom API client that handles authentication:

```typescript
// apiClient.ts
import axios from 'axios';
import { authService } from '../services/authService';

const API_URL = import.meta.env.VITE_API_URL;

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token (401) and we haven't tried to refresh yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to validate the token
      const isValid = await authService.validateToken();
      
      if (isValid) {
        // If token is valid, retry the original request
        return apiClient(originalRequest);
      } else {
        // If token is invalid, redirect to login
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Role-Based API Access

### Checking User Roles Before Making Requests

You can use the `useAuth` hook to check the user's role before making API requests:

```typescript
import { useAuth } from '../hooks/useAuth';
import apiClient from '../apiClient';

function AdminComponent() {
  const { user } = useAuth();
  
  const fetchAdminData = async () => {
    // Only make the request if the user is an admin
    if (user?.role === 'admin') {
      const response = await apiClient.get('/api/admin-data');
      return response.data;
    } else {
      console.error('Unauthorized: User is not an admin');
      return null;
    }
  };
  
  // Component JSX
}
```

### Creating Role-Specific API Functions

You can create role-specific API functions to encapsulate role-based access control:

```typescript
// adminApi.ts
import apiClient from '../apiClient';
import { useAuth } from '../hooks/useAuth';

export function useAdminApi() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  
  const fetchAdminData = async () => {
    if (!isAdmin) {
      throw new Error('Unauthorized: User is not an admin');
    }
    
    const response = await apiClient.get('/api/admin-data');
    return response.data;
  };
  
  const updateAdminSettings = async (settings) => {
    if (!isAdmin) {
      throw new Error('Unauthorized: User is not an admin');
    }
    
    const response = await apiClient.put('/api/admin-settings', settings);
    return response.data;
  };
  
  return {
    isAdmin,
    fetchAdminData,
    updateAdminSettings
  };
}
```

## Error Handling for Authentication Issues

### Handling Authentication Errors

When making API requests, you should handle authentication errors appropriately:

```typescript
import apiClient from '../apiClient';
import { useNavigate } from 'react-router-dom';

async function fetchProtectedData() {
  try {
    const response = await apiClient.get('/api/protected-data');
    return response.data;
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized - token is invalid or expired
        console.error('Authentication error: Token is invalid or expired');
        // Redirect to login
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        // Forbidden - user doesn't have permission
        console.error('Authorization error: User does not have permission');
      } else {
        // Other error
        console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network error: No response received');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    throw error;
  }
}
```

## Best Practices for API Authentication

1. **Always Use the API Client**: Use the API client for all requests to ensure consistent authentication handling.

2. **Validate Tokens Before Sensitive Operations**: For sensitive operations, validate the token before making the request.

3. **Handle Authentication Errors**: Implement proper error handling for authentication-related errors.

4. **Use Role-Based Access Control**: Check user roles before making role-specific API requests.

5. **Implement Token Refresh Logic**: For long-lived sessions, implement token refresh logic to handle token expiration.

6. **Secure Sensitive Data**: Never store sensitive data in localStorage or sessionStorage.

7. **Use HTTPS**: Always use HTTPS for API requests to ensure data is encrypted in transit.

8. **Implement CSRF Protection**: For sensitive operations, implement CSRF protection to prevent cross-site request forgery attacks. 
