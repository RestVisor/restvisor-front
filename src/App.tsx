import React from 'react';
import { LoginForm } from './components/LoginForm';
import { AuthProvider } from './hooks/useAuth';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <LoginForm />
      </div>
    </AuthProvider>
  );
}

export default App;
