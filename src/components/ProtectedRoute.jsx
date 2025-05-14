import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login if not authenticated, saving the current location
        return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
    }

    return children;
};

export default ProtectedRoute; 