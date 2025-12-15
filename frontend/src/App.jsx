import React, { Fragment, useState, useEffect } from "react";
import AppRouter from "./router/Router";
import AppContext from "./context/AppContext";
import {
  getUserDetails,
  refreshAccessToken,
  logoutUser,
} from "./serviceWorkers/AuthServiceWorker";
import Spinner from "./components/utils/Spinner";
import ToastProvider from "./components/utils/ToastProvider";
import { toast } from "react-toastify";

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // -----------------------
  // Toast handlers
  // -----------------------
  useEffect(() => {
    if (success) {
      toast.success(success);
      setSuccess("");
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setError("");
    }
  }, [error]);

  // -----------------------
  // Logout (UPDATED)
  // -----------------------
  const logout = async (showMessage = true) => {
    await logoutUser()
      .then((response) => {
        setSuccess("Logged out successfully");
        setUser(null);
        setIsAuthenticated(false);
      })
      .catch((e) => {
        console.log(e.message)
      });
  };

  // -----------------------
  // Initialize auth
  // -----------------------
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
                setUser(retryUserData.data);
                setIsAuthenticated(true);
              } else {
                setError("Session expired. Please login again.");
                await logout();
              }
            } else {
              setError("Session expired. Please login again.");
              await logout();
            }
          } else {
            setUser(userData.data);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Auth initialization error:", err);
          setError("Authentication failed");
          await logout();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // -----------------------
  // Auto refresh token
  // -----------------------
  useEffect(() => {
    if (!isAuthenticated) return;

    const refreshInterval = setInterval(async () => {
      const result = await refreshAccessToken();

      if (result?.error) {
        setError("Session expired. Logging out.");
        await logout();
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [isAuthenticated]);

  // -----------------------
  // Context
  // -----------------------
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

  // -----------------------
  // Loader
  // -----------------------
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
