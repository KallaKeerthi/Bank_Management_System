import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
    const { user } = useAuth();

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Logged in, but wrong role
    if (role && user.role !== role) {
        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        if (user.role === "customer") {
            return <Navigate to="/customer/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;