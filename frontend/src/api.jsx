import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const api = axios.create({ baseURL: BASE_URL });

// Add token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
