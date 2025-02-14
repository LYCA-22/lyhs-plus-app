import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoading: boolean;
  os: string;
  isMobile: boolean;
  browser: string;
  used: boolean;
}

const initialState: UserState = {
  isLoading: true,
  os: "",
  isMobile: false,
  browser: "",
  used: false,
};

export const systemSlice = createSlice({
  name: "systemStatus", // slice 的名稱
  initialState, // 初始狀態
  reducers: {
    // 定義可以更新這個 slice 狀態的方法
    updateStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateSystemData: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateStatus, updateSystemData } = systemSlice.actions;
