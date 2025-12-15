import React, { Fragment, useState, useEffect } from "react";
import AppRouter from "./router/Router";
import AppContext from "./context/AppContext";
import {
  getUserDetails,
  refreshAccessToken,
} from "./serviceWorkers/AuthServiceWorker";
import Spinner from "./components/utils/Spinner";
import ToastProvider from "./components/utils/ToastProvider";
import { toast } from "react-toastify";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Common toast states
  const [success, setSuccess] = useState("boo");
  const [error, setError] = useState("hi");

  // Success Toast Handler
  useEffect(() => {
    if (success) {
      toast.success(success);
      setSuccess("");
    }
  }, [success]);

  // Error Toast Handler
  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("udhyoga_access_token");
      const refreshToken = localStorage.getItem("udhyoga_refresh_token");

      if (accessToken && refreshToken) {
        try {
          const userData = await getUserDetails();

          if (userData?.error) {
            const refreshResult = await refreshAccessToken();

            if (!refreshResult?.error) {
              const retryUserData = await getUserDetails();

              if (!retryUserData?.error) {
                setUser(retryUserData?.data);
                setIsAuthenticated(true);
              } else {
                setError("Session expired. Please login again.");
                logout();
              }
            } else {
              setError("Session expired. Please login again.");
              logout();
            }
          } else {
            setUser(userData?.data);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
          setError("Authentication failed");
          logout();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Auto refresh token
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      const result = await refreshAccessToken();

      if (result?.error) {
        setError("Session expired. Logging out.");
        logout();
      }
    }, 14 * 60 * 1000);

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
    logout,
    success,
    setSuccess,
    error,
    setError,
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spinner size="xl" color="#16A34A" />
      </div>
    );
  }

  return (
    <Fragment>
      <ToastProvider />
      <AppContext.Provider value={context}>
        <AppRouter />
      </AppContext.Provider>
    </Fragment>
  );
};

export default App;
