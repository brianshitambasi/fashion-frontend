import axios from "axios";

const api = axios.create({
  baseURL: "https://hair-salon-app-1.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

export default api;
