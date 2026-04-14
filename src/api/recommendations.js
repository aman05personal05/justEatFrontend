import api from "./axios";

export const recommendationsApi = {
  get: () => api.get("/recommendations"),
  getMenuItems: () => api.get("/recommendations/menu-items"),
};
