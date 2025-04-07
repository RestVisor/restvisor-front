import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { TablesAndMenuProvider } from './hooks/useTablesAndMenu';
import { LoginForm } from './components/LoginForm';
import AdminDashboard from './pages/AdminDashboard';
import ChefDashboard from './pages/ChefDashboard';
import WaiterDashboard from './pages/WaiterDashboard';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <AuthProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginForm />} />

                        {/* Protected routes - wrapped in TablesAndMenuProvider */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute allowedRoles={['admin']}>
                                    <TablesAndMenuProvider>
                                        <AdminDashboard />
                                    </TablesAndMenuProvider>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/chef"
                            element={
                                <ProtectedRoute allowedRoles={['chef']}>
                                    <TablesAndMenuProvider>
                                        <ChefDashboard />
                                    </TablesAndMenuProvider>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/waiter"
                            element={
                                <ProtectedRoute allowedRoles={['waiter']}>
                                    <TablesAndMenuProvider>
                                        <WaiterDashboard />
                                    </TablesAndMenuProvider>
                                </ProtectedRoute>
                            }
                        />

                        {/* Catch all route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AuthProvider>
            </div>
        </Router>
    );
}

export default App;
