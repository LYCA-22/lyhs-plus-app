import { apiClient } from "../http/apiClient";

export const publicApi = {
  getStatus() {
    return apiClient.get("/v1/status");
  },
  getLunchList<T>() {
    return apiClient.get<T>("/v1/lyps/lunch/list");
  },
};
