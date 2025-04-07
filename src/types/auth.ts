import { z } from 'zod';

// User role enum
export const UserRole = z.enum(['admin', 'chef', 'waiter']);
export type UserRole = z.infer<typeof UserRole>;

// User schema
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: UserRole,
});

export type User = z.infer<typeof UserSchema>;

// Auth state schema
export const AuthStateSchema = z.object({
  user: UserSchema.nullable(),
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
});

export type AuthState = z.infer<typeof AuthStateSchema>;

// Auth response schema
export const AuthResponseSchema = z.object({
  token: z.string(),
  user: UserSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// Login request schema
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

// Register request schema
export const RegisterRequestSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: UserRole,
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>; 
