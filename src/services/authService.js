import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: async (credentials) => {
    const { data } = await API.post("/auth/login", credentials);
    return data;
  },

  signup: async (credentials) => {
    const { data } = await API.post("/auth/signup", credentials);
    return data;
  },

  // Sends Firebase ID token to backend → gets back your app's JWT
  googleLogin: async (idToken) => {
    const { data } = await API.post(
      "/auth/google",
      {},
      { headers: { Authorization: `Bearer ${idToken}` } }
    );
    return data;
  },

  getMe: async () => {
    const { data } = await API.get("/auth/me");
    return data;
  },
};






// import api from "./api";

// export const authService = {
//   signup: async (data) => {
//     const res = await api.post("/auth/signup", data);
//     return res.data;
//   },

//   login: async (data) => {
//     const res = await api.post("/auth/login", data);
//     return res.data;
//   },

//   getMe: async () => {
//     const res = await api.get("/auth/me");
//     return res.data;
//   },
// };