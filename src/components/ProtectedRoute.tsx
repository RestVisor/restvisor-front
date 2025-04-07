import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // If authenticated but no user data, something went wrong
    if (!user) {
        console.log('Authenticated but no user data, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    // Check if user has the required role
    if (!allowedRoles.includes(user.role)) {
        console.log(`User role ${user.role} not allowed, redirecting to appropriate dashboard`);
        // Redirect to the appropriate dashboard based on user's role
        switch (user.role) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'chef':
                return <Navigate to="/chef" replace />;
            case 'waiter':
                return <Navigate to="/waiter" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    // If all checks pass, render the protected content
    return <>{children}</>;
};

export default ProtectedRoute;
