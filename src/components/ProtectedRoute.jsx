import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../context/AuthContext';

// Protected Route Component - requires authentication
export function ProtectedRoute({ children, allowedRoles = [] }) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to user's appropriate dashboard
        return <Navigate to={ROLE_ROUTES[user.role] || '/'} replace />;
    }

    return children;
}

// Public Route - redirects authenticated users to their dashboard
export function PublicRoute({ children }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    if (isAuthenticated && user) {
        return <Navigate to={ROLE_ROUTES[user.role] || '/'} replace />;
    }

    return children;
}

// Loading Screen Component
function LoadingScreen() {
    return (
        <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
            <style>{`
        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: var(--bg-primary);
          gap: 1rem;
        }
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--border-color);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        .loading-screen p {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }
      `}</style>
        </div>
    );
}

export default ProtectedRoute;
