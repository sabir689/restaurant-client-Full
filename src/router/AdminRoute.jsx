import { Navigate, useLocation } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth(); 
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    // Show a centered loading spinner while checking both Auth and Admin status
    if (loading || isAdminLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen gap-4">
                <span className="loading loading-infinity loading-lg text-orange-500"></span>
                <p className="text-orange-600 font-bold animate-pulse uppercase tracking-widest text-xs">
                    Verifying Admin Access...
                </p>
            </div>
        );
    }

    // If both exist, allow entry
    if (user && isAdmin) {
        return children;
    }

    // Otherwise, send them back to the sign-in page (using your router's path)
    return <Navigate to="/signIn" state={{ from: location }} replace />
};

export default AdminRoute;