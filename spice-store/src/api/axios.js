import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  withCredentials: true,
});

// OPTIONAL RESPONSE HANDLER
API.interceptors.response.use(
  (response) => response,

  (error) => {
    console.log("API ERROR:", error.response?.data || error.message);

    return Promise.reject(error);
  },
);

export default API;
