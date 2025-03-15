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
}

const initialState: UserState = {
  isLoading: true,
  os: "",
  isMobile: false,
  browser: "",
  used: false,
  homeApps: [],
  isPwa: false,
};

export const systemSlice = createSlice({
  name: "systemStatus",
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
  },
});

export const { updateStatus, updateSystemData, updateHomeApps } =
  systemSlice.actions;
