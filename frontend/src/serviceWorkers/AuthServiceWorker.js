import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/accounts/";

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
    console.log("User registered:", response.data);
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

// ---------------------------
// LOGIN
// ---------------------------
export const loginUser = async (payload) => {
  try {
    const res = await axios.post(`${BASE_URL}auth/login/`, payload);

    // Save tokens
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    return res.data;
  } catch (err) {
    return { error: true, message: err.response?.data || "Login failed" };
  }
};

// ---------------------------
// LOGOUT
// ---------------------------
export const logoutUser = async () => {
  try {
    const refresh = localStorage.getItem("refresh");

    await axios.post(`${BASE_URL}auth/logout/`, { refresh });

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

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
    const access = localStorage.getItem("access");

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
    const refresh = localStorage.getItem("refresh");

    const res = await axios.post(`${BASE_URL}auth/refresh/`, {
      refresh: refresh,
    });

    localStorage.setItem("access", res.data.access);

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
