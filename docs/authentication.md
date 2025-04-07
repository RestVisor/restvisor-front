# Authentication System Documentation

## Overview

The RestVisor application uses a JWT-based authentication system with persistent state management. This document provides technical details on how the authentication system works and how to use it in your requests.

## Authentication Flow

1. **Login/Registration**: User credentials are validated and a JWT token is issued
2. **Token Storage**: The token is stored in localStorage and added to axios headers
3. **State Persistence**: Authentication state is persisted across page reloads
4. **Token Validation**: Tokens are validated on application initialization and before protected operations
5. **Role-Based Access**: Access to routes and features is controlled by user roles

## Technical Implementation

### Authentication Service (`authService.ts`)

The `authService` provides methods for managing authentication state:

```typescript
// Token management
setToken(token: string): void
getToken(): string | null
removeToken(): void

// User data management
setUser(user: User): void
getUser(): User | null
removeUser(): void

// Complete auth state management
setAuthState(authState: { user: User | null; isAuthenticated: boolean }): void
getAuthState(): { user: User | null; isAuthenticated: boolean } | null
clearAuthState(): void

// Authentication operations
validateToken(): Promise<boolean>
login(email: string, password: string): Promise<AuthResponse>
register(name: string, email: string, password: string, role: string): Promise<AuthResponse>
logout(): void
```

### Authentication Hook (`useAuth.tsx`)

The `useAuth` hook provides access to authentication state and methods:

```typescript
const { 
  user, 
  isAuthenticated, 
  isLoading, 
  login, 
  register, 
  logout 
} = useAuth();
```

### Protected Routes

Protected routes use the `ProtectedRoute` component to restrict access based on user roles:

```typescript
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>
```

## Using Authentication in API Requests

### Automatic Token Inclusion

The `authService` automatically adds the JWT token to all axios requests:

```typescript
// In authService.ts
setToken(token: string) {
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
```

This means all axios requests will automatically include the token in the Authorization header.

### Manual Token Validation

To validate a token before making a request:

```typescript
import { authService } from '../services/authService';

// Before making a sensitive request
const isValid = await authService.validateToken();
if (!isValid) {
  // Handle invalid token (e.g., redirect to login)
  return;
}

// Proceed with the request
const response = await axios.get('/api/protected-endpoint');
```

### Role-Based Access Control

To check if a user has a specific role:

```typescript
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user } = useAuth();
  
  // Check if user has admin role
  if (user?.role === 'admin') {
    // Show admin-only content
  }
  
  return (
    // Component JSX
  );
}
```

## Data Types

### User Schema

```typescript
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'chef', 'waiter'])
});
```

### Auth State Schema

```typescript
const AuthStateSchema = z.object({
  user: UserSchema.nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean()
});
```

## Error Handling

The authentication system includes comprehensive error handling:

1. **Invalid Token**: Automatically clears auth state and redirects to login
2. **Expired Token**: Detected during validation and handled appropriately
3. **Invalid User Data**: Validated using Zod schemas to ensure data integrity
4. **Network Errors**: Caught and logged with appropriate user feedback

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage (consider using httpOnly cookies for enhanced security)
2. **Token Validation**: Tokens are validated on application initialization and before sensitive operations
3. **Role Verification**: Server-side role verification is essential (client-side checks are for UX only)
4. **CSRF Protection**: Consider implementing CSRF tokens for sensitive operations

## Troubleshooting

### Common Issues

1. **Lost Authentication State**: Check if the token is properly stored and validated
2. **Invalid Token Format**: Ensure the token is properly formatted in the Authorization header
3. **Role Mismatch**: Verify that the user's role matches the expected role for the operation
4. **Network Errors**: Check API connectivity and CORS configuration

### Debugging

Enable detailed logging in the authentication system:

```typescript
// In authService.ts
console.log('Token validation response:', response.data);
console.log('User data validation result:', result);

// In useAuth.tsx
console.log('Auth state initialization:', authState);
console.log('Token validation result:', isValid);
```

## API Endpoints

### Authentication Endpoints

- **Login**: `POST /usuarios/login`
- **Register**: `POST /usuarios/register`
- **Validate Token**: `GET /usuarios/validate`

### Request/Response Formats

#### Login Request

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

#### Login Response

```typescript
interface AuthResponse {
  token: string;
  user: User;
}
```

#### Token Validation Response

```typescript
interface ValidationResponse {
  user: User;
}
```

## Best Practices

1. **Always Validate Tokens**: Validate tokens before sensitive operations
2. **Use Protected Routes**: Wrap sensitive components with `ProtectedRoute`
3. **Implement Role-Based Access**: Check user roles before allowing access to features
4. **Handle Token Expiration**: Implement refresh token logic for long-lived sessions
5. **Secure Storage**: Consider using more secure storage methods for production
6. **Server-Side Validation**: Always validate tokens and roles on the server side 
