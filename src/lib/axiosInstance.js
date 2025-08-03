import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8000/api", // Base URL for your API
  baseURL: "/api", // Always use proxy in development
  withCredentials: true, // Include cookies in requests

  timeout: 5000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json", // Default content type
    "Accept-Control-Allow-Credentials": "true",
  },
});

export default axiosInstance;
