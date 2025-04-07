# Token Validation Process

This document provides technical details on how token validation works in the RestVisor application.

## Overview

Token validation is a critical part of the authentication system. It ensures that:

1. The token is valid and not expired
2. The user associated with the token exists and is active
3. The user's data is up-to-date

## Validation Flow

The token validation process follows these steps:

1. **Retrieve Token**: Get the token from localStorage
2. **Send Validation Request**: Send the token to the backend for validation
3. **Process Response**: Handle the response from the backend
4. **Update State**: Update the authentication state based on the validation result

## Implementation Details

### Token Retrieval

```typescript
// In authService.ts
getToken(): string | null {
  return localStorage.getItem('token');
}
```

### Validation Request

```typescript
// In authService.ts
async validateToken(): Promise<boolean> {
  const token = this.getToken();
  if (!token) return false;

  try {
    const response = await axios.get(`${API_URL}/users/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Process response...
  } catch (error) {
    // Handle error...
  }
}
```

### Response Processing

```typescript
// In authService.ts
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
```

### Error Handling

```typescript
// In authService.ts
catch (error) {
  console.error('Token validation error:', error);
  this.clearAuthState();
  return false;
}
```

## When to Validate Tokens

Tokens should be validated in the following scenarios:

1. **Application Initialization**: When the application loads, to restore the authentication state
2. **Before Sensitive Operations**: Before performing sensitive operations that require authentication
3. **After Token Refresh**: After refreshing a token, to ensure the new token is valid
4. **Periodic Validation**: Periodically validate the token to ensure it hasn't been revoked

## Backend Validation Endpoint

The backend validation endpoint (`/users/validate`) performs the following checks:

1. **Token Format**: Verifies that the token is a valid JWT
2. **Token Signature**: Verifies that the token was signed by the server
3. **Token Expiration**: Checks if the token has expired
4. **User Existence**: Verifies that the user associated with the token exists
5. **User Status**: Checks if the user is active and not disabled

## Response Format

The validation endpoint returns a response in the following format:

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

## Handling Validation Failures

When token validation fails, the following actions should be taken:

1. **Clear Authentication State**: Remove the token and user data from localStorage
2. **Redirect to Login**: Redirect the user to the login page
3. **Show Error Message**: Display an error message to the user

```typescript
// In authService.ts
if (!isValid) {
  this.clearAuthState();
  // Redirect to login
  window.location.href = '/login';
}
```

## Debugging Token Validation

To debug token validation issues, you can enable detailed logging:

```typescript
// In authService.ts
console.log('Token validation request:', {
  url: `${API_URL}/users/validate`,
  headers: { Authorization: `Bearer ${token}` }
});

console.log('Token validation response:', response.data);
```

## Security Considerations

1. **Token Storage**: JWT tokens are stored in localStorage (consider using httpOnly cookies for enhanced security)
2. **Token Expiration**: Tokens should have a reasonable expiration time to limit the window of opportunity for token theft
3. **Token Revocation**: Implement a mechanism to revoke tokens if they are compromised
4. **HTTPS**: Always use HTTPS for token validation requests to prevent token interception
5. **CSRF Protection**: Implement CSRF protection to prevent cross-site request forgery attacks

## Best Practices

1. **Validate Early**: Validate tokens as early as possible in the application lifecycle
2. **Handle Errors Gracefully**: Implement proper error handling for token validation failures
3. **Keep User Data Updated**: Update user data from the validation response to ensure it's up-to-date
4. **Implement Token Refresh**: For long-lived sessions, implement token refresh logic to handle token expiration
5. **Log Validation Failures**: Log token validation failures for security auditing 
