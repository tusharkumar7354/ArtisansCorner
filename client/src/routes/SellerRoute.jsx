import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

const SellerRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }

  if (!user?.isSeller) {
    return <Navigate replace to="/become-seller" />;
  }

  return children;
};

export default SellerRoute;
