import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const AdminRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  const isAdmin = user?.roles?.includes("admin");

  if (!isAdmin) {
    return <Navigate replace to="/" />;
  }

  return children;
};

export default AdminRoute;
