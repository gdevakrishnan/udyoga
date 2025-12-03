import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
// import AppContext from "../context/AppContext";
// import { isAuthenticated } from "../serviceWorkers/authServices";

const PrivateRoute = () => {
    //   const { user, isAuthChecked } = useContext(AppContext);

    // Wait until authentication check completes
    //   if (!isAuthChecked) return null;

    // If user is not logged in → redirect to login
    //   if (!user && !isAuthenticated()) {
    //     return <Navigate to="/login" replace />;
    //   }

    // Otherwise, render the protected route
    return <Outlet />;
};

export default PrivateRoute;