import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { homeApps } from "@/types";

interface UserState {
  isLoading: boolean;
  os: string;
  isMobile: boolean;
  browser: string;
  used: boolean;
  homeApps: homeApps[];
  isPwa: boolean;
  isSubscribe: boolean;
  subscribe: [];
  isBack: boolean;
  BackLink: string;
  isSetOpen: boolean;
}

const initialState: UserState = {
  isLoading: true,
  os: "",
  isMobile: false,
  browser: "",
  used: false,
  homeApps: [],
  isPwa: false,
  isSubscribe: false,
  subscribe: [],
  isBack: false,
  BackLink: "",
  isSetOpen: false,
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
    updateHomeApps: (state, action: PayloadAction<homeApps[]>) => {
      state.homeApps = action.payload;
    },
    closeBack: (state) => {
      state.isBack = false;
    },
  },
});

export const { updateStatus, updateSystemData, updateHomeApps, closeBack } =
  systemSlice.actions;
