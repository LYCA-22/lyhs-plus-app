import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  sessionId: string;
  id: string;
  name: string;
  email: string;
  level: string;
  type: "staff" | "normal" | "";
  role: string;
  grade: string;
  class: string;
  isLoggedIn: boolean;
  school_session: string;
  JSESSIONID: string;
  SRV: string;
  number: number;
  stu_id: string;
}

const initialState: UserState = {
  sessionId: "",
  id: "",
  name: "",
  email: "",
  level: "",
  type: "",
  role: "",
  grade: "",
  class: "",
  isLoggedIn: false,
  school_session: "",
  JSESSIONID: "",
  SRV: "",
  number: 0,
  stu_id: "",
};

export const userSlice = createSlice({
  name: "user", // slice 的名稱
  initialState, // 初始狀態
  reducers: {
    updateUserData: (state, action: PayloadAction<Partial<UserState>>) => {
      Object.assign(state, action.payload);
    },
    logout: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { updateUserData, logout } = userSlice.actions;
export default userSlice.reducer;
