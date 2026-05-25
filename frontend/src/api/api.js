import axios from "axios";
 
const baseURL = import.meta.env.VITE_API_GATEWAY_URL || "https://localhost:9192";
 
const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
 
// Add authentication token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
 
  // ✅ Define ALL public endpoints
  const publicEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/send-otp",
    "/auth/verify-otp",
    "/auth/passkeys/authentication"
  ];
 
  const isPublic = publicEndpoints.some(url => config.url.includes(url));
 
  // ✅ Only attach token for protected endpoints
  if (token && !isPublic) {
    config.headers.Authorization = `Bearer ${token}`;
  }
 
  return config;
});
 
export default API;