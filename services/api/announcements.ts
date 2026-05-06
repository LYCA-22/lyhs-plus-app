import { AnnData, schoolAnnData } from "@/store/newsSlice";
import { apiClient } from "../http/apiClient";

interface ApiDataResponse<T> {
  data: T;
}

export const announcementApi = {
  getSchoolList() {
    return apiClient.get<ApiDataResponse<schoolAnnData[]>>("/v1/lyps/list");
  },
  getLysaList() {
    return apiClient.get<ApiDataResponse<AnnData[]>>("/v1/lyps/ann/list");
  },
  getSchoolDetail(rawUrl: string) {
    return apiClient.get(`/v1/lyps/detail/${rawUrl}`);
  },
  updateLysaViewCount(id: string | number) {
    return apiClient.put(`/v1/lyps/ann/view/${id}`, undefined, {
      auth: false,
    });
  },
  deleteLysa(id: string | number) {
    return apiClient.delete(`/v1/lyps/ann/delete/${id}`);
  },
  addLysa(formData: FormData) {
    return apiClient.post("/v1/lyps/ann/add", formData, {
      formData: true,
    });
  },
};
