import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  // If user comes from back/forward navigation, force logout
  if (performance.navigation.type === 2) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  if (!token) return <Navigate to="/login" />;

  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
}
