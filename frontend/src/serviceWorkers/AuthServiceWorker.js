import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}accounts/`;

// ---------------------------
// REGISTER
// ---------------------------
export const registerUser = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}auth/register/`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Register failed" };
  }
};

// ---------------------------
// LOGIN
// ---------------------------
export const loginUser = async (payload) => {
  try {
    const response = await axios.post(`${BASE_URL}auth/login/`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Save tokens
    localStorage.setItem("udhyoga_access_token", response.data.access);
    localStorage.setItem("udhyoga_refresh_token", response.data.refresh);

    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Login failed" };
  }
};

// ---------------------------
// LOGOUT
// ---------------------------
export const logoutUser = async () => {
  try {
    const refresh = localStorage.getItem("udhyoga_refresh_token");
    const access = localStorage.getItem("udhyoga_access_token");

    await axios.post(`${BASE_URL}auth/logout/`, { refresh }, {
      headers: {
        "Authorization": `Bearer ${access}`
      }
    });

    localStorage.removeItem("udhyoga_access_token");
    localStorage.removeItem("udhyoga_refresh_token");

    return { message: "Logged out successfully" };
  } catch (err) {
    return { error: true, message: "Logout failed" };
  }
};

// ---------------------------
// GET USER DETAILS
// ---------------------------
export const getUserDetails = async () => {
  try {
    const access = localStorage.getItem("udhyoga_access_token");

    const res = await axios.get(`${BASE_URL}auth/me/`, {
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    return res.data;
  } catch (err) {
    return { error: true, message: "Failed to fetch user" };
  }
};

// ---------------------------
// REFRESH TOKEN
// ---------------------------
export const refreshAccessToken = async () => {
  try {
    const refresh = localStorage.getItem("udhyoga_refresh_token");
    const access = localStorage.getItem("udhyoga_access_token");

    const res = await axios.post(`${BASE_URL}auth/refresh/`, {
      refresh: refresh,
    }, {
      headers: {
        Authorization: `Bearer ${access}`
      }
    });

    localStorage.setItem("udhyoga_access_token", res.data.access);
    localStorage.setItem("udhyoga_refresh_token", res.data.refresh);

    return res.data;
  } catch (err) {
    return { error: true, message: "Token refresh failed" };
  }
};

// ---------------------------
// SERVER STATUS
// ---------------------------
export const checkServerStatus = async () => {
  try {
    const res = await axios.get(`${BASE_URL}server-status/`);
    return res.data;
  } catch (err) {
    return { error: true, message: "Server unreachable" };
  }
};
