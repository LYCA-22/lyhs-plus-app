import { userMemberData } from "@/types";
import { apiClient } from "../http/apiClient";

interface ApiDataResponse<T> {
  data: T;
}

export const userApi = {
  getMe() {
    return apiClient.get<ApiDataResponse<userMemberData>>("/v1/user/me");
  },
};
