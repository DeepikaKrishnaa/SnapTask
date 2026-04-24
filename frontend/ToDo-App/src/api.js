import axios from "axios";

const API = axios.create({
  baseURL: "http://3.110.143.145:30007/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;