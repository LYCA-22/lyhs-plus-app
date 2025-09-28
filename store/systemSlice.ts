import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface serverError {
  status: boolean;
  code: string;
  message: string;
}

interface school {
  SRV: string;
  JSESSIONID: string;
}

export interface subscribeInfo {
  endpoint: string;
  expirationTime: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface subscribe {
  status: boolean;
  info: subscribeInfo;
}

interface device {
  os: string;
  isMobile: boolean;
  browser: string;
}

interface UserState {
  initialize: boolean;
  isLoading: boolean;
  deviceInfo: device;
  used: boolean;
  isPwa: boolean;
  subscribe: subscribe;
  isBack: boolean;
  BackLink: string;
  error: serverError;
  school: school;
}

const initialState: UserState = {
  initialize: true,
  isLoading: true,
  deviceInfo: {
    os: "",
    isMobile: false,
    browser: "",
  },
  used: false,
  isPwa: false,
  subscribe: {
    status: false,
    info: {
      endpoint: "",
      expirationTime: "",
      keys: {
        p256dh: "",
        auth: "",
      },
    },
  },
  isBack: false,
  BackLink: "",
  error: {
    status: false,
    code: "",
    message: "",
  },
  school: {
    SRV: "",
    JSESSIONID: "",
  },
};

export const systemSlice = createSlice({
  name: "systemData",
  initialState,
  reducers: {
    updateStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateSystemData: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
    closeBack: (state) => {
      state.isBack = false;
    },
    updateInitialize: (state, action: PayloadAction<boolean>) => {
      state.initialize = action.payload;
    },
  },
});

export const { updateStatus, updateSystemData, closeBack, updateInitialize } =
  systemSlice.actions;
