import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1/ai/";

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