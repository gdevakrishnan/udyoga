import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import AppContext from "../context/AppContext";
// import { isAuthenticated } from "../serviceWorkers/authServices";

const PublicRoute = () => {
    //   const { user, isAuthChecked } = useContext(AppContext);

    // Wait for auth check to finish before deciding
    //   if (!isAuthChecked) return null;

    // If user is logged in → redirect to home (or dashboard)
    //   if (user || isAuthenticated()) {
    // return <Navigate to="/" replace />;
    //   }

    // Otherwise render the public route (login/register)
    return <Outlet />;
};

export default PublicRoute;