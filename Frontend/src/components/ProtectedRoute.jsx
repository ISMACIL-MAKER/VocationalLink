import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { DASHBOARD_BY_ROLE } from "../constants/roles";

export default function ProtectedRoute({ allowedRoles }) {
  const location = useLocation();
  const { user, token, bootstrapped } = useSelector((state) => state.auth);

  if (!bootstrapped) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-alt">
        <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/Login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = DASHBOARD_BY_ROLE[user.role] || "/";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
