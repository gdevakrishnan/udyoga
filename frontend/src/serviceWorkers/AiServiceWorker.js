import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}ai/`;

// ---------------------------
// Scrape JD
// ---------------------------
export const scrapeJobDescData = async (payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}scrape/`, { "url": payload.jdUrl }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Register failed" };
  }
};


// ---------------------------
// Get Embedding of JD and Resume
// ---------------------------
export const getEmbeddingsResumeJd = async (payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}get-embeddings/`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Register failed" };
  }
};


// ---------------------------
// Analyze JD and Resume
// ---------------------------
export const analyzeResumeJd = async (payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}analyze/`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Register failed" };
  }
};


// ---------------------------
// Query JD and Resume
// ---------------------------
export const queryResumeJd = async (payload, token) => {
  try {
    const response = await axios.post(`${BASE_URL}query/`, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    });
    return response;
  } catch (err) {
    return { error: true, message: err.response?.data || "Register failed" };
  }
};