import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { TablesAndMenuProvider } from './hooks/useTablesAndMenu'; // Importar el TablesAndMenuProvider
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import AdminDashboard from './pages/AdminDashboard';
import ChefDashboard from './pages/ChefDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TablesAndMenuProvider>  {/* Envuelve el contenido dentro de TablesAndMenuProvider */}
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Protected routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chef"
              element={
                <ProtectedRoute allowedRoles={['chef']}>
                  <ChefDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/waiter"
              element={
                <ProtectedRoute allowedRoles={['waiter']}>
                  <WaiterDashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </TablesAndMenuProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;