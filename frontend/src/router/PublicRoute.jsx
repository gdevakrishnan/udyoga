import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppContext from "../context/AppContext";

const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useContext(AppContext);

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
