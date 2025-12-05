import React, { Fragment, useState, useEffect } from "react";
import AppRouter from "./router/Router";
import AppContext from "./context/AppContext";
import { getUserDetails, refreshAccessToken } from "./serviceWorkers/AuthServiceWorker";
import Spinner from "./components/utils/Spinner";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("udhyoga_access_token");
      const refreshToken = localStorage.getItem("udhyoga_refresh_token");

      if (accessToken && refreshToken) {
        try {
          // Try to fetch user details with existing access token
          const userData = await getUserDetails();

          if (userData.error) {
            // If access token is expired, try to refresh it
            const refreshResult = await refreshAccessToken();

            if (!refreshResult.error) {
              // Retry fetching user details with new access token
              const retryUserData = await getUserDetails();

              if (!retryUserData.error) {
                setUser(retryUserData);
                setIsAuthenticated(true);
              } else {
                // If still fails, clear tokens and logout
                logout();
              }
            } else {
              // Refresh token is also invalid, logout
              logout();
            }
          } else {
            // Successfully got user data
            setUser(userData?.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          logout();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Set up automatic token refresh before expiration
  useEffect(() => {
    if (!isAuthenticated) return;

    // Refresh token every 14 minutes (assuming 15 min token expiry)
    const refreshInterval = setInterval(async () => {
      const result = await refreshAccessToken();
      
      if (result.error) {
        console.error("Token refresh failed, logging out");
        logout();
      }
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);

    localStorage.removeItem("udhyoga_access_token");
    localStorage.removeItem("udhyoga_refresh_token");
  };

  const context = {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setIsAuthenticated,
    logout
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <Spinner size="xl" color="#16A34A"/>
      </div>
    );
  }

  return (
    <Fragment>
      <AppContext.Provider value={context}>
        <AppRouter />
      </AppContext.Provider>
    </Fragment>
  );
};

export default App;