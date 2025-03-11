import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import { User, KeyRound, ChefHat } from 'lucide-react';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('waiter');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password, role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-xl">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to start your shift</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  className="input-field pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  required
                  className="input-field pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <label className="relative flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="waiter"
                checked={role === 'waiter'}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 ${role === 'waiter' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                {role === 'waiter' && <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>}
              </div>
              <span className="text-sm font-medium text-gray-700">Waiter</span>
            </label>

            <label className="relative flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="chef"
                checked={role === 'chef'}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 ${role === 'chef' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                {role === 'chef' && <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>}
              </div>
              <span className="text-sm font-medium text-gray-700">Chef</span>
            </label>

            <label className="relative flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === 'admin'}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full border-2 ${role === 'admin' ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                {role === 'admin' && <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>}
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </label>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}