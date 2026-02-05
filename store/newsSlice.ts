import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface schoolAnnData {
  date: string;
  department: string;
  title: string;
  link: string;
}

interface AnnouncementState {
  schoolAnnDatas: schoolAnnData[];
  lysaAnnDatas: [];
}

const initialState: AnnouncementState = {
  schoolAnnDatas: [],
  lysaAnnDatas: [],
};

export const announcementSlice = createSlice({
  name: "AnnData",
  initialState,
  reducers: {
    // 載入學校網站公告
    loadSchholAnns: (state, action: PayloadAction<schoolAnnData[]>) => {
      state.schoolAnnDatas = action.payload;
    },
  },
});

export const { loadSchholAnns } = announcementSlice.actions;
