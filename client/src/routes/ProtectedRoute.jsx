import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const ProtectedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();
  if (loading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        to="/login"
        state={{
          from: location,
        }}
      />
    );
  }
  return children;
};

export default ProtectedRoute;
