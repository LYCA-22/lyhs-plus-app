import { creditData, SubData } from "@/types";
import { apiClient } from "../http/apiClient";

export interface KsaSession {
  JSESSIONID: string;
  SRV: string;
  session_key: string;
}

interface KsaResult<T> {
  result: {
    dataRows: T;
  };
}
interface BasicInfoResponse {
  stuInfo: {
    uuid: number;
    [key: string]: unknown;
  };
}

interface ExamDetailResponse {
  subScoreDetail: unknown[];
}

function ksaHeaders(ksa: KsaSession) {
  return {
    KsaAuthKey: ksa.session_key,
  };
}

export const ksaApi = {
  login(userId: string, password: string) {
    return apiClient.post<KsaSession>(
      "/v1/lyps/school/login",
      {
        userId,
        password,
      },
      { auth: false },
    );
  },
  quickLogin() {
    return apiClient.post<KsaSession>(
      "/v1/lyps/school/quickLogin",
      {},
      { auth: true },
    );
  },
  linkQuickMode(openid_account: string, openid_password: string) {
    return apiClient.put("/v1/lyps/school/linkQuickMode", {
      openid_account,
      openid_password,
    });
  },
  closeQuickMode() {
    return apiClient.put("/v1/lyps/school/closeQuickMode");
  },
  enable() {
    return apiClient.put("/v1/lyps/school/enable");
  },
  searchOpenId(grade: string, classId: string, number: string) {
    return apiClient.get<{ openid: string }>(
      `/v1/lyps/school/idSearch/${grade}/${classId}/${number}`,
      { auth: false },
    );
  },
  getBasicInfo(ksa: KsaSession) {
    return apiClient.get<BasicInfoResponse>(
      `/v1/lyps/school/basicInfo/${ksa.JSESSIONID}/${ksa.SRV}`,
      { headers: ksaHeaders(ksa) },
    );
  },
  getAllSemeData(ksa: KsaSession, uuid: number) {
    return apiClient.get<creditData[]>(
      `/v1/lyps/school/allSemeData/${ksa.JSESSIONID}/${ksa.SRV}/${uuid}`,
      { headers: ksaHeaders(ksa) },
    );
  },
  getSemeDetail(
    ksa: KsaSession,
    syear: string | number,
    seme: string | number,
  ) {
    return apiClient.get<KsaResult<unknown[]>>(
      `/v1/lyps/school/semeDetail/${ksa.JSESSIONID}/${ksa.SRV}/${syear}/${seme}`,
      { headers: ksaHeaders(ksa) },
    );
  },
  getExamDetail(ksa: KsaSession, itemId: string | number) {
    return apiClient.get<ExamDetailResponse>(
      `/v1/lyps/school/examDetail/${ksa.JSESSIONID}/${ksa.SRV}/${itemId}`,
      { headers: ksaHeaders(ksa) },
    );
  },
  getSemeSubScore(ksa: KsaSession, creditId: string | number) {
    return apiClient.get<KsaResult<SubData[]>>(
      `/v1/lyps/school/semeSubScore/${ksa.JSESSIONID}/${ksa.SRV}/${creditId}`,
      { headers: ksaHeaders(ksa) },
    );
  },
  getAbsence<T>(ksa: KsaSession) {
    return apiClient.get<KsaResult<T[]>>(
      `/v1/lyps/school/absence/${ksa.JSESSIONID}/${ksa.SRV}`,
      { headers: ksaHeaders(ksa) },
    );
  },
  getAbsent<T>(ksa: KsaSession) {
    return apiClient.get<KsaResult<T[]>>(
      `/v1/lyps/school/absent/${ksa.JSESSIONID}/${ksa.SRV}`,
      { headers: ksaHeaders(ksa) },
    );
  },
  getProfileImage(ksa: KsaSession) {
    return apiClient.get<{ stuImageData: string }>(
      `/v1/lyps/school/image/${ksa.JSESSIONID}/${ksa.SRV}`,
      { headers: ksaHeaders(ksa) },
    );
  },
};
