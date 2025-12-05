import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useContext(AppContext);
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
