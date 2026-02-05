import { userMemberData } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: userMemberData = {
  uuid: "",
  display_name: "",
  zh_name: "",
  role: "studentMember",
  is_disabled: false,
  class_name: "忠",
  grade: "高一",
  number: 0,
  stu_id: "",
  is_member: false,
  ksa_enabled: false,
  openid_account: null,
  openid_password: null,
  created_at: "",
  updated_at: "",
};

export const userSlice = createSlice({
  name: "user", // slice 的名稱
  initialState, // 初始狀態
  reducers: {
    loadUserData: (state, action: PayloadAction<userMemberData>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { loadUserData } = userSlice.actions;
export default userSlice.reducer;
