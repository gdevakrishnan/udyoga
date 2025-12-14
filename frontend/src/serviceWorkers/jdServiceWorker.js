import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}jd/`;

// ---------------------------
// Create JD (Manual / AI)
// ---------------------------
export const createJD = async (payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data || "Failed to create JD",
    };
  }
};

// ---------------------------
// List Recruiter JDs
// ---------------------------
export const listJDs = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data || "Failed to fetch JDs",
    };
  }
};

// ---------------------------
// Get Single JD
// ---------------------------
export const getJDById = async (id, token) => {
  try {
    const response = await axios.get(`${BASE_URL}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data || "Failed to fetch JD",
    };
  }
};

// ---------------------------
// Update JD
// ---------------------------
export const updateJD = async (id, payload, token) => {
  try {
    const response = await axios.put(`${BASE_URL}${id}/`, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data || "Failed to update JD",
    };
  }
};

// ---------------------------
// Delete JD
// ---------------------------
export const deleteJD = async (id, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data || "Failed to delete JD",
    };
  }
};

// ---------------------------
// Generate JD using AI
// ---------------------------
export const generateJDWithAI = async (payload) => {
  try {
    const access = localStorage.getItem("udhyoga_access_token");

    const response = await axios.post(
      `${BASE_URL}generate-ai/`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      }
    );
    return response;
  } catch (err) {
    return {
      error: true,
      message: err.response?.data || "Failed to generate JD",
    };
  }
};
