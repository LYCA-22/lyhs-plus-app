import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  age: number;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  name: "",
  age: 0,
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
    updateName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    updateAge: (state, action: PayloadAction<number>) => {
      state.age = action.payload;
    },
  },
});
