import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 資料型態定義
interface appError {
  type: "client" | "server";
  status: number;
  code: string;
  message: string;
  detail: string;
}
interface ksaCookies {
  SRV: string;
  JSESSIONID: string;
  session_key: string;
  uuid: string;
}
interface deviceInfo {
  os: string;
  isMobile: boolean;
  browser: string;
  operate_type: "WEB" | "PWA";
  used_mark: boolean;
}
interface appInfo {
  version: string;
  gitHash: string;
}
interface serviceStatus {
  pageIsLoading: boolean;
  isBack: boolean;
  backLink: string;
}
interface appState {
  initialize: boolean;
  user_logged: boolean;
  device_info: deviceInfo;
  app_error: appError;
  ksa_cookies: ksaCookies;
  app_info: appInfo;
  service_status: serviceStatus;
}

const initialState: appState = {
  initialize: false,
  user_logged: false,
  // if initialize is true, that means the all service has been initialized.
  device_info: {
    os: "",
    isMobile: false,
    browser: "",
    operate_type: "WEB",
    used_mark: false,
  },
  app_error: {
    type: "client",
    status: 0,
    code: "",
    message: "",
    detail: "",
  },
  ksa_cookies: {
    SRV: "",
    JSESSIONID: "",
    session_key: "",
    uuid: "",
  },
  app_info: {
    version: "",
    gitHash: "",
  },
  service_status: {
    pageIsLoading: false,
    isBack: false,
    backLink: "",
  },
};

export const systemSlice = createSlice({
  name: "appStatus",
  initialState,
  reducers: {
    // 功能模組化
    updatePageLoadingStatus: (state, action: PayloadAction<boolean>) => {
      state.service_status.pageIsLoading = action.payload;
    },
    turnOnBackLink: (state, action: PayloadAction<string>) => {
      state.service_status.isBack = true;
      state.service_status.backLink = action.payload;
    },
    turnOffBackLink: (state) => {
      state.service_status.isBack = false;
      state.service_status.backLink = "";
    },
    setKsaCookies: (state, action: PayloadAction<Partial<ksaCookies>>) => {
      Object.assign(state.ksa_cookies, action.payload);
    },
    setDeviceInfo: (state, action: PayloadAction<Partial<deviceInfo>>) => {
      Object.assign(state.device_info, action.payload);
    },
    setAppInfo: (state, action: PayloadAction<Partial<appInfo>>) => {
      Object.assign(state.app_info, action.payload);
    },
    setAppError: (state, action: PayloadAction<Partial<appError>>) => {
      Object.assign(state.app_error, action.payload);
    },
    appInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialize = true;
      state.user_logged = action.payload;
    },
  },
});

export const {
  updatePageLoadingStatus,
  turnOnBackLink,
  turnOffBackLink,
  setKsaCookies,
  setDeviceInfo,
  setAppInfo,
  setAppError,
  appInitialized,
} = systemSlice.actions;
