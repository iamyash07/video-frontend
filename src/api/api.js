import axios from "axios";

const api = axios.create({
 baseURL: "http://localhost:5050/api/v1",
   // FIXED
  withCredentials: true,
});

// Debug log
console.log("🔥 AXIOS INSTANCE LOADED WITH:", api.defaults.baseURL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
