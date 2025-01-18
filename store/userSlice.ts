import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  name: string;
  email: string;
  level: string;
  type: "staff" | "normal" | "";
  role: string;
  grade: string;
  class: string;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  id: "",
  name: "",
  email: "",
  level: "",
  type: "",
  role: "",
  grade: "",
  class: "",
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user", // slice 的名稱
  initialState, // 初始狀態
  reducers: {
    // 定義可以更新這個 slice 狀態的方法
    login: (state) => {
      state.isLoggedIn = true;
    },
    updateUserData: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { login, updateUserData } = userSlice.actions;
export default userSlice.reducer;
