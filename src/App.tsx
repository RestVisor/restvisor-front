import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { AdminDashboard } from './pages/AdminDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import ChefDashboard from './pages/ChefDashboard';

function App() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user?.role === 'admin' ? (
            <Navigate to="/admin" replace />
          ) : user?.role === 'chef' ? (
            <Navigate to="/kitchen" replace />
          ) : (
            <Navigate to="/waiter" replace />
          )
        }
      />
      <Route
        path="/admin/*"
        element={
          user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/waiter/*"
        element={
          user?.role === 'waiter' ? (
            <WaiterDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/kitchen/*"
        element={
          user?.role === 'chef' ? (
            <ChefDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;