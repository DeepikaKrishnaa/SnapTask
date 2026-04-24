import axios from "axios";

const API = axios.create({
  baseURL: "http://52-66-27-174.nip.io:30007/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;