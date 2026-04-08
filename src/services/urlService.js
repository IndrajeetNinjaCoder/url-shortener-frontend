import api from "./api";

export const urlService = {
  shorten: async (data) => {
    const res = await api.post("/shorten", data);
    return res.data;
  },

  bulkShorten: async (links) => {
    const res = await api.post("/shorten/bulk", { links });
    return res.data;
  },

  editLink: async (shortId, data) => {
    const res = await api.put(`/edit/${shortId}`, data);
    return res.data;
  },

  deleteLink: async (shortId) => {
    const res = await api.delete(`/delete/${shortId}`);
    return res.data;
  },

  preview: async (shortId) => {
    const res = await api.get(`/preview/${shortId}`);
    return res.data;
  },

  getAnalytics: async (shortId) => {
    const res = await api.get(`/analytics/${shortId}`);
    return res.data;
  },

  getUserLinks: async () => {
    const res = await api.get("/user/links");
    return res.data;
  },
};