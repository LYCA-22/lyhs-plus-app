// userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isLoading: boolean;
}

const initialState: UserState = {
  isLoading: true,
};

export const systemSlice = createSlice({
  name: "systemStatus", // slice 的名稱
  initialState, // 初始狀態
  reducers: {
    // 定義可以更新這個 slice 狀態的方法
    updateStatus: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { updateStatus } = systemSlice.actions;
