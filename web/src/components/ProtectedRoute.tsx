import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
